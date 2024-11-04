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
    try {
        const estoque = readEstoque();
        const item = estoque.find(i => i.id === parseInt(req.params.id));

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.create = (req, res) => {
    const newItem = req.body;
    console.log('Dados recebidos para criação:', newItem);

    const stockItems = readData();
    stockItems.push(newItem);
    writeData(stockItems);

    // Verifica se o item criado está abaixo do alerta mínimo
    if (newItem.quantidade < newItem.alertaMinimo) {
        // Aqui você pode enviar um evento ou mensagem para o frontend, mas para simplicidade,
        // vamos apenas logar no console.
        console.log(`Alerta: O item ${newItem.descricao} está abaixo do limite mínimo.`);
    }

    res.status(201).json(newItem);
};

exports.update = (req, res) => {
    const { descricao, quantidade, alertaMinimo } = req.body;
    try {
        const estoque = readEstoque();
        const itemIndex = estoque.findIndex(i => i.id === parseInt(req.params.id));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }

        estoque[itemIndex] = { id: parseInt(req.params.id), descricao, quantidade, alertaMinimo };
        writeEstoque(estoque);
        res.json({ message: 'Item atualizado com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateQuantity = (req, res) => {
    const id = parseInt(req.params.id);
    const { quantidade } = req.body;

    try {
        const estoque = readData();
        const itemIndex = estoque.findIndex(i => i.id === id);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item não encontrado." });
        }

        estoque[itemIndex].quantidade = quantidade;
        writeData(estoque);
        res.status(200).json({ message: "Quantidade atualizada com sucesso." });
    } catch (error) {
        console.error("Erro ao atualizar a quantidade:", error);
        res.status(500).json({ message: "Erro ao atualizar o item", error: error.message || error });
    }
};

exports.remove = (req, res) => {
    try {
        const estoque = readData();
        const newEstoque = estoque.filter(i => i.id !== parseInt(req.params.id));

        if (newEstoque.length === estoque.length) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }

        writeData(newEstoque);
        res.json({ message: 'Item do estoque excluído com sucesso' });
    } catch (err) {
        res.status(500).json(err);
    }
};