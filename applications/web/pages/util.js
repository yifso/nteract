function getFilePath(params){
    const filepathSegments = params.slice(4);
    let filepath;
    if (typeof filepathSegments !== "string") {
      filepath = filepathSegments.join("");
    } else {
      filepath = filepathSegments;
    }
  
    return filepath
  }

  function getFileType(type){
    if (type == "file")
      return "file"
    else if (type =="dir")
      return "directory"
  }



exports.getFilePath = getFilePath
exports.getFileType = getFileType

