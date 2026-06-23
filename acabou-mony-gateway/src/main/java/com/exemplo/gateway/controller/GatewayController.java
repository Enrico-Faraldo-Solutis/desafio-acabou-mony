package com.exemplo.gateway.controller;

import java.net.URI;
import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
@RestController
@RequestMapping("/api")
public class GatewayController {

    private final RestTemplate restTemplate;

    public GatewayController() {
        this.restTemplate = new RestTemplate();
    }

    @RequestMapping("/{service}/**")
    public ResponseEntity<String> proxy(
            @PathVariable String service,
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {

        String baseUrl = switch (service) {
            case "acabou-mony-account"     -> "http://localhost:8080";
            case "acabou-mony-auth"        -> "http://localhost:8081";
            case "acabou-mony-transaction" -> "http://localhost:8083";
            case "acabou-mony-auditing"    -> "http://localhost:8084";
            case "acabou-mony-card"        -> "http://localhost:8085";
            default -> null;
        };

        if (baseUrl == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Serviço não encontrado");
        }

        // Reconstruct the downstream URL
        String downstreamPath = request.getRequestURI().replace("/api/" + service, "");
        URI downstreamUri = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .path(downstreamPath)
                .query(request.getQueryString())
                .build(true)
                .toUri();

        // Copy headers
        HttpHeaders headers = Collections.list(request.getHeaderNames())
                .stream()
                .collect(Collectors.toMap(
                        headerName -> headerName,
                        headerName -> Collections.list(request.getHeaders(headerName)),
                        (oldValue, newValue) -> newValue, // In case of duplicates, keep the new one
                        HttpHeaders::new
                ));
        headers.remove(HttpHeaders.HOST); // Let RestTemplate set the host

        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);

        try {
            // Execute the request
            return restTemplate.exchange(downstreamUri, method, httpEntity, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
        }
    }
}

