let currentId = 0;

const addItem = (event) => {
    event.preventDefault();

    const descricao = document.getElementById('descricao');
    const quantidade = document.getElementById('quantidade');
    const alertaMinimo = document.getElementById('alertaMinimo');

    if (!descricao || !quantidade || !alertaMinimo) {
        console.error('Um ou mais elementos do formulário não foram encontrados.');
        return; 
    }

    const itemData = {
        descricao: descricao.value,
        quantidade: quantidade.value,
        alertaMinimo: alertaMinimo.value
    };

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
        const tabelaCorpo = document.getElementById('tabela-corpo');
        const linha = document.createElement('tr');

        linha.appendChild(createCell(data.descricao));
        linha.appendChild(createCell(data.quantidade));
        linha.appendChild(createActionsCell(data.id));

        tabelaCorpo.appendChild(linha);

        descricao.value = '';
        quantidade.value = '';
        alertaMinimo.value = '';
    })
    .catch(error => {
        console.error('Erro ao adicionar item:', error);
    });
};

const createCell = (text) => {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
};

const createActionsCell = (id) => {
    const acoesCell = document.createElement('td');

    const btnAtualizar = document.createElement('button');
    btnAtualizar.textContent = 'Atualizar';
    btnAtualizar.onclick = () => atualizarQuantidade(id);
    acoesCell.appendChild(btnAtualizar);

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = () => removerItem(id);
    acoesCell.appendChild(btnRemover);

    return acoesCell;
};

async function carregarItens() {
    try {
        const response = await fetch('/estoque/itens');
        const items = await response.json();
        const tabelaCorpo = document.getElementById('tabela-corpo');
        const alertContainer = document.getElementById('alert-container');

        tabelaCorpo.innerHTML = '';
        alertContainer.innerHTML = '';

        items.forEach(item => {
            const linha = document.createElement('tr');
            linha.appendChild(createCell(item.descricao));
            linha.appendChild(createCell(item.quantidade));
            linha.appendChild(createActionsCell(item.id));

            tabelaCorpo.appendChild(linha);

            if (item.quantidade < item.alertaMinimo) {
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
            const response = await fetch(`/estoque/update/${id}`, { // Corrigido para usar crase
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
            const response = await fetch(`/estoque/delete/${id}`, { // Corrigido para usar crase
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
