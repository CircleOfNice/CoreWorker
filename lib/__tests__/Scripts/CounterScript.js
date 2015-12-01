"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _circleCoreMeta = require("@circle/core-meta");

var Increment = (function () {
    function Increment() {
        _classCallCheck(this, _Increment);

        this.counter = 0;
        this.interval = setInterval(this.increase.bind(this), 1);
    }

    _createClass(Increment, [{
        key: "increase",
        value: function increase() {
            this.counter = this.counter + 1;

            console.log("Log No. " + this.counter);
            return this.counter > 39 ? clearInterval(this.interval) : null;
        }
    }]);

    var _Increment = Increment;
    Increment = (0, _circleCoreMeta.Singleton)(Increment) || Increment;
    return Increment;
})();

Increment();

//# sourceMappingURL=CounterScript.js.map