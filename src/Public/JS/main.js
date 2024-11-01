// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    // Função para carregar os dados do paciente (exemplo)
    async function loadPaciente(id) {
        const response = await fetch(`/paciente/visualizar/${id}`);
        const paciente = await response.json();
        content.innerHTML = `
            <h2>${paciente.nome}</h2>
            <p>Data de Nascimento: ${paciente.dataNascimento}</p>
            <p>Telefone: ${paciente.telefone}</p>
            <p>Email: ${paciente.email}</p>
            <!-- Outros dados do paciente -->
        `;
    }

    loadPaciente(1);  // Carregar o paciente com ID 1
});
