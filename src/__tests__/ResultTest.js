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

import Result from "../Result";
import assert from "assert";

describe("Result", function() {
    it("creates a new Result", function() {
        const result1 = Result.create(null);
        const result2 = Result.create("test");

        assert.deepStrictEqual(result1, Result({ data: null }), "Result should handle null-input");
        assert.deepStrictEqual(result2, Result({ data: "test" }), "Result should handle string-input");
        assert.throws(Result.create.bind(null, ["test"]), TypeError, "Result should only handle string || null");
    });
});
