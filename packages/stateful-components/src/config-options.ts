import { createConfigOption } from "@nteract/mythic-configuration";

export const {
  selector: userTheme,
} = createConfigOption({
  key: "theme",
  label: "Theme",
  values: [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ],
  defaultValue: "light",
});
