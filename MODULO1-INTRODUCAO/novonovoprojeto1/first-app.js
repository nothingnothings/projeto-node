const fs = require('fs');





console.log('Hello from Node.js');




fs.writeFileSync('hello.txt', 'Hello from node.js'); ////////VERSÃO SÍNCRONA. 1o argumento ----> É O PATH __ EM QUE VOCÊ VAI QUERER SALVAR ESSE ARQUIVO.... 
                                                    //////ESSE 'PATH' SEMPRE DEVERÁ CONTER O ___NOME __ DO SEU ARQUIVO, ao final (se você quiser o CRIAR, como 'hello.txt', que será CRIADO por meio desse 'writeFileSync', se inda inexistir.... ) -----> E SE VOCÊ COLOCA SÓ O NOME DO ARQUIVO SOLTO, SEM O PATH ANTES DELE (tipo '/caminho/rota/destino/hello.txt', isso seria o nome com o path antes dele), se você faz isso, VOCÊ FARÁ COM QUE UM ARQUIVO COM ESSE NOME SEJA CRIADO NO MESMO FOLDER DESSE ARQUIVO '.js' QUE VOCê EXECUTOU/RODOU...

                                                    ////JÁ O SEGUNDO PARÂMETRO É __ A __ DATA__ QUE VOCÊ VAI QUERER ESCREVER NESSE ARQUIVO... (no caso, esse texto de 'Hello from node.js'...)
