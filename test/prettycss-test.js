"use strict";
var vows = require('vows');
var assert = require('assert');
var prettyCss = require('../lib/prettycss');
var fs = require('fs');
var diff = require('diff');

var prettyPrint = function () {
	var context = {
		topic: function () {
			var testName = this.context.name.split(' ')[0];
			var topicCallback = this.callback;
			var dirBase = __dirname + '/prettycss/' + testName;
			var processesLeft = 4;
			var cssIn = null;
			var dataIn = null;
			var cssOut = null;
			var dataOut = null;

			var whenDone = function (err) {
				processesLeft --;

				if (err) {
					processesLeft = -1;
					topicCallback(err);
					return;
				}

				if (processesLeft > 0) {
					return;
				}

				var p = prettyCss.parse(cssIn, dataIn);
				topicCallback(null, p, cssOut, dataOut);
			};

			fs.readFile(dirBase + '-in.css', 'utf-8', function (err, data) {
				if (! err) {
					cssIn = data;
				}
				whenDone(err);
			});
			fs.readFile(dirBase + '-out.css', 'utf-8', function (err, data) {
				if (! err) {
					cssOut = data;
				}
				whenDone(err);
			});
			fs.readFile(dirBase + '-in.json', 'utf-8', function (err, data) {
				if (! err) {
					try {
						dataIn = JSON.parse(data);
					} catch (err) {
					}
				}
				whenDone(err);
			});
			fs.readFile(dirBase + '-out.json', 'utf-8', function (err, data) {
				if (! err) {
					try {
						dataOut = JSON.parse(data);
					} catch (err) {
					}
				}
				whenDone(err);
			});
		},

		'CSS Matches': function (err, p, expectedCss, expectedProblems) {
			assert.ifError(err);
			var aStr = p.toString() + "\n";  // Pretty printing removes the last newline
			var dStr = diff.createPatch(null, expectedCss, aStr);
			assert.deepEqual(aStr, expectedCss, "Pretty CSS did not match\nDiff:" + dStr);
		},

		'Problems Match': function (err, p, expectedCss, expectedProblems) {
			assert.ifError(err);
			assert.deepEqual(p.getProblems(), expectedProblems);
		}
	};

	return context;
};

exports.batch = vows.describe('lib/prettycss.js').addBatch({
	'bad_braces': prettyPrint(),
	'bad_nested_block': prettyPrint(),
	'comment-bug2': prettyPrint(),
	'exercises': prettyPrint(),
	'hacks': prettyPrint(),
	'nth-child': prettyPrint(),
	'test_base': prettyPrint()
});
