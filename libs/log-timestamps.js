function init() {
	console.logCopy = console.log.bind(console);
	console.log = function(data) {
		let now = new Date();
		let currentDate = now.toISOString().substr(0, 10);
		let currentTime = now.toISOString().substr(11, 8);
		let currentDateTime = `[${currentDate} ${currentTime}]:`;
		this.logCopy(currentDateTime, data);
	};
}

module.exports.init = init;