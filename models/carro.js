// models/carro.js

const { Sequelize, sequelize } = require('./db');

const Carro = sequelize.define('carros', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
  timestamps: false // Desativa os campos de data de criação e atualização automática
});

module.exports = Carro;
