function init() {
	console.logCopy = console.log.bind(console);
	console.log = function(...data) {
		this.logCopy(`${getDateTimestamp()} ${data.join(' ')}`);
	};
	console.debugCopy = console.debug.bind(console);
	console.debug = function(...data) {
		this.debugCopy(`${getDateTimestamp()} ${data.join(' ')}`);
	};
}

function getDateTimestamp() {
	let now = new Date();
	let currentDate = now.toISOString().substr(0, 10);
	let currentTime = now.toISOString().substr(11, 8);
	return `[${currentDate} ${currentTime}]:`;
}

module.exports.init = init;
