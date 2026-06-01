package com.example.acabou_mony_auth.service;

import com.example.acabou_mony_auth.exception.AuthException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final TwoFactorAuthService twoFactorAuthService;
    private final JwtService jwtService;

    public AuthService(TwoFactorAuthService twoFactorAuthService, JwtService jwtService) {
        this.twoFactorAuthService = twoFactorAuthService;
        this.jwtService = jwtService;
    }

    public Long processarLoginIncial(String email, String senha) {
        // Validação básica de credenciais (Futuramente batendo no UsuarioRepository)
        if (!"ana@mony.com".equals(email) || !"123456".equals(senha)) {
            throw new AuthException("E-mail ou senha inválidos.");
        }

        Long usuarioId = 1L; // ID simulado da Ana

        //Delegando a geração e envio para o seu novo service
        twoFactorAuthService.gerarEEnviarCodigo(usuarioId, email);

        return usuarioId;
    }

    public String validar2FAeGerarToken(Long usuarioId, String codigo) {
        //Delegando a validação rígida do código para o seu novo service
        twoFactorAuthService.validarCodigo(usuarioId, codigo);

        // Se o método acima não lançar exception, o código é válido. Geramos o Token!
        return jwtService.gerarToken(usuarioId, "ana@mony.com");
    }
}