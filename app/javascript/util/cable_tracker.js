import _ from 'lodash';

export function createCableStateManager(channelName, channelParams, receivedCallback) {
    const subscriptionDict = Object.assign({
        channel: channelName
    }, channelParams)

    return App.cable.subscriptions.create(subscriptionDict, {
        received: receivedCallback,
    });
};

export function listStateReducer(currentList, receivedData) {
    const existingIndex = currentList.findIndex(record => record.id === receivedData.id);

    if (existingIndex >= 0) {
        currentList[existingIndex] = receivedData;
    } else {
        currentList.push(receivedData)
    }

    return currentList;
};
