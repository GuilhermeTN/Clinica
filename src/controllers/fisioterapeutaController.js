const db = require('../../db/database');

exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM fisioterapeuta');
        res.json(results);
    } catch (err) {
        console.error('Erro ao obter fisioterapeutas:', err);
        res.status(500).json({ message: 'Erro ao obter fisioterapeutas', error: err });
    }
};

exports.getById = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM fisioterapeuta WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Fisioterapeuta não encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Erro ao obter fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao obter fisioterapeuta', error: err });
    }
};

exports.create = async (req, res) => {
    const { nome, especialidade, telefone, email } = req.body;
    try {
        const [results] = await db.query('INSERT INTO fisioterapeuta SET ?', { nome, especialidade, telefone, email });
        res.status(201).json({ id: results.insertId, nome, especialidade, telefone, email });
    } catch (err) {
        console.error('Erro ao criar fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao criar fisioterapeuta', error: err });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { nome, especialidade, telefone, email } = req.body;

    try {
        const [results] = await db.query('UPDATE fisioterapeuta SET ? WHERE id = ?', [{ nome, especialidade, telefone, email }, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Fisioterapeuta não encontrado' });
        }
        res.json({ message: 'Fisioterapeuta atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao atualizar fisioterapeuta', error: err });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query('DELETE FROM fisioterapeuta WHERE id = ?', [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Fisioterapeuta não encontrado' });
        }
        res.json({ message: 'Fisioterapeuta removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao remover fisioterapeuta', error: err });
    }
};
