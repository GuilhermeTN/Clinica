const apiUrl = 'http://localhost:3000/prontuarios/api';

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao realizar a operação');
    }
    return response.json();
}

async function renderProntuarios() {
    try {
        const prontuarios = await fetchJson(apiUrl);
        renderProntuarioTable(prontuarios);
    } catch (error) {
        console.error('Erro ao carregar prontuários:', error);
        alert('Erro ao carregar prontuários. Tente novamente mais tarde.');
    }
}

function renderProntuarioTable(prontuarios) {
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
}

function openForm() {
    document.getElementById('form-modal').style.display = 'block';
    document.getElementById('prontuario-form').reset();
    document.getElementById('form-title').innerText = 'Adicionar Prontuário';
}

function closeForm() {
    document.getElementById('form-modal').style.display = 'none';
}

async function saveProntuario(event) {
    event.preventDefault();
    const id = document.getElementById('prontuario-id').value;
    const paciente = document.getElementById('paciente').value;
    const data = document.getElementById('data').value;
    const historico = document.getElementById('historico').value;

    const method = id ? 'PUT' : 'POST'; // Usa PUT se id estiver presente
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    try {
        await fetchJson(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paciente, data, historico })
        });
        closeForm();
        renderProntuarios();
    } catch (error) {
        alert(`Erro ao salvar prontuário: ${error.message}`);
    }
}

async function editProntuario(id) {
    try {
        const prontuario = await fetchJson(`${apiUrl}/${id}`);
        document.getElementById('prontuario-id').value = prontuario.id;
        document.getElementById('paciente').value = prontuario.paciente;
        document.getElementById('data').value = prontuario.data;
        document.getElementById('historico').value = prontuario.historico;
        document.getElementById('form-title').innerText = 'Editar Prontuário';
        openForm();
    } catch (error) {
        alert(`Erro ao editar prontuário: ${error.message}`);
    }
}

async function deleteProntuario(id) {
    if (confirm('Você tem certeza que deseja excluir este prontuário?')) {
        try {
            await fetchJson(`${apiUrl}/${id}`, { method: 'DELETE' });
            renderProntuarios();
        } catch (error) {
            alert(`Erro ao excluir prontuário: ${error.message}`);
        }
    }
}

// Função de pesquisa
async function searchProntuario() {
    const search = document.getElementById('search').value.toLowerCase();
    try {
        const prontuarios = await fetchJson(apiUrl);
        const filtered = prontuarios.filter(prontuario =>
            prontuario.paciente.toLowerCase().includes(search)
        );
        renderProntuarioTable(filtered);
    } catch (error) {
        alert(`Erro ao pesquisar prontuários: ${error.message}`);
    }
}

document.getElementById('prontuario-form').addEventListener('submit', saveProntuario);
document.getElementById('search').addEventListener('input', searchProntuario);
renderProntuarios();
