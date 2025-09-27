function carregar(ano) {
    const posicaoChave = document.body.dataset.posicao;

    fetch('../configs/top_positions.json')
        .then(response => response.json())
        .then(dados => {
            const container = document.querySelector("#jogadores");
            container.innerHTML = '';

            //variavel importante, pois define qual será a pesquisa do array, permitindo o uso do mesmo script para todas as consultas especificas.
            const listaDeJogadoresDaPosicao = dados[posicaoChave];

            if (!listaDeJogadoresDaPosicao) {
                console.error(`Nenhuma lista de jogadores encontrada para a chave: "${posicaoChave}"`);
                return;
            }

            const jogadoresDoAno = listaDeJogadoresDaPosicao.filter(jogador => jogador.year === ano);
            
            jogadoresDoAno.forEach(jogador => {
                const card = document.createElement("div");
                card.classList.add("card");
                const img = document.createElement("img");
                img.src = jogador.player_image_url;
                img.alt = jogador.player_name;
                const titulo = document.createElement("h3");
                titulo.textContent = jogador.player_name.replace(/[\d()]/g, '').trim();
                card.appendChild(img);
                card.appendChild(titulo);
                card.addEventListener('click', () => abrirModal(jogador));
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Houve um problema com a requisição na função carregar():", error);
        });
}

function popularSelectAnos() {
    console.log("Tentando popular o seletor de anos...");
    fetch('../configs/top_positions.json')
        .then(response => {
            console.log("Resposta do fetch recebida.");
            if (!response.ok) {
                throw new Error('Erro na rede: ' + response.statusText);
            }
            return response.json();
        })
        .then(dados => {
            console.log("Dados do JSON recebidos com sucesso.");
            const selectAno = document.getElementById("ano");
            selectAno.innerHTML = '';

            const todosOsJogadores = Object.values(dados).flat();

            const anosUnicos = [...new Set(todosOsJogadores.map(jogador => jogador.year))].sort();

            anosUnicos.forEach(ano => {
                const option = document.createElement("option");
                option.value = ano;
                option.textContent = ano;
                selectAno.appendChild(option);
            });

            selectAno.addEventListener('change', (event) => {
                const anoSelecionado = parseInt(event.target.value);
                carregar(anoSelecionado);
            });

            if (anosUnicos.length > 0) {
                carregar(anosUnicos[0]);
            }
        })
        .catch(error => {
            console.error("Houve um problema ao buscar os anos:", error);
        });
}


//funções do modal
function abrirModal(jogador) {
    const modal = document.getElementById("meuModal");
    const modalImg = document.getElementById("modal-img");
    const modalTitulo = document.getElementById("modal-titulo");
    modalTitulo.textContent = jogador.player_name.replace(/[\d()]/g, '').trim();
    const modalDIF = document.getElementById("modal-dif");
    const modalDIF1 = document.getElementById("modal-dif1");
    const modalCART = document.getElementById("modal-cart");
    const modalVAL = document.getElementById("modal-valor");
    modalImg.src = jogador.player_image_url;
    const metric = jogador.hover_metric.split("<br>");
    modalDIF.textContent = metric[0];
    modalDIF1.textContent = metric[1];
    modalCART.textContent = jogador.yellow_cards;
    modalVAL.textContent = (jogador.value / 1000000).toFixed(2);//ajusta o valor para exibir somente 2 caracteres depois da , após a divisão por milhao (para exibir o resultado em milhões de euros).
    modal.style.display = "block";
}

function fecharModal() {
    const modal = document.getElementById("meuModal");
    modal.style.display = "none";
}

document.querySelector(".fechar").addEventListener('click', fecharModal);

document.addEventListener("DOMContentLoaded", () => {
    const seletorAno = document.getElementById("ano");
    const check = document.getElementById("check");

    if (seletorAno && check) {
        seletorAno.addEventListener("change", () => {
            check.checked = false; // fecha o menu
        });
    }
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById("meuModal");
    if (event.target === modal) {
        fecharModal();
    }
});

document.addEventListener('DOMContentLoaded', popularSelectAnos);