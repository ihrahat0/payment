-- Create blockchain chains table
CREATE TABLE chains (
  id SERIAL PRIMARY KEY,
  chain_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  native_currency VARCHAR(50) NOT NULL,
  native_amount VARCHAR(50) NOT NULL
);

-- Create tokens table
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  chain_id INTEGER NOT NULL REFERENCES chains(chain_id),
  symbol VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  decimals INTEGER NOT NULL,
  UNIQUE(chain_id, symbol)
);

-- Create a configuration table
CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT
);

-- Insert blockchain data
INSERT INTO chains (chain_id, name, icon, native_currency, native_amount) VALUES
(56, 'BNB Smart Chain', '🔶', 'BNB', '0.033'),
(1, 'Ethereum', '💎', 'ETH', '0.01');

-- Insert token data for BSC
INSERT INTO tokens (chain_id, symbol, address, amount, decimals) VALUES
(56, 'USDT', '0x55d398326f99059fF775485246999027B3197955', '20', 18),
(56, 'USDC', '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', '20', 18);

-- Insert token data for Ethereum
INSERT INTO tokens (chain_id, symbol, address, amount, decimals) VALUES
(1, 'USDT', '0xdAC17F958D2ee523a2206206994597C13D831ec7', '20', 6),
(1, 'USDC', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '20', 6);

-- Insert the recipient address
INSERT INTO config (key, value, description)
VALUES ('recipient_address', '0x553Ae53727B39d233236A28aBE9A3f1693F57019', 'Default wallet address to receive transfers');
