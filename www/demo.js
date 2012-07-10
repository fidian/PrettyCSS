$(function () {
	var optionMeta_default = {
		type: "string",
		validation: /^[ \t\f\r\n]*$/,
		description: "No description found",
		validationMessage: "This can only contain whitespace"
	};

	var optionMeta = {
		// Drop-down lists
		cssLevel: {
			type: "list",
			values: [ "1", "2", "2.1", "3" ],
			description: "Desired CSS level"
		},

		// Booleans
		autocorrect: {
			type: "checkbox",
			description: "Enable autocorrection of bad CSS"
		},
		propertiesLowerCase: {
			type: "checkbox",
			description: "Lowercase property names"
		},
		valuesLowerCase: {
			type: "checkbox",
			description: "Lowercase values"
		},

		// Whitespace options
		at_pre: {
			description: "Before @at rule"
		},
		at_whitespace: {
			description: "Between @at rule elements"
		},
		at_post: {
			description: "After @at rule"
		},

		atblock_pre: {
			description: "Starting @at rule block",
			validation: /^[ \t\f\r\n]*\{[ \t\f\r\n]*$/,
			validationMessage: "This must contain an open brace ({) and may have whitespace"
		},
		atblock_post: {
			description: "Finishing @at rule block",
			validation: /^[ \t\f\r\n]*\}[ \t\f\r\n]*$/,
			validationMessage: "This must contain a close brace (}) and may have whitespace"
		},

		block_pre: {
			description: "Starting a block",
			validation: /^[ \t\f\r\n]*\{[ \t\f\r\n]*$/,
			validationMessage: "This must contain an open brace ({) and may have whitespace"
		},
		block_post: {
			description: "Finishing a block",
			validation: /^[ \t\f\r\n]*\}[ \t\f\r\n]*$/,
			validationMessage: "This must contain an close brace (}) and may have whitespace"
		},

		cdo: {
			description: "Starting an HTML comment",
			validation: /^[ \t\f\r\n]*(<!--[ \t\f\r\n]*)?$/,
			validationMessage:  "This must have &lt;!-- and may have whitespace"
		},
		cdc: {
			description: "Finishing an HTML comment",
			validation: /^[ \t\f\r\n]*(-->[ \t\f\r\n]*)?$/,
			validationMessage:  "This must have --&gt; and may have whitespace"
		},

		combinator_pre: {
			description: "Before a combinator"
		},
		combinator_post: {
			description: "After a combinator"
		},

		topcomment_pre: {
			description: "Before a comment at the top level"
		},
		topcomment_post: {
			description: "After a comment at the top level"
		},
		comment_pre: {
			description: "Before a comment anywhere else"
		},
		comment_post: {
			description: "After a comment anywhere else"
		},

		declaration_pre: {
			description: "Before a declaration"
		},
		declaration_post: {
			description: "After a declaration"
		},

		functionComma: {
			description: "How parameters are separated in a function call",
			validation: /^[ \t\f\r\n]*,[ \t\f\r\n]*$/,
			validationMessage: "You need to have a comma and may also include whitespace"
		},
		functionSpace: {
			description: "Whitespace, when needed in a function call",
			validation: /^[ \t\f\r\n]+$/,
			validationMessage: "There must be some whitespace"
		},

		important: {
			description: "How the !important flag is represented",
			validation: /^[ \t\f\r\n]*![ \t\f\r\n]*important[ \t\f\r\n]*$/,
			validationMessage:  "Must have '!' and 'important' and may have whitespace"
		},

		indent: {
			description: "What to use when indenting the contents of a block"
		},

		keyframe_pre: {
			description: "Before a keyframe"
		},
		keyframe_post: {
			description: "After a keyframe"
		},
		keyframeselector_pre: {
			description: "Before a keyframe selector"
		},
		keyframeselector_post: {
			description: "After a keyframe selector"
		},

		property_pre: {
			description: "Before a property name"
		},
		property_post: {
			description: "After a property name and before the colon"
		},

		ruleset_pre: {
			description: "Before a complete ruleset"
		},
		ruleset_post: {
			description: "After a complete ruleset"
		},

		selector_pre: {
			description: "Before a selector"
		},
		selector_whitespace: {
			description: "Whitespace between selectors",
			validation: /^[ \t\f\r\n]+/,
			validationMessage: "This must contain at least one whitespace character"
		},
		selector_comma: {
			description: "A comma between selectors",
			validation: /^[ \t\f\r\n]*,[ \t\f\r\n]*$/,
			validationMessage: "You must have a comma and may include whitespace"
		},
		selector_post: {
			description: "After a selector"
		},

		stylesheet_pre: {
			description: "What comes at the top of a stylesheet"
		},
		stylesheet_whitespace: {
			description: "What is between rules and comments in a stylesheet"
		},
		stylesheet_post: {
			description: "What appears at the end of a stylesheet"
		},

		value_pre: {
			description: "Between a colon and the value of a property"
		},
		value_post: {
			description: "After a property value and before the semicolon"
		}
	};

	function addOptionInput(option, $wrapper) {
		var ni = ' name="' + option.name + '" id="' + option.name + '"';
		var nic = ni + ' class="option"';

		if (option.type == 'string') {
			var i = $('<input type="text"' + nic + ' />');
			i.val(slashAdd(option.defaultValue));
			anyUpdate(i, function () {
				var v = i.val();

				if (v.indexOf(' ') != -1) {
					v = v.replace(/ /g, "\xB7");
					i.val(v);
				}

				if (slashRemove(v).match(option.validation)) {
					$wrapper.removeClass('optionInvalid');
				} else {
					$wrapper.addClass('optionInvalid');
				}
			});
			i.change();
			return i;
		}

		if (option.type == 'checkbox') {
			var cb = $('<input type="checkbox"' + ni + ' />');

			if (option.defaultValue) {
				cb.prop('checked', true);
			}

			return $('<div class="option" />').append(cb);
		}

		if (option.type == 'list') {
			var l = $('<select' + nic + ' />');
			option.values.forEach(function (item) {
				l.append($('<option />').prop('value', item).text(item));
			});
			return l;
		}

		return $('<div />').text('Unknown option type: ' + option.type);
	}

	function addOptions($dest) {
		for (var i in optionMeta) {
			var option = optionMeta[i];
			var opt = $('<div class="optionWrapper" />');
			var valmsg = $('<div class="optionValidationMessage" />').text(option.validationMessage);
			opt.append(addOptionInput(option, opt));
			opt.append($('<div class="optionLabel" />').text(option.description + ":").append(valmsg));
			opt.append($('<div class="optionClear" />'));
			$dest.append(opt);
		}
	}

	function anyUpdate($target, func) {
		$target.change(func).keypress(func).keyup(func).keydown(func);
	}

	function assignOptionDefaults() {
		var util = require('./util');
		var options = util.setOptions();
		var defaults = optionMeta_default;

		for (var i in optionMeta) {
			optionMeta[i].name = i;

			if (typeof options[i] != 'undefined') {
				optionMeta[i].defaultValue = options[i];
			}

			for (var j in defaults) {
				if (typeof optionMeta[i][j] == 'undefined') {
					optionMeta[i][j] = defaults[j];
				}
			}
		}
	}

	function defaultOptions() {
		var util = require('./util');
		var options = util.setOptions({});
		delete(options.debug);
		delete(options.fileEncoding);

		for (var i in options) {
			if (typeof options[i] == 'function') {
				delete(options[i]);
			}
		}

		return options;
	}

	function setOptions(opt) {
		var $optElem = $('.option');

		for (var i in opt) {
			var v = opt[i];
			v = slashAdd(v);
			$optElem.filter('#' + i).val(v);
		}
	}

	function showProblem(problem, $dest) {
		var message = $("<span />").text(problem.message);
		var detail = $('<div class="hidden" />');
		var line;

		if (problem.token) {
			line = 'Token: ';
			line += problem.token.type + ' (' + problem.token.content + ')';
			line += ' on line ' + problem.token.line;
			line += ', character ' + problem.token.charNum;
		} else {
			line = 'No token supplied';
		}

		detail.append($('<span />').text(line));
		detail.append('<br>');
		detail.append($('<span />').text('Problem code:  ' + problem.code));

		if (problem.more) {
			detail.append('<br>');
			detail.append($('<span />').text('Full problem code:  ' + problem.code + ':' + problem.more));
		}

		var detailTagShow = $('<span class="detailTag" />').text('[ More ]');
		var detailTagHide = $('<span class="detailTag hidden" />').text('[ Less ]');
		var toggleFunction = function () {
			detail.toggleClass('hidden');
			detailTagShow.toggleClass('hidden');
			detailTagHide.toggleClass('hidden');
		};
		detailTagShow.click(toggleFunction);
		detailTagHide.click(toggleFunction);
		$dest.append(message).append(detailTagShow).append(detailTagHide).append(detail);
		return $dest;
	}

	function showProblemList(target, list) {
		var $target = $(target);
		$target.empty();

		if (list.length === 0) {
			$target.text('None were reported.');
			return;
		}

		var ul = $('<ul />');

		for (var i = 0; i < list.length; i ++) {
			ul.append(showProblem(list[i], $('<li />')));
		}

		$target.append(ul);
	}

	function slashAdd(v) {
		v = v.toString();
		v = v.replace(/\\/g, "\\");
		v = v.replace(/\r/g, "\\r");
		v = v.replace(/\t/g, "\\t");
		v = v.replace(/\f/g, "\\f");
		v = v.replace(/\n/g, "\\n");
		v = v.replace(/ /g, "\xB7");
		return v;
	}

	function slashRemove(v) {
		v = v.replace(/\xB7/g, " ");
		v = v.replace(/\\r/g, "\r");
		v = v.replace(/\\t/g, "\t");
		v = v.replace(/\\f/g, "\f");
		v = v.replace(/\\n/g, "\n");
		v = v.replace(/\\\\/g, "\\");
		return v;
	}

	function update () {
		if (! dirty && ! force) {
			return;
		}

		dirty = false;
		var content = $cssIn.val();

		if (! force && content == lastContent) {
			return;
		}

		force = false;
		lastContent = content;
		options = {};
		$(".option").each(function (idx, elem) {
			var $elem = $(elem);
			var v = $elem.val();
			v = slashRemove(v);
			options[$elem.attr('id')] = v;
		});

		var pp = prettycss.parse(content, options);
		$cssOut.val(pp.toString());
		updateProblems(pp.getProblems());
	}

	function updateClasses(hasErrOrWarn, target, className) {
		var $t = $(target);

		if (hasErrOrWarn) {
			$t.removeClass('no_' + className);
			$t.addClass(className);
		} else {
			$t.addClass('no_' + className);
			$t.removeClass(className);
		}
	}

	function updateProblems(problems) {
		var errors = [];
		var warnings = [];
		problems.forEach(function (item) {
			if (item.typeCode == 'error') {
				errors.push(item);
			} else {
				warnings.push(item);
			}
		});
		showProblemList('#errorList', errors);
		showProblemList('#warningList', warnings);
		updateClasses(errors.length, '.update', 'error');
		updateClasses(warnings.length, '.update', 'warning');
	}

	var lastContent = '';
	var prettycss = require('./prettycss');
	var $cssIn = $('#cssIn');
	var $cssOut = $('#cssOut');
	var dirty = false;
	var force = true;  // Force the initial call to set up the form
	var setFlag = function () {
		dirty = true;
	};

	assignOptionDefaults();
	window.setInterval(update, 100);
	update();
	anyUpdate($cssIn, setFlag);
	addOptions($('#optionWrapper'));

	$('#presetMinify').click(function () {
		var opt = defaultOptions();

		for (var i in opt) {
			opt[i] = '';
		}

		opt.selector_whitespace = " ";
		opt.selector_comma = ",";
		opt.block_pre = "{";
		opt.block_post = "}";
		opt.atblock_pre = "{";
		opt.atblock_post = "}";
		opt.ruleset_post = "\n";
		opt.at_post = "\n";
		opt.important = "!important";
		opt.function_comma = ",";
		opt.propertiesLowerCase = true;
		opt.topcomment_post = "\n";
		opt.cssLevel = 3;
		opt.valuesLowerCase = true;
		setOptions(opt);
		force = true;
		return false;
	});
	$('#presetDefault').click(function () {
		setOptions(defaultOptions());
		force = true;
		return false;
	});
	$('#cssIn').focus();
	var $tabs = $('#tabs').tabs();
	$('.warningsAndErrors').live('click', function () {
		$tabs.tabs('select', 1);
	});
});
