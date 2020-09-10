
const {
	celebrate,
	Joi,
	Segments,
} = require('celebrate');

const self = function(){
	
}

self.prototype.pattern = {
	name: new RegExp(/^[a-zA-Z]+[\w]*[a-zA-Z]$/),
	state: new RegExp(/(deleted|active|inactive)$/),
	scopes: new RegExp(/^[a-z]+(,[a-z])*$/),
	attr: new RegExp(/^[\w]+(,[\w]+)*$/)
};

self.prototype.defaultQueryGets = function(){
	return {
		limit : Joi.number().integer().max(50).min(10).default(20),
		page  : Joi.number().integer().min(0).default(0),
		scopes: Joi.string().regex(this.pattern.scopes),
		attr  : Joi.string().regex(this.pattern.attr)
	}
}

self.prototype.createValidate = function(specification){
	return celebrate({
		...((specification.QUERY!==undefined)?({[Segments.QUERY]: Joi.object().keys(specification.QUERY)}):undefined),
		...((specification.BODY!==undefined)?({[Segments.BODY]: Joi.object().keys(specification.BODY)}):undefined),
		...((specification.PARAMS!==undefined)?({[Segments.PARAMS]: Joi.object().keys(specification.PARAMS)}):undefined)
	});
}

self.prototype.createCountValidate = function(model){
	const QUERY = {};
	for(attr in model.rawAttributes){
		if(model.rawAttributes[attr].ON && model.rawAttributes[attr].ON.COUNT){
			QUERY[attr] = model.rawAttributes[attr].ON.COUNT;
		}
		if(model.rawAttributes[attr].ON && model.rawAttributes[attr].ON.GROUP){
			if(!QUERY.group){
				QUERY.group = Joi.string();
			}
			QUERY.group = QUERY.group.valid(attr);
		}
	}
	return this.createValidate({QUERY: QUERY});
}

self.prototype.createGetValidate = function(model){
	const QUERY = {};
	for(attr in model.rawAttributes){
		if(model.rawAttributes[attr].ON && model.rawAttributes[attr].ON.GET){
			QUERY[attr] = model.rawAttributes[attr].ON.GET;
		}
	}
	return this.createValidate({QUERY: {...this.defaultQueryGets(),...QUERY}});
}

self.prototype.createPostValidate = function(model){
	const BODY = {};
	for(attr in model.rawAttributes){
		if(model.rawAttributes[attr].ON && model.rawAttributes[attr].ON.POST){
			BODY[attr] = model.rawAttributes[attr].ON.POST;
		}
	}
	return this.createValidate({BODY: BODY});
}

self.prototype.createPutValidate = function(model){
	const BODY = {};
	for(attr in model.rawAttributes){
		if(model.rawAttributes[attr].ON && model.rawAttributes[attr].ON.PUT){
			BODY[attr] = model.rawAttributes[attr].ON.PUT;
		}
	}
	return this.createValidate({BODY: BODY});
}

self.prototype.createReadValidate = function(){
	return this.createValidate({QUERY: {attr : Joi.string().regex(this.pattern.attr)}});
}

module.exports = new self;