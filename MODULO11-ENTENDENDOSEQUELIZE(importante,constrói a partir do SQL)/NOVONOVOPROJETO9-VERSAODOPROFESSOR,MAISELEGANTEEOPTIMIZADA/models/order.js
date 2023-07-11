// const Sequelize = require('sequelize');

const { Sequelize } = require('sequelize');

const sequelize = require("../util/database");







const Order = sequelize.define('order',
{

    id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
    }
}

);




module.exports = Order;