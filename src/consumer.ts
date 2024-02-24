import type { Consumer } from '@rails/actioncable';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
let consumer: Consumer;

export default function useConsumer() {
  if (!consumer) {
    // nextjs server-side rendering will try and load actioncable server-side
    // if we don't do this lazy load. actioncable initializes and tries to fetch
    // browser constants upon import.
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const { createConsumer } = require('@rails/actioncable');
    consumer = createConsumer(publicRuntimeConfig.apiWebsocketUrl);
  }

  return consumer;
}
