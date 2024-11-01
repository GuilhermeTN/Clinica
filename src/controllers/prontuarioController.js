// src/controllers/prontuarioController.js
const db = require('../../db/database');

exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM prontuario');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM prontuario WHERE id = ?', [req.params.id]);
        res.json(results[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    const { pacienteId, dataRegistro, historico } = req.body;
    try {
        const [results] = await db.query('INSERT INTO prontuario SET ?', { pacienteId, dataRegistro, historico });
        res.status(201).json({ id: results.insertId, ...req.body });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    const { pacienteId, dataRegistro, historico } = req.body;
    try {
        await db.query('UPDATE prontuario SET ? WHERE id = ?', [{ pacienteId, dataRegistro, historico }, req.params.id]);
        res.json({ message: 'Prontuário atualizado com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        await db.query('DELETE FROM prontuario WHERE id = ?', [req.params.id]);
        res.json({ message: 'Prontuário excluído com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};
