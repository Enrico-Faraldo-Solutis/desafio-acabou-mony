CREATE DATABASE acabou_o_mony;
USE acabou_o_mony;

-- 1. TABELA DE USUÁRIOS (Centraliza Clientes e Comerciantes como a Ana)
CREATE TABLE usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nome VARCHAR(100) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          senha VARCHAR(255) NOT NULL, -- Guardar SEMPRE como Hash (BCrypt)
                          tipo_usuario ENUM('CLIENTE', 'COMERCIANTE') NOT NULL,
                          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE CONTAS (Onde fica o saldo dinâmico)
CREATE TABLE contas (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        usuario_id BIGINT NOT NULL,
                        saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                        status ENUM('ATIVA', 'BLOQUEADA') DEFAULT 'ATIVA',
                        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                        CONSTRAINT chk_saldo_nao_negativo CHECK (saldo >= 0.00) -- Evita saldo negativo sem cheque especial
);

-- 3. TABELA DE CÓDIGOS 2FA (Crucial já que trafegamos em HTTP plano)
CREATE TABLE codigos_2fa (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             usuario_id BIGINT NOT NULL,
                             codigo VARCHAR(6) NOT NULL,
                             expira_em TIMESTAMP NOT NULL,
                             utilizado BOOLEAN DEFAULT FALSE,
                             FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 4. TABELA DE TRANSAÇÕES (Onde o bicho pega para o tempo < 1s)
CREATE TABLE transacoes (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            conta_origem_id BIGINT NOT NULL,
                            conta_destino_id BIGINT NOT NULL,
                            valor DECIMAL(15, 2) NOT NULL,
                            tipo ENUM('CREDITO', 'DEBITO') NOT NULL,
                            status ENUM('PENDENTE', 'APROVADA', 'REJEITADA') DEFAULT 'PENDENTE',
                            data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (conta_origem_id) REFERENCES contas(id),
                            FOREIGN KEY (conta_destino_id) REFERENCES contas(id)
);

-- 5. TABELA DE INTEGRAÇÃO LIVE COMMERCE (História 4)
CREATE TABLE transacoes_live (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 transacao_id BIGINT NOT NULL,
                                 live_id VARCHAR(100) NOT NULL, -- Identificador da transmissão da Ana
                                 plataforma_origem VARCHAR(50) NOT NULL, -- Ex: 'Instagram', 'TikTok', 'PlataformaPropria'
                                 FOREIGN KEY (transacao_id) REFERENCES transacoes(id)
);

-- INDEXAÇÃO PARA ALTO DESEMPENHO (< 1 segundo)
CREATE INDEX idx_contas_usuario ON contas(usuario_id);
CREATE INDEX idx_transacoes_data ON transacoes(data_transacao);
CREATE INDEX idx_codigos_2fa_busca ON codigos_2fa(usuario_id, codigo, utilizado);