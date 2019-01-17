/**
 * Mocks the window object
 *
 * Jest doesn't have direct access to the window object like the browser does.
 * Mocking the window object allows Jest tests to interact with the window
 * object.
 */

// For some reason, this property does not get set above.
global.Image = global.window.Image;

// tslint:disable-next-line:no-empty
global.Range = function Range() {};

// tslint:disable-next-line:only-arrow-functions
global.Blob = function(content, options) {
  return { content, options };
};

const createContextualFragment = html => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.children[0]; // so hokey it's not even funny
};

Range.prototype.createContextualFragment = html =>
  createContextualFragment(html);

// tslint:disable-next-line:no-empty
global.window.focus = () => {};

// HACK: Polyfill that allows codemirror to render in a JSDOM env.
global.window.document.createRange = function createRange() {
  return {
    setEnd: () => {},
    setStart: () => {},
    // tslint:disable-next-line:object-literal-sort-keys
    getBoundingClientRect: () => ({ right: 0 }),
    getClientRects: () => [],
    createContextualFragment
  };
};

// HACK: To test index.js
document.querySelector = () => document.createElement("div");

process.on("unhandledRejection", (error, promise) => {
  // tslint:disable-next-line:no-console
  console.error("Unhandled promise rejection somewhere in tests");
  // tslint:disable-next-line:no-console
  console.error(error);
  // tslint:disable-next-line:no-console
  console.error(error.stack);
  // tslint:disable-next-line:no-console
  promise.catch(err => console.error("promise rejected", err));
});
