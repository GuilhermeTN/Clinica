const fs = require('fs');
const path = require('path');
const paymentsFilePath = path.join(__dirname, '../../db/pagamentos.json');

// Função para gerar um ID único (simples, para propósitos de exemplo)
const generateId = () => {
    return Date.now();
};

// Função para registrar pagamento
const registrarPagamento = (req, res) => {
    const { patientName, paymentType, amount } = req.body;
    const newPayment = {
        id: generateId(),
        nome: patientName,
        total: amount
    };

    // Ler o arquivo JSON existente
    fs.readFile(paymentsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ message: 'Erro ao registrar pagamento' });
        }

        let payments = [];
        if (data) {
            payments = JSON.parse(data); // Parse se o arquivo não estiver vazio
        }

        payments.push(newPayment); // Adiciona o novo pagamento

        // Escrever de volta no arquivo JSON
        fs.writeFile(paymentsFilePath, JSON.stringify(payments, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar pagamentos:', err);
                return res.status(500).json({ message: 'Erro ao registrar pagamento' });
            }
            res.status(201).json(newPayment); // Responde com o pagamento criado
        });
    });
};

module.exports = {
    registrarPagamento,
};
