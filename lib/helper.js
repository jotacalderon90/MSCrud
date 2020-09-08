
const self = function(){
	
}

self.prototype.getQueryAttributes = function(req,model){
	let ret = [];
	if(req.query.attr){
		ret = req.query.attr.split(',');
	}else{
		for(a in model.rawAttributes){
			ret.push(a);
		}
	}
	return ret;
}

self.prototype.getQueryWhere = function(req,model){
	const ret = {};
	for(a in model.rawAttributes){
		if(req.query[a]!=undefined){
			ret[a] = req.query[a];
		}
	}
	return ret;
}

self.prototype.getBody = function(req,model){
	const ret = {};
	for(a in model.rawAttributes){
		if(req.body[a]!=undefined){
			ret[a] = req.body[a];
		}
	}
	return ret;
}

self.prototype.getPK = function(model){
	for(a in model.rawAttributes){
		if(model.rawAttributes[a].primaryKey){
			return a;
		}
	}
}

module.exports = new self;