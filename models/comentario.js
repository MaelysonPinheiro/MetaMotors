const { Sequelize, sequelize } = require('./db');

const Comentario = sequelize.define('comentarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comentario: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    avaliacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
}, {
    timestamps: false
});

module.exports = Comentario;
