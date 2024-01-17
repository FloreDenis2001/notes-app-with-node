const Sequelize = require('sequelize');
const {sequelize} = require('../server');

const Notes = sequelize.define("Notes", {
    id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
    },
    title: Sequelize.STRING,
    notite: Sequelize.STRING,
    materie: Sequelize.STRING,
    tag: Sequelize.STRING,
    isTrash: Sequelize.BOOLEAN,
    attachment: {
        type: Sequelize.STRING, 
        allowNull: true, 
    }
})

module.exports = Notes;