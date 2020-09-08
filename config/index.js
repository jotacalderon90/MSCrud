const fs = require('fs');
const path = require('path');
if (!fs.existsSync(path.join(__dirname, `./environments/${process.env.NODE_ENV || 'development'}.json`))) {
	throw new Error('environments is not defined');
}
module.exports = require(`./environments/${process.env.NODE_ENV || 'development'}.json`);