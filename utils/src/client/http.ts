import { ResourceNotFoundError, UnauthorizedError, ValidationError } from "../api";

export const BaseUrl = process.env.NODE_ENV === "production" ? new URL(process.env.NEXT_PUBLIC_APP_URL!) : new URL("http://localhost:3000");

export async function getStoredToken() {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
}

type MethodType = "GET" | "POST" | "PUT" | "DELETE";

type QueryParams = { [k: string]: any };

export interface QueryAsOptions {
  params?: QueryParams
}

export interface QueryPostOptions extends QueryAsOptions {
  bodyAsJson?: boolean;
  body?: any;
}

function formatUrl(uri: string, { params }: QueryAsOptions) {
  const url = new URL(uri, BaseUrl);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v) {
        const value = (typeof v === "object")
            ? JSON.stringify(v)
            : v.toString();
        url.searchParams.append(k, value);
      }
    }
  }
  return url.toString();
}

export async function get<T>(uri: string, options: QueryAsOptions = {}): Promise<T> {
  return fetchAndCheckAs<T>("GET", uri, options);
}

export async function getAsString(uri: string, options: QueryAsOptions = {}): Promise<string> {
  const response = await fetchAndCheck("GET", uri, options);
  return response.text();
}

export async function putAs<T>(uri: string, options: QueryPostOptions = {}): Promise<T> {
  return fetchAndCheckAs<T>("PUT", uri, options);
}

export async function postAs<T>(uri: string, options: QueryPostOptions = {}): Promise<T> {
  return fetchAndCheckAs<T>("POST", uri, options);
}

export async function remove(uri: string, options: QueryPostOptions = {}) {
  return fetchAndCheck("DELETE", uri, options);
}

export function post(uri: string, options: QueryPostOptions = {}) {
  return fetchAndCheck("POST", uri, options);
}

async function fetchAndCheckAs<T>(method: MethodType, uri: string, options: QueryPostOptions = {}): Promise<T> {
  const response = await fetchAndCheck(method, uri, options);
  return response.json();
}

function formatBody(body?: any, bodyAsJson: boolean = true) {
  if (!body) {
    return null;
  }
  if (bodyAsJson) {
    return JSON.stringify(body);
  }
  return body;
}

async function fetchAndCheck(method: MethodType, uri: string, options: QueryPostOptions = {}) {
  const { body, bodyAsJson } = options;
  const response = await fetch(formatUrl(uri, options), {
    headers: await headers(body, bodyAsJson),
    method,
    body: formatBody(body, bodyAsJson)
  });
  if (response.status !== 200 && response.status !== 201) {
    switch (response.status) {
      case 400:
        const json = await response.json();
        throw new ValidationError(json?.errors || {});
      case 404:
        throw new ResourceNotFoundError(await response.text());
      case 401:
      case 403:
        throw new UnauthorizedError();
      default:
        throw new Error(await response.text());
    }
  }
  return response;
}

async function headers(body?: any, bodyAsJson: boolean = true) {
  const h = new Headers();
  const token = await getStoredToken();
  if (token) {
    h.append("Authorization", `Bearer ${token}`);
  }
  if (body && bodyAsJson) {
    h.append("Content-Type", "application/json");
  }
  return h;
}
