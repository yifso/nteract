/**
 * @module fs-kernels
 */
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

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
  resource_dir: string;
  spec: KernelSpec;
}

export interface KernelResourceByName {
  [name: string]: KernelResource;
}

function augmentKernelResources(resources: KernelResourceByName): void {
  Object.keys(resources).forEach(async name => {
    const resource = resources[name];
    resource.name = name;
    const readdir = promisify(fs.readdir);
    const files = await readdir(resource.resource_dir);
    resource.files = files
      .map(file => path.join(resource.resource_dir, file));
  });
}

/**
 * find a kernel by name
 * @param kernelName the kernel to locate
 * @return kernelResource object
 */
export async function find(kernelName: string): Promise<KernelResource> {
  return (await findAll())[kernelName];
}

/**
 * Get an array of kernelResources objects for the host environment
 * This matches the Jupyter notebook API for kernelspecs exactly
 * @return Promise for an array of kernelResources objects
 */
export async function findAll(): Promise<KernelResourceByName> {
  return new Promise((resolve, reject) => {
    exec("python3 -m jupyter kernelspec list --json", (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        const resources: KernelResourceByName = JSON.parse(stdout).kernelspecs;
        augmentKernelResources(resources);
        resolve(resources);
      }
    });
  });
}
