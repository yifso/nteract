export const getLanguage =  (extention: string) =>  {
      let language = "markdown"
      
      switch( extention.toLowerCase() ) {
          case "pyc":
          case "py":
            language = "python"
          break;
          case "jsx":
          case "ts":
          case "tsx":
          case "json":
          case "js":
            language = "javascript"
          break;
          case "md":
             language = "markdown"
          break;
          case "c":
            language = "c"
          case "cpp":
            language = "c++"
          break;
          case "cs":
            language = "cs#"
          break;
          case "yaml":
          case "yml":
            language = "yaml"
          break;
          case "proto":
            language = "protobuf"
          break;
          case "go":
            language = "go"
          break;
          case "html":
            language = "html"
          case "css": 
            language = "css"
          break;
          break;
          case "jl":
            language = "julia"
          break;
          case "sql":
            language = "sql"
          break;
          case "r":
            language = "r"
          case "makefile":
            language = "cmake"
          case "sh":
            language = "bash"
      }
      
      console.log(language) 
      return language
  }

