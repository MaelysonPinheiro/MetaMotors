// contato.js

const { Sequelize, sequelize } = require('./db');

const Contato = sequelize.define('contato', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    carro_interesse: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Desativar timestamps
});

module.exports = Contato;
