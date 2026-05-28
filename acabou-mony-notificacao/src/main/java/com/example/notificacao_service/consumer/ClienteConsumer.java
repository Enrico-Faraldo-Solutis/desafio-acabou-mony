package com.example.notificacao_service.consumer;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;

@Component
public class ClienteConsumer {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @RabbitListener(queues = "cliente.cadastro.queue")
    public void consumir(Map<String, Object> dados) {
        String emailDestinatario = (String) dados.get("email");
        String nomeDestinatario = (String) dados.get("nome");

        System.out.println("Notificação recebida. Iniciando envio de e-mail para: " + emailDestinatario);

        // Dispara o e-mail real
        enviarEmailReal(emailDestinatario, nomeDestinatario);
    }

    private void enviarEmailReal(String para, String nome) {
        Email from = new Email(fromEmail);
        String subject = "Bem-vindo à nossa Locadora de Carros!";
        Email to = new Email(para);

        String textoMensagem = String.format("Olá %s,\n\nSeu cadastro como motorista foi realizado com sucesso! Você já pode usar nosso sistema para alugar veículos.", nome);
        Content content = new Content("text/plain", textoMensagem);

        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            System.out.println("[SendGrid] Status Code: " + response.getStatusCode());
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("[SendGrid] E-mail enviado com sucesso para " + para);
            } else {
                System.err.println("[SendGrid] Erro ao enviar: " + response.getBody());
            }

        } catch (IOException ex) {
            System.err.println("[SendGrid] Erro de rede/comunicação: " + ex.getMessage());
        }
    }
}