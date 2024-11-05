const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../db/estoque.json');

const readData = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Erro ao escrever no arquivo JSON:', err);
    }
};

exports.getItems = (req, res) => {
    const stockItems = readData();
    const itemsWithAlert = stockItems.map(item => {
        item.alertaAtivado = item.quantidade <= item.alertaMinimo;
        return item;
    });
    res.json(itemsWithAlert);
};

exports.getById = (req, res) => {
    const estoque = readData();
    const item = estoque.find(i => i.id === parseInt(req.params.id));

    if (!item) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.json(item);
};

exports.create = (req, res) => {
    const newItem = req.body;
    console.log('Dados recebidos para criação:', newItem);

    const stockItems = readData();
    
    // Calcular o próximo ID
    const nextId = stockItems.length > 0 ? Math.max(...stockItems.map(item => item.id)) + 1 : 1;
    
    // Adiciona o novo item com o novo ID
    newItem.id = nextId;
    stockItems.push(newItem);
    writeData(stockItems);

    if (newItem.quantidade < newItem.alertaMinimo) {
        console.log(`Alerta: O item ${newItem.descricao} está abaixo do limite mínimo.`);
    }

    res.status(201).json(newItem);
};

exports.update = (req, res) => {
    const { descricao, quantidade, alertaMinimo } = req.body;

    const estoque = readData();
    const itemIndex = estoque.findIndex(i => i.id === parseInt(req.params.id));

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }

    estoque[itemIndex] = { id: parseInt(req.params.id), descricao, quantidade, alertaMinimo };
    writeData(estoque);
    res.json({ message: 'Item atualizado com sucesso' });
};

exports.updateQuantity = (req, res) => {
    const id = parseInt(req.params.id);
    const { quantidade } = req.body;

    const estoque = readData();
    const itemIndex = estoque.findIndex(i => i.id === id);

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item não encontrado." });
    }

    estoque[itemIndex].quantidade = quantidade;
    writeData(estoque);
    res.status(200).json({ message: "Quantidade atualizada com sucesso." });
};

exports.remove = (req, res) => {
    const estoque = readData();
    const newEstoque = estoque.filter(i => i.id !== parseInt(req.params.id));

    if (newEstoque.length === estoque.length) {
        return res.status(404).json({ message: 'Item não encontrado' });
    }

    writeData(newEstoque);
    res.json({ message: 'Item do estoque excluído com sucesso' });
};
