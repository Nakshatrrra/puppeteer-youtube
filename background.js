chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.action === "search") {
        const term = message.term;
        fetch('http://localhost:3000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ term })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        return true;
    }
});
