const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = 3333;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
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

app.post('/session', async (req, res) => {
    const { username } = req.body;
    let user = '';
    try {
        user = await pool.query('SELECT * FROM users WHERE user_name = ($1)', [username]);
        if (!user.rows[0]) {
            user = await pool.query('INSERT INTO users (user_name) VALUES ($1) RETURNING *', [username]);
        }
        return res.status(200).send(user.rows);
    } catch (error) {
        return res.status(400).send(error);
    }
});

app.post('/todo/:user_id', async (req, res) => {
    const { description, done } = req.body;
    const { user_id } = req.params;
    try {
        const newTodo = await pool.query('INSERT INTO todos (todo_description, todo_done, user_id) VALUES ($1, $2, $3) RETURNING *', [description, done, user_id]);
        return res.status(200).send(newTodo.rows);
    } catch (error) {
        return res.status(400).send(error);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
