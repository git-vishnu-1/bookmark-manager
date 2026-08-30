const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS SOLUTION');
        res.status(200).json({
            status: 'success',
            message: 'Server and DB are alive',
            db_test: rows[0].solution
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
});

app.post('/bookmarks', async (req, res) => {
    const { url, title, description } = req.body;

    if (!url || !title) {
        return res.status(400).json({ error: 'URL and title are strictly required.' });
    }

    try {
        const query = 'INSERT INTO bookmarks (url, title, description) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [url, title, description]);
        
        res.status(201).json({
            message: 'Bookmark saved successfully',
            bookmarkId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
});

app.post('/bookmarks/:id/tags', async (req, res) => {
    const bookmarkId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Tag name is strictly required.' });
    }

    const tagName = name.toLowerCase().trim();

    try {
        await pool.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tagName]);
        
        const [tagRows] = await pool.query('SELECT id FROM tags WHERE name = ?', [tagName]);
        
        if (tagRows.length === 0) {
            return res.status(500).json({ error: 'Failed to retrieve tag ID.' });
        }
        
        const tagId = tagRows[0].id;

        await pool.query(
            'INSERT IGNORE INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)', 
            [bookmarkId, tagId]
        );
        
        res.status(201).json({
            message: 'Tag securely linked to bookmark',
            tagId: tagId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process tag' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});