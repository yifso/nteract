import fs from "fs";
import jp from "../src/jupyter-paths";

const execSync = require("child_process").execSync;

const actual = JSON.parse(execSync("jupyter --paths --json"));

// case-insensitive comparisons
actual.data = actual.data.filter(fs.existsSync).map(path => {
  return path.toLowerCase();
});
actual.config = actual.config.filter(fs.existsSync).map(path => {
  return path.toLowerCase();
});

describe("dataDirs", () => {
  it("returns a promise that resolves to a list of directories that exist", () => {
    return jp.dataDirs({ withSysPrefix: true }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(dirs).toStrictEqual(actual.data);
    });
  });
  it("works even in the absence of python", () => {
    jp.guessSysPrefix = jest.fn(() => null);

    var result = jp.dataDirs({ withSysPrefix: true }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(actual.data).toEqual(dirs);
      expect(actual.data.length).not.toBeLessThan(dirs.length);
    });

    jp.guessSysPrefix.mockRestore();
    return result;
  });
  it("returns a promise that resolves to a list of directories that exist", () => {
    return jp.dataDirs({ askJupyter: () => new Promise(actual) }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(dirs).toStrictEqual(actual.data);
    });
  });
  it("returns immediately with a guess by default", async () => {
    var dirs = await jp.dataDirs();
    dirs = dirs.map(dir => {
      return dir.toLowerCase();
    });
    expect(Array.isArray(dirs)).toBe(true);
    dirs.forEach(el => {
      expect(typeof el).toBe("string");
    });
    expect(dirs).toStrictEqual(actual.data);
  });
});

describe("runtimeDir", () => {
  it("returns the directory where runtime data is stored", async () => {
    expect(await jp.runtimeDir()).toEqual(actual.runtime[0]);
  });
});

describe("configDirs", () => {
  it("returns a promise that resolves to a list of directories that exist", () => {
    return jp.configDirs({ withSysPrefix: true }).then(dirs => {
      dirs = dirs.map(dir => {
        return dir.toLowerCase();
      });
      expect(Array.isArray(dirs)).toBe(true);
      dirs.forEach(el => {
        expect(typeof el).toBe("string");
      });
      expect(dirs).toStrictEqual(actual.config);
    });
  });
  it("returns a promise that resolves to a list of directories that exist", () => {
    return jp
      .configDirs({ askJupyter: () => new Promise(actual) })
      .then(dirs => {
        dirs = dirs.map(dir => {
          return dir.toLowerCase();
        });
        expect(Array.isArray(dirs)).toBe(true);
        dirs.forEach(el => {
          expect(typeof el).toBe("string");
        });
        expect(dirs).toStrictEqual(actual.config);
      });
  });
  it("returns immediately with a guess by default", async () => {
    var dirs = await jp.configDirs();
    dirs = dirs.map(dir => {
      return dir.toLowerCase();
    });
    expect(Array.isArray(dirs)).toBe(true);
    dirs.forEach(el => {
      expect(typeof el).toBe("string");
    });
    expect(dirs).toStrictEqual(actual.config);
  });
});
