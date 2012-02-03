exports.setOptions = function () {
	var options = {
		fileEncoding: "utf-8"
	};

	for (var argIndex = 0; argIndex < arguments.length; argIndex ++) {
		if (arguments[argIndex]) {
			for (var name in arguments[argIndex]) {
				options[name] = arguments[argIndex][name];
			}
		}
	}

	return options;
};
