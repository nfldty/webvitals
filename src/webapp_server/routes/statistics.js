const express = require('express');
const { getAveragePagesPerSession, getAverageTimePerPage, getAverageTotalTime, getLiveUsers, getTotalSession, getLeastTraffic, getMostTraffic } = require('../utils/metrics');
const router = express.Router();

router.post('/statistics', async (req, res) => {
    try {
      const mostTraffic = await getMostTraffic(5);  // Fetch the top 5 pages
      const leastTraffic = await getLeastTraffic(5);  // Fetch the least 5 pages
      const totalSessions = await getTotalSession();
      const avgPagesPerSession = await getAveragePagesPerSession();
      const liveUsers = await getLiveUsers();
      const avgTimePerPage = await getAverageTimePerPage();
      const totalAvgTime = await getAverageTotalTime();
  
      // Combine all statistics into a single response
      const statistics = {
        mostTraffic,
        leastTraffic,
        totalSessions,
        avgPagesPerSession,
        liveUsers,
        avgTimePerPage,
        totalAvgTime,
      };
      res.json(statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Failed to fetch statistics', details: error.message });
    }
  });




// // Function to get pages with the most traffic
// export async function getMostTraffic(takeNum){
//   try {
//       const result = await prisma.pageVisit.groupBy({
//           by: ['pageUrl'],
//           _count: {pageUrl: true},
//           orderBy: {_count:{ pageUrl:'desc'}},
//           take: takeNum,
//       });    
//       return result;
//   } catch (error) {
//       console.error('Error fetching most traffic pages:', error);
//       throw error;
//     }
// }

// // Function to get pages with the least traffic
// export async function getLeastTraffic(takeNum){
//   try {
//       const result = await prisma.pageVisit.groupBy({
//           by: ['pageUrl'],
//           _count:{pageUrl: true},
//           orderBy: {_count: {pageUrl: 'asc'}},
//           take: takeNum,
//       });
//       return result;
//   } catch (error) {
//       console.error('Error fetching least traffic pages:', error);
//       throw error;
//     }
// }

// // Function to get total sessions 
// export async function getTotalSession() {
//   try {
//       const result = await prisma.session.count();
//       return result;
//   } catch (error) {
//       console.error('Error fetching total sessions:', error);
//       throw error;
//   }
// }

// // Function to get average pages per session
// export async function getAveragePagesPerSession() {
//   try {
//       const totalPages = await prisma.pageVisit.count();
//       const totalSessions = await prisma.session.count();
//       const averagePagesPerSession = totalSessions === 0 ? 0 : totalPages / totalSessions;
//       return averagePagesPerSession;
//   } catch (error) {
//       console.error('Error fetching average pages per session:', error);
//       throw error;
//   }
// }
// // current live users (check timestamp)
// export async function getLiveUsers(){
//   try {
//       const liveSessions = await prisma.session.findMany({
//           where: {
//               endTime: null,
//           },
//           include: {
//               user: true,
//           },
//       });
  
//       const liveUserIds = liveSessions.map(session => session.user.id);
//       return liveUserIds;
//   } catch (error) {
//       console.error('Error fetching current live users:', error);
//       throw error;
//   }
// }

// // average time  per page
// export async function getAverageTimePerPage(){
//   try {
//       const pageVisits = await prisma.pageVisit.findMany({
//           where: {
//               leftAt:{
//                   not: null,
//               },
//           },
//       });
//       totalTime = 0;
//       totalPages = 0;
//       pageVisits.forEach(page => {
//           totalPages += 1
//           totalTime += page.leftAt - page.visitedAt; //  time spent in milliseconds
//       })
//       const avgTime = totalPages === 0 ? 0 : totalTime/totalPages
//       return avgTime / 1000; // make it into seconds
//   } catch (error) {
//       console.error('Error getting average time spent per page:', error);
//       throw error;
//   }
// }

// // avg time total
// export async function getAverageTotalTime() {
//   try {
//       const timeRecords = await prisma.timeSpent.findMany();
//       let totalTime = 0;
//       let TotalRecord = 0;
//       timeRecords.forEach(record => {
//           totalTime += record.elapsedTime;
//           TotalRecord += 1
//       });
//       const avgTime = TotalRecord === 0? 0 : totalTime/TotalRecord;
//       return avgTime;
//   } catch (error) {
//       console.error('Error getting average total time:', error);
//       throw error;
//   }
// }

module.exports = router;
  