const fs = require('fs');
const path = require('path');
const paymentsFilePath = path.join(__dirname, '../../db/pagamentos.json');

const getNextId = (payments) => {
    if (payments.length === 0) return 1; // Se não houver pagamentos, começa com 1
    const maxId = Math.max(...payments.map(payment => payment.id));
    return maxId + 1; // Incrementa o maior ID existente
};

const registrarPagamento = (req, res) => {
    const { patientName, amount } = req.body;

    fs.readFile(paymentsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ message: 'Erro ao registrar pagamento' });
        }

        const payments = data ? JSON.parse(data) : [];
        const newPayment = {
            id: getNextId(payments), // Gera ID sequencial
            nome: patientName,
            total: amount,
        };

        payments.push(newPayment);

        fs.writeFile(paymentsFilePath, JSON.stringify(payments, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar pagamentos:', err);
                return res.status(500).json({ message: 'Erro ao registrar pagamento' });
            }
            res.status(201).json(newPayment);
        });
    });
};

const obterPagamentos = (req, res) => {
    fs.readFile(paymentsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ message: 'Erro ao obter pagamentos' });
        }
        const payments = data ? JSON.parse(data) : [];
        res.status(200).json(payments);
    });
};

module.exports = {
    registrarPagamento,
    obterPagamentos, // Adicionada nova função
};
