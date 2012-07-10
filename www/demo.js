$(function () {
	var optionMeta = {
	};

	function addOptions() {
		var options = defaultOptions();
		$dest = $('#optionWrapper');
		for (var i in options) {
			var v = options[i];
			v = slashAdd(v);
			var inp = $('<input type="text" name="' + i + '" id="' + i + '" class="option"/>').val(v);
			var opt = $('<div class="optionWrapper" />');
			opt.append(inp);
			opt.append($('<div class="optionLabel" />').text(i + ":"));
			opt.append($('<div class="optionClear" />'));
			$dest.append(opt);
		}
	}

	function anyUpdate($target, func) {
		$target.change(func).keypress(func).keyup(func).keydown(func);
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

		var detailTagShow = $('<span class="detailTag" />').text('[ Show Details ]');
		var detailTagHide = $('<span class="detailTag hidden" />').text('[ Hide Details ]');
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
		return v;
	}

	function slashRemove(v) {
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

	window.setInterval(update, 100);
	update();
	anyUpdate($cssIn, setFlag);
	addOptions();

	var setOptions = function (opt) {
		var $optElem = $('.option');

		for (var i in opt) {
			var v = opt[i];
			v = slashAdd(v);
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
