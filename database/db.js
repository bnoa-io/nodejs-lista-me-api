import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Função que retorna a conexão com o banco
export async function getDBConnection() {
  const db = await open({
    filename: './banco.sqlite',
    driver: sqlite3.Database
  });

  // await db.exec(` DROP TABLE IF EXISTS usuarios`);
  
  // Cria tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cargo TEXT NOT NULL,
      contratacao DATE NOT NULL,
      status BOOLEAN NOT NULL,
      salario REAL NOT NULL
    )
  `);

  return db;
}
