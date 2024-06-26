//Carregamento AJAX
let ajax = new XMLHttpRequest();
ajax.open('GET', './dados.json', true);

ajax.send()

ajax.onreadystatechange = function() {
    let content = document.getElementById('content');
    let jsonData = [];
    if(this.readyState == 4 && this.status == 200){
        jsonData = JSON.parse(ajax.responseText);
        console.log(jsonData);

        if(jsonData.length == 0){
            content.innerHTML = '<div class="alert alert-warning" role ="alert">Desculpe. Não foi possivel conectar a nossa base de dados! Tente de novo mais tarde</div>';
            /**
             * Se não tivermos um retorno valido, encerraremos com mensagem de erro simples.
             */
            return;
        }

        let htmlContent = '';

        for(let i=0; i<jsonData.length; i++){
            htmlContent += `<div class="row"><div class="col-12"> <h2><span></span>${jsonData[i].categoria}</h2></div> </div>`;

            if(jsonData[i].brinquedos.length == 0){
                htmlContent += '<div class="row"><div class="col-12"> <div class="alert alert-warning" role ="alert">Desculpe. Ainda não possuimos brinquedos para essa categoria!</div></div> </div>';
            } else{
                htmlContent += `<div class="row">`;

                for(let j=0; j<jsonData[i].brinquedos.length; j++){
                    htmlContent += gerarTemplateBrinquedo(
                        jsonData[i].brinquedos[j].nome,
                        jsonData[i].brinquedos[j].imagem,
                        jsonData[i].brinquedos[j].valor,
                        jsonData[i].brinquedos[j].whatsapp
                    );
                }
                
                htmlContent += `</div>`;
            }

        }
        cacheDinamico(jsonData);
        content.innerHTML = htmlContent;
        
    }
}

var gerarTemplateBrinquedo = function(nome, imagem, valor, telefone){
    return `<div class="col-lg-4">
                <div class="card">
                    <img src="${imagem}" class="card-img-top" alt="${nome}">
                    <div class="card-body">
                        <h5 class="card-title">${nome}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <p class="card-text"><strong>Valor:</strong>${valor}</p>
                        <div class="d-grid gap-2">
                            <a href="https://api.whatsapp.com/send?phone=55${telefone}&text=Olá tenho interesse na ActionFigure ${nome}" target="_blank"class="btn btn-warning">Comprar</a>
                        </div>
                    </div>
                </div>
            </div>`;
}

/**
 * Contruir cache dinamico
 */
var cacheDinamico = function(dadosJson){
    if(`caches` in window){
        console.log(`Deletando cache dinamico antigo`);
        caches.delete(`brinquedo-app-dinamico`).then(() => {
            if(dadosJson.length > 0){
                var files =[`dados.json`];

                for(let i=0; i<dadosJson.length; i++){
                    for(let j=0; j<dadosJson[i].brinquedos.length; j++){
                        if(files.indexOf(dadosJson[i].brinquedos[j].imagem) == -1){
                            files.push(dadosJson[i].brinquedos[j].imagem);
                        }
                    }
                }
            }
            caches.open(`brinquedo-app-dinamico`).then((cache) => {
                cache.addAll(files).then(() => {
                    console.log(`Novo cache dinamico gerado`);
                })
            })
        });
    }
}

/**
 * botao de instalação
 */
let disparoInstalacao = null;
const botaoIntalar = document.getElementById(`botao`);

let iniciarInstalacao = function(){
    botaoIntalar.removeAttribute(`hidden`);
    botaoIntalar.addEventListener(`click`, () =>{
        disparoInstalacao.prompt();
        disparoInstalacao.userChoice.then((choice) => {
            if(choice.outcome === `accepted`){
                console.log(`Usuario instalou`);
            } else{
                console.log(`Não instalou`);
            }
        })
    });
}

window.addEventListener(`beforeinstallprompt`, gravarDisparo);

function gravarDisparo(event){
    disparoInstalacao = event;
}