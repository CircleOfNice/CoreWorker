/*
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
 *
 * Copyright 2016 TeeAge-Beatz UG (haftungsbeschränkt)
 */

import TimeoutError from "../TimeoutError";
import assert from "assert";

describe("TimeoutError", function() {
    it("creates a new TimeoutError without a null argument", function(done) {
        /* eslint-disable */
        try {
        /* eslint-ensable */
            throw TimeoutError.create(null);
            done(new Error("TimeoutError should have been caught"));
        } catch(err) {
            assert.equal("Timeout exceeded.", err.message);
            done();
        }
    });

    it("creates a new TimeoutError with a non null argument", function(done) {
        /* eslint-disable */
        try {
        /* eslint-enable */
            throw TimeoutError.create("Foobar");
            done(new Error("Error should have been caught"));
        } catch(err) {
            assert.equal("Timeout exceeded. Last process output is: Foobar", err.message);
            done();
        }
    });

    it("creates a new TimeoutError with a non null but empty argument", function(done) {
        /* eslint-disable */
        try {
        /* eslint-enable */
            throw TimeoutError.create("");
            done(new Error("Error should have been caught"));
        } catch(err) {
            assert.equal("Timeout exceeded.", err.message);
            done();
        }
    });
});
