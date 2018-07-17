const assert = require('assert'),
	requestPromise = require('request-promise')
//OrientDB = require('orientjs');

const connect = Symbol("connect")

module.exports = function () {
	assert(!this.orientDB, "field exists")

	const shared = this;

	class OrientDB {
		constructor(config) {
			this.config = config;
		}

		/*[connect](force) {
			if (!force && this.auth){
				return Promise.resolve();
			}
			return requestPromise({
				method: 'GET',
				uri: `http://${this.config.host}:${this.config.port}/connect/${this.config.name}`,
				headers: {
					"Authorization": `Basic ${Buffer.from(this.config.username + ':' + this.config.password).toString('base64')}`
				},
				resolveWithFullResponse: true
			}).then((res) => {
				return requestPromise({
					method: 'POST',
					uri: `http://${this.config.host}:${this.config.port}/server/configuration.command.timeout/${this.config.timeout * 1000}`,
					headers: {
						"Authorization": `Basic ${Buffer.from(this.config.username + ':' + this.config.password).toString('base64')}`
					},
					resolveWithFullResponse: true
				}).then(() => {
					this.auth = res.headers["set-cookie"][0];
				})
			}).catch((err) => {
				this.auth = null;
			})
		}*/

		query(command, parameters) {
			return new Promise((resolve, reject)=>{
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
	}

	this.orientDB = new OrientDB(this.config.get("orientdb"));
	//const client = OrientDB(this.config.get("orientdb"));

	//this.orientDB = client.use(this.config.get("orientdb"));

	return Promise.resolve();
}