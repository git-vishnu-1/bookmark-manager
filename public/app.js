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