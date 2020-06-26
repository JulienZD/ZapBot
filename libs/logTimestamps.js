module.exports = {
	init() {
		console.logCopy = console.log.bind(console);
		console.log = function(data) {
			const now = new Date();
			const currentDate = now.toISOString().substr(0, 10);
			const currentTime = now.toISOString().substr(11, 8);
			const currentDateTime = `[${currentDate} ${currentTime}]:`;
			this.logCopy(currentDateTime, data);
		};
	},
};