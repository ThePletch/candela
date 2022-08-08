export type RequestMethod = "GET" | RequestPayloadMethod;
export type RequestPayloadMethod = "POST" | "PATCH" | "PUT" | "DELETE";

export function request(
  url: string,
  method: RequestMethod,
  additionalOptions: RequestInit = {}
) {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method,
  };

  return fetch(url, { ...defaultOptions, ...additionalOptions }).catch(
    (response: unknown) => {
      if (response instanceof Response) {
        response.json().then((json) => {
          let text = "Request failed.";
          Object.keys(json).forEach((key) => {
            text += "\n" + json[key];
          });

          alert(text);
          throw new Error(text);
        });
      }
      throw new Error("Unknown error.");
    }
  );
}

export function makePayloadRequest(
  url: string,
  method: RequestPayloadMethod,
  body: Record<string, unknown>
) {
  return request(url, method, {
    body: JSON.stringify(body),
  });
}

export function makeGetRequest(url: string) {
  return request(url, "GET", {});
}

export function makePostRequest(url: string, body: Record<string, unknown>) {
  return makePayloadRequest(url, "POST", body);
}

export function makePutRequest(url: string, body: Record<string, unknown>) {
  return makePayloadRequest(url, "PUT", body);
}

export function makePatchRequest(url: string, body: Record<string, unknown>) {
  return makePayloadRequest(url, "PATCH", body);
}
