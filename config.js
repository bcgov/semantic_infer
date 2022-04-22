const fs = require("fs");
class config {
	
	constructor(){
		let NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || __dirname + '/config';
		this.config = {}
		try {
			let f = fs.readFileSync(NODE_CONFIG_DIR + '/default.json');
			this.config = JSON.parse(f);
			f = fs.readFileSync(NODE_CONFIG_DIR + '/'+ (process.env.NODE_ENV || 'production') +'.json');
			this.config = {...this.config, ...JSON.parse(f)}
		}
		catch(e){}
		try {
			this.config = {...this.config, ...JSON.parse(process.env.NODE_CONFIG)};
		}
		catch(e){}		
	}
	get(param_name){
		return this.config[param_name];
	}
	has(param_name){
		return typeof(this.config[param_name]) !== 'undefined';
	}
};
module.exports = {config:config}