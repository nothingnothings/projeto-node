const Sequelize = require('sequelize'); ////OBTIDO POR MEIO DE 'npm install --save sequelize', pacote que TAM´BEM REQUER UM INSTALL PRÉVIO DE 'npm install --save mysql2'...

const sequelize = require('../util/database'); ///definimos isso lá no folder 'util', no arquivo 'database.js', em que EXPORTAMOS esse 'sequelize' configurado...

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  title: Sequelize.STRING, ////shorthand do DEFINE visto logo acima... (com esse shorthand, definimos apenas o TYPE daquele field, sem definir mais nada acerca das características que esse field deve ter....)

  price: {
    type: Sequelize.DOUBLE, ///CASAS DECIMAIS... considera '0.99', etc...
    allowNull: false, ////_IMPOSSIBILITA O WRITE DE VALORES NULOS.... produto sempre deverá custar alguma coias....
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
