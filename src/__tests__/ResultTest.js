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
