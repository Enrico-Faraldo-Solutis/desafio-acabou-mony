package com.exemplo.gateway.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebFluxSecurity // ESSENCIAL: Ativa a segurança para projetos WebFlux
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            // 1. Desabilita o CSRF, que não é necessário para uma API stateless
            .csrf(csrf -> csrf.disable())
            
            // 2. Habilita e configura o CORS usando o método que definimos abaixo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 3. Autoriza TODAS as requisições a passar pelo Gateway.
            // A segurança real será feita nos microserviços.
            // Isso garante que a requisição OPTIONS do navegador não seja bloqueada.
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/**").permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite requisições do seu frontend React
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        
        // Permite todos os métodos comuns (GET, POST, etc.) e o OPTIONS
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Permite todos os cabeçalhos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permite que o navegador envie credenciais (como cookies), se necessário
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração de CORS a todas as rotas do Gateway
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}