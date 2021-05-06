import _ from 'lodash';

export function createCableStateManager(channelName, channelParams, receivedCallback) {
    const subscriptionDict = Object.assign({
        channel: channelName
    }, channelParams)

    return App.cable.subscriptions.create(subscriptionDict, {
        received: receivedCallback,
    });
};

// sortExtractor is a function that extracts the sorting key from a record.
export function listStateReducer(currentList, receivedData, sortExtractor) {
    const existingIndex = currentList.findIndex(record => record.id === receivedData.id);

    // sort by ID by default
    sortExtractor = sortExtractor ?? (record => Number(record.id));

    const sortFn = (a, b) => {
        const sortResult = sortExtractor(a) - sortExtractor(b);

        if (sortResult == NaN) {
            console.error("NaN-causing records:", a, b)
            throw "Got NaN from sorting records, stopping JS from proceeding anyway"
        }

        return sortResult;
    };

    if (existingIndex >= 0) {
        currentList[existingIndex] = receivedData;
    } else {
        currentList.push(receivedData)
    }

    return currentList.sort(sortFn);
};
