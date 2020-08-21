import map from "lang-map";
import { useState } from "react";

export const getLanguage = (extension: string) => {
  return map.languages(extension)[0]
}

export const useInput = (val: string | undefined) => {
  const [value, setValue] = useState(val);

  function handleChange(e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) {
    setValue(e.currentTarget.value);
  }

  return {
    value,
    onChange: handleChange
  }
}

export const useCheckInput = (val: boolean | undefined) => {
  const [value, setValue] = useState(val);

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setValue(e.currentTarget.checked);
  }

  return {
    value,
    onChange: handleChange
  }
}

