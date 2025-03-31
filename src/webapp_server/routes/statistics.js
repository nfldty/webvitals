const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prismaClient');
const { applyFilters } = require('../utils/filter'); // Filter function for SESSIONS
// Removed unused metric functions for filtered route as calculations are now inline
// const { getMostTraffic, ... } = require('../utils/metrics');


// Route to fetch overall statistics for a specific user (Unchanged - assumes metrics functions handle filtering or no filtering needed)
router.get('/statistics', async (req, res) => {
    // This route appears to rely on the functions from '../utils/metrics'
    // Make sure those functions correctly handle potential 'req.query' filters if needed
    // or are only intended for non-filtered stats. We leave this route as is based on current structure.
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId', message: 'Please provide a valid userId.' });
        }
        // Lazy-load metric functions only if needed or make sure they exist
        const metrics = require('../utils/metrics');

        const mostTraffic = await metrics.getMostTraffic(userId, 1, req.query);
        const leastTraffic = await metrics.getLeastTraffic(userId, 1, req.query);
        const totalSessions = await metrics.getTotalSession(userId, req.query);
        const avgPagesPerSession = await metrics.getAveragePagesPerSession(userId, req.query);
        const liveUsers = await metrics.getLiveUsers(userId, req.query);
        const avgTotalTime = await metrics.getAverageTotalTime(userId, req.query);
        const clickStatistics = await metrics.getClickStatistics(userId, req.query);
        const avgTimePerPage = await metrics.getAverageTimePerPage(userId, req.query);
        const extraData = await metrics.getExtraData(userId, req.query);

        res.json({
            mostTraffic,
            leastTraffic,
            totalSessions,
            avgPagesPerSession,
            liveUsers,
            avgTotalTime,
            clickStatistics,
            avgTimePerPage,
            extraData
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
    }
});


// --- Other routes (sessions, events) remain unchanged ---
router.get('/sessions', async (req, res) => {
    try {
      const userId = req.query.userId; // userId is expected to be a string
      if (!userId) {
        return res.status(400).json({
          error: 'Invalid userId',
          message: 'Please provide a valid userId in the query string.'
        });
      }
      const sessions = await prisma.session.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' }
      });
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({
        error: 'Failed to fetch sessions',
        message: error.message,
      });
    }
  });


  router.get('/sessions/:sessionId/events', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        return res.status(400).json({
          error: 'Invalid sessionId',
          message: 'Please provide a valid sessionId.'
        });
      }
      const mouseMovements = await prisma.mouseMovement.findMany({
        where: { sessionId: sessionId }
      });
      const mouseClicks = await prisma.mouseClick.findMany({
        where: { sessionId: sessionId }
      });
      const movementEvents = mouseMovements.map(m => ({
        type: 'mousemove',
        x: m.xCoord,
        y: m.yCoord,
        timestamp: new Date(m.createdAt).getTime()
      }));
      const clickEvents = mouseClicks.map(c => ({
        type: 'click',
        x: c.xCoord,
        y: c.yCoord,
        timestamp: new Date(c.createdAt).getTime()
      }));
      const events = [...movementEvents, ...clickEvents].sort((a, b) => a.timestamp - b.timestamp);
      res.json(events);
    } catch (error) {
      console.error('Error fetching session events:', error);
      res.status(500).json({
        error: 'Failed to fetch session events',
        message: error.message,
      });
    }
  });


module.exports = router;