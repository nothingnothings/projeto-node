
    const fs = require('fs');


    console.log('TEST');



const requestHandler = (req, res) => {


    const url = req.url;


    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My first page</title></head>');
        res.write('<body>');
        res.write('<div>');
        res.write('<form action="/message" method="POST"');
        res.write('<label htmlFor="message">Enter a Message!</label>');
        res.write('<input type="text" name="message"></input>');
        res.write('<button type="submit">SEND</button>');
        res.write('</form>');
        res.write('</div>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
      }
    
      console.log('textTest');


      if (url === '/message' && req.method === 'POST') {
        const body = [];
    
        req.on('data', (chunk) => {
          console.log(chunk);
          body.push(chunk);
        });
        // req.on( ////esta linha precisa ter um 'RETURN' no seu início, para IMPEDIR a execução daquelas linhas síncronas de 'res.setHeader()', mais abaixo...
        return req.on('end', () => {
          const parsedBody = Buffer.concat(body).toString().split('=')[1];
          console.log(parsedBody);
        //   fs.writeFileSync('message.txt', parsedBody); ///versão síncrona. meio ruim.
        fs.writeFile('message.txt', parsedBody,  ///versão assíncrona, que aceita 3 PARÂMETROS, SENDO O ÚLTIMO DELES __ UMA CALLBACK FUNCTION A SER EXECUTADA QUANDO TIVER ACABADO O 'WRITE' DO ARQUIVO (evento 'end do write')....
         (err) => {   //writeFile também te deixa FAZER ERROR HANDLING (escrever cases de 'falta de permission' por exemplo, no write de arquivos.. --> aí você pode handle it gracefully, mandando uma response com error code ao usuário, show de outras páginas, etc etc...)
            res.writeHead(302, {
                Location: '/',
              });
              return res.end();
            
        });
        //   res.writeHead(302, {
        //     Location: '/',
        //   });
        //   return res.end();
        });
      }
    
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>My first page</title></head>');
      res.write('<body><div><h1>Hello from my Node.js Server!</h1></div></body>');
      res.write('</html>');
      res.end();



}






// module.exports = requestHandler; ////PRIMEIRA SINTAXE DE EXPORTS DO NODEJS... --> requer que você IMPORTE ESSE ARQUIVO 'routes.js' NO ARQUIVO EM QUE PLANEJA USAR ESSA FUNÇÃO..




module.exports = {
  handler: requestHandler,
  someText: 'some hard coded text'
}



// exports.handler = requestHandler; ////esta sintaxe tbm é permitida, é um SHORTCUT EM QUE REMOVEMOS 'module'; (e esse código aqui é basicamente o mesmo código do de cima.....)
// exports.someText = 'Some hard coded text'; 



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




