/**
 * @module fs-kernels
 */
import fs from "fs";
import path from "path";
import { promisify } from "util";
import jp from "./jupyter-paths";

interface KernelInfo {
  name: string;
  resourceDir: string;
}

export interface KernelSpec {
  display_name: string;
  argv: string[];
  language: string;
  env?: { [varialbe: string]: string };
}

interface KernelResource {
  name: string;
  files: string[];
  resources_dir: string;
  spec: KernelSpec;
}

export interface KernelResourceByName {
  [name: string]: KernelResource;
}

function flatten(array: any[]) {
  return [].concat(...array);
}

/**
 * Get a kernel resources object
 * @param  {Object}   kernelInfo              description of a kernel
 * @param  {string}   kernelInfo.name         name of the kernel
 * @param  {string}   kernelInfo.resourceDir  kernel's resources directory
 * @return {Promise<Object>}                  Promise for a kernelResources object
 */
function getKernelResources(kernelInfo: KernelInfo): Promise<KernelResource> {
  const readdir = promisify(fs.readdir);
  return readdir(kernelInfo.resourceDir).then((files: string[]) => {
    const kernelJSONIndex = files.indexOf("kernel.json");
    if (kernelJSONIndex === -1) {
      throw new Error("kernel.json not found");
    }

    const readFile = promisify(fs.readFile);
    return readFile(path.join(kernelInfo.resourceDir, "kernel.json")).then(
      (data: string | Buffer) => ({
        files: files.map(x => path.join(kernelInfo.resourceDir, x)),
        name: kernelInfo.name,
        resources_dir: kernelInfo.resourceDir,
        spec:
          data instanceof Buffer
            ? JSON.parse(data.toString())
            : JSON.parse(data)
      })
    );
  });
}

/**
 * Gets a list of kernelInfo objects for a given directory of kernels
 * @param  {string}   directory         path to a directory full of kernels
 * @param  {boolean}  [mustExist=false] does the directory have to exist?
 * @return {Promise<Object[]>}          Promise for an array of kernelInfo objects
 */
function getKernelInfos(
  directory: string,
  mustExist: boolean = false
): Promise<KernelInfo[]> {
  const readdir = promisify(fs.readdir);
  return readdir(directory)
    .then((files: string[]) => {
      return files.map(fileName => ({
        name: fileName,
        resourceDir: path.join(directory, fileName)
      }));
    })
    .catch(error => {
      if (!mustExist && error.code === "ENOENT") {
        return [];
      }
      throw error;
    });
}

/**
 * find a kernel by name
 * @param  {string} kernelName the kernel to locate
 * @return {Object} kernelResource object
 */
export function find(kernelName: string) {
  return jp
    .dataDirs({ withSysPrefix: true })
    .then(dirs => {
      const kernelInfos: KernelInfo[] = dirs.map(dir => ({
        name: kernelName,
        resourceDir: path.join(dir, "kernels", kernelName)
      }));

      return extractKernelResources(kernelInfos);
    })
    .then((kernelResource: KernelResourceByName) => kernelResource[kernelName]);
}

async function extractKernelResources(
  kernelInfos: KernelInfo[]
): Promise<KernelResourceByName> {
  try {
    const kernelResources = await Promise.all(
      kernelInfos
        .filter(a => a) // remove null/undefined kernelInfo
        .reduce((a: KernelInfo[], b: KernelInfo) => a.concat(b), []) // flatten the results into one array
        .map(a => getKernelResources(a))
    );
    return kernelResources
      .filter(a => a) // remove null/undefined kernelResources
      .reduce((kernels: KernelResourceByName, kernel: KernelResource) => {
        if (!kernels[kernel.name]) {
          kernels[kernel.name] = kernel;
        }
        return kernels;
      }, {});
  } catch (error) {
    throw error;
  }
}

/**
 * Get an array of kernelResources objects for the host environment
 * This matches the Jupyter notebook API for kernelspecs exactly
 * @return {Promise<Object<string,kernelResource>} Promise for an array of kernelResources objects
 */
export async function findAll() {
  try {
    const dirs = await jp.dataDirs({ withSysPrefix: true });
    const kernelInfoPromises = flatten(
      dirs.map(async dir => await getKernelInfos(path.join(dir, "kernels")))
    );
    const kernelInfos = await Promise.all(kernelInfoPromises);
    return extractKernelResources(kernelInfos);
  } catch (error) {
    throw error;
  }
}
