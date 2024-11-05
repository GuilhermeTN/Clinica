const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../db/consulta.json');

const readDataFromFile = () => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeDataToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.getConsultasPorData = (req, res) => {
    const { dia, mes, ano } = req.query;
    try {
        const consultas = readDataFromFile();
        const dataConsulta = new Date(ano, mes - 1, dia);

        const filteredConsultas = consultas.filter(consulta => {
            const consultaDate = new Date(consulta.data);
            return consultaDate.toDateString() === dataConsulta.toDateString();
        });

        const isDateOccupied = filteredConsultas.length > 0;
        res.json({ consultas: filteredConsultas, isDateOccupied });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAll = (req, res) => {
    try {
        const consultas = readDataFromFile();
        res.json(consultas);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = (req, res) => {
    try {
        const consultas = readDataFromFile();
        const consulta = consultas.find(c => c.id === parseInt(req.params.id));
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        res.json(consulta);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = (req, res) => {
    const { pacienteId, fisioterapeutaId, data, tipoTratamento, observacoes } = req.body;

    try {
        const pacientes = JSON.parse(fs.readFileSync(path.join(__dirname, '../../db/paciente.json'), 'utf-8'));
        const fisioterapeutas = JSON.parse(fs.readFileSync(path.join(__dirname, '../../db/fisioterapeuta.json'), 'utf-8'));

        const pacienteExists = pacientes.some(paciente => paciente.id === pacienteId);
        const fisioterapeutaExists = fisioterapeutas.some(fisio => fisio.id === fisioterapeutaId);

        if (!pacienteExists) {
            return res.status(400).json({ message: 'Paciente não encontrado.' });
        }

        if (!fisioterapeutaExists) {
            return res.status(400).json({ message: 'Fisioterapeuta não encontrado.' });
        }

        const consultas = readDataFromFile();
        const isDateOccupied = consultas.some(consulta => consulta.data === data);

        if (isDateOccupied) {
            return res.status(400).json({ message: 'Data já ocupada. Escolha outra data.' });
        }

        const newConsulta = {
            id: consultas.length ? consultas[consultas.length - 1].id + 1 : 1,
            pacienteId,
            fisioterapeutaId,
            data,
            tipoTratamento,
            status: 'Agendado',
            observacoes
        };

        consultas.push(newConsulta);
        writeDataToFile(consultas);
        res.status(201).json({ message: 'Consulta agendada com sucesso.', consulta: newConsulta });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar a consulta.', error: err });
    }
};

exports.update = (req, res) => {
    const { pacienteId, fisioterapeutaId, data, tipoTratamento, status, observacoes } = req.body;

    try {
        let consultas = readDataFromFile();
        const index = consultas.findIndex(c => c.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        consultas[index] = { id: parseInt(req.params.id), pacienteId, fisioterapeutaId, data, tipoTratamento, status, observacoes };
        writeDataToFile(consultas);
        res.json({ message: 'Consulta atualizada com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = (req, res) => {
    try {
        let consultas = readDataFromFile();
        const index = consultas.findIndex(c => c.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        consultas.splice(index, 1);
        writeDataToFile(consultas);
        res.json({ message: 'Consulta deletada com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};
