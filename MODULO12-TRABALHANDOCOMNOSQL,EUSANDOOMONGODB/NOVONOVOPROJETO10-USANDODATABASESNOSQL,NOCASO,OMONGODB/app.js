const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

// const expressHbs = require('express-handlebars');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');








const errorController = require('./controllers/error');


// const MongoClient = require('mongodb'); ////USO DE DATABASES NOSQL.... --> forma ERRADA de usar isso... ver código logo abaixo, e arquivo 'database.js', no folder 'util'...


const mongoConnect = require('./util/database').mongoConnect; ///use isto em conjunto com 'getDb()' (EXECUTE O 'mongoConnect' para CONECTAR SEU APP AO MONGODB; mongoConnect é uma função auxiliar criada lá em 'database.js'... 'getDb()' TAMBÉM É UMA FUNÇÃO AUXILIAR CRIADA LÁ EM 'database.js', MAS É UMA FUNÇÃO QUE DEVERÁ SER CHAAMDA NOS MÓDULOS DE SEU APP NODEJS, para executar OPERAÇÕES COM A DATABASE a partir do '_db' que ficou defined/undefined em razão da EXECUÇÃO dessa função 'mongoConnect'...)
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

app.use((req, res, next) => {
  User.findUserById('616fa02db3544414dae89f26') ///dummy user...
    .then((user) => {
   ////////////  req.user = user; //////////CÓDIGO VELHO, SEM OS METHODS necessários...
   req.user = new User(user.name, user.email, user.cart, user._id); ///////////CÓDIGO NOVO, COM OS METHODS NECESSÁRIOS...
      next();
      // console.log(req.user, 'TEST3');
   
   
    })

    .catch((err) => {
      console.log(err);
    });

  // next();
    // console.log('TEST2');
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



mongoConnect(  
  () => { 




    app.listen(3000);

  }

); 




// app.listen(3000);