
const http = require('http');

const fs = require('fs');

// http.createServer(); //////FUNÇÃO MAIS IMPORTANTE PARA A CRIAÇÃO DE UM SERVIDOR NODEJS (duh)

// const reqListener = (req, res) => { ///objetos que representam A REQUEST que chega ao server e a RESPONSE que vamos enviar para fora dele....
//    ^^^^^^
///A DEFINIÇÃO DESSA FUNÇÃO 'REQUEST LISTENER' é desnecessária, podemos simplesmente escrever uma anonymous function DENTRO DO CALL DE 'createServer', e então escrever nosso código normalmente...
// };

// http.createServer(reqListener); ///////ESSA FUNÇÃO ACEITA/EXIGE UM PARÂMETRO QUE É UM  ''''REQUEST LISTENER'''' ---> ESSA FUNÇÃO-PARÂMETRO SERÁ EXECUTADA 'FOR EACH AND EVERY INCOMING REQUEST' que atinge o servidor.... (poderíamos, por exemplo, implementar um 'contador de visitas' no servidor, por meio dessa função...)
                        ////^^^^^^ VERSÃO QUE USA UMA DEFINIÇÃO EXPLÍCITA DE 'reqListener'.... ---> MAS NÃO PRECISAMOS ESCREVER NOSSA 'REQUEST LISTENER' FUNCTION EXPLICITAMENTE; podemos simplesmente escrever uma função interna/ANONYMOUS FUNCTION DENTRO DO CALL DE 'createServer'...








// http.createServer((req, res) => { ////versão SIMPLIFICADA DO CÓDIGO QUE TEMOS MAIS ACIMA. É melhor... (a função interna desse 'createServer' será JUSTAMENTE UMA FUNÇÃO 'request listener', uma função QUE SERÁ EXECUTADA FOR EACH AND EVERY REQUEST QUE ALCANÇA O SERVER...)
//         console.log(req);
// }) ^^^^^ SINTAXE INCOMPLETA...





const server = http.createServer((req, res) => { ////versão SIMPLIFICADA DO CÓDIGO QUE TEMOS MAIS ACIMA. É melhor... (a função interna desse 'createServer' será JUSTAMENTE UMA FUNÇÃO 'request listener', uma função QUE SERÁ EXECUTADA FOR EACH AND EVERY REQUEST QUE ALCANÇA O SERVER...)
        // console.log(req); 
        // console.log(req.url); ////método essencial (usado no ROUTING de requests, e outras coisas)...
        // console.log(req.method); ///método essencial (usado para LIMITAR O TIPO DE INCOMING REQUESTS QUE RECEBEMOS)....
        // console.log(req.headers); ///método essencial, usado para DETERMINAR/DESCOBRIR NOSSOS HEADERS...
        // console.log(res);



        const url = req.url;


        // console.log(url);

        // console.log(req);
        // console.log(req.query);

        if (url === '/') { ///ROUTING DE REQUESTS... --> se acessarmos uma url com 'slash nothing', vamos querer executar esse código aí...
                res.write('<html>');
                res.write('<head><title>My first page</title></head>');
                res.write('<body>');
                res.write('<div>');
                res.write('<form action="/message" method="POST"');
                res.write('<label htmlFor="message">Enter a Message!</label>')
                res.write('<input type="text" name="message"></input>');
                res.write('<button type="submit">SEND</button>');
                res.write('</form>');
                res.write('</div>');
                res.write('</body>');
                res.write('</html>');
                return res.end(); // 'return' e '.end()' NECESSÁRIOS PARA EVITAR QUE AS LINHAS QUE ESTÃO FORA DESSE IF CHECK SEJAM executadas...
        }


        
        if (url === '/message' && req.method === 'POST') {
               

                const body = [];


                req.on(
                        'data', ///evento 'data'.... --> vai fazer 'listen to' ao evento 'DATA', data de NOSSO REQUEST/anexada ao nosso request...
                        (chunk) => { ///SERÁ EXECUTADO MÚLTIPLAS VEZES/re-executado múltiplas vezes, tudo devido ao COMPORTAMENTO DAS 'DATA STREAMS' e dos 'Buffers' (bus stops das data streams), que são o conceito/construct do javascript QUE _ FAZ __ COM QUE __ NOSSA DATA ANEXADA AO REQUEST SEJA ''''PROGRESSIVAMENTE OBTIDA''', obtida aos poucos...
                                //^^^^ ISTO É UMA CALLBACK FUNCTION. CÓDIGO ASSÍCRONO, vinculado à ocorrência do evento 'data'...
                                console.log(chunk);     ///EIS O CÓDIGO EM QUESTÃO. ESSE  CÓDIGO VAI SE 'REPETIR' MÚLTIPLAS VEZES, ATÉ QUE NOSSA DATA SEJA PARSEADA/MANIPULADA POR INTEIRO, pelo nodejs...
                                body.push(chunk); //esse código tbm será executado múltiplas vezes... (eu acho)...
                        }
                )
                // req.on( ////esta linha precisa ter um 'RETURN' no seu início, para IMPEDIR a execução daquelas linhas síncronas de 'res.setHeader()', mais abaixo...
      return  req.on(
                'end',
                        () => { ///esta função interna é uma CALLBACK FUNCTION. CÓDIGO ASSÍNCRONO.
                                const parsedBody = Buffer.concat(body).toString().split('=')[1]; ////'Buffer.concat(body)' ---> isso é um BUFFER/OBJETO BUFFER --> esse objeto é então CONVERTIDO EM UMA STRING por meio de 'toString()'...
                                console.log(parsedBody);
                                fs.writeFileSync('message.txt', parsedBody); ///NA VERSÃO 'app.js' LEGIT, troquei essa função por sua versão ASSÍNCRONA, QUE GERALMENTE É MELHOR/MAIS APROPRIADA, POIS NÃO BLOQUEIA A EXECUÇÃO DO OVERALL CODE como esta... -----> além disso, essa outra versão aceita um TERCEIRO PARÂMETRO, que é uma CALLBACK FUNCTION A SER EXECUTADA QUANDO O 'WRITE' TIVER TERMINADO... (é um event)...
                                res.writeHead(302
                                        , 
                                        {
                                             'Location': '/'   
                                        })
                                return res.end();
                        }
                )
                


                
                // console.log(req.body); ///ISSO NÃO EXISTE.... --> ver conceito de 'data stream' e 'buffers' (os BUS STOPS), e o uso do mÉTOOD 'req.on(() => {})'...
                
               
                // fs.writeFileSync('message.txt', 'DUMMY'); ///versão __SÍNCRONA___ de 'write a file'... depois professor vai explicar melhor a diferença entre isto e 'writeFile' (A VERSÃO ASSÍNCRONA)... 
                // fs.writeFile('message.txt', ); /////versão ASSÍNCRONA DE 'write a file'. É mais utilizada do que a outra.

                // fs.writeFileSync('message.txt', parsedBody);
                // res.statusCode = 302; ///esses 2 códigos são a MESMA COISA QUE O 'writeHead', mas espalhados/escritos em 2 linhas....
                // res.setHeader = ('Location', '/');
      

                // res.writeHead(302
                //         , 
                //         {
                //              'Location': '/'   
                //         })
                // return res.end();

        }


        res.setHeader('Content-Type', 'text/html'); ////CÓDIGO QUE SERÁ IGNORADO PELA EXECUÇÃO DE NOSSA FUNÇÃO, se alcançamos esse primerio if check de 'url === /'....
        res.write('<html>');
        res.write('<head><title>My first page</title></head>')
        res.write('<body><div><h1>Hello from my Node.js Server!</h1></div></body>');
        res.write('</html>');
        res.end(); ///////EIS O CÓDIGO EM QUESTÃO.




        //process.exit(); ///fecha nosso webserver, TERMINA O 'ONGOING EVENT LOOP'/execução de nosso servidor (vai parar de receber requests, pois terminamos o MAIN PROCESS que continha o eventListener que fazia listen aos REQUESTS) ------> este recurso é raramente usado, pois se usarmos 'process.exit()', PARAMOS DE RECEBER INCOMING REQUESTS, E O SERVER PARA DE FUNCIONAR...
}) 








// server.listen(); ///////OUTRO CÓDIGO __ ESSENCIAL__ PARA MANTER/CRIAR NOSSO SERVER NODEJS... ---> isso aqui vai fazer 'LISTEN' por requests, e é o que vai DEIXAR NOSSO SERVER ABERTO A REQUESTS...
////     ^^^^^^ CÓDIGO que ACEITA PARÂMETROS OPCIONAIS (como a porta a que vamos querer fazer 'LISTEN'...).





server.listen(3000); /// EM PRODUCTION, VOCÊ TIPICAMENTE DEIXA ESSE NEGÓCIO EM BRANCO, para que ELE 'TAKE THE DEFAULT OF PORT 80'...
        ////^^^^usamos a porta 3000 pq estamos em DEVELOPMENT...



////PORTA 3000 --> FREQUENTEMENTE USADA ___ NO MODO DE DEVELOPMENT___....


////PORTA 80 --> FREQUENTEMENTE USADA NO MODO DE __ PRODUCTION___...






// VOCÊ PODE USAR QUALQUER PORTA QUE VOCÊ QUISER,
// MAS 
// AS PORTAS 
// '1000'
// SÃO 
// TIPICAMENTE BEM SAFE....