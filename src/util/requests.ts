export type RequestPayloadMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type RequestMethod = 'GET' | RequestPayloadMethod;

export function request(
  url: string,
  method: RequestMethod,
  guid: string,
  additionalOptions: RequestInit = {},
) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Participation-Guid': guid,
    },
    credentials: 'include',
    method,
  };

  return fetch(url, { ...defaultOptions, ...additionalOptions }).catch(
    (response: unknown) => {
      if (response instanceof Response) {
        response.json().then((json) => {
          let text = 'Request failed.';
          Object.keys(json).forEach((key) => {
            text += `\n${json[key]}`;
          });

          alert(text);
          throw new Error(text);
        });
      }
      throw new Error('Unknown error.');
    },
  );
}

export function makePayloadRequest(
  url: string,
  method: RequestPayloadMethod,
  guid: string,
  body: Record<string, unknown>,
) {
  return request(url, method, guid, {
    body: JSON.stringify(body),
  });
}

export function makeGetRequest(url: string, guid: string) {
  return request(url, 'GET', guid, {});
}

export function makePostRequest(
  url: string,
  guid: string,
  body: Record<string, unknown>,
) {
  return makePayloadRequest(url, 'POST', guid, body);
}

export function makePutRequest(
  url: string,
  guid: string,
  body: Record<string, unknown>,
) {
  return makePayloadRequest(url, 'PUT', guid, body);
}

export function makePatchRequest(
  url: string,
  guid: string,
  body: Record<string, unknown>,
) {
  return makePayloadRequest(url, 'PATCH', guid, body);
}
