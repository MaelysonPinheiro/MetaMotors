const { Sequelize, sequelize } = require('./db');

const Pedido = sequelize.define('pedidos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: Sequelize.INTEGER,
    }
}, {
  timestamps: false // Desativa os campos de data de criação e atualização automática
});

module.exports = Pedido;