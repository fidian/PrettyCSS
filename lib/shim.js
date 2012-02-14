if (! Array.prototype.every) {
	Array.prototype.every = function (callback, context) {
		var keepGoing = true;

		for (var i = 0; i < this.length; i ++) {
			keepGoing = callback.call(context, this[i], i, this);
			if (! keepGoing) {
				return keepGoing;
			}
		}

		return keepGoing;
	};
}

if (! Array.prototype.forEach) {
	Array.prototype.forEach = function (callback, context) {
		for (var i = 0; i < this.length; i ++) {
			callback.call(context, this[i], i, this);
		}
	};
}
