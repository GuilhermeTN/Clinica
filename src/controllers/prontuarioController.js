const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../db/prontuario.json');

function readProntuarios() {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function saveProntuarios(prontuarios) {
    fs.writeFileSync(filePath, JSON.stringify(prontuarios, null, 2));
}

function getAll(req, res) {
    const prontuarios = readProntuarios();
    res.json(prontuarios);
}

function getById(req, res) {
    const prontuarios = readProntuarios();
    const id = parseInt(req.params.id, 10);
    const entry = prontuarios.find(item => item.id === id);

    if (!entry) {
        return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    res.json(entry);
}

const create = (req, res) => {
    const prontuarios = readProntuarios();
    const newProntuario = {
        id: prontuarios.length > 0 ? prontuarios[prontuarios.length - 1].id + 1 : 1,
        ...req.body
    };

    prontuarios.push(newProntuario);
    saveProntuarios(prontuarios);
    res.status(201).json(newProntuario);
};

function update(req, res) {
    const prontuarios = readProntuarios();
    const id = parseInt(req.params.id, 10);
    const index = prontuarios.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    const updatedEntry = { ...prontuarios[index], ...req.body };
    prontuarios[index] = updatedEntry;
    saveProntuarios(prontuarios);
    res.json(updatedEntry);
}

function deleteById(req, res) {
    const prontuarios = readProntuarios();
    const id = parseInt(req.params.id, 10);
    const index = prontuarios.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    prontuarios.splice(index, 1);
    saveProntuarios(prontuarios);
    res.json({ message: 'Prontuário deletado com sucesso' });
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};
