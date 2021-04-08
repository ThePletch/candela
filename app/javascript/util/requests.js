function request(url, method, additionalOptions) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        method,
    };

    return fetch(url, {...defaultOptions, ...additionalOptions})
        .then(response => {
            if (!response.ok) {
                response.json().then(json => {
                    let text = "Request failed."
                    Object.keys(json).forEach(key => {
                        text += "\n" + json[key];
                    });

                    alert(text);
                });
            }
        });
}

function makePayloadRequest(url, method, participantGuid, body) {
    return request(url, method, {
        body: JSON.stringify({
            ...body,
            participant_guid: participantGuid,
        }),
    });
}

export function makeGetRequest(url, participantGuid) {
    return request(url, 'GET', {});
}

export function makePostRequest(url, participantGuid, body) {
    return makePayloadRequest(url, 'POST', participantGuid, body);
}

export function makePutRequest(url, participantGuid, body) {
    return makePayloadRequest(url, 'PUT', participantGuid, body);
}

export function makePatchRequest(url, participantGuid, body) {
    return makePayloadRequest(url, 'PATCH', participantGuid, body);
}
