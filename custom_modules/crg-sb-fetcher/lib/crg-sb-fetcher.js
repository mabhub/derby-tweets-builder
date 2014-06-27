/*
 * crg-sb-fetcher
 * https://github.com/mabhub/derby-tweets-builder
 *
 * Copyright (c) 2014 mab
 * Licensed under the MIT license.
 */

'use strict';

module.exports = (function (local) {

	var events       = require ('events');
	var eventEmitter = new events.EventEmitter();
	var request      = require ('request');
	var xml2js       = require('xml2js');
	var endCallback  = function () {};

	/**
	 * Default values
	 */
	var server   = 'localhost:8000';
	var services = {
		get:      'SaveXml',
	};

	/**
	 * Methods
	 */
	function test () {
		console.log('test');
	}

	function set () {
		var typeof0 =  typeof arguments[0];
		var typeof1 =  typeof arguments[1];

		if (arguments.length === 1 && typeof0 === 'object') {
			for (var a in arguments[0]) {
				this[a] = arguments[0][a];
			}
		}
	}

	function fetchXml (callback) {
		var uri = ['http:/', this.server || server, services.get, '?path=ScoreBoard'].join('/');
		request(uri, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				eventEmitter.emit('xmlfetch', body);
			}
		});
		if (callback && typeof callback === 'function') {
			endCallback = callback;
		}
		return this;
	}

	function parseXML (data) {
		var parser = new xml2js.Parser();
		parser.addListener('end', function(result) {
			eventEmitter.emit('xmlParse', result.document)
		});
		parser.parseString(data);
	}

	function onXmlFetch (data) {
		parseXML(data);
	}

	function onXmlParse (dataObj) {
		endCallback(dataObj);
		// console.log(JSON.stringify(dataObj));
	}

	eventEmitter.on('xmlfetch', onXmlFetch);
	eventEmitter.on('xmlParse', onXmlParse);

	return {
		fetchXml: fetchXml,
		set: set
	};
}(this));
