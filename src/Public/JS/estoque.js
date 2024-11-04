let currentId = 0;
// Defina a função addItem antes de atribuí-la ao evento
const addItem = (event) => {
    event.preventDefault(); // Previne o envio padrão do formulário

    console.log('Tentando acessar os elementos do formulário.');

    const descricao = document.getElementById('descricao');
    const quantidade = document.getElementById('quantidade');
    const alertaMinimo = document.getElementById('alertaMinimo');
    currentId ++;
    

    if (!descricao || !quantidade || !alertaMinimo) {
        console.error('Um ou mais elementos do formulário não foram encontrados.');
        return; 
    }

    const itemData = {
        id: currentId,
        descricao: descricao.value,
        quantidade: quantidade.value,
        alertaMinimo: alertaMinimo.value
    };

    console.log('Dados do item:', itemData);

    // Envia a requisição para adicionar o item
    fetch('http://localhost:3000/estoque/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Item adicionado com sucesso:', data);

        // Adiciona o item à tabela automaticamente
        const tabelaCorpo = document.getElementById('tabela-corpo');
        const linha = document.createElement('tr');

        const descricaoCell = document.createElement('td');
        descricaoCell.textContent = itemData.descricao;
        linha.appendChild(descricaoCell);

        const quantidadeCell = document.createElement('td');
        quantidadeCell.textContent = itemData.quantidade;
        linha.appendChild(quantidadeCell);

        const acoesCell = document.createElement('td');

        // Botão de Atualizar
        const btnAtualizar = document.createElement('button');
        btnAtualizar.textContent = 'Atualizar';
        btnAtualizar.onclick = () => atualizarQuantidade(data.id); // Usando o ID retornado do servidor
        acoesCell.appendChild(btnAtualizar);

        // Botão de Remover
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => removerItem(data.id); // Usando o ID retornado do servidor
        acoesCell.appendChild(btnRemover);

        linha.appendChild(acoesCell);

        tabelaCorpo.appendChild(linha);

        // Limpa os campos do formulário após o envio
        descricao.value = '';
        quantidade.value = '';
        alertaMinimo.value = '';
    })
    .catch(error => {
        console.error('Erro ao adicionar item:', error);
    });
};


async function carregarItens() {
    try {
        const response = await fetch('/estoque/itens');
        const items = await response.json();
        const tabelaCorpo = document.getElementById('tabela-corpo');
        const alertContainer = document.getElementById('alert-container');

        tabelaCorpo.innerHTML = ''; // Limpa a tabela antes de adicionar os itens
        alertContainer.innerHTML = ''; // Limpa alertas anteriores

        items.forEach(item => {
            const linha = document.createElement('tr');
            
            const descricao = document.createElement('td');
            descricao.textContent = item.descricao;
            linha.appendChild(descricao);

            const quantidade = document.createElement('td');
            quantidade.textContent = item.quantidade;
            linha.appendChild(quantidade);

            const acoes = document.createElement('td');

            // Botão de Atualizar
            const btnAtualizar = document.createElement('button');
            btnAtualizar.textContent = 'Atualizar';
            btnAtualizar.onclick = () => atualizarQuantidade(item.id);
            acoes.appendChild(btnAtualizar);

            // Botão de Remover
            const btnRemover = document.createElement('button');
            btnRemover.textContent = 'Remover';
            btnRemover.onclick = () => removerItem(item.id);
            acoes.appendChild(btnRemover);

            linha.appendChild(acoes);

            tabelaCorpo.appendChild(linha);

            // Verifica se a quantidade está abaixo do alerta mínimo
            if (item.quantidade < item.alertaMinimo) {
                // Adiciona a mensagem de alerta ao container
                alertContainer.innerHTML += `<p>Alerta: O item ${item.descricao} está abaixo do limite mínimo!</p>`;
            }
        });
    } catch (error) {
        console.error('Erro ao carregar itens do estoque:', error);
    }
}

async function atualizarQuantidade(id) {
    const novaQuantidade = prompt('Digite a nova quantidade:');
    if (novaQuantidade) {
        try {
            const response = await fetch(`/estoque/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantidade: novaQuantidade })
            });
            if (response.ok) {
                alert('Quantidade atualizada com sucesso!');
                carregarItens();
            } else {
                console.error('Erro ao atualizar a quantidade.');
            }
        } catch (error) {
            console.error('Erro ao atualizar a quantidade:', error);
        }
    }
}

async function removerItem(id) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        try {
            const response = await fetch(`/estoque/delete/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Item removido com sucesso!');
                carregarItens();
            } else {
                console.error('Erro ao remover o item.');
            }
        } catch (error) {
            console.error('Erro ao remover o item:', error);
        }
    }
}

// Carrega os itens quando a página é carregada
window.addEventListener('DOMContentLoaded', carregarItens);

document.getElementById('formularioEstoque').addEventListener('submit', addItem);
