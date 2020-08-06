export const getLanguage =  (extension: string) =>  {
      let language = "markdown"
      
      switch( extension.toLowerCase() ) {
          case "pyc":
          case "py":
            language = "python"
          break;
          case "jl":
            language = "julia"
          break;
         case "r":
            language = "r"
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
          break;
          case "css": 
            language = "css"
          break;
          case "sql":
            language = "sql"
          break;
          case "makefile":
            language = "cmake"
          break;
          case "sh":
            language = "bash"
          break;
      }
      
      return language
  }

