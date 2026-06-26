package com.example.acabou_mony_transaction.dto.auditoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for audit log entries
 * Sent to auditing service for critical transaction operations
 * Matches the AuditLogCreateDTO structure expected by the auditing service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDto {

    private Long usuarioId;

    private String acao;

    private String entidadeNome;

    private Long entidadeId;

    private Map<String, Object> detalhes;

    private String ipOrigem;
}
