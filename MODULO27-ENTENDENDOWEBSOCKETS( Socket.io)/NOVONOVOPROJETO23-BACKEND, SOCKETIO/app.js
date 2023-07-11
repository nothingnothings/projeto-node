const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const uuid = require('uuid').v4;

const multer = require('multer'); /////sim, vamos usar o multer novamente, para FAZER HANDLE DOS FILE UPLOADS FEITOS PELO USER AO NOSSO BACKEND/APP...

const mongoose = require('mongoose'); ///nem mesmo precisamos do 'mongodb' driver.... (mas instale mesmo assim).




const MONGODB_URI =
  'mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/postFeed?retryWrites=true&w=majority';

const feedRoutes = require('./routes/feed');



const authRoutes = require('./routes/auth');
const { init } = require('./models/user');



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, PUT, PATCH, GET, POST, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    console.log(file.fieldname, 'LINE');

    cb(null, uuid() + '-' + file.originalname); ///vamos usar isso como substituto de  ''   cb(null, new Date().toISOString() + file.originalname);''
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);

  console.log(req.body.title, 'LINE3');

  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    if (
      req.body.title.length >= 6 &&
      req.body.title.match(/^[A-Za-z]+$/) &&
      req.body.content.length >= 6
    ) {
      console.log('IMAGE UPLOADED')
      return cb(null, true);
    } else {
      return cb('Invalid data inputted, file was not saved.', false);
    }
  } else {
   return cb(null, false); ///isso é o que interessa... vai parar nosso fileupload, se o chamarmos... (ou não).
  }
};

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images'))); //não se esqueça do '/images' no início...

// console.log(path.join(__dirname, 'images'));



app.use('/auth', authRoutes);

app.use('/feed', feedRoutes);


// app.listen(3000);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; ///COM ESSA SINTAXE, DEFINIMOS '500' por default.... será o default caso nenhum status code tiver sido definido anteriormente, no objeto 'erro'...
  const message = error.message; ////'message' é uma propriedade QUE SEMPRE EXISTE NOS OBJETOS 'error'... é a mensagem que você escreve tipo em 'new Error('Mensagem escrita')' ....
  const data = error.data; ///ver o código de 'exports.signup', lá em 'auth.js'...
  res.status(status).json(
    ///RESPOSTA PADRONIZADA...
    {
      message: message,
      data: data 
    }
  );
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(8080); ////AQUI, VAMOS __ ARMAZENAR__ NOSSO SERVIDOR (o app nodeexpress em si) EM UMA CONST DE NOME 'server', QUE VAI SER USADA NAQUELE CALL DE 'socket.io' ali embaixo (pq o protocolo WEBSOCKETS 'builds upon' o protocolo HTTP, que é o default dos browsers/app nodeexpress)...
    // const io = require('socket.io')(server,  /////////IMPORT LOCAL DESSA PACKAGE QUE FAZ MANAGE DE 'WEBSOCKETS CHANNELS'....
            //)
    
    const io = require('./socket').init(server, ///AQUI, NESSA VERSÃO DA SINTAXE, IMPORTAMOS O 'io' LÁ DE NOSSO ARQUIVO 'socket', para que seja POSSÍVEL REUTILIZAR ESSE 'io' EM VÁRIOS LUGARES DE NOSSO CÓDIGO... (nos controllers, no caso)....
    ///você deve usar seu 'server' (o app nodeexpress na totalidde) como ARGUMENTO DO CALL DESSE 'require('socket.io')'....
            //É ISSO QUE VAI DEFINIR NOSSA 'websockets connection'...
    

            { ////SEGUNDO PARÂMETRO.... necessário para EVITAR _ ERROS _ DE CORS... (sim, também precisamos fazer handle do cors NO NOSSO CANAL 'WEBSOCKETS', além do http...)
              cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
                credentials: true
            }
          }
        
    )
            io.on('connection', (socket) => {  ////'.on()' é o método do SOCKET.IO __ que __dEFINE EVENT LISTENERS, TRIGGADOS POR DETERMINADAS COISAS.... (como 'connections', nesse nosso exemplo)...
              /// o segundo parâmetro SEMPRE SERÁ UMA CALLBACK FUNCTION, function que recebe o ARGUMENTO 'socket' (que será A ACTUAL CONNECTION, A WEBSOCKETS CONNECTION ENTRE CLIENT E SERVER)....

              console.log('Client connected'); ////não veremos, 'out of the box',  esse 'client connected' no console... --> mas pq?  ------> PQ PRECISAMOS QUE _ _SEJA ESTABELECIDA/TENTEADA __ UM 'WEBSOCKET REQUEST', lá do BROWSERSIDE, disparado do browserside, PARA QUE ESSE CÓDIGO de 'io.on('connection')', esse eventListener aí, __ SEJA __ TRIGGADO_... (e para que seja feito aquele console.log...)
           
            }) 


            //'io.on()' --> É UM LISTENER... -> NO CASO DE 'connections', vamos FAZER COM QUE ESSE CÓDIGO DO SEGUNDO PARÂMETRO SEJA EXECUTADO __ SEMPRE QUE _UMA NOVA CONNECTION (feita por um client) FOR ESTABELECIDA AO NOSSO NODEEXPRESS APP...


            ///'socket' --> é o client/conexão ao client, objeto que representa essa conexão...
        
        
          }) 
  .catch((err) => {
    console.log(err);
  });

// app.listen(8080); // usamos a porta 8080 PQ NO REACT JÁ USAMOS AUTOMATICAMENTE A PORTA '3000'...
