import { createClient } from '@/utils/supabase/client';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  
    const schemaName = 'mock_schema';
  
    /*if (!schemaName) {
      return res.status(400).json({ error: 'O nome do schema é obrigatório' });
    }*/
  
    try {
      // Criar o schema
      const { error: schemaError } = await supabase.rpc('create_schema', { schema_name: schemaName });
    if (schemaError) throw schemaError;
  
      // Criar as tabelas dentro do schema
      const tables = `
        CREATE TABLE ${schemaName}.enterprise (
          enterpriseId SERIAL PRIMARY KEY,
          enterpriseCreatedAt TIMESTAMP DEFAULT NOW(),
          userEmail VARCHAR(255) NOT NULL
        );
  
        CREATE TABLE ${schemaName}.users (
          userEmail VARCHAR(255) PRIMARY KEY,
          userName VARCHAR(255) NOT NULL,
          userPassword VARCHAR(255) NOT NULL,
          userIsAdmin BOOLEAN DEFAULT FALSE,
          userSafeDelete BOOLEAN DEFAULT FALSE,
          userCreatedAt TIMESTAMP DEFAULT NOW(),
        );
  
        CREATE TABLE ${schemaName}.participate (
          participateId BIGSERIAL PRIMARY KEY,
          participateName VARCHAR(255) NOT NULL,
          participatePhone VARCHAR(20),
          participateEmail VARCHAR(255),
          participateAddress TEXT,
          participateSafeDelete BOOLEAN DEFAULT FALSE,
          participateCreatedAt TIMESTAMP DEFAULT NOW(),
          participateDescription TEXT
        );
  
        CREATE TABLE ${schemaName}.item (
          itemId BIGSERIAL PRIMARY KEY,
          itemName VARCHAR(255) NOT NULL,
          itemQuantity INT NOT NULL,
          itemCreatedAt TIMESTAMP DEFAULT NOW(),
          itemPosition VARCHAR(255),
          itemDescription TEXT,
          itemSafeDelete BOOLEAN DEFAULT FALSE,
        );
  
        CREATE TABLE ${schemaName}.movement_history (
          historyId BIGSERIAL PRIMARY KEY,
          itemId INT REFERENCES ${schemaName}.item(itemId),
          participateId INT REFERENCES ${schemaName}.participate(participateId),
          movementDate TIMESTAMP DEFAULT NOW(),
          historyQuantity BIGINT NOT NULL,
          userEmail VARCHAR(255) REFERENCES ${schemaName}.users(userEmail),
          historyCreatedAt TIMESTAMP DEFAULT NOW(),
          historySafeDelete BOOLEAN DEFAULT FALSE,
          historyNF BIGINT,
          participateName VARCHAR(255),
          itemName VARCHAR(255)
        );
      `;
  
      const { error: tableError } = await supabase.rpc('execute_sql', { query: tables });
      if (tableError) throw tableError;
  
      res.status(200).json({ message: `Schema '${schemaName}' e tabelas criadas com sucesso!` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }