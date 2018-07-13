const assert = require('assert'),
	OrientDB = require('orientjs');

module.exports = function () {
	assert(!this.orientDB, "field exists")

	const client = OrientDB(this.config.get("orientdb"));

	this.orientDB = client.use(this.config.get("orientdb"));

	return Promise.resolve();
}