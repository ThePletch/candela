import { type FunctionComponent } from 'react';

import '@candela/stylesheets/application.scss';

type AppProps<T> = {
  Component: FunctionComponent<T>;
  pageProps: T;
};

export default function MyApp<T>({ Component, pageProps }: AppProps<T>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}
