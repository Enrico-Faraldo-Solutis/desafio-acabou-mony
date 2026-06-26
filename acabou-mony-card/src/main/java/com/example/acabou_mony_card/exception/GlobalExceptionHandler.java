package com.example.acabou_mony_card.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Captura o erro do Feign quando o outro microsserviço retorna 404
    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<Object> handleFeignNotFoundException(FeignException.NotFound ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");

        // Aqui pegamos a mensagem que você customizou lá no seu CardService!
        body.put("message", "Não é possível criar o cartão. A conta informada não existe no sistema central.");

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // Captura o erro caso o microsserviço de contas esteja totalmente fora do ar
    @ExceptionHandler(FeignException.ServiceUnavailable.class)
    public ResponseEntity<Object> handleFeignServiceUnavailable(FeignException.ServiceUnavailable ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        body.put("error", "Service Unavailable");
        body.put("message", "O serviço de verificação de contas está temporariamente indisponível.");

        return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
    }

        // Captura qualquer outro erro do Feign (conexão recusada, timeout, etc)
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Object> handleFeignException(FeignException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_GATEWAY.value());
        body.put("error", "Bad Gateway");
        body.put("message", "Erro ao comunicar com o serviço de contas: " + ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY);
    }

        @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}