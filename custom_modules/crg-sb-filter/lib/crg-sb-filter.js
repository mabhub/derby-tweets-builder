/*
 * crg-sb-filter
 * https://github.com/mabhub/derby-tweets-builder
 *
 * Copyright (c) 2014 mab
 * Licensed under the MIT license.
 */

'use strict';

module.exports = (function (local) {

	var events       = require('events');
	var eventEmitter = new events.EventEmitter();

	var base = {};
	/**
	 * Methods
	 */
	function test () {
		console.log('test', arguments[0]);
	}

	function parse (data) {
		var raw    = data;
		var output = {};
		var sb     = raw.ScoreBoard[0];
		output.age = Date.now() - data.$.SystemTime;

		/**
		 * Teams
		 */
		var teams      = {};
		var teamLabels = ['home', 'away'];
		sb.Team.forEach(function (team, index) {
			var label          = teamLabels[index] || 'team_' + (index+1);
			var t        = {};

			/**
			* Team names
			*/
			t.names      = {};
			t.names.main = team.Name.toString();
			team.AlternateName.forEach(function (name, index) {
				t.names[name.$.Id] = name.Name.toString();
			});

			/**
			 * Team scores
			 */
			t.score = parseInt(team.Score.toString());

			/**
			 * Team goods
			 */
			t.to   = parseInt(team.Timeouts.toString());
			t.or   = parseInt(team.OfficialReviews.toString());
			t.lead = team.LeadJammer.toString() === 'true' ? true : false;
			t.pass = parseInt(team.Pass.toString());

			/**
			 * Team players
			 */
			if (team.Skater) {
				t.skaters = [];
				team.Skater.forEach(function (skater) {
					t.skaters.push({
						name: skater.Name.toString(),
						number: skater.Number.toString()
					});
				});
			}
			/*
			t.positions = {};
			team.Position.forEach(function (position) {
				var id          = position.$.Id.toLowerCase();
				t.positions[id] = {};
				t.positions[id].Name = position.
			});
			*/

			teams[label] = t;

		});
		output.teams = teams;

		/**
		 * Game clocks
		 */
		sb.Clock.forEach(function (clock) {
			var id           = clock.$.Id.toLowerCase();
			output[id]       = {}
			output[id].id    = parseInt(clock.Number[0]);

			var tkey         = (clock.Direction[0] === 'true') ? 'remaning' : 'elapsed';
			output[id][tkey] = parseInt(clock.Time[0]);

			output[id].max   = parseInt(clock.MaximumTime[0]);
			output[id].min   = parseInt(clock.MinimumTime[0]);

			output[id].on    = clock.Running[0] === 'true' ? true : false;
		});

		return output;
	}

	function get (label) {
		label = label.toLowerCase();

		var output;

		switch (label) {
			case 'teams':
				output = {
					home: base.ScoreBoard.Team[0],
					away: base.ScoreBoard.Team[1]
				};
				break;
			default:
				output = false;
		}
		return output;
	}

	function full () {
		return base;
	}

	function load (data) {
		base = parse(data);
		eventEmitter.emit('load');
	}

	function onEvent (event, callback) {
		if (typeof event === 'string' && typeof callback === 'function') {
			eventEmitter.on(event, callback);
		}
	}

	return {
		get: get,
		load: load,
		on: onEvent,
		full: full
	};

}(this));
