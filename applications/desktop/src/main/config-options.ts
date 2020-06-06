import { defineConfigOption } from "@nteract/mythic-configuration";

export const {
  selector: defaultKernel,
} = defineConfigOption({
  key: "defaultKernel",
  label: "Default kernel on startup",
  valuesFrom: "kernelspecs",
  defaultValue: "python3",
});

export const {
  selector: customAccelerators,
} = defineConfigOption({
  key: "accelerators",
  label: "Custom accelerators",
  defaultValue: {},
});
