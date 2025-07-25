import express from 'express';
import { getDBConnection } from './database/db.js';

const app = express();
const PORT = 3333;

app.use(express.json());

// CREATE - Inserir usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  try {
    const db = await getDBConnection();
    const result = await db.run(
      'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
      [nome, email]
    );

    res.status(201).json({ id: result.lastID, nome, email });
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
  const { nome, email } = req.body;
  try {
    const db = await getDBConnection();
    const result = await db.run(
      'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
      [nome, email, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ id, nome, email });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
  }
});

// DELETE - Remover usuário
app.delete('/usuarios/:id', async (req, res) => {
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
