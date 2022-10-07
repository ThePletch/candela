import { type FunctionComponent, useEffect } from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
import '@candela/stylesheets/application.scss';

type AppProps<T> = {
  Component: FunctionComponent<T>,
  pageProps: T,
}

export default function MyApp<T>({ Component, pageProps }: AppProps<T>) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return <Component {...pageProps} />
}
