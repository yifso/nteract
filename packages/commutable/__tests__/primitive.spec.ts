import { remultiline } from "../src/primitives";

describe("remultiline", () => {
    it("correctly splits strings by newline", () => {
        const testString = "this\nis\na\ntest\n";
        const multilined = remultiline(testString);
        expect(multilined).toEqual(["this\n", "is\n", "a\n", "test\n"]);
    })
})