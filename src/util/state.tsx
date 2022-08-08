import _ from "lodash";
import { type ReactElement, useState } from "react";

import consumer from "consumer";
import { makePayloadRequest, type RequestPayloadMethod } from "util/requests";

export function useHttpState(
  url: string,
  method: RequestPayloadMethod,
  body?: Record<string, unknown>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = (overrideBody?: Record<string, unknown>) => {
    setLoading(true);
    return makePayloadRequest(url, method, overrideBody || body || {})
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { loading, error, makeRequest };
}

export function listStateReducer<T>(
  currentList: T[],
  receivedData: T,
  getIdentifier: (item: T) => number
): T[] {
  const existingIndex = currentList.findIndex(
    (record) => getIdentifier(record) === getIdentifier(receivedData)
  );

  const sortFn = (a: T, b: T) => {
    const sortResult = getIdentifier(a) - getIdentifier(b);

    if (sortResult == NaN) {
      console.error("NaN-causing records:", a, b);
      throw "Got NaN from sorting records, stopping JS from proceeding anyway";
    }

    return sortResult;
  };

  if (existingIndex >= 0) {
    currentList[existingIndex] = receivedData;
  } else {
    currentList.push(receivedData);
  }

  return currentList.sort(sortFn);
}

export function withSingletonSubscription<T>(
  channel: string,
  props: Record<string, unknown>,
  thunk: (record: T) => ReactElement
): ReactElement {
  const [record, setRecord] = useState<T | null>(null);
  consumer.subscriptions.create(
    { channel, ...props },
    {
      received: setRecord,
    }
  );

  if (record !== null) {
    return thunk(record);
  }

  return <p>Loading...</p>;
}

export function withListSubscription<T>(
  channel: string,
  props: Record<string, unknown>,
  getIdentifier: (record: T) => number,
  thunk: (records: T[]) => ReactElement
): ReactElement {
  const [records, setRecords] = useState<T[] | null>(null);
  consumer.subscriptions.create(
    { channel, ...props },
    {
      received: (record: T) => {
        setRecords(listStateReducer(records || [], record, getIdentifier));
      },
    }
  );

  if (records !== null) {
    return thunk(records);
  }

  return <p>Loading...</p>;
}

export function withModelListSubscription<T extends { id: number }>(
  channel: string,
  props: Record<string, unknown>,
  thunk: (records: T[]) => ReactElement
): ReactElement {
  return withListSubscription(channel, props, (record) => record.id, thunk);
}
