const fs = require('fs');
const path = require('path');
const jsonFilePath = path.join(__dirname, '../../db/paciente.json');

// Função auxiliar para ler o arquivo JSON
const readJsonFile = () => {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
};

// Função auxiliar para escrever no arquivo JSON
const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
};

exports.getAll = (req, res) => {
    try {
        const pacientes = readJsonFile();
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao ler pacientes', error: err });
    }
};

exports.getById = (req, res) => {
    try {
        const pacientes = readJsonFile();
        const paciente = pacientes.find(p => p.id === parseInt(req.params.id));
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao ler pacientes', error: err });
    }
};

exports.create = (req, res) => {
    const { nome, dataNascimento, telefone, email, endereco, genero, cpf } = req.body;
    try {
        const pacientes = readJsonFile();
        const newId = pacientes.length ? pacientes[pacientes.length - 1].id + 1 : 1;
        const newPaciente = { id: newId, nome, dataNascimento, telefone, email, endereco, genero, cpf };
        pacientes.push(newPaciente);
        writeJsonFile(pacientes);
        res.status(201).json(newPaciente);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao cadastrar paciente', error: err });
    }
};

exports.update = (req, res) => {
    const { nome, dataNascimento, telefone, email, endereco, genero, cpf } = req.body;
    try {
        const pacientes = readJsonFile();
        const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        pacientes[index] = { id: pacientes[index].id, nome, dataNascimento, telefone, email, endereco, genero, cpf };
        writeJsonFile(pacientes);
        res.json({ message: 'Paciente atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar paciente', error: err });
    }
};

exports.delete = (req, res) => {
    try {
        const pacientes = readJsonFile();
        const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        pacientes.splice(index, 1);
        writeJsonFile(pacientes);
        res.json({ message: 'Paciente removido com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao remover paciente', error: err });
    }
};
