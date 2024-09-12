const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Saldo = sequelize.define('Saldo', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
}, {
    tableName: 'saldos',
    timestamps: false
});

module.exports = Saldo;
