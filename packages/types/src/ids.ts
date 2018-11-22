export type HostId = string;
export type KernelId = string;
export type SessionId = string;
export type CellId = string;

export const castToHostId = (id: string): HostId => id;
export const castToKernelId = (id: string): KernelId => id;
export const castToSessionId = (id: string): SessionId => id;
export const castToCellId = (id: string): CellId => id;