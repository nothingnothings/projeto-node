// const http = require('http');

// const fs = require('fs');

// const server = http.createServer((req, res) => {
//   const url = req.url;

//   if (url === '/') {
//     res.write('<html>');
//     res.write('<head><title>My first page</title></head>');
//     res.write('<body>');
//     res.write('<div>');
//     res.write('<form action="/message" method="POST"');
//     res.write('<label htmlFor="message">Enter a Message!</label>');
//     res.write('<input type="text" name="message"></input>');
//     res.write('<button type="submit">SEND</button>');
//     res.write('</form>');
//     res.write('</div>');
//     res.write('</body>');
//     res.write('</html>');
//     return res.end();
//   }

//   if (url === '/message' && req.method === 'POST') {
//     const body = [];

//     req.on('data', (chunk) => {
//       console.log(chunk);
//       body.push(chunk);
//     });
//     // req.on( ////esta linha precisa ter um 'RETURN' no seu início, para IMPEDIR a execução daquelas linhas síncronas de 'res.setHeader()', mais abaixo...
//     return req.on('end', () => {
//       const parsedBody = Buffer.concat(body).toString().split('=')[1];
//       console.log(parsedBody);
//     //   fs.writeFileSync('message.txt', parsedBody); ///versão síncrona. meio ruim.
//     fs.writeFile('message.txt', parsedBody,  ///versão assíncrona, que aceita 3 PARÂMETROS, SENDO O ÚLTIMO DELES __ UMA CALLBACK FUNCTION A SER EXECUTADA QUANDO TIVER ACABADO O 'WRITE' DO ARQUIVO (evento 'end do write')....
//      (err) => {   //writeFile também te deixa FAZER ERROR HANDLING (escrever cases de 'falta de permission' por exemplo, no write de arquivos.. --> aí você pode handle it gracefully, mandando uma response com error code ao usuário, show de outras páginas, etc etc...)
//         res.writeHead(302, {
//             Location: '/',
//           });
//           return res.end();
        
//     });
//     //   res.writeHead(302, {
//     //     Location: '/',
//     //   });
//     //   return res.end();
//     });
//   }

//   res.setHeader('Content-Type', 'text/html');
//   res.write('<html>');
//   res.write('<head><title>My first page</title></head>');
//   res.write('<body><div><h1>Hello from my Node.js Server!</h1></div></body>');
//   res.write('</html>');
//   res.end();
// });

// server.listen(3000);


console.log('test');

console.log('TEST');


const http = require('http');

const routes = require('./routes'); ///nós exportamos 'requestHandler'/importamos 'requestHandler', lá de 'routes.js'...

// const fs = require('fs'); //devemos nos concentrar no CREATE DO SERVER, e não no uso de filesystem (colocamos isso em outro arquivo)....

// const server = http.createServer((req, res) => {
//   // const url = req.url; ///desnecessário.


// });



// const server = http.createServer(routes);



console.log(routes.someText);



console.log('TEST');


const server = http.createServer(routes.handler);


server.listen(3000);
