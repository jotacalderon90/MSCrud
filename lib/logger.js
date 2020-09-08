const {
	createLogger,
	format,
	transports
} = require('winston');

module.exports = function(namespace) {
	const logger = createLogger({
		name: namespace,
		level: config.LOG_LEVEL ? config.LOG_LEVEL.toLowerCase() : 'debug',
		levels: {
			crit: 0,
			error: 1,
			warning: 2,
			info: 3,
			debug: 4
		},
		format: format.combine(
			format.splat(),
			format.printf(function(log) {
				switch (log.level) {
					case 'debug':
						log.level = `\x1b[1m[DEBUG]\x1b[0m`;
						break;
					case 'info':
						log.level = `\x1b[36;1m[INFO]\x1b[0m`;
						break;
					case 'warning':
						log.level = `\x1b[33;1m[WARN]\x1b[0m`;
						break;
					case 'error':
						log.level = `\x1b[31:1m[ERROR]\x1b[0m`;
						break;
					case 'crit':
						log.level = `\x1b[31;5m[CRIT]\x1b[0m`;
						break;
					default:
						log.level = `\x1b[31;5m[CRIT]\x1b[0m`;
				}
				if (log.uid) {
					log.message = `${log.uid} ${log.message}`;
				}
				if (typeof(log.message) === 'object') {
					log.message = JSON.stringify(log.message);
				}
				return `\x1b[1m[${namespace}]\x1b[0m \x1b[1m${(new Date()).toISOString()}\x1b[0m [${process.pid}] ${log.level}: ${log.message}`;
			})
		),
		transports: [new transports.Console({
			json: true
		})]
	});
	logger.express = function(response) {
		logger.info(response);
	};
	return logger;
};