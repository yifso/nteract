import map from "lang-map";

export const getLanguage = (extension: string) => {
  return map.languages(extension)[0]
}


