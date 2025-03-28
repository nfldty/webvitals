const express = require('express');
const router = express.Router();
const {
    getMostTraffic,
    getLeastTraffic,
    getTotalSession,
    getAveragePagesPerSession,
    getLiveUsers,
    getAverageTimePerPage,
    getAverageTotalTime
} = require('../utils/metrics');

// Create a single API route to fetch all statistics for a specific user
router.get('/statistics', async (req, res) => {
    try {
        // Get userId from the query string (e.g., ?userId=id1)
        const userId = req.query.userId;  // No need to parseInt anymore, as userId is expected to be a string

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({
                error: 'Invalid userId',
                message: 'Please provide a valid userId in the query string.'
            });
        }

        // Fetch statistics for the specified user
        const mostTraffic = await getMostTraffic(userId, 1);  // Fetch the top 5 pages for the user
        const leastTraffic = await getLeastTraffic(userId, 1);  // Fetch the least 5 pages for the user
        const totalSessions = await getTotalSession(userId);
        const avgPagesPerSession = await getAveragePagesPerSession(userId);
        const liveUsers = await getLiveUsers(userId); // Assuming this function can handle userId
        const avgTotalTime = await getAverageTotalTime(userId);
        const avgTimePerPage = await getAverageTimePerPage(userId);
  
        // Combine all statistics into a single response
        const statistics = {
            mostTraffic,
            leastTraffic,
            totalSessions,
            avgPagesPerSession,
            liveUsers,
            avgTotalTime,
            avgTimePerPage
        };
  
        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);

        // Return the error message with details
        res.status(500).json({ 
            error: 'Failed to fetch statistics',
            message: error.message, // Include the error message in the response
        });
    }
});

  
module.exports = router;