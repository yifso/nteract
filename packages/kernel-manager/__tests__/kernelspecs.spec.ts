import { findAll } from "../src/kernelspecs";

describe("findAll", () => {
  it("retrieves a collection of kernel specs", () => {
    return findAll().then(kernelspecs => {
      expect(kernelspecs).toHaveProperty("python3");
      expect(kernelspecs).toHaveProperty("python2");

      const defaultKernel = kernelspecs.python2 || kernelspecs.python3;

      expect(defaultKernel).toHaveProperty("spec");
      expect(defaultKernel).toHaveProperty("resources_dir");

      const spec = defaultKernel.spec;

      expect(spec).toHaveProperty("display_name");
      expect(spec).toHaveProperty("argv");
    });
  });
});
