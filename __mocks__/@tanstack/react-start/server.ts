import { vi } from "vitest";

export const getRequestHeaders = vi.fn(() => new Headers());
export const setResponseStatus = vi.fn();
