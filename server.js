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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});