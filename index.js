const assert = require('assert'),
	requestPromise = require('request-promise')
// OrientDB = require('orientjs');

module.exports = function () {
	assert(!this.orientDB, "field exists")

	const shared = this;

	class OrientDB {
		constructor(config) {
			this.config = config;
		}

		query(command, parameters, cb) {
			if (typeof parameters == "function") {
				cb = parameters;
				parameters = {};
			}
			return new Promise((resolve, reject) => {
				requestPromise({
					method: 'POST',
					uri: `http://${this.config.host}:${this.config.port}/command/${this.config.name}/sql/25`,
					headers: {
						"Authorization": `Basic ${Buffer.from(this.config.username + ':' + this.config.password).toString('base64')}`
					},
					json: true,
					body: Object.assign({
						command
					}, parameters && parameters.params ? {
						parameters: parameters.params
					} : {})
				}).then((res) => {
					cb && cb(null, res.result)
					resolve(res.result)
				}).catch((err) => {
					cb && cb(err.message)
					reject(err.message)
				})
			}).catch((err) => { })
		}

		batch(operations, transaction = true, cb) {
			if (typeof transaction == "function") {
				cb = transaction;
				transaction = true;
			}
			return new Promise((resolve, reject) => {
				requestPromise({
					method: 'POST',
					uri: `http://${this.config.host}:${this.config.port}/batch/${this.config.name}`,
					headers: {
						"Authorization": `Basic ${Buffer.from(this.config.username + ':' + this.config.password).toString('base64')}`
					},
					json: true,
					body: {
						transaction,
						operations: [{
							type: "script",
							language: "sql",
							script: `${transaction ? 'BEGIN;' : ''} ${operations.join(';')}; ${transaction ? 'COMMIT;' : ''}`
						}]
					}
				}).then((res) => {
					cb && cb(null, res.result)
					resolve(res.result)
				}).catch((err) => {
					cb && cb(err.message)
					reject(err.message)
				})
			}).catch((err) => { })
		}
	}

	this.orientDB = new OrientDB(this.config.get("orientdb"));
	// const client = OrientDB(this.config.get("orientdb"));

	// this.orientDB = client.use(this.config.get("orientdb"));

	return Promise.resolve();
}