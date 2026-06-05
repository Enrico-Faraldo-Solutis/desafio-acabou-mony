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

    @RabbitListener(queues = "am.notificacao.usuario-criado")
    public void consumir(Map<String, Object> dados) {
        String emailDestinatario = (String) dados.get("email");
        String nomeDestinatario = (String) dados.get("nome");

        String idUsuario = String.valueOf(dados.get("id"));

        System.out.println("=================================================");
        System.out.println("Notificação recebida. Enviando e-mail da Fintech para: " + emailDestinatario);
        System.out.println("=================================================");

        enviarEmailFintech(emailDestinatario, nomeDestinatario, idUsuario);
    }

    private void enviarEmailFintech(String para, String nome, String idUsuario) {
        Email from = new Email(fromEmail);
        String subject = "Sua conta no Acabou o Mony foi aberta! 🎉";
        Email to = new Email(para);

        String textoMensagem = String.format(
                "Olá %s,\n\n" +
                        "Seja muito bem-vindo à Fintech Acabou o Mony!\n\n" +
                        "Sua conta digital foi criada com sucesso (ID: %s) e já está pronta para receber depósitos e transações.\n\n" +
                        "Bons investimentos,\nEquipe Acabou o Mony.",
                nome, idUsuario
        );

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
                System.out.println("[SendGrid] E-mail de boas-vindas enviado para " + para);
            } else {
                System.err.println("[SendGrid] Erro ao enviar: " + response.getBody());
            }

        } catch (IOException ex) {
            System.err.println("[SendGrid] Erro de rede/comunicação: " + ex.getMessage());
        }
    }
}