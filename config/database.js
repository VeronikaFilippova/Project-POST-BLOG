const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:veronikaF1010@localhost:5432/blog_app', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false 
});

module.exports = sequelize;

