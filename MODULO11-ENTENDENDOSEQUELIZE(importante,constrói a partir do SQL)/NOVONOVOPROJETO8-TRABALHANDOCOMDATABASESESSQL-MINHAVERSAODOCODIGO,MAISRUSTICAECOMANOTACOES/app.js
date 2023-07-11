const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const expressHbs = require('express-handlebars');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

// const db = require('./util/database'); ///versão que NÃO USAVA SEQUELIZE

const sequelize = require('./util/database'); ////VERSÃO QUE USA SEQUELIZE... (é a CONNECTION POOL manageada pelo sequelize + conjunto de features do sequelize... tudo isso definido no arquivo 'database.js'...)

const Product = require('./models/product'); /////necessário para DEFINIR RELATIONS, NESSE NOSSO ROOT...
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  ////MIDDLEWARE CLÁSSICO, QUE VAI EXECUTAR ESSA ANON FUNCTION A PARTIR DE INCOMING REQUESTS QUE ATINJAM NOSSO BACKEND... ----> detalhe: esse código da anon function sempre SERÁ EXECUTADO__ DEPOIS __ DE 'sequelize', no momento em que 1 REQUEST ATINGIR NOSSO BACKEND... --> E ESSE BACKEND SÓ SERÁ ABERTO, com 'app.listen(3000)', SE O CO´DIGO DE 'sequelize.sync()' (CÓDIGO QUE SETTA NOSSA DATABASE SQL/vincula-a ao nosso app nodeJS) tiver sido executado com sucesso, pois o 'app.listen(3000)' se encontra DENTRO DELA, NO THEN BLOCK FINAL....

  User.findByPk(1)

    .then((user) => {
      req.user = user; ///vai definir uma nova propriedade/field de USER __DENTRO DO NOSSO OBJETO 'request', objeto request de nosso usuário/admin... esse valor, 'user', será o USER QUE FOI RETRIEVADO LÁ DE NOSSA DATABASe por meio de 'User.findByPk(1)'...
      //// ^^^^ essa nova propriedade/field __VAI CONTER UM VALOR ('user', retrievado da nossa database MYSQL pelo sequelize) QUE SERÁ MAIS DO QUE UM OBJECT JAVASCRIPT COMUM.... --> isso pq esse valor será um 'OBJETO SEQUELIZE', que é um objeto javascript comum MAS _ COM __ TODOS OS MÉTODOS/PROPRIEDADES ESPECIAIS 'SEQUELIZE' enfiadas no seu interior.... --> isso significa que COM ESSE OBJETO ESPECIAL SOMOS CAPAZES DE chamar métodos especiais sequelize sobre ele, em qualquer parte de nosso código... --> ex: lá em 'admin.js', arquivo controller, podemos chamar 'req.user.destroy()' PARA APAGAR__ ESSE VALUE NA NOSSA PROPRIEDADE 'user' enfiada dentro do nosso objeto 'request', no browser do user... 
      ///ex: req.user.destroy(); --> método SEQUELIZE que pode ser encontrado dnetro desse 'req.user', agora (pq o valor é um 'user' que foi retrievado LÁ DA DATABASE SQL por meio do SEQUELIZE, pq é o sequelize que adiciona esses convenience methods...)....
      console.log(req.user), 'LINE';
      next(); //precisamos disto, senão a execução do nosso app NODEJS vai parar....
      // console.log(req.user), 'LINE';
    })

    .catch((err) => {
      console.log(err);
    });
});

app.use(
  '/admin',

  adminRoutes
);

app.use(shopRoutes);

app.use(errorController.error404);

////sempre execute/defina relations ENTRE SEUS MODELS ___ANTES__ DO CALL de 'sequelize.sync()'

Product.belongsTo(
  User, ///DEFINE __ UMA RELATION ONE-TO-ONE ENTRE 'Product' e 'User'...

  {
    constraints: true,
    onDelete: 'CASCADE', ////ver anotação 'ADICIONANDO UMA RELATIONSHIP one-to-many', LÁ NO MÓDULO 11, 'entendendoSEQUELIZE'... ---> esse objeto são OPÇÕES, é um objeto OPCIONAL PARA CONFIGURAR A RELATION...
  }
);
User.hasMany(Product); //////DEFINE/CRIA UMA RELATION 'ONE-TO-MANY' entre User e Product (cada user terá MÚLTIPLOS PRODUCT)....
///User.hasMany(Product) é um par com '''Product.belongsTo(User)''''
///^^^^^professor diz que VOCÊ SÓ PRECISARIA DO CALL de 'User.hasMany(Product, {constraints: true, onDelete: 'CASCADE'})' MAS QUE AQUI ELE GOSTA DE DEIXAR TANTO o 'belongsTo' como o 'hasMany' pARA ___DEIXAR__ BEM CLARO COMO ESSA RELATION DEVE FUNCIONAR...



User.hasOne(Cart);///é par com 'Cart.belongsTo(User)'...
Cart.belongsTo( User, {constraints: true, onDelete: 'CASCADE' });
///('Cart.belongsTo(User)' É EXATAMENTE A MESMA COISA QUE 'User.hasOne(Cart)' -------------------->    AMBOS CÓDIGOS VÃO ADICIONAR UM FIELD DE 'userId' ao cart...)



Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem}); /////// este código faz par com 'Cart.belongsToMany(Product, {through: CartItem})') --> ambos são necessários para estabelecer uma RELATION MANY-TO-MANY...




















sequelize
  .sync ///ISTO AQUI __VAI BASICAMENTE__ CRIAR TABLES, NA DATABASE, PARA ___ TODOS __OS MODELS QUE DEFINIMOS COM sequelize.define(), como visto lá em 'product.js'... (local em que definimos o model de 'Product.js'...)
  ///e ele vai criar essas tables/vincular seus models a essas tables __JÁ NO INÍCIO DO SEU APP, NO STARTUP...
  (
    // {force: true} ////esta é uma setting EXPLOSIVA. Você SÓ DEVE A UTILIZAR DURANTE O DEVELOPMENT... --> ISSO PQ ELA SEMPRE VAI OVERWRITTAR _ SUAS TABLES 'VELHAS/PRESENTES' __ PELAS TABLES CRIADAS PELO SEQUELIZE/QUE SERÃO CRIADAS PELO SEQUELIZE QUANDO ELE RODA/RODARÁ ESSE '.sync()'... (no caso, só vamos usar isso durante development para OVERWRITTAR NOSSAS TABLES VELHA DE PRODUCTS e USERS, que não tinha  UMA RELATION DEFINIDA ENTRE ELAS, por NOVAS TABLES, COM ESSA RELATION COLOCADA NO SEU INTERIOR...)
    )  
  .then((result) => {
    // console.log(result);

    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }

    return user; /////esse 'user' é automaticamente convertido para ficar 'Promise.resolve(user)', por trás das cenas... (todo OBJETO retornado DENTRO DE UMA PROMISE é wrappado EM UMA NOVA PROMSE.... por trás das cenas...)
  })
  .then((user) => {

      if (user) {

          return user.getCart()
          .then(
              (cart) => {

                if(!cart) {
                  return user.createCart();
                } else {
                  return;
                }
              } 
          )
      }

  })
  .then(
    (user) => {
      app.listen(3000);
    }
  )
  .catch((err) => {
    console.log(err);
  });

// app.listen(3000); ////cria o nosso server... ongoing process...
