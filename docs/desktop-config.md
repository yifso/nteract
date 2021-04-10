# Configuring the nteract desktop app

The nteract desktop app cconfigurations use a JSON-based `nteract.json` file. Place the `nteract.json` file in the Jupyter config directory. To find the location of the Jupyter config directory on your system, run the `jupyter --paths` command.

```
$ jupyter --paths
    /Users/me/.jupyter
    /usr/local/etc/jupyter
    /etc/jupyter
```

Create the JSON file with the code below.

```
$ touch /Users/me/.jupyter/nteract.json
```

## Configurable options

The nteract desktop application supports the configuration options in the table below.

| Config Option      | Example                                  | Description                                                                                   |
| ------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `"theme" `           | `"theme": "dark"`                        | Sets the default theme of the nteract desktop app, either `"light"` (default) or `"dark"` |
| `"autoSaveInterval"` | `"autoSaveInterval": 1000`             | Frequency for saving notebook document in milliseconds, set to `0` to disable autoSave        |
| `"codeMirror"`       | `"codeMirror": { "lineNumbers" : true }` | Set of options for configuring the CodeMirror editor in the nteract desktop app             |

## Example configurations

The code below displays an `nteract.json` file that sets the default theme to the `dark` theme and disables auto-save.

```
{
    "theme": "dark",
    "autoSaveInterval": 0
}
```

This configuration example customizes the CodeMirror editor in the nteract desktop app.

```
{
    "codeMirror": {
        "matchBrackets": true,
        "autoCloseBrackets": 4,
        "cursorBlinkRate" 500
    }

}
```
