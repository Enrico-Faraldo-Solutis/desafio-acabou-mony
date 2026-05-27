-- Criação do Banco de Dados Único
CREATE DATABASE IF NOT EXISTS db_acabou_mony;
USE db_acabou_mony;

-- 1. TABELA: USUARIOS
-- Armazena os dados cadastrais e de login dos utilizadores
CREATE TABLE usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nome VARCHAR(100) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          cpf VARCHAR(14) NOT NULL UNIQUE,
                          senha_hash VARCHAR(255) NOT NULL,
                          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA: CODIGOS_2FA
-- Códigos para a autenticação em duas etapas (História 3)
-- Relacionada diretamente com a tabela de usuários
CREATE TABLE codigos_2fa (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             usuario_id BIGINT NOT NULL,
                             codigo VARCHAR(6) NOT NULL,
                             data_expiracao DATETIME NOT NULL,
                             usado BOOLEAN DEFAULT FALSE,
                             data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_usuario_2fa FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. TABELA: CONTAS
-- Armazena as contas financeiras e saldos
-- Cada conta pertence a um usuário
CREATE TABLE contas (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        usuario_id BIGINT NOT NULL,
                        saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                        status ENUM('ATIVA', 'BLOQUEADA', 'ENCERRADA') DEFAULT 'ATIVA',
                        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_usuario_conta FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. TABELA: TRANSACOES
-- Regista o histórico de transações (História 1)
-- Relaciona-se com as contas de origem e destino
CREATE TABLE transacoes (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            conta_origem_id BIGINT NOT NULL,
                            conta_destino_id BIGINT NOT NULL,
                            valor DECIMAL(15, 2) NOT NULL,
                            status ENUM('PENDENTE', 'CONCLUIDA', 'FALHA') DEFAULT 'PENDENTE',
                            tipo ENUM('DEBITO', 'CREDITO', 'TRANSFERENCIA') NOT NULL,
                            data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_conta_origem FOREIGN KEY (conta_origem_id) REFERENCES contas(id),
                            CONSTRAINT fk_conta_destino FOREIGN KEY (conta_destino_id) REFERENCES contas(id)
);

-- Índices recomendados para otimização de performance (História 1 - Menos de 1 segundo)
CREATE INDEX idx_transacoes_origem ON transacoes(conta_origem_id);
CREATE INDEX idx_transacoes_destino ON transacoes(conta_destino_id);
CREATE INDEX idx_codigos_usuario_valido ON codigos_2fa(usuario_id, usado);