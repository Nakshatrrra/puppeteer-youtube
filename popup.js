document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value;

        chrome.permissions.request({
            origins: ['http://localhost/', 'https://localhost/']
        }, function(granted) {
            if (granted) {
                fetch('http://localhost:3000/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ term: searchTerm })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    displayResults(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    showError("Failed to fetch data. Please try again later.");
                });
            } else {
                showError("Permission not granted. You can manually adjust permissions in extension settings.");
            }
        });
    });


});

function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(function() {
        errorElement.style.display = 'none';
    }, 5000);
}

function displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; 
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        const thumbnailElement = document.createElement('img');
        thumbnailElement.src = result.thumbnail;
        thumbnailElement.classList.add('thumbnail');

        const titleElement = document.createElement('a');
        titleElement.textContent = result.title;
        titleElement.href = 'https://www.youtube.com' + result.url;
        titleElement.target = '_blank';
        titleElement.classList.add('title-link');

        resultItem.appendChild(thumbnailElement);
        resultItem.appendChild(titleElement);

        resultsContainer.appendChild(resultItem);
    });
}

