// routes/statistics.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prismaClient');
const { getMostTraffic } = require('../utils/metrics');

// Function to get all mouse coordinates with their counts for a specific user
async function getMouseCoordinates(userId) {
    try {
        const mouseMovements = await prisma.mouseMovement.groupBy({
            by: ['xCoord', 'yCoord'], // Group by x and y coordinates
            where: {
                userId: userId, // Filter by userId
            },
            _count: {
                id: true, // Count the number of occurrences of each coordinate pair
            },
        });

        // Format the result into [{x:, y:, value: }]
        const formattedResult = mouseMovements.map((movement) => ({
            x: movement.xCoord,
            y: movement.yCoord,
            value: movement._count.id, // Count of occurrences of this (x, y) pair
        }));

        return formattedResult;
    } catch (error) {
        console.error('Error fetching mouse coordinates:', error);
        throw new Error('Failed to fetch mouse coordinates');
    }
}


// Create a single API route for fetching heatmap data (mouse coordinates)
router.get('/heatmap', async (req, res) => {
    try {
        const userId = req.query.userId;
        // Validate if userId is provided
        if (!userId) {
            return res.status(400).json({
                error: 'Invalid userId',
                message: 'Please provide a valid userId in the query string.',
            });
        }
        // let url = await getMostTraffic(userId, 1);
        // if (!url) {
        //     return res.status(400).json({
        //         error: 'Invalid userId',
        //         message: 'Please provide a valid userId in the query string.',
        //     });
        // }
        // url = url[0].pageUrl;

        // Fetch the mouse coordinates for the specified user
        const mouseCoordinates = await getMouseCoordinates(userId);

        // Return the heatmap data
        res.json({ mouseCoordinates,
        });
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        res.status(500).json({
            error: 'Failed to fetch heatmap data',
            message: error.message,
        });
    }
});

module.exports = router;
