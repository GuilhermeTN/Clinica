const db = require('../../db/database');

exports.getConsultasPorData = async (req, res) => {
    const { dia, mes, ano } = req.query;
    try {
        const [results] = await db.query('SELECT * FROM consulta WHERE DATE(data) = ?', [`${ano}-${mes}-${dia}`]);
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM consulta');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM consulta WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    const { pacienteId, fisioterapeutaId, data, tipoTratamento, observacoes } = req.body;
    const status = 'Agendado';

    try {
        const [results] = await db.query('INSERT INTO consulta SET ?', {
            pacienteId,
            fisioterapeutaId,
            data,
            tipoTratamento,
            status,
            observacoes
        });
        res.status(201).json({ id: results.insertId, pacienteId, fisioterapeutaId, data, tipoTratamento, status, observacoes });
    } catch (err) {
        console.error('Erro ao criar consulta:', err);
        res.status(500).json({ message: 'Erro ao criar consulta', error: err });
    }
};

exports.update = async (req, res) => {
    const { pacienteId, fisioterapeutaId, data, tipoTratamento, status, observacoes } = req.body;
    try {
        const [results] = await db.query('UPDATE consulta SET ? WHERE id = ?', [{ pacienteId, fisioterapeutaId, data, tipoTratamento, status, observacoes }, req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        res.json({ message: 'Consulta atualizada com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        const [results] = await db.query('DELETE FROM consulta WHERE id = ?', [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        res.json({ message: 'Consulta deletada com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};
