import express from 'express';
import cors from 'cors';
import { getDBConnection } from './database/db.js';

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// CREATE - Inserir usuário
app.post('/usuarios', async (req, res) => {
  const { nome, cargo, contratacao, status, salario } = req.body;
  console.log('POST usuario: ', req.body)
  try {
    const db = await getDBConnection();
    const result = await db.run(
      'INSERT INTO usuarios (nome, cargo, contratacao, status, salario) VALUES (?, ?, ?, ?, ?)',
      [nome, cargo, contratacao, status, salario]
    );

    res.status(201).json({ id: result.lastID, nome, cargo, contratacao, status, salario });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao inserir usuário', detalhe: error.message });
  }
});

// READ - Listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const db = await getDBConnection();
    const usuarios = await db.all('SELECT * FROM usuarios');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhe: error.message });
  }
});

// READ - Buscar usuário por ID
app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDBConnection();
    const usuario = await db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuário', detalhe: error.message });
  }
});

// UPDATE - Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, contratacao, status, salario } = req.body;

  console.log('PUT usuarios, body: ', req.body)

  try {
    const db = await getDBConnection();
    const result = await db.run(
      'UPDATE usuarios SET nome = ?, cargo = ?, contratacao = ?, status = ?, salario = ? WHERE id = ?',
      [nome, cargo, contratacao, status, salario, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ id, nome, cargo, contratacao, status, salario });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
  }
});

// DELETE - Remover usuário
app.delete('/usuarios/:id', async (req, res) => {
  console.log('DELETE /usuarios, id: ', req.params.id);
  const { id } = req.params;
  try {
    const db = await getDBConnection();
    const result = await db.run('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar usuário', detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
