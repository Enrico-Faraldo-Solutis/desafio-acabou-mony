package com.exemplo.gateway.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GatewayController {

    private final WebClient webClient;

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
            @RequestParam(required = false) MultiValueMap<String, String> queryParams,
            @RequestBody(required = false) Mono<String> body,
            ServerHttpRequest request) {

        String baseUrl = switch (service) {
            case "acabou-mony-account" -> "http://localhost:8080";
            case "acabou-mony-auth" -> "http://localhost:8081";
            case "acabou-mony-transaction" -> "http://localhost:8083";
            case "acabou-mony-auditing" -> "http://localhost:8084";
            case "acabou-mony-card" -> "http://localhost:8085";
            default -> null;
        };

        if (baseUrl == null) return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Serviço não encontrado"));

        String fullPath = request.getURI().getRawPath().replace("/api/" + service, "");

        System.out.println("FULL PATH: " + fullPath);
        System.out.println("BASE URL: " + baseUrl);

        return webClient.method(request.getMethod())
                .uri(baseUrl + fullPath)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .body(body == null ? Mono.empty() : body, String.class)
                .retrieve()
                .toEntity(String.class);
    }
}