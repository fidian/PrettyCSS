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

		$cssOut.removeClass('error');
		var pp = prettycss.parse(content, options);
		$cssOut.val(pp.toString());
	};

	window.setInterval(update, 100);
	anyUpdate($cssIn, setFlag);
	addOptions();
	anyUpdate($('.option'), setFlagForce);
});

$(function () {
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
		opt.ruleset_post = "\n";
		opt.at_post = "\n";
		opt.important = "!important";
		setOptions(opt);
		return false;
	});
	$('#presetDefault').click(function () {
		setOptions(defaultOptions());
		return false;
	});
});

$(function () {
	$('#tabs').tabs();
});
