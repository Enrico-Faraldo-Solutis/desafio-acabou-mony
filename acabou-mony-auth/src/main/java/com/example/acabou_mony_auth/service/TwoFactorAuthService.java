package com.example.acabou_mony_auth.service;

import com.example.acabou_mony_auth.entity.Codigo2FA;
import com.example.acabou_mony_auth.exception.AuthException;
import com.example.acabou_mony_auth.repository.Codigo2FARepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TwoFactorAuthService {

    private final Codigo2FARepository codigo2FARepository;

    @Value("${twofa.expiration.minutes:5}")
    private int expiracaoMinutos;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void gerarEEnviarCodigo(Long usuarioId, String email) {
        // 🌟 Buscando códigos ativos e invalidando direto pelo ecossistema do JPA
        List<Codigo2FA> codigosAtivos = codigo2FARepository.findByUsuarioIdAndUtilizadoFalse(usuarioId);
        codigosAtivos.forEach(codigo -> codigo.setUtilizado(true));
        codigo2FARepository.saveAll(codigosAtivos);

        // Gera código de 6 dígitos
        String codigo = String.format("%06d", secureRandom.nextInt(1_000_000));

        Codigo2FA codigo2FA = new Codigo2FA();
        codigo2FA.setUsuarioId(usuarioId);
        codigo2FA.setCodigo(codigo);
        codigo2FA.setExpiraEm(LocalDateTime.now().plusMinutes(expiracaoMinutos));
        codigo2FA.setUtilizado(false);

        codigo2FARepository.save(codigo2FA);

        simularEnvio(email, codigo);
    }

    @Transactional
    public void validarCodigo(Long usuarioId, String codigo) {
        // Usando o método derivado do Spring Data para pegar o último ativo
        Codigo2FA codigo2FA = codigo2FARepository
                .findFirstByUsuarioIdAndUtilizadoFalseOrderByIdDesc(usuarioId)
                .orElseThrow(() -> new AuthException("Nenhum código 2FA ativo encontrado. Faça login novamente."));

        if (codigo2FA.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new AuthException("Código 2FA expirado. Solicite um novo código.");
        }

        if (!codigo2FA.getCodigo().equals(codigo)) {
            throw new AuthException("Código 2FA inválido.");
        }

        codigo2FA.setUtilizado(true);
        codigo2FARepository.save(codigo2FA);
    }

    private void simularEnvio(String email, String codigo) {
        log.info("======================================================");
        log.info("  [SIMULAÇÃO DE E-MAIL/SMS]");
        log.info("  Destinatário : {}", email);
        log.info("  Código 2FA   : {}", codigo);
        log.info("  Expira em    : {} minuto(s)", expiracaoMinutos);
        log.info("======================================================");
    }
}