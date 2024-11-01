const db = require('../../db/database');

exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM paciente');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM paciente WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    const { nome, dataNascimento, telefone, email, endereco, genero, cpf } = req.body;
    try {
        const [results] = await db.query('INSERT INTO paciente SET ?', { nome, dataNascimento, telefone, email, endereco, genero, cpf });
        res.status(201).json({ id: results.insertId, ...req.body });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    const { nome, dataNascimento, telefone, email, endereco, genero, cpf } = req.body;
    try {
        const [results] = await db.query('UPDATE paciente SET ? WHERE id = ?', [{ nome, dataNascimento, telefone, email, endereco, genero, cpf }, req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.json({ message: 'Paciente atualizado com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        const [results] = await db.query('DELETE FROM paciente WHERE id = ?', [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.json({ message: 'Paciente removido com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};
