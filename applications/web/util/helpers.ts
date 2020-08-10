import map from "lang-map";

export const getLanguage =  (extension: string) =>  {
    return map.languages(extension)[0]
  }


export const getPath = (params) => {
    const filepathSegments = params.slice(4);
    let filepath;
    if (typeof filepathSegments !== "string") {
      filepath = filepathSegments.join("");
    } else {
      filepath = filepathSegments;
    }

    return filepath
  }

