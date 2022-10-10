import type { Subscription as CableSubscription } from '@rails/actioncable';
import _ from 'lodash';
import getConfig from 'next/config';
import {
  type Context,
  type ReactElement,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import consumer from '@candela/consumer';
import type { ListContext, SingletonContext } from '@candela/util/contexts';
import {
  makePayloadRequest,
  type RequestPayloadMethod,
} from '@candela/util/requests';

export type HttpState<T> = {
  loading: boolean;
  error: Error | null;
  makeRequest: (overrideBody?: Record<string, unknown>) => Promise<T>;
  response: T | null;
};

export function useHttpState<T = void>(
  path: string,
  method: RequestPayloadMethod,
  guid: string,
  body?: Record<string, unknown>,
): HttpState<T> {
  const { publicRuntimeConfig } = getConfig();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<T | null>(null);

  const makeRequest = async (overrideBody?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const rawResponse = await makePayloadRequest(
        `${publicRuntimeConfig.apiUrl}/${path}`,
        method,
        guid,
        overrideBody || body || {},
      );
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
        console.error('NON-ERROR', e);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading, error, makeRequest, response,
  };
}

export function listStateReducer<T>(
  currentList: T[],
  receivedData: T,
  getIdentifier: (item: T) => number,
): T[] {
  const existingIndex = currentList.findIndex(
    (record) => getIdentifier(record) === getIdentifier(receivedData),
  );

  const sortFn = (a: T, b: T) => {
    const sortResult = getIdentifier(a) - getIdentifier(b);

    if (Number.isNaN(sortResult)) {
      console.error('NaN-causing records:', a, b);
      throw new Error('Got NaN while sorting records. Responsible records logged to console.');
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

type SyncConfirmationMessage = { synchronized: true };

type SubscriptionMessage<T> = T | SyncConfirmationMessage;

type SubscriptionState<T, LoadingType = T> =
  | {
    record: T;
    loading: false;
  }
  | {
    record: LoadingType;
    loading: true;
  };

type SubscriptionReducer<T, LoadingType, ParcelType = T> = (
  currentState: SubscriptionState<T, LoadingType>,
  newParcel: SubscriptionMessage<ParcelType>
) => SubscriptionState<T, LoadingType>;

type GuidParam = { guid: string };

type SubscriptionProps<T, LoadingType, ParcelType> = {
  channel: string;
  params: Record<string, unknown> & GuidParam;
  context: Context<SubscriptionState<T, LoadingType>>;
  initialValue: LoadingType;
  reducerFn: SubscriptionReducer<T, LoadingType, ParcelType>;
  children: ReactElement | ReactElement[];
};

export function Subscription<T, LoadingType, ParcelType = T>({
  channel,
  params,
  context,
  reducerFn,
  initialValue,
  children,
}: SubscriptionProps<T, LoadingType, ParcelType>): ReactElement {
  const [state, updateState] = useReducer(reducerFn, {
    loading: true,
    record: initialValue,
  });

  const [subscription, setSubscription] = useState<CableSubscription | null>(
    null,
  );

  useEffect(() => {
    if (subscription !== null) {
      console.warn(
        'Subscribing to channel while subscription already defined.',
      );
      console.warn(subscription);
    }

    console.debug(channel, params);

    setSubscription(
      consumer().subscriptions.create(
        {
          ...params,
          channel,
        },
        {
          connected: console.warn,
          received: updateState,
          disconnected: console.error,
          rejected: console.error,
        },
      ),
    );

    // sometimes a subscription param will change, e.g. loading an
    // ID from a cache. when that happens, we want to unsub from the old
    // subscription before we sub to the new one.
    return () => {
      subscription?.unsubscribe();
      setSubscription(null);
    };
  }, [channel, params]);

  const ContextProvider = context.Provider;

  return (
    <ContextProvider value={state}>
      {children}
    </ContextProvider>
  );
}

export type SingletonState<T> = SubscriptionState<T, null>;

export function SingletonSubscription<T>(props: {
  channel: string;
  params: Record<string, unknown> & GuidParam;
  context: SingletonContext<T>;
  children: ReactElement | ReactElement[];
}): ReactElement {
  return Subscription<T, null>({
    ...props,
    initialValue: null,
    reducerFn: (state, parcel) => {
      if ('synchronized' in parcel) {
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

export function ListSubscription<T>(props: {
  getIdentifier: (record: T) => number;
  channel: string;
  params: Record<string, unknown> & GuidParam;
  context: ListContext<T>;
  children: ReactElement | ReactElement[];
}): ReactElement {
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

export function ModelListSubscription<T extends { id: number }>(props: {
  channel: string;
  params: Record<string, unknown> & GuidParam;
  context: ListContext<T>;
  children: ReactElement | ReactElement[];
}): ReactElement {
  return ListSubscription<T>({
    ...props,
    getIdentifier: (record) => record.id,
  });
}

type ContextList = {
  [K: string]: {
    loadingMessage: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: Context<SubscriptionState<any, any>>;
  };
};

type ContextMapping<T extends ContextList> = {
  [K in keyof T]: T[K]['context'] extends Context<infer State> ? State : null;
};

type RecordMapping<T extends ContextList> = {
  [K in keyof T]: ContextMapping<T>[K] extends SubscriptionState<
  infer RecordType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
  >
    ? RecordType
    : null;
};

type FullyLoadedRecords<T extends ContextList> = {
  loadingMessages: Record<string, never>;
  records: RecordMapping<T>;
};

type RecordsAndLoading<T extends ContextList> =
  | FullyLoadedRecords<T>
  | {
    loadingMessages: {
      [K in keyof T]: string;
    };
    records: Record<string, never>;
  }
  | {
    loadingMessages: {
      [K in keyof T]?: string;
    };
    records: Partial<RecordMapping<T>>;
  };

function recordsAllLoaded<T extends ContextList>(
  recordsAndLoading: RecordsAndLoading<T>,
): recordsAndLoading is FullyLoadedRecords<T> {
  return _.isEmpty(recordsAndLoading.loadingMessages);
}

export function useSubscriptionContexts<T extends ContextList>(
  contexts: T,
  thunk: (records: RecordMapping<T>) => ReactElement | null,
): ReactElement | null {
  const recordsAndLoading = Object.entries(contexts).reduce<RecordsAndLoading<T>>(
    (acc, [key, contextInfo]) => {
      const context = useContext(contextInfo.context);
      if (context.loading) {
        return {
          ...acc,
          loadingMessages: {
            ...acc.loadingMessages,
            [key]: contexts[key].loadingMessage,
          },
        } as RecordsAndLoading<T>;
      }

      return {
        ...acc,
        records: {
          ...acc.records,
          [key]: context.record,
        },
      } as RecordsAndLoading<T>;
    },
    {
      loadingMessages: {},
      records: {},
    },
  );

  if (recordsAllLoaded(recordsAndLoading)) {
    return thunk(recordsAndLoading.records);
  }

  return (
    <ul>
      {Object.entries(recordsAndLoading.loadingMessages).map(([k, message]) => (
        <li key={k}>
          <em>{message}</em>
        </li>
      ))}
    </ul>
  );
}

export function useSubscriptionContext<T, LoadingType>(
  context: Context<SubscriptionState<T, LoadingType>>,
  loadingMessage: string,
  thunk: (record: T) => ReactElement | null,
): ReactElement | null {
  return useSubscriptionContexts(
    {
      main: {
        loadingMessage,
        context,
      },
    },
    (contextMapping) => thunk(contextMapping.main as T),
  );
}
