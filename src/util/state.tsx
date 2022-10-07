import _ from "lodash";
import getConfig from 'next/config';
import {
  createContext,
  type Context,
  type ReactElement, useContext, useEffect, useReducer, useState } from "react";

import consumer from "consumer";
import { makePayloadRequest, type RequestPayloadMethod } from "util/requests";

export function useHttpState<T = void>(
  path: string,
  method: RequestPayloadMethod,
  body?: Record<string, unknown>
) {
  const { publicRuntimeConfig } = getConfig();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<T | null>(null);

  const makeRequest = async (overrideBody?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const rawResponse = await makePayloadRequest(`${publicRuntimeConfig.apiUrl}/${path}`, method, overrideBody || body || {})
      const json = await rawResponse.json();
      if (rawResponse.status >= 400) {
        throw new Error(json);
      }
      setResponse(json);
      return json;
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        console.error("NON-ERROR", e);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, makeRequest, response };
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

  let newList: T[];

  if (existingIndex >= 0) {
    newList = [...currentList];
    newList[existingIndex] = receivedData;
  } else {
    newList = [...currentList, receivedData];
  }

  return newList.sort(sortFn);
}

export const GUID_STORAGE_KEY = 'participationGuid' as const;

type SyncConfirmationMessage = { synchronized: true };

type SubscriptionMessage<T> = T | SyncConfirmationMessage;

type SubscriptionState<T, LoadingType = T> = {
  record: T;
  loading: false;
} | {
  record: LoadingType;
  loading: true;
};

type SubscriptionReducer<T, LoadingType, ParcelType = T> = (
  currentState: SubscriptionState<T, LoadingType>,
  newParcel: SubscriptionMessage<ParcelType>,
) => SubscriptionState<T, LoadingType>;

export function Subscription<T, LoadingType, ParcelType = T>(props: {
  channel: string;
  params?: Record<string, unknown>;
  context: Context<SubscriptionState<T, LoadingType>>;
  initialValue: LoadingType;
  reducerFn: SubscriptionReducer<T, LoadingType, ParcelType>,
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [guid, setGuid] = useState<string | null>(null);

  useEffect(() => {
    setGuid(localStorage.getItem(GUID_STORAGE_KEY));
  });

  const paramsAndGuid = {
    ...(props.params || {}),
    guid,
  };

  const [state, updateState] = useReducer(props.reducerFn, {
    loading: true,
    record: props.initialValue,
  });

  useEffect(() => {
    consumer.subscriptions.create(
      {
        ...paramsAndGuid,
        channel: props.channel,
      },
      {
        connected: console.log,
        received: (parcel: SubscriptionMessage<ParcelType>) => {
          updateState(parcel);
        },
        disconnected: console.error,
        rejected: console.error,
      },
    );
  }, [guid]);

  if (!guid) {
    return <em>Waiting for ID...</em>;
  }

  return <props.context.Provider value={state}>
    {props.children}
  </props.context.Provider>;
}

export type SingletonState<T> = SubscriptionState<T, null>;
export type SingletonContext<T> = Context<SingletonState<T>>;

export function createSingletonContext<T>() {
  return createContext<SingletonState<T>>({
    record: null,
    loading: true,
  });
}

export function SingletonSubscription<T>(
  props: {
    channel: string;
    params?: Record<string, unknown>;
    context: SingletonContext<T>;
    children: ReactElement | ReactElement[];
  },
): ReactElement {
  return Subscription<T, null>({
    ...props,
    initialValue: null,
    reducerFn: (state, parcel) => {
      if ('synchronized' in parcel) {
        console.log(`Synchronized with channel ${props.channel}.`);
        return state;
      }

      return {
        loading: false,
        record: parcel,
      };
    },
  });
}

export type ListState<T> = SubscriptionState<T[]>;
export type ListContext<T> = Context<ListState<T>>;

export function createListContext<T>() {
  return createContext<ListState<T>>({
    record: [],
    loading: true,
  });
}

export function ListSubscription<T>(
  props: {
    getIdentifier: (record: T) => number;
    channel: string;
    params?: Record<string, unknown>;
    context: ListContext<T>;
    children: ReactElement | ReactElement[];
  },
): ReactElement {
  return Subscription<T[], T[], T>({
    ...props,
    initialValue: [],
    reducerFn: (state, message) => {
      if ('synchronized' in message) {
        return {
          ...state,
          loading: false,
        };
      }

      return {
        ...state,
        record: listStateReducer(state.record, message, props.getIdentifier),
      };
    },
  });
}

export function ModelListSubscription<T extends { id: number }>(
  props: {
    channel: string;
    params?: Record<string, unknown>;
    context: ListContext<T>;
    children: ReactElement | ReactElement[];
  }
): ReactElement {
  return ListSubscription<T>({
    ...props,
    getIdentifier: (record) => record.id,
  });
}

export function useSubscriptionContext<T, LoadingType>(context: Context<SubscriptionState<T, LoadingType>>, loadingMsg: string, thunk: (record: T) => ReactElement): ReactElement {
  const {
    record,
    loading,
  } = useContext(context);

  if (loading) {
    return <em>{loadingMsg}</em>;
  }

  return thunk(record);
}
