const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const fs = require('fs');

const uuid = require('uuid').v4;

const multer = require('multer'); /////sim, vamos usar o multer novamente, para FAZER HANDLE DOS FILE UPLOADS FEITOS PELO USER AO NOSSO BACKEND/APP... (mesmo em um APP GRAPHQL, em vez de um app REST.... -_> pq vamos realmente usar UMA REST API DENTRO DO NOSSO APP GOVERNADO PELO GRPAHQL API.... ou seja, o graphql é TEORICAMente 'regido por um único endpoint', mas NA PRÁTICA PODEMOS ACABAR USANDO MAIS DE 1, COMO ESSE DE 'app.use('/post-image')', regido pelo MULTER, em que faremos o UPLOAD DE NOSSOS ARQUIVOS/images....)

const mongoose = require('mongoose'); ///nem mesmo precisamos do 'mongodb' driver.... (mas instale mesmo assim).

const { graphqlHTTP } = require('express-graphql'); ///VAMOS PRECISAR DISSO PARA SETTAR NOSSO __ ENDPOINT __ GRAPHQL (que será único, e de tipo post....) ---> por 'único', queremos dizer que VAI RECEBER TODOS __ OS REQUESTS__ DE SEU APP....
const graphqlResolver = require('./graphql/resolvers'); //VAMOS PRECISAR DISSO TAMBÉM.... ambos são necessários (o schema e o resolver) para settar nosso endpoint graphql...
const graphqlSchema = require('./graphql/schema');


const graphqlAuth = require('./middlewareHelpers/is-auth-graphql'); //vamos usar este middleware para fazer a AUTHENTICATION (json web token) DE NOSSO APP GRAPHQL...



const MONGODB_URI =
  'mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/postFeed?retryWrites=true&w=majority';

// const feedRoutes = require('./routes/feed');

// const authRoutes = require('./routes/auth');



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, PUT, PATCH, GET, POST, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200); ////USAMOS ISTO APENAS __ EM PROJETOS COM 'GRAPHQL' ativado no backend... --> isso vai fazer com que OS REQUESTS DE TIPO 'OPTIONS' (disparados AUTOMATICAMENTE POR NOSSOS BROWSERS) NUNCA __ ATINJAM__ A ENDPOINT ÚNICA DO GRAPHQL (que é o que queremos, na verdade).... ---> isso evita um ERRO 405, no uso do graphql...
  }
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
  // console.log(file);

  // console.log(req.body.title, 'LINE3');

  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // console.log(req.body, 'LINE APP');
    // if (
    //   req.body.title.length >= 6 &&
    //   req.body.title.match(/^[A-Za-z]+$/) &&
    //   req.body.content.length >= 6
    // ) {
      console.log('IMAGE UPLOADED')
      return cb(null, true);
    // } else {
    //   return cb('Invalid data inputted, file was not saved.', false);
    //}
  } else {
    return cb(null, false);
  }
  // } else {
  //  return cb(null, false); 
  // }
};

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images'))); 


// app.use('/auth', authRoutes); ///NÃO VAMOS MAIS UTILIZAR ESSAS ROUTES, PQ __ VAMOS USAR __ O 'GRAPHQL', que usa apenas 1 ÚNICO ENDPOINT, ENDPOINT DE 'graphQL' de tipo POST...

// app.use('/feed', feedRoutes);


// app.listen(3000);



app.use(graphqlAuth); ////////ISTO SEMPRE DEVE SER SETTADO__ LOGO __ ANTES DO MIDDLEWARE QUE DEFINE SEU 'ÚNICO ENDPOINT GRAPHQL' ( ou seja, esse código mais abaixo, de 'app.use()') ...  (no nosso caso, vamos colocar AINDA ANTES do código que ENVIA NOSSA 'IMAGE' AO MULTER.... ) --> ah e o endpoint graphql não é EXATAMENTE ÚNICO, não é mesmo... (esse endpoint do multer é um OUTRO ENDPOINT, de tipo 'graphql')....

app.put('/post-image', (req, res, next) => { ////VAMOS USAR ISTO PARA FAZER MANAGE DE NOSSO UPLOAD DE IMAGES (por meio de uma 'rest api') AO MESMO _ TEMPO EM QUE__ FAZEMOS MANAGE DE NOSSO APP COM NOSSA GRAPHQL API (ou seja, esse é o ÚNICO ENDPOINT QUE EXISTIRÁ ALÉM DO CLÁSSICO '/graphql' de tipo POST)....
  
  if (!req.isAuth) {
    throw new Error('Not authenticated'); ///também vamos checar pela AUTH do user aqui...
  }
  
  
  
  
  if(!req.file) { ///AINDA USAREMOS/DEPENDEREMOS DO 'MULTER' PARA FAZER O MANAGE DE NOSSAS IMAGES/FILES, mesmo usando o GRAPHQL no nosso backend...

    return res.status(200).json({message: 'No file provided!'}) ////O FATO DE O USER NÃO TER PROVIDENCIADO UMA IMAGE/FILE não será considerado como uma 'FALHA NO REQUEST', no nosso código... --> isso pq o send de uma image será FACULTATIVO... (tanto no CREATE, como no EDIT de um post)...

  }
  console.log(req.body);

  if (req.body.oldPath) { ///entraremos nesse IF BLOCK se for constatado que o USER ESTÁ EDITANDO UM POST QUE __ JÁ POSSUIA UMA IMAGE VINCULADA A SI... (é um dos cases de 'edit/update a post')....
    ///se entrarmos nesse block, vamos querer APAGAR A VELHA IMAGE QUE ESTAVA VINCULADA A ESSE POST....
    ///faremos isso por meio de 'fs.unlink', e por meio do 'path' (será usado para construir o caminho até essa velha image/arquivo)...
    fs.unlink(
      req.body.oldPath, (error) => {
        console.log(error);
      }
    )
  }



  return res.status(201)
  .json(
    {
      message: 'File stored.',
      filePath: req.file.path ////esse path é o path DA NOVA IMAGE QUE O USER RECÉM SUBMITTOU AO NOSSO BACKEND/ENDPOINT REST API, neste mesmo request.... (vamos querer armazenar esse path lá no 'post' a que ele pertence, lá na database mongodb...)
    }
  )


})


////ESTE MIDDLEWARE TAMBÉM __ É O LOCAL__ EM QUE __ VAMOS FAZER 'TEST' DOS NOSSOS QUERIES/MUTATIONS/SUBSCRIPTIONS, que são executados por meio daqueles resolvers/methods nos resolvers do arquivo 'resolvers.js'... --> VER PROPRIEDADE 'graphiql'... 
app.use('/graphql', graphqlHTTP(  ////ESSE É O __ ENDPOINT ÚNICO __ DO GRAPHQL ---> ele vai receber __ TODOS OS REQUESTS__ de seu app, tanto GET como POST.... -----> OBS::: NUNCA USE/ESCREVA 'app.post()' (limitar apenas a post requests), E SIM _ USE 'app.use()' (para que consigamos receber tanto requests de tipo GET como POST)...

{ ///este objeto config é OBRIGATÓRIO... (e esses 2 items/keys, com POINTERS AOS NOSSOS ARQUIVOS, TAMBÉM...)

  schema: graphqlSchema, //vamos precisar do nosso schema para settar o endpoint...
  rootValue: graphqlResolver, ///vamos settar nosso RESOLVER aqui... também é necessário para settarmos o endpoint....




  graphiql: true, ///SE VOCÊ DEFINIR ESSA PROPRIEDADE COMO 'true', VOCÊ ADQUIRE_ _UMA FERRAMENTA ESPECIAL DO GRAPHQL.... --> essa ferramneta/propriedade É __ JUSTAMENTE_ _ A RAZÃO __ DE NÃO USARMOS 'app.post()' (LIMITAR A POST REQUESTS esse middleware) NO LUGAR __ DE 'app.use()' (sintaxe que permite que TODOS OS TIPOS DE REQUEST CHEGUEM A ESSA ROUTE/MIDDLEWARE).... --> basta acessar 'localhost:8080/graphql' NA BARRA DE ENDEREÇOS, PARA ENCONTRAR ESSA API...

  // `formatError` is deprecated and replaced by `customFormatErrorFn`. It will be removed in version 1.0.0.
  // formatError(err) { /////USADO PARA _ SETTAR__ O ERROR HANDLING DE SEU APP... --> você define, aqui, QUAIS INFOS ADICIONAIS DEVEM SER RETORNADAS __ nas suas messages de error, ao user que usa seu app... (que envia requests com bodies forrados de queries)...
      customFormatErrorFn(err) {


    if (!err.originalError) { //propriedade que SÓ EXISTIRÁ SE O ERRO que acontecer no seu código __ FOI REALMENTE SETTADO/DEFINIDO POR VOCÊ (ou seja, TECHNICAL ERRORS, como uma LETRA OU SÍMBOLO FALTANDO, esses NÃO CONTAM como 'originalErrors', pq são erros padronizados, antigos...)
          //caso nenhum erro ORIGINAL seja encontrado, VAMOS QUERER _ RETORNAR __ O ERRO __ DO GRAPHQL em si, erro TÉCNICO OU WHATVER... por isso 'return err'...

          return err;
    }
      //caso NENHUM ERRO ORIGINAL/MAN-MADE FOR ENCONTRADO, vamos querer __EXTRAIR __ A DATA_ DESSE 'originalError', para que ELA SEJA USADA EM OUTROS LUGARES DE NOSSO APP...
      //essa data, no caso, é settada em CADA UM DE NOSSOS MÉTOODS NOS 'RESOLVERS'.... (ver arquivo 'resolver.js', e CÓDIGO DE INPUT VALIDATION, com os throws dos errors)...
      
      const data = err.originalError.data; ///EXEMPLO DE COMO PODEMOS RETRIEVAR DATA DE NOSSOS OBJETOS 'ERROR', no nosso runtime....

      const message = err.message || 'An error occurred.'; 


      const code = err.originalError.code || 500; 


      return { ///AQUI VAMOS _ _RETORNAR A DATA QUE QUISERMOS, É REALMENTE 'CUSTOM ERROR HANDLING'... ---> o professor gosta de retornar a MESSAGE DE ERRO EM SI, o 'código' de erro que settamos em cada um dos error, nos method do resolver.js, E A 'DATA' QUE SETTAMOS EM CADA UM DESSES METHOD, mesma coisa (no caso, a data, aqui, é o ARRAY DE ERRORS que ocorreram durante o runtime, o que é uma informação pertinente....) 
        message: message,
        status: code,
        data: data
      }


    // return err; ///ESTE É O VALOR DEFAULT, que faz com que seja gerado aquele objeto de 'error response' DEFAULT, com 'path', 'errors: []' (array), 'message' e 'data'...
  }

}
)); 

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; 
  const message = error.message;
  const data = error.data; 
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
    // const server = app.listen(8080);  NÃO VAMOS MAIS 'SET A WEBSOCKET CONNECTION ON TOP OF OUR HTTP SERVER'...

    app.listen(8080);
          }) 
  .catch((err) => {
    console.log(err);
  });

// app.listen(8080); // usamos a porta 8080 PQ NO REACT JÁ USAMOS AUTOMATICAMENTE A PORTA '3000'...
