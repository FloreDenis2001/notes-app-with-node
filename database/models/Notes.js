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
    data: Sequelize.DATE,
    tag: Sequelize.STRING,
    userId: Sequelize.INTEGER,
})

module.exports = Notes;