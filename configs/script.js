function carregar(ano) {
    fetch('../configs/top_players.json')
        .then(response => {
            if (!response.ok) { throw new Error('Network response was not ok'); }
            return response.json();
        })//passa o erro pro catch caso tenha
        .then(dados => {
            var cont = 0;
            const container = document.querySelector("#jogadores");
            container.innerHTML = '';
            const jogadoresDoAno = dados.filter(jogador => jogador.year === ano);// filtra todos os jogadores pelo ano
            jogadoresDoAno.forEach(jogador => {
                cont += 1;
                const card = document.createElement("div");
                card.classList.add("card");
                const img = document.createElement("img");
                img.src = jogador.player_image_url;
                img.alt = jogador.player_name;
                const titulo = document.createElement("h3");
                const tit = jogador.player_name;
                const nomeLimpo = tit.replace(/[\d()]/g, '').trim();
                const rank = document.createElement("h2");
                rank.textContent = cont;
                titulo.textContent = nomeLimpo;
                card.appendChild(rank)
                card.appendChild(img);
                card.appendChild(titulo);
                card.addEventListener('click', () => {
                    abrirModal(jogador);
                });
                container.appendChild(card);// acima é a adição dos componentes na parte principal do site
            });
        })
        .catch(error => {
            console.error("Houve um problema com a requisição na função carregar():", error);
        });//caso ocorra algum erro no carregar
}

function popularSelectAnos() {
    console.log("Tentando popular o seletor de anos...");
    fetch('../configs/top_players.json')
        .then(response => {
            console.log("Resposta do fetch recebida.");
            if (!response.ok) {
                //passa o erro pro catch
                throw new Error('Erro na rede: ' + response.statusText);
            }
            return response.json();
        })
        .then(dados => {
            console.log("Dados do JSON recebidos com sucesso.");
            const selectAno = document.getElementById("ano");
            selectAno.innerHTML = '';
            const anosUnicos = [...new Set(dados.map(jogador => jogador.year))].sort();

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
            // Esse catch será executado se o fetch falhar
            console.error("Houve um problema ao buscar os anos:", error);
        });
}

// Chama a função para popular a lista de anos quando a página carregar
document.addEventListener('DOMContentLoaded', popularSelectAnos);


//funções do modal
function abrirModal(jogador) {
    const modal = document.getElementById("meuModal");
    const modalImg = document.getElementById("modal-img");
    const modalTitulo = document.getElementById("modal-titulo");
    const nomeSujo = jogador.player_name;
    const nomeLimpo = nomeSujo.replace(/[\d()]/g, '').trim();
    modalTitulo.textContent = nomeLimpo;
    const modalPOS = document.getElementById("modal-pos");
    const modalDIF = document.getElementById("modal-dif");
    const modalDIF1 = document.getElementById("modal-dif1");
    const modalCART = document.getElementById("modal-cart");
    const modalVAL = document.getElementById("modal-valor");
    modalImg.src = jogador.player_image_url;
    modalPOS.textContent = jogador.position;
    const metrica = jogador.hover_metric;
    const metric = metrica.split("<br>");
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



