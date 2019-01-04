import { empty, Observable } from "rxjs";
import {
  mapTo,
  filter,
  catchError,
  map,
  mergeAll,
  toArray
} from "rxjs/operators";
import { spawn } from "spawn-rx";
import * as path from "path";
import { KernelspecInfo } from "@nteract/core";

/**
 * ipyKernelTryObservable checks for the existence of ipykernel in the environment.
 */
export function ipyKernelTryObservable(env: { prefix: string }) {
  const executable = path.join(env.prefix, "bin", "python");
  return (spawn(executable, ["-m", "ipykernel", "--version"], {
    split: true // When split is true the observable's return value is { source: 'stdout', text: '...' }
  }) as Observable<{ source: "stdout" | "stderr"; text: string }>).pipe(
    filter(x => x.source && x.source === "stdout"),
    mapTo(env),
    catchError(() => empty())
  );
}

/**
 * condaInfoObservable executes the conda info --json command and maps the
 * result to an observable that parses through the environmental informaiton.
 */
export function condaInfoObservable() {
  return spawn("conda", ["info", "--json"]).pipe(map(info => JSON.parse(info)));
}

/**
 * condaEnvsObservable will return an observable that emits the environmental
 * paths of the passed in observable.
 */
export function condaEnvsObservable(condaInfo$: Observable<any>) {
  return condaInfo$.pipe(
    map(info => {
      const envs = info.envs.map((env: string) => ({
        name: path.basename(env),
        prefix: env
      }));
      envs.push({ name: "root", prefix: info.root_prefix });
      return envs;
    }),
    map(envs => envs.map(ipyKernelTryObservable)),
    mergeAll(),
    toArray()
  );
}

/**
 * createKernelSpecsFromEnvs generates a dictionary with the supported langauge
 * paths.
 */
export function createKernelSpecsFromEnvs(envs: any) {
  const displayPrefix = "Python"; // Or R
  const languageKey = "py"; // or r

  const languageExe = "bin/python";

  const langEnvs: {
    [name: string]: KernelspecInfo["spec"] & { argv: string[] };
  } = {};

  Object.keys(envs).forEach(env => {
    const base = env.prefix;
    const exePath = path.join(base, languageExe);
    const envName = env.name;
    const name = `conda-env-${envName}-${languageKey}`;
    langEnvs[name] = {
      name,
      display_name: `${displayPrefix} [conda env:${envName}]`,
      argv: [exePath, "-m", "ipykernel", "-f", "{connection_file}"],
      language: "python"
    };
  });
  return langEnvs;
}

/**
 * condaKernelObservable generates an observable containing the supported languages
 * environmental elements.
 * @returns {Observable}  Supported language elements
 */
export function condaKernelsObservable() {
  return condaEnvsObservable(condaInfoObservable()).pipe(
    map(createKernelSpecsFromEnvs)
  );
}
