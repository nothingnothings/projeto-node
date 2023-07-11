const http = require('http');





const server = http.createServer((request, response) => { ///////DEFINE O SERVIDOR
    //response.setHeader('Content-Type', 'text/plain'); //USADO PARA OUTPUTTAR O 'HTML' como simples texto na página do browser (não há conversão, nesse caso, da escrita HTML em elementos da página.... a escrita html é simplesmente mostrada como texto na página do browser...)
    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon'} );
        response.end();
        console.log('favicon requested');
        return;
      }







    let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        body = Buffer.concat(body).toString();
        let userName = 'Unknown User'
        if (body) {
          userName = body.split('=')[1];
        }
        console.log(body);
        console.log(userName);

            //console.log(request.method, request.url);
      
    response.setHeader('Content-Type', 'text/html');
    //response.write('hello there!');
    response.write(`<h1>Hi, ${userName}</h1><form method="POST" action="/"><input name="username" type="text"><button type="submit">Send</button></form>`);
    response.end();
      })





});



server.listen(3000); //////EXECUTA O SERVIDOR.