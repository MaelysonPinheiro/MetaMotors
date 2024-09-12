const Sequelize = require('sequelize')

const sequelize = new Sequelize('loja_caros', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
});

console.log('Conectado ao Banco De Dados.');

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}