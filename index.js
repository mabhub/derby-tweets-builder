;(function (global) {
	"use strict";

	var Sbfetcher = require('./custom_modules/crg-sb-fetcher');
	var SbFilter  = require('./custom_modules/crg-sb-filter');

	Sbfetcher.set({
		server: '192.168.105.2:8000'
	});

	Sbfetcher.fetchXml(function (SbData) {

		SbFilter.load(SbData);
		// console.log(JSON.stringify(SbData));
		// console.log(SbFilter.get('Teams'));;
		console.log(SbFilter.full());;

	});

}(this));
