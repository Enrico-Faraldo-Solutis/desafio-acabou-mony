package com.example.acabou_mony_account.dto.conta;

public class ContaResponseDto {
    private Long id;
    private Long usuarioId;
    private Double saldo;

    public ContaResponseDto() {}

    public ContaResponseDto(Long id, Long usuarioId, Double saldo) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.saldo = saldo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }
}