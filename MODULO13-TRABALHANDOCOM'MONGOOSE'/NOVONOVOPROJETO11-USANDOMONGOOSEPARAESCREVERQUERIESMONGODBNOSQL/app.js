const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose'); // isto DEPRECA o arquivo 'database.js', pois faz toda sua função/atribuições AUTOMATICAMENTE (conecta-nos à database NOSQL/mongodb...)....

// const expressHbs = require('express-handlebars');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');








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




app.use((req, res, next) => { //esta é a versão MONGOOSE de CHECK por 1 user na nossa database.....  agora, no caso, estamos usando a versão DO MONGOOSE DE ESCRITA DE CÓDIGO SQL/queries NOSQL (ver código de 'mongoose.connect()', lá no FINAL DESTE ARQUIVO).
  User.findById('6178c60a90464c24983b0847') ///dummy user...
    .then((user) => {
       
      req.user = user; ////com isso, DEFINIMOS UM OBJETO 'user' no nosso request COMO TENDO O VALOR DO OBJETO/DOCUMENT 'user' ''''MONGOOSADO''' (ou seja, com TODOS OS METHODS CONVENIENCE DO MONGOOSE, ALÉM DA DATA DO USER QUE QUERÍAMOS), extraído lá da collection de 'users'...
      next();

    })

    .catch((err) => {
      console.log(err);
    });

});













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
                              next();});


app.use(
  '/admin',

  adminRoutes
);

app.use(shopRoutes);

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



mongoose.connect( ///sempre ESCREVA ESSE CÓDIGO no seu 'app.js'/arquivo central, pq É ELE __ QUE __ VAI SETTAR SUA CONEXÃO À DATABASE MONGODB, mediada pelo mongoose...
  ('mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/shop?retryWrites=true&w=majority')
)
.then(
  (result) => {



    User.findOne().then(
      (user) => {

          if(!user) { ///só vai criar 1 novo document 'user' na nossa collection 'users' __ SE NENHUM USER FOR ENCONTRADO DENTRO DELA... (isso evita a criação de múltiplos users, nesse nosso DUMMY PROJECT)...
            const user = new User(
              {  //CRIA UM OBJETO/document 'user' na collection de 'users' com ESSES VALORES NOS FIELDS...
                name: 'Max',
                email: 'max@test.com',
                cart: {
                  products: []
                }
              }
            )
            user.save(); ///confirma a criação desse objeto/document 'user' na collection 'users'...
          }

    app.listen(3000); ////sempre execute isso, que inicia nosso backend NODE, DEPOIS das connections/manipulações com a database, manipulações que envolvam o USER...
      }
    )
  } 
)
.catch(
  (err) => {
    console.log(err);
  }
)

