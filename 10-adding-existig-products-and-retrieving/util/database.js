const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete-course', 'root', 'K4tsuhir00ht0m0', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
