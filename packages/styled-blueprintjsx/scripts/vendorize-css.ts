/**
 * This script is used to create styled-jsx css`` strings for use by components.
 *
 * One problem though -- this doesn't solve the issue of loading fonts. We still have to tackle that.
 */

import * as fs from "fs";
import * as util from "util";
import * as path from "path";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdirp = util.promisify(require("mkdirp"));

async function loadCSS(filename: string): Promise<string> {
  const rawCSS = await readFile(filename);

  const loader = require(require("styled-jsx/webpack").loader);

  const cssInJS = await new Promise<string>((resolve, reject) => {
    loader.call(
      // Abusing styled-jsx's webpack API just to get the CSS we need
      {
        query: "?type=global",
        addDependency: () => {},
        callback: (err: Error | null, data: string) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        }
      },
      rawCSS.toString()
    );
  });

  return cssInJS;
}

type Manifest = Array<{
  cssIn: string;
  jsOut: string;
}>;

async function processManifest(manifest: Manifest) {
  for (var entry of manifest) {
    console.log(`Processing CSS of ${entry.cssIn}`);
    const result = await loadCSS(entry.cssIn);
    await mkdirp(path.dirname(entry.jsOut));
    await writeFile(entry.jsOut, result);
    console.log(`Wrote CSS for ${entry.cssIn} to ${entry.jsOut}`);
  }
}

var manifest = [
  {
    cssIn: require.resolve("@blueprintjs/core/lib/css/blueprint.css"),
    jsOut: path.join(__dirname, "..", "src/vendor/blueprint-css.ts")
  },
  {
    cssIn: require.resolve("@blueprintjs/select/lib/css/blueprint-select.css"),
    jsOut: path.join(__dirname, "..", "src/vendor/blueprint-select-css.ts")
  }
];

console.log("Converting CSS to CSS-in-JS");
processManifest(manifest)
  .then(() => {
    console.log("✨");
  })
  .catch(err => {
    console.error(err);
    process.exit(3);
  });
