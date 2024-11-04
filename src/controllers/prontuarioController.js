const fs = require('fs');
const path = require('path');
// Corrigido o caminho para 'db'
const filePath = path.join(__dirname, '../../db/prontuario.json');

// Lê todos os prontuários do arquivo JSON
function readProntuarios() {
    if (!fs.existsSync(filePath)) {
        // Se o arquivo não existir, retorna um array vazio
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

// Salva os prontuários em um arquivo JSON
function saveProntuarios(prontuarios) {
    fs.writeFileSync(filePath, JSON.stringify(prontuarios, null, 2));
}

// Função para obter todos os prontuários
function getAll(req, res) {
    const prontuarios = readProntuarios();
    res.json(prontuarios);
}

// Função para obter um prontuário específico por ID
function getById(req, res) {
    const prontuarios = readProntuarios();
    const id = parseInt(req.params.id, 10);
    const entry = prontuarios.find(item => item.id === id);

    if (!entry) {
        return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    res.json(entry);
}

// Função para criar um novo prontuário
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

// Função para atualizar um prontuário por ID
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

// Função para deletar um prontuário por ID
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
