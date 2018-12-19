import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { homedir } from "os";

let sysPrefixGuess: string | null | undefined = undefined;

type JupyterPaths = {
  config: string[];
  runtime: string;
  data: string[];
};

function home(subDir?: string) {
  const baseDir = homedir();
  return subDir ? path.join(baseDir, subDir) : baseDir;
}

function accessCheck(d: fs.PathLike) {
  // check if a directory exists and is listable (X_OK)
  if (!fs.existsSync(d)) return false;
  try {
    fs.accessSync(d, fs.constants.X_OK);
  } catch (e) {
    // [WSA]EACCES
    return false;
  }
  return true;
}

function guessSysPrefix() {
  // inexpensive guess for sysPrefix based on location of `which python`
  // based on shutil.which from Python 3.5

  // only run once:
  if (sysPrefixGuess !== undefined) return sysPrefixGuess;

  var PATH = (process.env.PATH || "").split(path.delimiter);
  if (PATH.length === 0) {
    sysPrefixGuess = null;
    return;
  }

  var pathext = [""];
  if (process.platform === "win32") {
    pathext = (process.env.PATHEXT || "").split(path.delimiter);
  }

  PATH.some(bin => {
    bin = path.resolve(bin);
    var python = path.join(bin, "python");

    return pathext.some(
      (ext: string): boolean => {
        var exe = python + ext;
        if (accessCheck(exe)) {
          // PREFIX/bin/python exists, return PREFIX
          // following symlinks
          if (process.platform === "win32") {
            // Windows: Prefix\Python.exe
            sysPrefixGuess = path.dirname(fs.realpathSync(exe));
          } else {
            // Everywhere else: prefix/bin/python
            sysPrefixGuess = path.dirname(path.dirname(fs.realpathSync(exe)));
          }
          return true;
        }
        return false;
      }
    );
  });
  if (sysPrefixGuess === undefined) {
    // store null as nothing found, but don't run again
    sysPrefixGuess = null;
  }
  return sysPrefixGuess;
}

var askJupyterPromise: Promise<JupyterPaths> | null = null;

function askJupyter() {
  // ask Jupyter where the paths are
  if (!askJupyterPromise) {
    askJupyterPromise = new Promise((resolve, reject) => {
      exec("jupyter --paths --json", (err, stdout) => {
        if (err) {
          console.warn("Failed to ask Jupyter about its paths: " + err);
          reject(err);
        } else {
          resolve(JSON.parse(stdout.toString().trim()));
        }
      });
    });
  }
  return askJupyterPromise;
}

function systemConfigDirs() {
  var paths = [];
  // System wide for Windows and Unix
  if (process.platform === "win32") {
    const defaultProgramDataPath = "C:ProgramData";
    paths.push(
      path.resolve(
        path.join(process.env.PROGRAMDATA || defaultProgramDataPath, "jupyter")
      )
    );
  } else {
    paths.push("/usr/local/etc/jupyter");
    paths.push("/etc/jupyter");
  }
  return paths;
}

async function configDirs(opts?: {
  askJupyter?: () => Promise<JupyterPaths>;
  withSysPrefix?: boolean;
}): Promise<string[]> {
  if (opts && opts.askJupyter) {
    try {
      const paths = await askJupyter();
      return paths.config;
    } catch {
      return configDirs();
    }
  }

  var paths = [];
  if (process.env.JUPYTER_CONFIG_DIR) {
    paths.push(process.env.JUPYTER_CONFIG_DIR);
  }

  paths.push(home(".jupyter"));
  const systemDirs = systemConfigDirs();

  if (opts && opts.withSysPrefix) {
    return new Promise<string[]>((resolve, reject) => {
      // deprecated: withSysPrefix expects a Promise
      // but no change in content
      resolve(configDirs());
    });
  }
  // inexpensive guess, based on location of `python` executable
  var sysPrefix = guessSysPrefix() || "/usr/local/";
  var sysPathed = path.join(sysPrefix, "etc", "jupyter");
  if (systemDirs.indexOf(sysPathed) === -1) {
    paths.push(sysPathed);
  }
  return paths.concat(systemDirs);
}

function systemDataDirs() {
  var paths = [];
  // System wide for Windows and Unix
  if (process.platform === "win32") {
    const defaultProgramDataPath = "C:ProgramData";
    paths.push(
      path.resolve(
        path.join(process.env.PROGRAMDATA || defaultProgramDataPath, "jupyter")
      )
    );
  } else {
    paths.push("/usr/local/share/jupyter");
    paths.push("/usr/share/jupyter");
  }
  return paths;
}

/**
 * where the userland data directory resides
 * includes things like the runtime files
 * @return {string} directory for data
 */
function userDataDir() {
  // Userland specific
  if (process.platform === "darwin") {
    return home("Library/Jupyter");
  } else if (process.platform === "win32") {
    const defaultAppDataPath = home("AppData");
    return path.resolve(
      path.join(process.env.APPDATA || defaultAppDataPath, "jupyter")
    );
  }
  return process.env.XDG_DATA_HOME || home(".local/share/jupyter");
}

/**
 * dataDirs returns all the expected static directories for this OS.
 * The user of this function should make sure to make sure the directories
 * exist.
 *
 * When withSysPrefix is set, this returns a promise of directories
 *
 * @param  {bool} withSysPrefix include the sys.prefix paths
 * @return {Array} All the Jupyter Data Dirs
 */
async function dataDirs(opts?: {
  askJupyter?: () => Promise<JupyterPaths>;
  withSysPrefix?: boolean;
}): Promise<string[]> {
  if (opts && opts.askJupyter) {
    try {
      const paths = await askJupyter();
      return paths.data;
    } catch (error) {
      return dataDirs();
    }
  }

  var paths = [];
  if (process.env.JUPYTER_PATH) {
    paths.push(process.env.JUPYTER_PATH);
  }

  paths.push(userDataDir());

  const systemDirs = systemDataDirs();

  if (opts && opts.withSysPrefix) {
    return new Promise<string[]>((resolve, reject) => {
      // deprecated: withSysPrefix expects a Promise
      // but no change in content
      resolve(dataDirs());
    });
  }
  // inexpensive guess, based on location of `python` executable
  var sysPrefix = guessSysPrefix();
  if (sysPrefix) {
    var sysPathed = path.join(sysPrefix, "share", "jupyter");
    if (systemDirs.indexOf(sysPathed) === -1) {
      paths.push(sysPathed);
    }
  }
  return paths.concat(systemDirs);
}

async function runtimeDir(opts?: {
  askJupyter?: () => Promise<JupyterPaths>;
}): Promise<string> {
  if (opts && opts.askJupyter) {
    try {
      const paths = await askJupyter();
      return paths.runtime;
    } catch (error) {
      return runtimeDir();
    }
  }

  if (process.env.JUPYTER_RUNTIME_DIR) {
    return process.env.JUPYTER_RUNTIME_DIR;
  }

  if (process.env.XDG_RUNTIME_DIR) {
    return path.join(process.env.XDG_RUNTIME_DIR, "jupyter");
  }
  return path.join(userDataDir(), "runtime");
}

export default { dataDirs, runtimeDir, configDirs, guessSysPrefix };
