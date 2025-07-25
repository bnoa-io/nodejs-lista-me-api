import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Função que retorna a conexão com o banco
export async function getDBConnection() {
  const db = await open({
    filename: './banco.sqlite',
    driver: sqlite3.Database
  });

  // Cria tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  return db;
}
