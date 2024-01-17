const Sequelize = require('sequelize');
const {sequelize} = require('../server');

const Enrollment = sequelize.define("Enrollment", {
    id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
    },
    noteId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    status : Sequelize.STRING,
})

module.exports = Enrollment;