document.addEventListener('DOMContentLoaded', () => {
    const calendarioDiv = document.getElementById('calendario');
    const mesAnoDiv = document.getElementById('mesAno');
    const hoje = new Date();
    let mesAtual = hoje.getMonth();
    let anoAtual = hoje.getFullYear();

    // Variável global para armazenar a data selecionada
    let dataSelecionada;

    // Referência ao campo de entrada de data
    const inputData = document.getElementById('data');

    // Função para renderizar o calendário
    const renderizarCalendario = (mes, ano) => {
        calendarioDiv.innerHTML = ''; // Limpa o conteúdo anterior
        mesAnoDiv.textContent = `${meses[mes]} ${ano}`;
        mesAnoDiv.style.textAlign = 'center';

        // Cabeçalho com o mês e ano
        const mesAnoHeader = document.createElement('div');
        mesAnoHeader.textContent = `${meses[mes]} ${ano}`;
        mesAnoHeader.style.gridColumn = 'span 7';
        mesAnoHeader.style.textAlign = 'center';
        mesAnoHeader.style.fontSize = '20px';
        mesAnoHeader.style.fontWeight = 'bold';
        calendarioDiv.appendChild(mesAnoHeader);

        // Cabeçalho dos dias da semana
        const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        diasDaSemana.forEach(dia => {
            const diaElem = document.createElement('div');
            diaElem.textContent = dia;
            calendarioDiv.appendChild(diaElem);
        });

        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);

        // Adiciona dias em branco para o primeiro dia do mês
        for (let i = 0; i < primeiroDia.getDay(); i++) {
            const diaElem = document.createElement('div');
            calendarioDiv.appendChild(diaElem); // Dia vazio
        }

        // Adiciona os dias do mês
        for (let i = 1; i <= ultimoDia.getDate(); i++) {
            const diaElem = document.createElement('div');
            diaElem.classList.add('dia');
            diaElem.textContent = i;

            // Define o evento de clique para o dia no calendário
            diaElem.onclick = (event) => {
                event.preventDefault(); // Impede o comportamento padrão
                dataSelecionada = `${ano}-${mes + 1}-${i}`; // Formato da data: YYYY-MM-DD
                agendarConsultaPopup(dataSelecionada); // Chama o pop-up com a data selecionada
            };

            // Verifica se há consultas agendadas neste dia
            verificarConsulta(i, mes + 1, ano).then(hasConsulta => {
                if (hasConsulta) {
                    diaElem.classList.add('vermelho'); // Dia com consulta
                } else {
                    diaElem.classList.add('verde'); // Dia sem consulta
                }
            });

            calendarioDiv.appendChild(diaElem);
        }

        // Botão para voltar ao mês atual
        const voltarMesAtualButton = document.createElement('button');
        voltarMesAtualButton.textContent = 'Voltar ao Mês Atual';
        voltarMesAtualButton.onclick = () => {
            mesAtual = hoje.getMonth();
            anoAtual = hoje.getFullYear();
            renderizarCalendario(mesAtual, anoAtual);
        };
        calendarioDiv.appendChild(voltarMesAtualButton);

        // Botão para próximo mês
        const proximoMesButton = document.createElement('button');
        proximoMesButton.textContent = 'Próximo Mês';
        proximoMesButton.onclick = () => {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            renderizarCalendario(mesAtual, anoAtual);
        };
        calendarioDiv.appendChild(proximoMesButton);
    };

    // Array para os meses
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Função para verificar se há consultas agendadas
    const verificarConsulta = async (dia, mes, ano) => {
        try {
            const response = await fetch(`/consultas/data?dia=${dia}&mes=${mes}&ano=${ano}`);
            const consultas = await response.json();
            return consultas.length > 0; // Retorna true se houver consultas
        } catch (err) {
            console.error('Erro ao verificar consultas:', err);
            return false;
        }
    };

    // Renderiza o calendário no carregamento da página
    renderizarCalendario(mesAtual, anoAtual);
});