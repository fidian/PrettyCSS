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

		if (token) {
			message += " (" + token.type + ", line " + token.line + ")";
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
		var opt = $('<div />');
		opt.append($('<span class="optionLabel" />').text(i + ":")).append(inp);
		$dest.append(opt);
	}
}

function addslashes(v) {
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
	var force = false;
	var setFlag = function () {
		dirty = true;
	};
	var setFlagForce = function () {
		dirty = true;
		force = true;
	};
	var update = function () {
		if (! dirty) {
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

		if (pp.errors) {
			$cssOut.addClass('error');
		} else {
			$cssOut.removeClass('error');
		}
	};

	window.setInterval(update, 100);
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
		setOptions(opt);
		setFlagForce();
		return false;
	});
	$('#presetDefault').click(function () {
		setOptions(defaultOptions());
		setFlagForce();
		return false;
	});
});

$(function () {
	$('#tabs').tabs();
});
