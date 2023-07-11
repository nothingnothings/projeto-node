const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const uuid = require('uuid').v4;

const multer = require('multer'); /////sim, vamos usar o multer novamente, para FAZER HANDLE DOS FILE UPLOADS FEITOS PELO USER AO NOSSO BACKEND/APP...

const mongoose = require('mongoose'); ///nem mesmo precisamos do 'mongodb' driver.... (mas instale mesmo assim).

const MONGODB_URI =
  'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/postFeed?retryWrites=true&w=majority';

const feedRoutes = require('./routes/feed');



const authRoutes = require('./routes/auth');



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
      req.body.title.length > 6 &&
      req.body.title.match(/^[A-Za-z]+$/) &&
      req.body.content.length > 6
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
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(8080); // usamos a porta 8080 PQ NO REACT JÁ USAMOS AUTOMATICAMENTE A PORTA '3000'...
