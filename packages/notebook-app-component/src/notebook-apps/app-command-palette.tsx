import React from "react";
import {
  CommandPalette as Palette,
  CommandButtonRow,
  CommandPaletteProps,
  Icons,
} from "@nteract/presentational-components";

interface Props {
  isVisible: boolean;
}
export default class CommandPalette extends React.Component<Props> {
  render() {
    const { isVisible } = this.props;

    return (
      <Palette
        placeholder="Filter commands"
        onChange={() => console.log("filter commands")}
        shortCut={["⌘", "M"]}
        isVisible={isVidible}
      >
        <CommandButtonRow
          onClick={() => console.log("Run Cell")}
          shortCut={["Shift", "Enter"]}
        >
          <Icons.Play /> Run Cell
        </CommandButtonRow>
        <CommandButtonRow
          onClick={() => console.log("Add Cell Below")}
          shortCut={["Shift", "M"]}
        >
          <Icons.AddCell below={false} />
          Add Cell Below
        </CommandButtonRow>
        <CommandButtonRow
          onClick={() => console.log("Add Cell Above")}
          shortCut={["Shift", "Backspace"]}
        >
          <Icons.AddCell />
          Add Cell Above
        </CommandButtonRow>
        <CommandButtonRow
          onClick={() => console.log("Convert to Markdown")}
          shortCut={["⌘", "M"]}
        >
          <Icons.Markdown />
          Convert to Markdown
        </CommandButtonRow>
        <CommandButtonRow
          onClick={() => console.log("Hide Output")}
          shortCut={["Shift", "O"]}
        >
          <Icons.Eye />
          Hide Output
        </CommandButtonRow>
        <CommandButtonRow
          onClick={() => console.log("Hide Input")}
          shortCut={["Shift", "I"]}
        >
          <Icons.Eye />
          Hide Input
        </CommandButtonRow>
      </Palette>
    ) : null;
  }
}
