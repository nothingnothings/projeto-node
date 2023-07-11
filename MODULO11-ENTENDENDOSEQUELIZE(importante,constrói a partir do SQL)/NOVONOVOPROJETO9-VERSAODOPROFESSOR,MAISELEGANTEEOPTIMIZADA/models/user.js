// const Sequelize = require('sequelize');

const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');



const User = sequelize.define(
    'user', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        email: {
            allowNull: false,
            type: Sequelize.STRING ////É O EQUIVALENTE A 'VARCHAR(255)', lá no WORKBENCH/DATABASE SQL COMUM...
        },
        // password: {
        //     allowNull: false,
        //     type: Sequelize.NUMBER
        // }
    }
)


module.exports = User;