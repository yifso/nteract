/* tslint:disable:no-empty no-console only-arrow-functions */

/**
 * Mocks the window object
 *
 * Jest doesn't have direct access to the window object like the browser does.
 * We mock / fake implement properties on the window object because JSDOM either
 * does not support them or has only a partial implementation.
 */

const globalAny:any = global;

// For some reason, this property does not get set above.
globalAny.Image = globalAny.window.Image;

globalAny.Range = function Range(): void {};

globalAny.Blob = function(content: any[], options: object): any {
  return { content, options };
};

/**
 * Mock jQuery to allow jupyter-widgets tests to run.
 */
import $ from "jquery";
globalAny.$ = globalAny.jQuery = $;
require("jquery-ui");
require("jquery-ui/ui/widget");
require("jquery-ui/ui/widgets/mouse");

const createContextualFragment = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  // Element and DocumentFragment are technically incompatible
  return (div.children[0] as unknown) as DocumentFragment; // so hokey it's not even funny
};

Range.prototype.createContextualFragment = (html: string) =>
  createContextualFragment(html);

globalAny.window.URL.createObjectURL = function(): void {};
globalAny.window.focus = () => {};

// HACK: Polyfill that allows codemirror to render in a JSDOM env.
globalAny.window.document.createRange = function createRange() {
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

process.on("unhandledRejection", (error:any, promise) => {
  console.error("Unhandled promise rejection somewhere in tests");
  console.error(error);
  console.error(error.stack);
  promise.catch(err => console.error("promise rejected", err));
});

// HACK: To avoid error of NotImplemented in vega tests
HTMLCanvasElement.prototype.getContext = jest.fn();
