
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const router = require("trascender.router");

const logger = require('./lib/logger')('app');

//define app
const self = function(){
	
	this.log('start express applitaction');
	this.express = express();
	
	this.log('set response header');
	this.express.set('trust proxy', true);
	this.express.set('x-powered-by', false);
	this.express.set('etag', false);
	
	this.log('configurate express');
	this.express.use(express.json());
	this.express.use(express.urlencoded({ extended: false }));
	
	this.log('configurate helmet');
	this.express.use(helmet());
	
	this.log('configurate cors');
	this.express.use(cors(this.corsOptions));
	
	this.log('configurate compression');
	this.express.use(compression());
	
	this.log('configurate routes');
	new router(this, __dirname + "/routes");
	
	this.log('express applitaction started');
	return this.express;
	
}



//log function
self.prototype.log = function(log){
	logger.info(log);
}



//corsOptions object
self.prototype.corsOptions = {
	origin     : /.*/,
	methods    : ['GET', 'POST', 'PUT'],
	credentials: true
}



//export app
module.exports = new self();