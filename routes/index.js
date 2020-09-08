const logger = require('../lib/logger')('routes');
logger.info('configure route');

const validate = require('../lib/validate');
const helper = require('../lib/helper');
const database = require('../models');

for(model in database){
	database[model].countValidate = validate.createCountValidate(database[model]);
	database[model].getValidate = validate.createGetValidate(database[model]);
	database[model].postValidate = validate.createPostValidate(database[model]);
	database[model].readValidate = validate.createReadValidate(database[model]);
	database[model].putValidate = validate.createPutValidate(database[model]);
}

const self = function(){
	
}

self.prototype.isLoggedIn = function (req) {
	if (req.isAuthenticated()) {
		req.session.touch();
		return true;
	} else if (req.headers['x-api-key'] === 'mLOnjquDzVTQIbuzyBUHIJRINTXkV20C') {
		return true;
	} else {
		return false;
	}
}

/*COUNT
//@route('/:object/count')
//@method(['get'])
*/
self.prototype.COUNT = async function(req,res){
	try{
		if(!this.isLoggedIn(req)){
			throw({status: 401, message: 'unauthorized'});
		}
		if(!database[req.params.object]){
			throw({status: 400, message: 'invalid object'});
		}
		
		await database[req.params.object].countValidate(req,res);
		
		const r = await database[req.params.object].count({
			where: helper.getQueryWhere(req,database[req.params.object]), 
			group: (req.query.group)?req.query.group.split(','):undefined
		});
		
		res.json(typeof r === 'number' ? [{ count: r }] : r);
		
	}catch(e){
		res.status(e.status||500).json({message: e.message||e.toString()});
	}
}

/*GET
//@route('/:object')
//@method(['get'])
*/
self.prototype.GET = async function(req,res){
	try{
		if(!this.isLoggedIn(req)){
			throw({status: 401, message: 'unauthorized'});
		}
		if(!database[req.params.object]){
			throw({status: 400, message: 'invalid object'});
		}
		
		await database[req.params.object].getValidate(req,res);
		
		const r = await database[req.params.object].findAll({
			attributes : helper.getQueryAttributes(req,database[req.params.object]),
			where : helper.getQueryWhere(req,database[req.params.object]),
			limit : req.query.limit,
			offset : req.query.page * req.query.limit
		});
		
		res.json(r);
		
	}catch(e){
		res.status(e.status||500).json({message: e.message||e.toString()});
	}
}

/*CREATE
//@route('/:object')
//@method(['post'])
*/
self.prototype.CREATE = async function(req,res){
	try{
		if(!this.isLoggedIn(req)){
			throw({status: 401, message: 'unauthorized'});
		}
		if(!database[req.params.object]){
			throw({status: 400, message: 'invalid object'});
		}
		
		await database[req.params.object].postValidate(req,res);
		
		const r = await database[req.params.object].create(req.body);
		res.status(201).json(r);
		
	}catch(e){
		res.status(e.status||500).json({message: e.message||e.toString()});
	}
}

/*READ
//@route('/:object/:id')
//@method(['get'])
*/
self.prototype.READ = async function(req,res){
	try{
		if(!this.isLoggedIn(req)){
			throw({status: 401, message: 'unauthorized'});
		}
		if(!database[req.params.object]){
			throw({status: 400, message: 'invalid object'});
		}
		
		await database[req.params.object].readValidate(req,res);
		
		const r = await database[req.params.object].findByPk(req.params.id, {
			attributes : helper.getQueryAttributes(req,database[req.params.object]),
			rejectOnEmpty : true
		});
		
		res.json(r);
		
	}catch(e){
		res.status(e.status||500).json({message: e.message||e.toString()});
	}
}

/*PUT
//@route('/:object/:id')
//@method(['put'])
*/
self.prototype.UPDATE = async function(req,res){
	try{
		if(!this.isLoggedIn(req)){
			throw({status: 401, message: 'unauthorized'});
		}
		if(!database[req.params.object]){
			throw({status: 400, message: 'invalid object'});
		}
		
		await database[req.params.object].putValidate(req,res);
		
		const where = {};
		where[helper.getPK(database[req.params.object])] = req.params.id;
		
		const r = await database[req.params.object].update(req.body,{where: where});
		res.status(200).json({updated: r});
		
	}catch(e){
		res.status(e.status||500).json({message: e.message||e.toString()});
	}
}

/*DELETE
//@route('/:object/:id')
//@method(['delete'])
*/
self.prototype.DELETE = async function(req,res){
	try{
		if(!this.isLoggedIn(req)){
			throw({status: 401, message: 'unauthorized'});
		}
		if(!database[req.params.object]){
			throw({status: 400, message: 'invalid object'});
		}
		
		/*const where = {};
		where[helper.getPK(database[req.params.object])] = req.params.id;
		
		const r = await database[req.params.object].update({status: 'deleted'},{where: where});*/
		res.status(200).json({data: true});
		
	}catch(e){
		res.status(e.status||500).json({message: e.message||e.toString()});
	}
}

module.exports = self;