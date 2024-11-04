const apiUrl = 'http://localhost:3000/prontuarios/api';

function renderProntuarios() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(prontuarios => {
            const tbody = document.getElementById('prontuarios-table').getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            prontuarios.forEach(prontuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prontuario.id}</td>
                    <td>${prontuario.paciente}</td>
                    <td>${prontuario.data}</td>
                    <td>${prontuario.historico}</td>
                    <td>
                        <button onclick="editProntuario(${prontuario.id})">Editar</button>
                        <button onclick="deleteProntuario(${prontuario.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}


function openForm() {
    document.getElementById('form-modal').style.display = 'block';
    document.getElementById('prontuario-form').reset();
    document.getElementById('form-title').innerText = 'Adicionar Prontuário';
}

function closeForm() {
    document.getElementById('form-modal').style.display = 'none';
}

function saveProntuario(event) {
    event.preventDefault();
    const id = document.getElementById('prontuario-id').value;
    const paciente = document.getElementById('paciente').value;
    const data = document.getElementById('data').value;
    const historico = document.getElementById('historico').value;

    const method = id ? 'PUT' : 'POST'; // Usa PUT se id estiver presente
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paciente, data, historico })
    })
    .then(response => {
        if (response.ok) {
            closeForm();
            renderProntuarios();
        }
    });
}

function editProntuario(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(prontuario => {
            document.getElementById('prontuario-id').value = prontuario.id;
            document.getElementById('paciente').value = prontuario.paciente;
            document.getElementById('data').value = prontuario.data;
            document.getElementById('historico').value = prontuario.historico;
            document.getElementById('form-title').innerText = 'Editar Prontuário';
            openForm();
        });
}

function deleteProntuario(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            renderProntuarios();
        }
    });
}

// Função de pesquisa
function searchProntuario() {
    const search = document.getElementById('search').value.toLowerCase();
    fetch(apiUrl)
        .then(response => response.json())
        .then(prontuarios => {
            const filtered = prontuarios.filter(prontuario =>
                prontuario.paciente.toLowerCase().includes(search)
            );
            renderFilteredProntuarios(filtered);
        });
}

function renderFilteredProntuarios(filtered) {
    const tbody = document.getElementById('prontuarios-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    filtered.forEach(prontuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prontuario.id}</td>
            <td>${prontuario.paciente}</td>
            <td>${prontuario.data}</td>
            <td>${prontuario.historico}</td>
            <td>
                <button onclick="editProntuario(${prontuario.id})">Editar</button>
                <button onclick="deleteProntuario(${prontuario.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.getElementById('prontuario-form').addEventListener('submit', saveProntuario);
document.getElementById('search').addEventListener('input', searchProntuario);
renderProntuarios();
