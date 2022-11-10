const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const PORT = 3333;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Olá, Mundo!!!');
});

app.get('/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        return res.status(200).send(rows);
    } catch (error) {
        return res.status(400).send(error);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
