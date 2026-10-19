const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;
const pool = new Pool({
  host: process.env.DB_HOST || 'bd',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.POSTGRES_DB || 'appdb',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin'
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bonjour, le serveur Node.js fonctionne !');
});

app.post('/addUser', async (req, res) => {
  const { id, name, username } = req.body;

  if (!Number.isInteger(id) || !name || !username) {
    return res.status(400).json({
      error: 'id doit être un entier et name et username sont obligatoires'
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (id, name, username) VALUES ($1, $2, $3) RETURNING id, name, username',
      [id, name, username]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'id ou username existe déjà' });
    }

    console.error('Erreur lors de la création de l’utilisateur :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL UNIQUE
    )
  `);

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Impossible de démarrer le serveur :', error);
  process.exit(1);
});
