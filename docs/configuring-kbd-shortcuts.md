# Customizing keyboard shortcuts

The nteract desktop app supports overriding the default keymappings defining in [the keyboard shortcuts documentation](./kbd-shortcuts) using nteract's [configuration system](./desktop-config).

In order to configure your own keyboard shortcuts, you will need to ensure that you have created an `nteract.json` file in the `~/.jupyter` directory on your machine. The nteract desktop app will look for custom keyboard shortcut mappings under the `keyboardShortcuts` property in this file.

```
{
    "keyboardShortcuts": {
        // Your keyboard shortcut mappings here
    }
}
```

Keyboard shortcut mappings are defined in a key-value pair where the key is the shortcut name and the value is an [Electron-supported keyboard accelerator](https://www.electronjs.org/docs/api/accelerator).

```
{
    "keyboardShortcuts": {
        "new": "CmdOrCtrl+M",
        "newCodeCellBelow": "CmdOrCtrl+Shift+J"
  }
}
```

The table below outlines all the available configurations and their defaults.

| Action                 | Default Keyboard Shortcut    |
| ---------------------- | ---------------------------- |
| `new`                  | <kbd>CmdOrCtrl+N</kbd>       |
| `open`                 | <kbd>CmdOrCtrl+O</kbd>       |
| `save`                 | <kbd>CmdOrCtrl+S</kbd>       |
| `saveAs`               | <kbd>CmdOrCtrl+Shift+S</kbd> |
| `publish`              | None                         |
| `exportPDF`            | None                         |
| `selectAll`            | <kbd>CmdOrCtrl+A</kbd>       |
| `newCodeCellAbove`     | <kbd>CmdOrCtrl+Shift+A</kbd> |
| `newCodeCellBelow`     | <kbd>CmdOrCtrl+Shift+B</kbd> |
| `newTextCellBelow`     | None                         |
| `copyCell`             | <kbd>CmdOrCtrl+Shift+C</kbd> |
| `cutCell`              | <kbd>CmdOrCtrl+Shift+X</kbd> |
| `pasteCell`            | <kbd>CmdOrCtrl+Shift+V</kbd> |
| `deleteCell`           | <kbd>CmdOrCtrl+Shift+D</kbd> |
| `changeToCodeCell`     | <kbd>CmdOrCtrl+Shift+Y</kbd> |
| `changeToMarkdownCell` | <kbd>CmdOrCtrl+Shift+M</kbd> |
| `runAllCells`          | None                         |
| `runAllCellsBelow`     |                              |
| `clearAllOutputs`      | None                         |
| `expandContents`       | None                         |
| `killKernel`           | None                         |
| `interruptKernel`      | None                         |
| `restartKernel`        | None                         |
| `restartAndRunAll`     | None                         |
| `restartAndClearAll`   | None                         |

When configuring custom keyboard shortcuts, remember:

- You can have keyboard shortcuts that don't need modifiers like <kbd>Cmd</kbd> and <kbd>Alt</kbd> but you'll need to make sure that you are not focused on any cell editors before using the keyboard shortcuts (typically by pressing <kbd>Esc</kbd>).
- Be sure that the keyboard shortcuts you define don't conflict with any other keyboard shortcuts.
- Keyboard shortcuts must be configured before the nteract application is launched.
