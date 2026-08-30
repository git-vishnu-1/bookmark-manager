async function loadBookmarks() {
    const container = document.getElementById('resultsContainer');
    try {
        const response = await fetch('/bookmarks');
        const data = await response.json();
        
        if (data.data.length === 0) {
            container.innerHTML = '<p>No bookmarks saved yet.</p>';
            return;
        }

        container.innerHTML = data.data.map(bookmark => `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <h3 style="margin: 0 0 5px 0;"><a href="${bookmark.url}" target="_blank">${bookmark.title}</a></h3>
                <p style="margin: 0 0 5px 0;">${bookmark.description || 'No description'}</p>
                <small style="color: #555;">Tags: ${bookmark.tags || 'None'}</small>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Failed to load bookmarks.</p>';
    }
}

loadBookmarks();

document.getElementById('bookmarkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('url').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const statusText = document.getElementById('statusMessage');
    
    try {
        const response = await fetch('/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, title, description })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            statusText.innerText = `Success: ${data.message}`;
            document.getElementById('bookmarkForm').reset();
        } else {
            statusText.innerText = `Error: ${data.error}`;
        }
    } catch (error) {
        statusText.innerText = 'Failed to connect to the server.';
    }
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    const container = document.getElementById('resultsContainer');

    if (!query) {
        container.innerHTML = '<p style="color: red;">Please enter a search term.</p>';
        return;
    }

    container.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`/bookmarks/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
            container.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
            return;
        }

        if (data.results === 0) {
            container.innerHTML = '<p>No bookmarks found.</p>';
            return;
        }

        const htmlElements = data.data.map(bookmark => `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <h3 style="margin: 0 0 5px 0;"><a href="${bookmark.url}" target="_blank">${bookmark.title}</a></h3>
                <p style="margin: 0 0 5px 0;">${bookmark.description || 'No description'}</p>
                <small style="color: #555;">Tags: ${bookmark.tags || 'None'}</small>
            </div>
        `).join('');

        container.innerHTML = htmlElements;
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Search failed. Check server connection.</p>';
    }
});