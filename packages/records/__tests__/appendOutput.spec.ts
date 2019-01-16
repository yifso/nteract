import appendOutput, { mutate } from "../src/outputs/append-output";

describe("appendOutput", () => {
  test("puts new outputs at the end by default", () => {
    const outputs = [
      { output_type: "stream", name: "stdout", text: "Woo" },
      {
        output_type: "error",
        ename: "well",
        evalue: "actually",
        traceback: []
      }
    ];
    const newOutputs = appendOutput(outputs, {
      output_type: "display_data",
      data: {},
      metadata: {}
    });

    expect(newOutputs).toEqual([
      { output_type: "stream", name: "stdout", text: "Woo" },
      {
        output_type: "error",
        ename: "well",
        evalue: "actually",
        traceback: []
      },
      {
        output_type: "display_data",
        data: {},
        metadata: {}
      }
    ]);
  });

  test("handles the case of a single stream output", () => {
    const outputs = [{ name: "stdout", text: "hello", output_type: "stream" }];
    const newOutputs = appendOutput(outputs, {
      name: "stdout",
      text: " world",
      output_type: "stream"
    });

    expect(newOutputs).toEqual([
      { name: "stdout", text: "hello world", output_type: "stream" }
    ]);
  });

  test("merges streams of text", () => {
    let outputs = [];

    outputs = appendOutput(outputs, {
      name: "stdout",
      text: "hello",
      output_type: "stream"
    });

    expect(outputs).toEqual([
      { name: "stdout", text: "hello", output_type: "stream" }
    ]);
  });

  test("keeps respective streams together", () => {
    const outputs = [
      { name: "stdout", text: "hello", output_type: "stream" },
      { name: "stderr", text: "errors are", output_type: "stream" }
    ];
    const newOutputs = appendOutput(outputs, {
      name: "stdout",
      text: " world",
      output_type: "stream"
    });

    expect(newOutputs).toEqual([
      { name: "stdout", text: "hello world", output_type: "stream" },
      { name: "stderr", text: "errors are", output_type: "stream" }
    ]);

    const evenNewerOutputs = appendOutput(newOutputs, {
      name: "stderr",
      text: " informative",
      output_type: "stream"
    });

    expect(evenNewerOutputs).toEqual([
      { name: "stdout", text: "hello world", output_type: "stream" },
      {
        name: "stderr",

        text: "errors are informative",
        output_type: "stream"
      }
    ]);
  });

  test("outputs are actually immutable now", () => {
    const outputs = [
      { output_type: "stream", name: "stdout", text: "Woo" },
      {
        output_type: "error",
        ename: "well",
        evalue: "actually",
        traceback: []
      }
    ];

    const newOutputs = appendOutput(outputs, {
      output_type: "display_data",
      data: {},
      metadata: {}
    });

    expect(() => {
      newOutputs[0] = { output_type: "stream", name: "stdout", text: "Boo" };
    }).toThrow(
      "Cannot assign to read only property '0' of object '[object Array]'"
    );
  });

  test("outputs are appended and mutable", () => {
    const outputs = [
      { output_type: "stream", name: "stdout", text: "Woo" },
      {
        output_type: "error",
        ename: "well",
        evalue: "actually",
        traceback: []
      }
    ];

    const newOutputs = mutate.appendOutput(outputs, {
      output_type: "display_data",
      data: {},
      metadata: {}
    });

    newOutputs[0] = { output_type: "stream", name: "stdout", text: "Boo" };

    expect(newOutputs).toEqual([
      { output_type: "stream", name: "stdout", text: "Boo" },
      {
        output_type: "error",
        ename: "well",
        evalue: "actually",
        traceback: []
      },
      {
        output_type: "display_data",
        data: {},
        metadata: {}
      }
    ]);
  });
});
