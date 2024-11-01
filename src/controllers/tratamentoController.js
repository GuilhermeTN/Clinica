const db = require('../../db/database');

exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM tratamento');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM tratamento WHERE id = ?', [req.params.id]);
        res.json(results[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    const { nome, descricao, duracao, preco } = req.body;
    try {
        const [results] = await db.query('INSERT INTO tratamento SET ?', { nome, descricao, duracao, preco });
        res.status(201).json({ id: results.insertId, ...req.body });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    const { nome, descricao, duracao, preco } = req.body;
    try {
        await db.query('UPDATE tratamento SET ? WHERE id = ?', [{ nome, descricao, duracao, preco }, req.params.id]);
        res.json({ message: 'Tratamento atualizado com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        await db.query('DELETE FROM tratamento WHERE id = ?', [req.params.id]);
        res.json({ message: 'Tratamento excluído com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};
