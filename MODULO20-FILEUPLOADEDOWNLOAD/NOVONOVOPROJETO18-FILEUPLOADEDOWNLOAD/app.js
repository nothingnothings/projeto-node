const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer'); ///USADO PARA HANDLAR FILE UPLOADS FEITOS PELO USER AO NOSSO BACKEND/APP...

const mongoose = require('mongoose'); // isto DEPRECA o arquivo 'database.js', pois faz toda sua função/atribuições AUTOMATICAMENTE (conecta-nos à database NOSQL/mongodb...)....

const session = require('express-session'); //// instalado/incorporado ao nosso project por meio de 'npm install --save express-session'...  ------> ESSA PACKAGE VAI NOS DEIXAR 'SETTAR 1 SESSION' PARA O NOSSO APP, session QUE __ SERÁ INCORPORADA/CONSIDERADA/USADA __ EM TODO __  REQUEST SUBSEQUENTE QUE FIZERMOS AO NOSSO app node....

const { validationResult } = require('express-validator');

const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

const MONGODB_URI = 'mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/shop?retryWrites=true&w=majority';






// const imagePath = path.join(__dirname, 'images').replace(/\\/g, "/"); //não faça isso....


const imagePath = process.cwd();

console.log(imagePath);







const store = new MongoDBStore( ////usado junto de 'app.use(session())', lá embaixo. Os 2 são necessários...
  {
    ///objeto OPTIONS dessa instanciação desse 'mongo db store', que é usado para ARMAZENAR SUAS SESSIONS...

    uri: MONGODB_URI, ///mesma connection string de nosso CONNECT GERAL AO NOSSO DATABASE... (usado lá em 'mongoose.connect()')...

    collection: 'sessions', //aqui você define a COLLECTION em que você vai querer ARMAZENAR SUAS SESSIONS....
    //expires// opcional.... ---> SE VOCÊ SETTAR ISSO, o mongodb VAI AUTOMATICAMENTE LIMPAR suas sessions ARMAZENADAS NESSA collection aí, quando o tempo delas expirar, tempo definido nessa key...
  } //em 'uri' você deve colocar A __sTRING__ DA DATABASE EM QUE VOCê VAI QUERER ARMAZENAR (o seu store) SUAS SESSIONS...
);

const csrf = require('csurf'); ///USADO __ PARA___ EVITAR 'CSRF ATTACKS', tudo por meio do uso de CSRF TOKENS _ NAS NOSSAS VIEWS.... (Assistir aula 255)... --> OBS:::: VOCÊ DEVE INICIALIZAR/CONFIGURAR SEU CSRFTOKEn (com aquele 'app.use(csrfProtection)'  ) __DEPOIS__ DO MIDDLEWARE QUE DEFINE/SETTA __ SUA __ SESSION.... (visto mais abaixo, com 'app.use(session())' )

const flash = require('connect-flash'); /////USADO __ PARA__ FAZER SHOW __ DE ERROR MESSAGES/DISPLAY DE MENSAGENS DE ERRO AO USER __APÓS___ REDIRECTS... (utiliza SESSIONS para isso). ----> OBS::: __TAMBÉM__ DEVE SER INICIALIZADO/USADO ___ DEPOIS __ DO SET DA SESSION (Que é feito com o middleware de 'app.use(session())' )





const errorController = require('./controllers/error');

const User = require('./models/user');

const csrfProtection = csrf();

const fileStorage = multer.diskStorage(
  ///É POR MEIo de 'multer.diskStorage()' QUE VAMOS __ CRIAR UMA 'STORAGE ENGINE'.. --> e essa storage engine será , então, utilizada NAQUELE MIDDLEWARE DO MULTER, VISTO LOGO ABAIXO... tipo naquele objeto {storage: fileStorage}...
  {
    destination: (req, file, cb) => {
      /// o SET DE 'dest/destination' (destination) FARÁ COM QUE ___ SEUS FILE UPLOADS SEJAM DIRECIONADOS A ESSA PASTA/LOCAL... (e se você adicionar essa propriedade de 'dest', VOCÊ DEIXARÁ DE TER AQUELA KEY DE 'buffer' em 'req.file'...)
      cb(null, 'images'); ///o 'null' é relativo AO 'ERRO' QUE VOCÊ PASSA COMO PRIMEIRO ARGUMENTO DESSE CALLBACK...
    },
    filename: (req, file, cb) => {
      console.log(file.fieldname, 'LINE');
      ///OBS::: SE VOCÊ SETTAR/configurar/definir o FILENAME de seus arquivos storados __ por meio dessa key de 'filename:', o multer AUTOMATICAMENTE __ VAI PARAR__ DE ARMAZENAR UM 'RANDOM HASH' (auto-generated random hash) LÁ NAQUELA PROPRIEDADE 'filename', em 'req.file' (o que ficará nesse lugar, no caso, é o FILENAME que você DEFINIU AQUI, e não mais aquele hash randomizado...)
      cb(null, Date.now()+ '-' + file.originalname); ///ESTA VERSÃO __ PRESTA__.... vai adicionar essa image no nosso server, com esse pequeno 'Date.now()' para diferenciar entre arquivos....
          
       ///////O SEGUNDO ARGUMENTO É 'WHAT YOUR FILENAME SHOULD BE' (é como deve ser CHAMADO o arquivo que você vai armazenar naquela 'destination') ---> e '.originalName' é um MÉTODO EXISTENTE DENTRO DO OBJETO 'file' QUE NOS DÁ O ACTUAL FILENAME do arquivo que o user uploadou...
          // new Date().toISOString().replace(':', '$') + '-' + file.fieldname ///ESSE __CÓDIGO__ NÃO FUNCIONA... (salva os arquivos em BRANCO, com nomes errados)....

      
        // file.filename /NESSA CONCATENAÇÃO, VAMOS USAR o 'file.filename' JUSTAMENTE PQ 'filename' é uma PROPRIEDADE DENTRO DO OBJETO 'req.file' QUE VAI CONTER A 'RANDOM HASH' GERADA PARA __ CADA 1 DESSES ARQUIVOS (hash única)... ---> faremos isso para que NÃO HAJA CONFUSÃO ENTRE NOSSAS FILES ARMAZENADAS NO NOSSO NODEAPP... ----------> MAS ESSE MÉTODO/APPROACH DE 'UNIQUENESS' NÃO VAI FUNCIONAR, POR ISSO O PROFESSOR DECIDIU SÓ USAR 'new Date().toISOString()'..
      
    },
  }
);










const fileFilter = (req, file, cb) => {
  ////AQUI NESSA CONST, REFERENCIADA LÁ NO 'CONFIGURADOR DO MULTER' (middleware ali de baixo), __ NÓS__ DEFINIMOS QUAIS 'FILETYPES' DEVERÃO SER ACEITOS( cb true), E QUAIS DEVERÃO SER __ rECUSADOS (cb false) -------> cb é o callback, é claro...

  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const upload =  multer(
  /// o SET DE 'dest/destination' (destination) FARÁ COM QUE ___ SEUS FILE UPLOADS SEJAM DIRECIONADOS A ESSA PASTA/LOCAL... (e se você adicionar essa propriedade de 'dest', VOCÊ DEIXARÁ DE TER AQUELA KEY DE 'buffer' em 'req.file'...)
  // {dest: 'images'} ///VERSÃO 'SIMPLES' DE CONFIGURAR O MULTER... não é tão boa, pq não te dá coisas como o CONFIG DAS SUAS FILENAME, etc.... (coisa vista naquela config constant de 'fileStorage', logo acima...)
  {
    storage: fileStorage, //versão mais completa/recomendada. ----> É A VERSÃO QUE USA A 'STORAGE ENGINE' que críamos previamente, como visto logo acima...
    fileFilter: fileFilter,
  }
).single('image')


app.use(bodyParser.urlencoded({ extended: false })); ////use ISTO e 'multer'( o multer é usado para parsear E HANDLAR, EM SUAS FORMS, TANTO 'text data', como o BODYPARSER, COMO TAMBÉM 'file data', coisa que o bodyparser NÃO CONSEGUE FAZER...)





// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
// );
app.use(express.static(path.join(__dirname, 'public')));///serve ESTÁTICO de ARQUIVOS CSS E JS, nesse folder de 'public'... (isso é necessário para fazer esses 'js UI' e ARQUIVOS CSS, estilos, FUNCIONAREM/SEREM CARREGADOS PELOS USERS DE SEU APP...)
// app.use( '/images', express.static(path.join(__dirname, 'images'))) ///SIM, VOCê PODE __ FAZER SERVE__ DE MÚLTIPLOS FOLDERS __ DE FORMA ___ESTÁTICA__ NO SEU APP....  -------> AQUI, NO CASO, USAMOS '/images' PARA RESOLVER O PROBLEMA DOS PATHS.... (assistir aula '321', serving images statically...).

app.use('/images', express.static(path.join(__dirname, 'images')));









app.use(
  // multer(
  //   /// o SET DE 'dest/destination' (destination) FARÁ COM QUE ___ SEUS FILE UPLOADS SEJAM DIRECIONADOS A ESSA PASTA/LOCAL... (e se você adicionar essa propriedade de 'dest', VOCÊ DEIXARÁ DE TER AQUELA KEY DE 'buffer' em 'req.file'...)
  //   // {dest: 'images'} ///VERSÃO 'SIMPLES' DE CONFIGURAR O MULTER... não é tão boa, pq não te dá coisas como o CONFIG DAS SUAS FILENAME, etc.... (coisa vista naquela config constant de 'fileStorage', logo acima...)
  //   {
  //     storage: fileStorage, //versão mais completa/recomendada. ----> É A VERSÃO QUE USA A 'STORAGE ENGINE' que críamos previamente, como visto logo acima...
  //     fileFilter: fileFilter,
  //   }
  // ).single('image')

  (req, res, next) => {


  upload(req, res, (error) => {

    if(error instanceof multer.MulterError) {
      console.log('MULTER ERROR HAS OCCURRED');
    } else if (error) {
      console.log('AN UNKNOWN ERROR HAS OCCURRED');
      console.log(error);
    
    }

  })
  next();
}
);


app.use(
  /// (1/2) ///DEVE SER USADO COM O MIDDLEWARE DE BAIXO, que vai _RESOLVER__ O PROBLEMA DOS 'MONGOOSE METHODS', que são necessa´rios e NÃO SERÃO OBTIDOS _ QUANDO RETRIEVARMOS UMA SESSION DIRETAMENTE/conseguirmos dados nas sessions diretamente (pq os methods SÃO PERDIDOS na database....)
  session(
    ////USADO PARA DEFINIR/SETTAR NOSSA 'session' no nosso app, SESSION QUE SERÁ USADA/EMBUTIDA __ EM TODO E QUALQUER REQUEST que será enviado ao nosso server/app node... ----> É POR ISSO QUE VOCÊ SEMPRE DEVE ESCREVER ESSE CÓDIGO __ BEM NO INÍCIO DO RUNTIME/FLOW DE SEU APP, junto desses bodyParser e definidores de 'exceções public' ( middleware de 'express.static()' ....)
    {
      //é aqui que vamos  SETTAR__ NOSSO 'STORE', o 'STORE' que será usado para ARMAZENAR NOSSAS SESSIONS....

      secret: 'asjosaoasjoasjoghihninknxcknklnknlk', ///segredo FRACO.... vocÊ DEVE _USAR __SECRETS _ FORTES (longas strings, o ideal são 'random sets of characters'... --> colocamos isso NA FASE DE PRODUCTION...) --> O 'secret' É USADO NO __ GENERATE__ Do 'id' QUE SERÁ armazenado no seu 'SESSION COOKIE', no browser do usuário... (ver aulas 'o que é uma session' e 'initializing the session middleware')  --> OBS: O ID __ da session ARMAZENADO NO SERVER/DATABASe é o id 'puro', ao passo que o ID __ armazenado no BROWSER em 1 cookie ( o SESSION COOKIE, cookie em que fica ARMAZENADA A SESSION, o COUNTERPART da session que será matcheado com ela) SERÁ 1 'HASHED ID', UM ID ___CODIFICADO, cujo algoritmo SÓ É ENTENDIDO PELO PRÓPRIO APP NODE QUE CRIOU/FORMATOU ESSE HASHED ID, E QUE __ DEPENDE DESSE VALOR AÍ, de 'secret' nesse define da sua session...
      // secret: 'ASSAasj21jasjxzkvnklnbbnz,qn2oigndpoghojuhojá0wqj0dknbxklcknkmgnhoaso1mnkl2nlg' ////segredo já um pouquinho mais forte.

      resave: false, //////SETTING DE PERFORMANCE... Forces the session to be saved back to the session store, even if the session was never modified during the request. -----> VOCê DEVE __GERALMENTE SETTAR COMO 'FALSE', pq você NÃO VAI QUERER que SUA 'SESSION' seja SALVA a partir de TODO E CADA REQUEST CYCLE (req-res, ciclo que termina com o SEND DE UMA RESPONSE, que mata o request), PQ _àS VEZES OS REQUESTS__ PODEM N TER ALTERADO COISA ALGUMA, hipóteses em que É INÚTIL SALVAR/re-salvar a session, pq nada nela terá mudado a partir daquele request inútil...
      saveUninitialized: false, ////MESMA COISA QUE A SETTING DE CIMA, 1 setting de PERFORMANCE...  ------> VOCÊ __ DEVE  SETTAR __ COMO  'FALSE' PQ __ ISSO VAI __ BASICAMENTE ___ ___GARANTIR__, também,  QUE  NENHUMA  SESSION  ACABE  'saved for a request WHERE THAT SESSION DOESNT NEED/didnt need TO BE SAVED' ----> ISSO PQ  __-NADA FOI/TERÁ SIDO ALTERADO NA SESSION, por meio desse request, o  que afastaria a necessidade de 'save' dessa session para salvar as changes...
      store: store, ///define o STORE que você vai querer usar.... (vamos passar nossa CONSTANTE de 'store' que definimos mais acima..., com o 'new MongoDBStore()'...)
      // cookie: { ////KEY USADA PARA _ DEFINIR CONFIGS ESPECÍFICAS DE NOSSO 'SESSION COOKIE', dos session cookies armazenados no browser de nosso user... (pleonasmo... todos session cookies são armazenados NO BROWSER DO USER...)
      //   maxAge: ...
      // }
    }
  )
);

app.use(csrfProtection); ///inicializa nossa PROTEÇÃO CONTRA ATAQUES CSRF.... sempre coloque __DEPOIS__ de 'multer'...

app.use(flash()); //inicializa NOSSO CÓDIGO QUE VAI AJUDAR COM O SHOW/DISPLAY DE MESSAGES DE ERRO A PARTIR DE REDIRECTS...
///definido o uso de 'connect-flash', podemos o UTILIZAR EM QUALQUER LUGAR DE NOSSO APP, no objeto 'request'....
/// USAGE do MÉTODO que vem com esse middleware:  devemos escrever 'req.flash()' nos LOCAIS DE NOSSO CÓDIGO/CASES __ EM QUE __ VAMOS QUERER FLASHAR UMA 'ERROR MESSAGE' dentro de nossa session, para ser usado PARA __ DISPLAYAR__ ERROR MESSAGES AO USER/USERS....

app.use((req, res, next) => {
  ///////////MIDDLEWARE QUE __ VAI ADICIONAR/ADICIONA __ O CSRF TOKEN __ E UMA SESSION____ A CADA 1 DE NOSSAS ROUTES DO APP...

  ///'.locals' ---> É PROPRIEDADE __ CRIADA__ DENTRO __ DO OBJETO 'res'.... significa 'local variables', E É __ ADICIONADA __ POR MEIO DA PACKAGE DO 'EXPRESS'....

  ///qual é a utilidade de 'locals'? ------> A UTILIDADE É __JUSTAMENTE__ ADICIONAR a CSRF TOKEN e A SESSION a TODAS AS PAGES DE SEU APP, por meio de middlewares como este aqui...

  //TUDO QUE  DEFINIRMOS EM '.locals' (como 'csrfToken' e 'isLoggedIn', respectivamente nossa CSRF TOKEN E __ A SESSION/AUTH STATUS DO USER...) PODERÁ _SER USADO __ EM CADA 1 DOS VIEWS __ DE NOSSO APP... --_> e é assim que implementamos as SESSIONS e os CSRF TOKENS todos de uma vez, em todas as pages de nosso app...
  res.locals.isLoggedIn = req.session.isLoggedIn;
  console.log('LOCALS SET');
  res.locals.csrfToken = req.csrfToken();



  next(); ///esse 'next' É NECESSÁRIO, pois __ vamos querer PROSSEGUIR_  depois __ do set dessas propriedades...

  // throw new Error('Dummy');

  ////OBS:: IMPORTANTE!!! --> SÓ NUNCA SE ESQUEÇA DE COLOCAR O INPUT DE TYPE HIDDEN específico (este aqui:  <input type="hidden" value="<%= csrfToken %>" name="_csrf"> <!--  VOCÊ _ _DEVE UTILIZAR ESSE NAME de '_csrf' para esse INPUT FIELD DE TYPE 'hidden' SE VOCê QUER__ QUE A PACKAGE 'csurf' CONSIGA DETECTAR ESSE INPUT FIELD__ COMO AQUELE RESPONSÁVEL/SEGURADOR DE SUA CSRF TOKEN...-->) ________EM __TODAS AS FORMS, NOS SEUS VIEWS, DE SEU PROJECT.... é necessário, pq senão o pacote 'csurf' VAI TE RETORNAR ERROS DE 'INVALID TOKEN', etc etc...
});

app.use((req, res, next) => {
  // (2/2) (DEVE SER USADO COM O MIDDLEWARE LOGO ACIMA... --> esse middleware aqui, que fica ABAIXO daquele middleware de 'session', __ É O NEGÓCIO _ QUE __ VAI __ USAR__ A 'SESSION DATA' retrievada naquele middleware mais de cima __ PARA ENTÃO _ FETCHEAr/CRIAR __ 1 OBJETO/MODEL 'User' com TODOS OS METHODS MONGOOSE DE QUE PRECISAMOS (pq esses methods NÃO PODEM SER RETRIEVADOS DIRETAMENTE DE UMA SESSION/DATA DE DENTRO DE UMA SESSIOn, que é o que estamos fazendo no c´digo acima, o RETRIEVE/SET DE UMA SESSION...))
  // User.findById('xsaashisiahsiaxsix')

  // throw new Error('Dummy'); //// exemplo de THROW DE ERROR em códigos SÍNCRONOS (que vai REALMENTE TRIGGAR o special express error handling middleware, ao contrário do throw de Error em CÓDIGOS_ _ ASSÍNCRONOS, que não funciona)...
  if (!req.session.user) {
    //USADO PARA EVITAR O ERRO DE 'TypeError: Cannot read property '_id' of undefined at A:\projeto4 - NODEJS\MODULO14-SESSIONSECOOKIES\NOVONOVOPROJETO12-COOKIESESESSIONS\app.js:86:34 ' ------->  COM ESSE CÓDIGO, POUPAMOS ERROS E FAEZMOS COM QUE __ APENAS __ SEJA EXECUTADO O RETRIEVE DE 'user', esse mongodb model, QUANDO EFETIVAMENTE __ EXISTIR UM objeto 'user' dentro do objeto 'REQUEST' de seu user....
    console.log('TEST');
    return next();
  }
  console.log('TEST2');
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        ///////////CASO DE 'THE USER GOT DELETED IN BETWEEN'.... --> A SESSION DESSE USER AINDA EXISTE NA DATABASE, MAS O USER EM SI FOI DELETADO da database...
        return next();
      }
      req.user = user; //////EIS O CÓDIGO EM QUESTÃO. __VAI_ __ REALMENTE__ nos dar 1 'mongoose model' A PARTIR __ DA SESSION DATA RETRIEVADA AUTOMATICAMENTE PELO 'express-session' MIDDLEWARE usado logo acima... ( e com esse OBJETO/MODEL MONGOOSE cheio de methods, PODEMOS REALIZAR AS OPERATIONS DE NOSSO APP...) (pq esses methods PASSARÃO A EXISTIR DENTRO DO OBJETO 'user' dentro do objeto 'req' daquele user.... )
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err); //importante. é isso que vai 'REACH OUT' o SPECIAL EXPRESS ERROR HANDLING MIDDLEWARE....
      // throw new Error(err); //NUNCA FAÇA ASSIM.... não faça o THROW DE ERRORS dentro de código assíncrono (dentro de CALLBACKS, THEN-CATCH BLOCKS e async/await), PQ ESSES THROWS __ NÃO VÃO TRIGGAR__ O SEU 'SPECIAL EXPRESS ERROR HANDLING MIDDLEWARE' (só será triggado esse middleware SE SEU 'throw new Error()' for escrito FORA DE CÓDIGO ASSÍNCRONO, em código SÍNCRONO....) --> PARA CONSEGUIR 'REACH OUT' AO SPECIAL EXPRESS ERROR HANDLING MIDDLEWARE __ DENTRO _DE CÓDIGO ASSÍNCRONO (como promises/then-catch, callbacks e async/await), VOCê É __ OBRIGADO__ A USAR 'next(new Error(error))'...
    });
});

app.use('/admin', adminRoutes
);

app.use(shopRoutes);

app.use(authRoutes);

app.get(errorController.error500);

app.use(errorController.error404);

app.use(
  ///////MIDDLEWARE ESPECIAL DO EXPRESS. USADO PARA HANDLING DE ERROS... (o express identifica que ele é especial POR MEIO DOS SEUS 4 ARGUMENTOS, 'error, req, res, next'...)
  (error, req, res, next) => {
    //para acessar/executar o código contido nesse MIDDLEWARE/nesses middlewares especial/especiais, basta USAR A FUNÇÃO 'next()' e então passar UM ERRO COMO PARÂMETRO, TIPO ASSIM: 'next(erroQueVocêQuerPassar)' ------> SE VOCÊ USAR ISSO EM ALGUM LUGAR DO SEU CO´DIGO, ESSE CALL VAI AUTOMATICAMETNE TRIGGAR ESTE MIDDLEWARE AQUI, de 'error, req, res, next'...
    //e sim, a execuçaõ desse middleware especial vai pular ATÉ MESMO A EXECUÇAÕ DE 'error404' (que é o middleware/route 'unknown' de nosso app, que faz catch de todos os paths/routes não compreendidos por 'adminRoutes', 'authRoutes', etc...)

    // res.redirect('/500'); //ver controller de 'error500', lá em 'error.js'...

    console.log(req.method);

    // if (req.method === 'POST') {
    //   res.status(500).render('500', {
    //     pageTitle: 'Error!',
    //     path: '/500',
    //     isLoggedIn: true,
    //     csrfToken: req.body._csrf,
    //   });
    // } else {
      console.log(req.session, 'ENTER');

      res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isLoggedIn: req.session.isLoggedIn,
      });
    }
  // }
);

mongoose
  .connect(
    // ('mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/shop?retryWrites=true&w=majority')
    MONGODB_URI //mesma coisa que essa fita ali de cima.....
  )
  .then((result) => {
    app.listen(3000); ////sempre execute isso, que inicia nosso backend NODE, DEPOIS das connections/manipulações com a database, manipulações que envolvam o USER...
  })
  .catch((err) => {
    console.log(err);
  });
