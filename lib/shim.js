if (! Array.prototype.every) {
	Array.prototype.every = function (callback, context) {
		var l = this.length;
		var t = Object(this);
		var keepGoing = true;

		for (var i = 0; i < l; i ++) {
			if (i in t) {
				keepGoing = callback.call(context, this[i], i, this);
				if (! keepGoing) {
					return keepGoing;
				}
			}
		}

		return keepGoing;
	};
}

if (! Array.prototype.some) {
	Array.prototype.some = function (callback, context) {
		var l = this.length;
		var t = Object(this);
		for (var i = 0; i < l; i ++) {
			if (i in t) {
				if (callback.call(context, this[i], i, this)) {
					return true;
				}
			}
		}

		return false;
	};
}

if (! Array.prototype.forEach) {
	Array.prototype.forEach = function (callback, context) {
		for (var i = 0; i < l; i ++) {
			callback.call(context, this[i], i, this);
		}
	};
}
