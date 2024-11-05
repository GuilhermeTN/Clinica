document.getElementById('fisioterapeutaForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fisioterapeutaData = {
        nome: document.getElementById('nome').value,
        especialidade: document.getElementById('especialidade').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('/fisioterapeutas/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fisioterapeutaData),
        });

        if (response.ok) {
            document.getElementById('status').innerText = 'Fisioterapeuta cadastrado com sucesso!';
            document.getElementById('fisioterapeutaForm').reset();
            loadFisioterapeutas();
        } else {
            const errorData = await response.json();
            document.getElementById('status').innerText = `Erro: ${errorData.message || 'Erro ao cadastrar fisioterapeuta.'}`;
        }
    } catch (error) {
        console.error('Erro ao cadastrar fisioterapeuta:', error);
        document.getElementById('status').innerText = 'Erro ao cadastrar fisioterapeuta.';
    }
});

async function loadFisioterapeutas() {
    try {
        const response = await fetch('/fisioterapeutas/api');
        const fisioterapeutas = await response.json();
        const tbody = document.querySelector('#fisioterapeutasTable tbody');
        tbody.innerHTML = '';

        fisioterapeutas.forEach(fisio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fisio.id}</td>
                <td>${fisio.nome}</td>
                <td>${fisio.especialidade}</td>
                <td>${fisio.telefone}</td>
                <td>${fisio.email}</td>
                <td><button class="remove-btn" data-id="${fisio.id}">Remover</button></td>
            `;
            tbody.appendChild(row);
        });

        addRemoveEventListeners();
    } catch (error) {
        console.error('Erro ao carregar fisioterapeutas:', error);
    }
}

function addRemoveEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            removeFisioterapeuta(id);
        });
    });
}

async function removeFisioterapeuta(id) {
    if (confirm('Você tem certeza que deseja remover este fisioterapeuta?')) {
        try {
            const response = await fetch(`/fisioterapeutas/api/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                document.getElementById('status').innerText = 'Fisioterapeuta removido com sucesso!';
                loadFisioterapeutas();
            } else {
                const errorData = await response.json();
                document.getElementById('status').innerText = `Erro: ${errorData.message || 'Erro ao remover fisioterapeuta.'}`;
            }
        } catch (error) {
            console.error('Erro ao remover fisioterapeuta:', error);
            document.getElementById('status').innerText = 'Erro ao remover fisioterapeuta.';
        }
    }
}

// Carregar fisioterapeutas ao iniciar a página
loadFisioterapeutas();
