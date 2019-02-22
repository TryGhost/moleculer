/*
 * moleculer
 * Copyright (c) 2019 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

"use strict";

const _ = require("lodash");
const { BrokerOptionsError } = require("../../errors");

const Reporters = {
	Base: require("./base"),
	Console: require("./console"),
	Datadog: require("./datadog"),
	Event: require("./event"),
	Jaeger: require("./jaeger"),
	Zipkin: require("./zipkin"),
};

function getByName(name) {
	/* istanbul ignore next */
	if (!name)
		return null;

	let n = Object.keys(Reporters).find(n => n.toLowerCase() == name.toLowerCase());
	if (n)
		return Reporters[n];
}

/**
 * Resolve reporter by name
 *
 * @param {object|string} opt
 * @returns {Reporter}
 * @memberof ServiceBroker
 */
function resolve(opt) {
	if (opt instanceof Reporters.Base) {
		return opt;
	} else if (_.isString(opt)) {
		let ReporterClass = getByName(opt);
		if (ReporterClass)
			return new ReporterClass();
		else
			throw new BrokerOptionsError(`Invalid metric reporter type '${opt}'.`, { type: opt });

	} else if (_.isObject(opt)) {
		let ReporterClass = getByName(opt.type);
		if (ReporterClass)
			return new ReporterClass(opt.options);
		else
			throw new BrokerOptionsError(`Invalid metric reporter type '${opt.type}'.`, { type: opt.type });
	}

	return null;
}

module.exports = Object.assign({ resolve }, Reporters);
