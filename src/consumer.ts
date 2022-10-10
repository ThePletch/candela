import type { Consumer } from '@rails/actioncable';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
let consumer: Consumer;

export default () => {
  if (!consumer) {
    const { createConsumer } = require('@rails/actioncable');
    consumer = createConsumer(publicRuntimeConfig.apiWebsocketUrl);
  }

  return consumer;
};
