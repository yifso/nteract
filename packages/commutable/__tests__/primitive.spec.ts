import { remultiline } from "../src/primitives";

describe("remultiline", () => {
    it("correctly splits strings by newline", () => {
        const testString = "this\nis\na\ntest\n";
        const multilined = remultiline(testString);
        expect(multilined).toBe(["this ", " is ", " a ", " test "]);
    })
})