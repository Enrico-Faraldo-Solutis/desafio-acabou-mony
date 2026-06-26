package com.exemplo.gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class GatewayController {

    private final WebClient webClient;

    @Value("${services.auth.url}")
    private String authUrl;

    @Value("${services.account.url}")
    private String accountUrl;

    @Value("${services.card.url}")
    private String cardUrl;

    @Value("${services.transaction.url}")
    private String transactionUrl;

    @Value("${services.auditing.url}")
    private String auditingUrl;

    public GatewayController() {
        this.webClient = WebClient.builder().build();
    }

    @GetMapping("/teste")
    public Mono<String> teste() {
        return Mono.just("Gateway funcionando!");
    }

    @RequestMapping("/{service}/{path:^(?!api).*$}/**")
    public Mono<ResponseEntity<String>> proxy(
            @PathVariable String service,
            @PathVariable String path,
            @RequestHeader HttpHeaders headers,
            ServerHttpRequest request) {

        return doProxy(service, headers, request);
    }

    @RequestMapping("/{service}")
    public Mono<ResponseEntity<String>> proxyRoot(
            @PathVariable String service,
            @RequestHeader HttpHeaders headers,
            ServerHttpRequest request) {

        return doProxy(service, headers, request);
    }

    private static final Set<String> HEADERS_PARA_REMOVER = Set.of(
            HttpHeaders.HOST,
            HttpHeaders.CONTENT_LENGTH,
            HttpHeaders.CONTENT_ENCODING,
            HttpHeaders.TRANSFER_ENCODING
    );

    private Mono<ResponseEntity<String>> doProxy(
            String service,
            HttpHeaders headers,
            ServerHttpRequest request) {

        String baseUrl = switch (service) {
            case "auth"         -> authUrl;
            case "accounts"     -> accountUrl;
            case "cards"        -> cardUrl;
            case "transactions" -> transactionUrl;
            case "auditing"     -> auditingUrl;
            default             -> null;
        };

        if (baseUrl == null) {
            return Mono.just(ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Serviço não encontrado: " + service));
        }

        String fullPath = request.getURI().getRawPath();
        Flux<DataBuffer> requestBody = request.getBody();

        return webClient.method(request.getMethod())
                .uri(baseUrl + fullPath)
                .headers(httpHeaders -> {
                    headers.forEach((key, values) -> {
                        if (!HEADERS_PARA_REMOVER.contains(key)) {
                            values.forEach(v -> httpHeaders.add(key, v));
                        }
                    });
                })
                .body(requestBody, DataBuffer.class)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex ->
                    Mono.just(ResponseEntity
                            .status(ex.getStatusCode())
                            .body(ex.getResponseBodyAsString())))
                .onErrorResume(ex ->
                    Mono.just(ResponseEntity
                            .status(HttpStatus.BAD_GATEWAY)
                            .body("Erro no gateway: " + ex.getMessage())));
    }
}