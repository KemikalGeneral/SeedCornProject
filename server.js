const express = require('express');
const app = express();
const port = process.env.PORT||5000;

const gPlay = require('google-play-scraper');
const appToScrape = 'com.mojang.minecraftpe';

app.get('/gPlay', (req, res) => {
    const gPlayResults = gPlay.app({appId: appToScrape});

    console.log('==================== server log ====================');
    gPlayResults.then(console.log);

    res.send({
        title: 'title',
        review: 'review',
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));