const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../db/fisioterapeuta.json');

const readDataFromFile = () => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeDataToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.getAll = (req, res) => {
    try {
        const fisioterapeutas = readDataFromFile();
        res.json(fisioterapeutas);
    } catch (err) {
        console.error('Erro ao obter fisioterapeutas:', err);
        res.status(500).json({ message: 'Erro ao obter fisioterapeutas', error: err });
    }
};

exports.getById = (req, res) => {
    try {
        const fisioterapeutas = readDataFromFile();
        const fisioterapeuta = fisioterapeutas.find(f => f.id === parseInt(req.params.id));
        if (!fisioterapeuta) {
            return res.status(404).json({ message: 'Fisioterapeuta não encontrado' });
        }
        res.json(fisioterapeuta);
    } catch (err) {
        console.error('Erro ao obter fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao obter fisioterapeuta', error: err });
    }
};

exports.create = (req, res) => {
    const { nome, especialidade, telefone, email } = req.body;
    try {
        const fisioterapeutas = readDataFromFile();
        const newFisioterapeuta = {
            id: fisioterapeutas.length ? fisioterapeutas[fisioterapeutas.length - 1].id + 1 : 1,
            nome,
            especialidade,
            telefone,
            email
        };
        fisioterapeutas.push(newFisioterapeuta);
        writeDataToFile(fisioterapeutas);
        res.status(201).json(newFisioterapeuta);
    } catch (err) {
        console.error('Erro ao criar fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao criar fisioterapeuta', error: err });
    }
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { nome, especialidade, telefone, email } = req.body;

    try {
        let fisioterapeutas = readDataFromFile();
        const index = fisioterapeutas.findIndex(f => f.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ message: 'Fisioterapeuta não encontrado' });
        }
        fisioterapeutas[index] = { id: parseInt(id), nome, especialidade, telefone, email };
        writeDataToFile(fisioterapeutas);
        res.json({ message: 'Fisioterapeuta atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao atualizar fisioterapeuta', error: err });
    }
};

exports.delete = (req, res) => {
    const { id } = req.params;
    try {
        let fisioterapeutas = readDataFromFile();
        const index = fisioterapeutas.findIndex(f => f.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ message: 'Fisioterapeuta não encontrado' });
        }
        fisioterapeutas.splice(index, 1);
        writeDataToFile(fisioterapeutas);
        res.json({ message: 'Fisioterapeuta removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover fisioterapeuta:', err);
        res.status(500).json({ message: 'Erro ao remover fisioterapeuta', error: err });
    }
};
