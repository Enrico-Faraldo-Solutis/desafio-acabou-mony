package com.exemplo.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import javax.crypto.SecretKey;
import java.util.List;

@Component
public class AuthWebFilter implements WebFilter {

    private static final Logger logger = LoggerFactory.getLogger(AuthWebFilter.class);

    // Rotas que não exigem token JWT — endpoints públicos do Auth Service
    private static final List<String> ROTAS_PUBLICAS = List.of(
            "/api/auth/login",
            "/api/auth/verify-2fa",
            "/api/teste",
            "/actuator/health"
    );

    private final SecretKey secretKey;

    public AuthWebFilter(@Value("${jwt.secret}") String secretKeyBase64) {
        try {
            // jjwt 0.12.x usa Decoders.BASE64 em vez de Base64.getDecoder()
            this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));
        } catch (Exception e) {
            logger.error("Erro ao decodificar a chave secreta: {}", e.getMessage());
            throw new IllegalArgumentException("Chave secreta inválida. Verifique a configuração em jwt.secret", e);
        }
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Libera rotas públicas sem exigir token
        if (isRotaPublica(path)) {
            logger.debug("Rota pública liberada: {}", path);
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Cabeçalho Authorization ausente ou inválido para: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        try {
            // jjwt 0.12.x: parser() + verifyWith() + parseSignedClaims()
            // Substitui o antigo: parserBuilder() + setSigningKey() + parseClaimsJws()
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Propaga dados do usuário como headers internos para os microsserviços downstream
            // Assim cada serviço sabe quem fez a requisição sem precisar validar o JWT novamente
            ServerWebExchange exchangeComUsuario = exchange.mutate()
                    .request(r -> r
                            .header("X-User-Id",    claims.getSubject())
                            .header("X-User-Email", claims.get("email", String.class))
                            .header("X-User-Nome",  claims.get("nome",  String.class))
                    )
                    .build();

            logger.debug("Token JWT válido. Usuário ID: {} → {}", claims.getSubject(), path);
            return chain.filter(exchangeComUsuario);

        } catch (JwtException e) {
            logger.warn("Falha na validação do token JWT: {}", e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        } catch (Exception e) {
            logger.error("Erro inesperado ao validar token: {}", e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isRotaPublica(String path) {
        return ROTAS_PUBLICAS.stream().anyMatch(path::startsWith);
    }
}