document.getElementById('pacienteForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('status').innerText = 'Paciente cadastrado com sucesso!';
            event.target.reset(); // Reseta o formulário
            loadPacientes(); // Atualiza a tabela de pacientes
        } else {
            const errorData = await response.json();
            document.getElementById('status').innerText = `Erro: ${errorData.message}`;
        }
    } catch (error) {
        document.getElementById('status').innerText = `Erro ao cadastrar paciente: ${error.message}`;
    }
});

// Função para carregar pacientes cadastrados
async function loadPacientes() {
    try {
        const response = await fetch('/pacientes/data');
        const pacientes = await response.json();
        const tbody = document.querySelector('#pacientesTable tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

        pacientes.forEach(paciente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paciente.id}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.dataNascimento}</td>
                <td>${paciente.telefone}</td>
                <td>${paciente.email}</td>
                <td>${paciente.endereco}</td>
                <td>${paciente.genero}</td>
                <td>${paciente.cpf}</td>
                <td><button class="remove-btn" data-id="${paciente.id}">Remover</button></td> <!-- Botão Remover -->
            `;
            tbody.appendChild(row);
        });

        // Adiciona event listeners para os botões de remoção
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                removePaciente(id);
            });
        });
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

// Função para remover um paciente
async function removePaciente(id) {
    if (confirm('Você tem certeza que deseja remover este paciente?')) {
        try {
            const response = await fetch(`/pacientes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                document.getElementById('status').innerText = 'Paciente removido com sucesso!';
                loadPacientes(); // Atualiza a tabela de pacientes
            } else {
                const errorData = await response.json();
                document.getElementById('status').innerText = `Erro: ${errorData.message}`;
            }
        } catch (error) {
            document.getElementById('status').innerText = `Erro ao remover paciente: ${error.message}`;
        }
    }
}

// Carrega pacientes ao iniciar a página
window.onload = loadPacientes;
