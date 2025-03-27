// Fetch metrics from database
async function getMetrics() {
    const pageVisits = await prisma.pageVisit.findMany();
    const mouseMovements = await prisma.mouseMovement.findMany();
    const timeSpent = await prisma.timeSpent.findMany();
    return { pageVisits, mouseMovements, timeSpent };
}

// Export as CSV
app.get('/export/csv', async (req, res) => {
    const metrics = await getMetrics();
    const filePath = 'metrics.csv';
    const writer = csvWriter({
        path: filePath,
        header: [
            { id: 'type', title: 'Type' },
            { id: 'userId', title: 'User ID' },
            { id: 'sessionId', title: 'Session ID' },
            { id: 'data', title: 'Data' }
        ]
    });

    const records = [
        ...metrics.pageVisits.map(e => ({ type: 'Page Visit', userId: e.userId, sessionId: e.sessionId, data: e.pageUrl })),
        ...metrics.mouseMovements.map(e => ({ type: 'Mouse Movement', userId: e.userId, sessionId: e.sessionId, data: `(${e.xCoord}, ${e.yCoord})` })),
        ...metrics.timeSpent.map(e => ({ type: 'Time Spent', userId: e.userId, sessionId: e.sessionId, data: e.elapsedTime }))
    ];

    await writer.writeRecords(records);
    res.download(filePath, 'metrics.csv', () => fs.unlinkSync(filePath));
});

// Export as PDF
app.get('/export/pdf', async (req, res) => {
    const metrics = await getMetrics();
    const filePath = 'metrics.pdf';
    const doc = new pdfKit();
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(16).text('Metrics Report', { align: 'center' });

    const addSection = (title, data) => {
        doc.moveDown().fontSize(14).text(title, { underline: true });
        data.forEach(e => {
            doc.moveDown().fontSize(12).text(`User: ${e.userId}, Session: ${e.sessionId}, Data: ${e.data}`);
        });
    };

    addSection('Page Visits', metrics.pageVisits.map(e => ({ userId: e.userId, sessionId: e.sessionId, data: e.pageUrl })));
    addSection('Mouse Movements', metrics.mouseMovements.map(e => ({ userId: e.userId, sessionId: e.sessionId, data: `(${e.xCoord}, ${e.yCoord})` })));
    addSection('Time Spent', metrics.timeSpent.map(e => ({ userId: e.userId, sessionId: e.sessionId, data: e.elapsedTime })));

    doc.end();
    doc.on('end', () => res.download(filePath, 'metrics.pdf', () => fs.unlinkSync(filePath)));
});