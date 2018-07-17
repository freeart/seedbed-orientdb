const assert = require('assert'),
	//requestPromise = require('request-promise')
	OrientDB = require('orientjs');


module.exports = function () {
	assert(!this.orientDB, "field exists")

	const shared = this;

	/* class OrientDB {
		constructor(config) {
			this.config = config;
		}

		query(command, parameters) {
			return new Promise((resolve, reject) => {
				requestPromise({
					method: 'POST',
					uri: `http://${this.config.host}:${this.config.port}/command/${this.config.name}/sql/25`,
					headers: {
						"Authorization": `Basic ${Buffer.from(this.config.username + ':' + this.config.password).toString('base64')}`
					},
					json: true,
					body: {
						command,
						parameters
					}
				}).then((res) => {
					resolve(res.result)
				}).catch((err) => {
					reject(err)
				})
			})
		}
	} */

	//this.orientDB = new OrientDB(this.config.get("orientdb"));
	const client = OrientDB(this.config.get("orientdb"));

	this.orientDB = client.use(this.config.get("orientdb"));

	return Promise.resolve();
}