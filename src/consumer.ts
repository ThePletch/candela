import { createConsumer } from "@rails/actioncable";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default createConsumer(publicRuntimeConfig.apiWebsocketUrl);
