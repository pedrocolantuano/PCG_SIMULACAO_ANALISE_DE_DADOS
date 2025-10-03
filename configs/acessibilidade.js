document.addEventListener('DOMContentLoaded', () => {
    function lerInstrucoes() {
        if (window.responsiveVoice) {
            responsiveVoice.speak(
                "Para navegar no site com assistente de voz, pressione TAB para alternar as abas e ENTER para acessar o conteúdo.",
                "Brazilian Portuguese Female",
                { rate: 1.0 }
            );
        } else {
            console.error("ResponsiveVoice não carregou.");
        }
    }

    let primeiroClique = false;
    function dispararPrimeiroClique() {
        if (!primeiroClique) {
            lerInstrucoes();
            primeiroClique = true;
            document.removeEventListener('click', dispararPrimeiroClique);
            document.removeEventListener('keydown', dispararPrimeiroClique);
        }
    }

    document.addEventListener('click', dispararPrimeiroClique);
    document.addEventListener('keydown', dispararPrimeiroClique);
});




function acessibilidade(page) {
    if (page === 'intro') {
        // teste de erros
        if (!window.responsiveVoice) {
            console.error("Erro: A biblioteca ResponsiveVoice.js não foi carregada.");
        return; // interrompe se der erro
        }
        // concatena os textos
        let textoCompleto = '';

        const elementoTitle = document.getElementById('titulo');
        if (elementoTitle) {
            textoCompleto += elementoTitle.textContent + '. '; // adiciona um . para a pausa apos o titulo
        }
            
        const paragrafos = document.querySelectorAll('.paragrafo');
        paragrafos.forEach(paragrafo => {
            textoCompleto += paragrafo.textContent + ' ';
        });

        // faz a voz do google falar em portugues
        responsiveVoice.speak(textoCompleto, "Brazilian Portuguese Female", {
            rate: 1.1,
            pitch: 1
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    const ativo = document.activeElement;
    if (ativo && ativo.classList.contains('navegavel')) {
      event.preventDefault();
      ativo.click();
    }
  }
});
    // Código para leitura por foco
    const elementosNavigaveis = document.querySelectorAll('.navegavel');

    elementosNavigaveis.forEach(elemento => {
        elemento.addEventListener('focus', function() {
            // Verifique se a biblioteca está carregada
            if (window.responsiveVoice) {
                // Interrompa a leitura anterior para evitar sobreposição
                responsiveVoice.cancel();
                
                let texto = '';
                
                // Verifique se o elemento focado é uma imagem dentro de um link
                const imagem = this.querySelector('img');
                if (imagem) {
                    // Pega o texto alt da imagem
                    texto = imagem.alt; 
                } else {
                    // Se não for uma imagem, pega o texto normal
                    texto = this.textContent.trim();
                }

                if (texto) {
                    responsiveVoice.speak(texto, "Brazilian Portuguese Female", {
                        rate: 1.1
                    });
                }
            }
        });
    });
});