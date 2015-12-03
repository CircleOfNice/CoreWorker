/* Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 *
 * This file is part of CoreWorker.
 *
 * CoreWorker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CoreWorker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with CoreWorker.  If not, see <http://www.gnu.org/licenses/>.
 */

import Validator from "../Validator";
import assert from "assert";
import Result from "../Result.type";

describe("Validator", function() {
    it("creates a new Validator out of a String", function() {
        const filter = Validator.create("match me");
        const data   = "Check If This match me";

        assert(filter.validate("Check If This match me"), "Should match String");
        assert.deepStrictEqual(filter.getResult(data), Result({ data: null }), "Should be equal to input");
        assert(!filter.validate("This shouldnt match."), "Shouldn't match String");
    });

    it("creates a new Validator out of a RegExp", function() {
        const filter   = Validator.create(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/);

        assert(filter.validate("New URL: http://www.google.de"), "Should return true");
        assert.deepStrictEqual(filter.getResult("New URL: http://www.google.de"), Result({ data: "http://www.google.de" }), "Should match Url");
        assert(!filter.validate("Numbers like 1,2,3 are not allowed."), "Shouldn't match String");
    });

    it("creates a new Validator out of a Function", function() {
        const search = value => value === "search";
        const filter = Validator.create(search);

        assert(filter.validate("search"), "Should match given String");
        assert.deepStrictEqual(filter.getResult("search me or not"), Result({ data: null }), "Should return input");
        assert(!filter.validate("Numbers like 1,2,3 are not allowed."), "Shouldn't match String");
    });

    it("throws an Error, if wrong condition is given", function() {
        assert.throws(Validator.create.bind(null, {}), TypeError);
        assert.throws(Validator.create.bind(null, []), TypeError);
    });
});
