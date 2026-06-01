package com.example.acabou_mony_auth.repository;

import com.example.acabou_mony_auth.entity.Codigo2FA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Codigo2FARepository extends JpaRepository<Codigo2FA, Long> {

    // O Spring gera o "LIMIT 1" e o "ORDER BY id DESC" automaticamente por causa do "findFirst...OrderByIdDesc"
    Optional<Codigo2FA> findFirstByUsuarioIdAndUtilizadoFalseOrderByIdDesc(Long usuarioId);

    // Busca todos os códigos ativos do usuário para podermos invalidar via lógica de negócio
    List<Codigo2FA> findByUsuarioIdAndUtilizadoFalse(Long usuarioId);
}