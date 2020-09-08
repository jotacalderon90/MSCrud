const logger = require('../lib/logger')('bbdd');
const fs = require('fs');
const path = require('path');

logger.info('configure bbdd');

const sequelize = new (require('sequelize'))(config['DATABASE']);

const database = {};

fs.readdirSync(path.join(__dirname, 'schemas'))
	.filter(function(file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
	})
	.forEach(function(file) {
		const model = sequelize.import(path.join(__dirname, 'schemas', file));
		database[model.name] = model;
	});

module.exports = database;

logger.info('bbdd configured');