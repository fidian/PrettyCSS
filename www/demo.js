var codeToMessage = {
	"block_expected": "Expected a block",
	"colon_expected": "Expected a colon",
	"ident_after_colon": "Expected an identifier after a colon",
	"ident_after_double_colon": "Expected an identifier after a double colon",
	"illegal_token_after_combinator": "An invalid token was found after a combinator",
	"invalid_token": "Invalid token encountered",
};

function showCodeList(target, list) {
	var $target = $(target);
	$target.empty();

	if (list.length == 0) {
		$target.text('None were reported.');
		return;
	}

	var ul = $('<ul />');

	for (var i = 0; i < list.length; i ++) {
		var code = list[i].code;
		var token = list[i].token;
		var li = $('<li />');
		var message = codeToMessage[code] || code;
		var line = null;

		if (token) {
			message += " (" + token.type + ", line " + token.line + ")";
			line = token.line;
		} else {
			message += " (no token supplied)";
		}

		li.text(message);
		ul.append(li);
	}

	$target.append(ul);
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

function anyUpdate($target, func) {
	$target.change(func).keypress(func).keyup(func).keydown(func);
}

function addOptions() {
	var options = defaultOptions();
	$dest = $('#optionWrapper');
	for (var i in options) {
		var v = options[i];
		v = addslashes(v);
		var inp = $('<input type="text" name="' + i + '" id="' + i + '" class="option"/>').val(v);
		var opt = $('<div class="optionWrapper" />');
		opt.append(inp);
		opt.append($('<div class="optionLabel" />').text(i + ":"));
		opt.append($('<div class="optionClear" />'));
		$dest.append(opt);
	}
}

function addslashes(v) {
	v = v.toString();
	v = v.replace(/\\/g, "\\");
	v = v.replace(/\r/g, "\\r");
	v = v.replace(/\t/g, "\\t");
	v = v.replace(/\f/g, "\\f");
	v = v.replace(/\n/g, "\\n");
	return v;
}

function stripslashes(v) {
	v = v.replace(/\\r/g, "\r");
	v = v.replace(/\\t/g, "\t");
	v = v.replace(/\\f/g, "\f");
	v = v.replace(/\\n/g, "\n");
	v = v.replace(/\\\\/g, "\\");
	return v;
}

$(function () {
	var lastContent = '';
	var prettycss = require('./prettycss');
	var $cssIn = $('#cssIn');
	var $cssOut = $('#cssOut');
	var dirty = false;
	var force = true;  // Force the initial call to set up the form
	var setFlag = function () {
		dirty = true;
	};
	var update = function () {
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
			v = stripslashes(v);
			options[$elem.attr('id')] = v;
		});

		var pp = prettycss.parse(content, options);
		$cssOut.val(pp.toString());
		showCodeList('#errorList', pp.errors);
		showCodeList('#warningList', pp.warnings);

		var updateClasses = function (hasErrOrWarn, target, className) {
			var $t = $(target);

			if (hasErrOrWarn) {
				$t.removeClass('no_' + className);
				$t.addClass(className);
			} else {
				$t.addClass('no_' + className);
				$t.removeClass(className);
			}
		};

		updateClasses(pp.errors.length, '.update', 'error');
		updateClasses(pp.warnings.length, '.update', 'warning');
	};

	window.setInterval(update, 100);
	update();
	anyUpdate($cssIn, setFlag);
	addOptions();

	var setOptions = function (opt) {
		var $optElem = $('.option');

		for (var i in opt) {
			var v = opt[i];
			v = addslashes(v);
			$optElem.filter('#' + i).val(v);
		}
	};
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
