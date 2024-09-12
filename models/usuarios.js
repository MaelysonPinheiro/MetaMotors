const { Sequelize, sequelize } = require('./db');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false // Desativa as colunas createdAt e updatedAt
});

Usuario.beforeCreate((usuario, options) => {
  const salt = bcrypt.genSaltSync(10);
  usuario.password = bcrypt.hashSync(usuario.password, salt);
});


module.exports = Usuario;
