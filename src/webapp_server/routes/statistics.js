const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prismaClient');
const { applyFilters } = require('../utils/filter'); // Import our corrected filter function
const {
    getMostTraffic,
    getLeastTraffic,
    getTotalSession,
    getAveragePagesPerSession,
    getLiveUsers,
    getAverageTimePerPage,
    getAverageTotalTime,
    getClickStatistics,
    getExtraData
} = require('../utils/metrics');

// Route to fetch overall statistics for a specific user
router.get('/statistics', async (req, res) => {
    try {
        const userId = req.query.userId; // userId is expected to be a string

        if (!userId) {
            return res.status(400).json({
                error: 'Invalid userId',
                message: 'Please provide a valid userId in the query string.'
            });
        }

        const mostTraffic = await getMostTraffic(userId, 5);
        const leastTraffic = await getLeastTraffic(userId, 5);
        const totalSessions = await getTotalSession(userId);
        const avgPagesPerSession = await getAveragePagesPerSession(userId);
        const liveUsers = await getLiveUsers(userId);
        const avgTotalTime = await getAverageTotalTime(userId);
        const clickStatistics = await getClickStatistics(userId);
        const avgTimePerPage = await getAverageTimePerPage(userId);
        const extraData = await getExtraData(userId);

        const statistics = {
            mostTraffic,
            leastTraffic,
            totalSessions,
            avgPagesPerSession,
            liveUsers,
            avgTotalTime,
            clickStatistics,
            avgTimePerPage,
            extraData
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ 
            error: 'Failed to fetch statistics',
            message: error.message,
        });
    }
});

// Route to get filtered statistics for a specific user
router.get('/filteredStatistics', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({
                error: 'Invalid userId',
                message: 'Please provide a valid userId in the query string.'
            });
        }
  
        // Build a base query for sessions
        let baseQuery = { where: { userId } };
  
        // Apply filters to the sessions query using our corrected function
        const filteredSessionQuery = applyFilters(baseQuery, req.query);
  
        // Total sessions with filters applied
        const totalSessions = await prisma.session.count(filteredSessionQuery);
  
        // For page visits, build a separate query and apply filters
        const pageVisitBaseQuery = { where: { userId } };
        const filteredPageVisitQuery = applyFilters(pageVisitBaseQuery, req.query);
        const totalPages = await prisma.pageVisit.count(filteredPageVisitQuery);
  
        const avgPagesPerSession = totalSessions === 0 ? 0 : totalPages / totalSessions;
  
        // Most traffic: group page visits by pageUrl using filtered conditions
        const mostTraffic = await prisma.pageVisit.groupBy({
            by: ['pageUrl'],
            where: filteredPageVisitQuery.where,
            _count: { pageUrl: true },
            orderBy: { _count: { pageUrl: 'desc' } },
            take: 1,
        });
  
        // Least traffic:
        const leastTraffic = await prisma.pageVisit.groupBy({
            by: ['pageUrl'],
            where: filteredPageVisitQuery.where,
            _count: { pageUrl: true },
            orderBy: { _count: { pageUrl: 'asc' } },
            take: 1,
        });
  
        // Live users: check sessions with recent mouse movements
        const sessions = await prisma.session.findMany(filteredSessionQuery);
        let liveUsers = 0;
        for (const session of sessions) {
            const latestMovement = await prisma.mouseMovement.findFirst({
                where: { sessionId: session.id },
                orderBy: { createdAt: 'desc' }
            });
            if (latestMovement && (new Date() - new Date(latestMovement.createdAt)) / 1000 < 300) {
                liveUsers++;
            }
        }
  
        // Average total time (from timeSpent records with filters)
        const timeSpentBaseQuery = { where: { userId } };
        const filteredTimeSpentQuery = applyFilters(timeSpentBaseQuery, req.query);
        const timeRecords = await prisma.timeSpent.findMany(filteredTimeSpentQuery);
        let totalTime = 0;
        timeRecords.forEach(record => {
            totalTime += record.elapsedTime;
        });
        const avgTotalTime = timeRecords.length === 0 ? 0 : totalTime / timeRecords.length;
  
        // Average time per page for visits where leftAt is not null
        const pageVisitTimeBaseQuery = { 
            where: { 
                userId,
                leftAt: { not: null }
            }
        };
        const filteredPageVisitTimeQuery = applyFilters(pageVisitTimeBaseQuery, req.query);
        const pageVisits = await prisma.pageVisit.findMany(filteredPageVisitTimeQuery);
        let totalTimePerPage = 0;
        pageVisits.forEach(visit => {
            const timeSpent = new Date(visit.leftAt) - new Date(visit.visitedAt);
            totalTimePerPage += timeSpent;
        });
        const avgTimePerPage = pageVisits.length === 0 ? 0 : (totalTimePerPage / pageVisits.length) / 1000;
  
        const statistics = {
            totalSessions,
            avgPagesPerSession,
            mostTraffic,
            leastTraffic,
            liveUsers,
            avgTotalTime,
            avgTimePerPage,

        };
  
        res.json(statistics);
    } catch (error) {
        console.error('Error fetching filtered statistics:', error);
        res.status(500).json({
            error: 'Failed to fetch filtered statistics',
            message: error.message,
        });
    }
});

module.exports = router;
