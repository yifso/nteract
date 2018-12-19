import jp from "./jupyter-paths";
import path from "path";
import fs from "fs";
import { promisify } from "util";

type KernelInfo = {
  name: string;
  resourceDir: string;
};

export type KernelSpec = {
  display_name: string;
  argv: string[];
  language: string;
  env?: { [varialbe: string]: string };
};

type KernelResource = {
  name: string;
  files: string[];
  resources_dir: string;
  spec: KernelSpec;
};

export type KernelResourceByName = { [name: string]: KernelResource };

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
        name: kernelInfo.name,
        files: files.map(x => path.join(kernelInfo.resourceDir, x)),
        resources_dir: kernelInfo.resourceDir, // eslint-disable-line camelcase
        spec: data instanceof Buffer ? data.toJSON() : JSON.parse(data)
      })
    );
  });
}

/**
 * Gets a list of kernelInfo objects for a given directory of kernels
 * @param  {string}   directory path to a directory full of kernels
 * @return {Promise<Object[]>}  Promise for an array of kernelInfo objects
 */
function getKernelInfos(directory: string): Promise<KernelInfo[]> {
  const readdir = promisify(fs.readdir);
  return readdir(directory).then((files: string[]) =>
    files.map(fileName => ({
      name: fileName,
      resourceDir: path.join(directory, fileName)
    }))
  );
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
    const kernelInfoPromises = dirs
      .map(async dir => await getKernelInfos(path.join(dir, "kernels")))
      .flat();
    const kernelInfos = await Promise.all(kernelInfoPromises);
    return extractKernelResources(kernelInfos);
  } catch (error) {
    throw error;
  }
}
