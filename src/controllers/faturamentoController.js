// src/controllers/faturamentoController.js
const db = require('../../db/database');

exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM faturamento');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM faturamento WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Faturamento não encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    const { pacienteId, valor, dataPagamento, status } = req.body;
    try {
        const [results] = await db.query('INSERT INTO faturamento SET ?', { pacienteId, valor, dataPagamento, status });
        res.status(201).json({ id: results.insertId, ...req.body });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    const { pacienteId, valor, dataPagamento, status } = req.body;
    try {
        const [results] = await db.query('UPDATE faturamento SET ? WHERE id = ?', [{ pacienteId, valor, dataPagamento, status }, req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Faturamento não encontrado' });
        }
        res.json({ message: 'Faturamento atualizado com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        const [results] = await db.query('DELETE FROM faturamento WHERE id = ?', [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Faturamento não encontrado' });
        }
        res.json({ message: 'Faturamento excluído com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};
