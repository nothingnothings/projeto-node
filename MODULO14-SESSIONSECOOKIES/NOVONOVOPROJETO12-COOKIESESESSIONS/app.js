const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose'); // isto DEPRECA o arquivo 'database.js', pois faz toda sua função/atribuições AUTOMATICAMENTE (conecta-nos à database NOSQL/mongodb...)....

const session = require('express-session'); //// instalado/incorporado ao nosso project por meio de 'npm install --save express-session'...  ------> ESSA PACKAGE VAI NOS DEIXAR 'SETTAR 1 SESSION' PARA O NOSSO APP, session QUE __ SERÁ INCORPORADA/CONSIDERADA/USADA __ EM TODO __  REQUEST SUBSEQUENTE QUE FIZERMOS AO NOSSO app node....

const MongoDBStore = require('connect-mongodb-session')(session); /////PACKAGE USADO COM 'express-session' PARA __aRMAZENAR__ NOSSAS 'SESSIONS' em databases MONGODB... (bem melhor do que usar a MEMORY DE NOSSO NODEJS PARA FAZER STORE DE NOSSAS SESSIONS...)
////vocÊ deve usar esse package/configurar esse STORE de sessions LÁ NO 'app.use' (middleware) que DEFINE A SUA SESSION, auqele 'app.use(session)'...

// const expressHbs = require('express-handlebars');

const app = express();

const MONGODB_URI =
  'mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/shop?retryWrites=true&w=majority';

const store = new MongoDBStore( ////usado junto de 'app.use(session())', lá embaixo. Os 2 são necessários...
  {
    ///objeto OPTIONS dessa instanciação desse 'mongo db store', que é usado para ARMAZENAR SUAS SESSIONS...

    uri: MONGODB_URI, ///mesma connection string de nosso CONNECT GERAL AO NOSSO DATABASE... (usado lá em 'mongoose.connect()')...

    collection: 'sessions', //aqui você define a COLLECTION em que você vai querer ARMAZENAR SUAS SESSIONS....
    //expires// opcional.... ---> SE VOCÊ SETTAR ISSO, o mongodb VAI AUTOMATICAMENTE LIMPAR suas sessions ARMAZENADAS NESSA collection aí, quando o tempo delas expirar, tempo definido nessa key...
  } //em 'uri' você deve colocar A __sTRING__ DA DATABASE EM QUE VOCê VAI QUERER ARMAZENAR (o seu store) SUAS SESSIONS...
);

app.set('view engine', 'ejs');

// app.set('views', 'views');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

// const MongoClient = require('mongodb'); ////USO DE DATABASES NOSQL.... --> forma ERRADA de usar isso... ver código logo abaixo, e arquivo 'database.js', no folder 'util'...

////DEPRECADO PELO USO DE 'mongoose', que foi importado logo acima, com 'const mongoose = require('mongoose');'...
// const mongoConnect = require('./util/database').mongoConnect; ///use isto em conjunto com 'getDb()' (EXECUTE O 'mongoConnect' para CONECTAR SEU APP AO MONGODB; mongoConnect é uma função auxiliar criada lá em 'database.js'... 'getDb()' TAMBÉM É UMA FUNÇÃO AUXILIAR CRIADA LÁ EM 'database.js', MAS É UMA FUNÇÃO QUE DEVERÁ SER CHAAMDA NOS MÓDULOS DE SEU APP NODEJS, para executar OPERAÇÕES COM A DATABASE a partir do '_db' que ficou defined/undefined em razão da EXECUÇÃO dessa função 'mongoConnect'...)
//importe sempre 'mongoConnect' no seu 'app.js', e nunca 'getDb()'; o 'getDb()' é para ser usado NOS SEUS MÓDULOS, NOS SEUS CONTROLLERS, etc...s

// const sequelize = require('./util/database');  //uso de databases SQL...

// const Product = require('./models/product'); //uso de databases SQL
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const OrderItem = require('./models/order-item');
// const Order = require('./models/order');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use( /// (1/2) ///DEVE SER USADO COM O MIDDLEWARE DE BAIXO, que vai _RESOLVER__ O PROBLEMA DOS 'MONGOOSE METHODS', que são necessa´rios e NÃO SERÃO OBTIDOS _ QUANDO RETRIEVARMOS UMA SESSION DIRETAMENTE/conseguirmos dados nas sessions diretamente (pq os methods SÃO PERDIDOS na database....)
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

app.use((req, res, next) => {  // (2/2) (DEVE SER USADO COM O MIDDLEWARE LOGO ACIMA... --> esse middleware aqui, que fica ABAIXO daquele middleware de 'session', __ É O NEGÓCIO _ QUE __ VAI __ USAR__ A 'SESSION DATA' retrievada naquele middleware mais de cima __ PARA ENTÃO _ FETCHEAr/CRIAR __ 1 OBJETO/MODEL 'User' com TODOS OS METHODS MONGOOSE DE QUE PRECISAMOS (pq esses methods NÃO PODEM SER RETRIEVADOS DIRETAMENTE DE UMA SESSION/DATA DE DENTRO DE UMA SESSIOn, que é o que estamos fazendo no c´digo acima, o RETRIEVE/SET DE UMA SESSION...))
  // User.findById('xsaashisiahsiaxsix')



  if(!req.session.user) { //USADO PARA EVITAR O ERRO DE 'TypeError: Cannot read property '_id' of undefined at A:\projeto4 - NODEJS\MODULO14-SESSIONSECOOKIES\NOVONOVOPROJETO12-COOKIESESESSIONS\app.js:86:34 ' ------->  COM ESSE CÓDIGO, POUPAMOS ERROS E FAEZMOS COM QUE __ APENAS __ SEJA EXECUTADO O RETRIEVE DE 'user', esse mongodb model, QUANDO EFETIVAMENTE __ EXISTIR UM objeto 'user' dentro do objeto 'REQUEST' de seu user....
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user; //////EIS O CÓDIGO EM QUESTÃO. __VAI_ __ REALMENTE__ nos dar 1 'mongoose model' A PARTIR __ DA SESSION DATA RETRIEVADA AUTOMATICAMENTE PELO 'express-session' MIDDLEWARE usado logo acima... ( e com esse OBJETO/MODEL MONGOOSE cheio de methods, PODEMOS REALIZAR AS OPERATIONS DE NOSSO APP...) (pq esses methods PASSARÃO A EXISTIR DENTRO DO OBJETO 'user' dentro do objeto 'req' daquele user.... )
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});






// app.use((req, res, next) => { //esta é a versão 'NORMAL MONGODB DRIVER' de CHECK por 1 user na nossa database.....  agora, no caso, estamos usando a versão DO MONGOOSE DE ESCRITA DE CÓDIGO SQL/queries NOSQL (ver código de 'mongoose.connect()', lá no FINAL DESTE ARQUIVO).
//   User.findUserById('616fa02db3544414dae89f26') ///dummy user...
//     .then((user) => {
//    ////////////  req.user = user; //////////CÓDIGO VELHO, SEM OS METHODS necessários...
//    req.user = new User(user.name, user.email, user.cart, user._id); ///////////CÓDIGO NOVO, COM OS METHODS NECESSÁRIOS...
//       next();
//       // console.log(req.user, 'TEST3');

//     })

//     .catch((err) => {
//       console.log(err);
//     });

//   // next();
//     // console.log('TEST2');
// });

/////////////MOVIDO LÁ PARA O CONTROLLER DE 'auth.js', no controller de 'exports.postLogin'.... (agora o user SÓ ESTARÁ 'LOGGED IN' ao pressionar o BUTTON de 'login'...)
// app.use((req, res, next) => { //esta é a versão MONGOOSE de CHECK por 1 user na nossa database.....  agora, no caso, estamos usando a versão DO MONGOOSE DE ESCRITA DE CÓDIGO SQL/queries NOSQL (ver código de 'mongoose.connect()', lá no FINAL DESTE ARQUIVO).
//   User.findById('6178c60a90464c24983b0847') ///dummy user...
//     .then((user) => {

//       req.user = user; ////com isso, DEFINIMOS UM OBJETO 'user' no nosso request COMO TENDO O VALOR DO OBJETO/DOCUMENT 'user' ''''MONGOOSADO''' (ou seja, com TODOS OS METHODS CONVENIENCE DO MONGOOSE, ALÉM DA DATA DO USER QUE QUERÍAMOS), extraído lá da collection de 'users'...
//       next();

//     })

//     .catch((err) => {
//       console.log(err);
//     });

// });

// Product.belongsTo( //uso de databases SQL
//   User,

//   {
//     constraints: true,
//     onDelete: 'CASCADE',
//   }
// );
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// User.hasMany(Order);
// Order.belongsTo(User);

// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

app.use((req, res, next) => {
  // console.log(req.user, 'LINE666666');
  next();
});

app.use(
  '/admin',

  adminRoutes
);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.error404);

// sequelize //uso de databases SQL
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: 'Max', email: 'test@test.com' });
//     }

//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then((cart) => {
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// mongoConnect(   ///uso de databases NOSQL....

////versão de connect to databse que VOCÊ NÃO DEVE USAR....

//   (client) => { //callback function.... examinar arquivo de 'database.js', no folder 'util'...

//     console.log(client);
//     app.listen(3000);
//   }

// );

// mongoConnect(   ////deprecado pelo uso de 'mongoose.connect()', que É A MESMA COISA QUE ESTE CÓDIGO, MAS COM A ATUAÇÃO DE 'MONGOOSE' NO WRITE DE NOSSAS QUERIES (é ele que vai formular nossas queries, a partir de uma linguagem 'object Document mapping' ...)
//   () => {

//     app.listen(3000);

//   }

// );

mongoose
  .connect(
    ///sempre ESCREVA ESSE CÓDIGO no seu 'app.js'/arquivo central, pq É ELE __ QUE __ VAI SETTAR SUA CONEXÃO À DATABASE MONGODB, mediada pelo mongoose...
    // ('mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/shop?retryWrites=true&w=majority')
    MONGODB_URI //mesma coisa que essa fita ali de cima.....
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        ///só vai criar 1 novo document 'user' na nossa collection 'users' __ SE NENHUM USER FOR ENCONTRADO DENTRO DELA... (isso evita a criação de múltiplos users, nesse nosso DUMMY PROJECT)...
        const user = new User({
          //CRIA UM OBJETO/document 'user' na collection de 'users' com ESSES VALORES NOS FIELDS...
          name: 'Max',
          email: 'max@test.com',
          cart: {
            products: [],
          },
        });
        user.save(); ///confirma a criação desse objeto/document 'user' na collection 'users'...
      }

      app.listen(3000); ////sempre execute isso, que inicia nosso backend NODE, DEPOIS das connections/manipulações com a database, manipulações que envolvam o USER...
    });
  })
  .catch((err) => {
    console.log(err);
  });
