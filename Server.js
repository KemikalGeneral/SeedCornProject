const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const googlePlayApp = require('google-play-scraper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let appToScrape = '';

/**
 * Using the appToScrape variable as the appId,
 * search the Google Play Store for the requested app and return as a Promise.
 * Use a callback to get the data to pass back to the front end.
 */
app.get('/gplay', (req, res) => {
    console.log('==================== /gPlay ====================');
    const gPlayResults = googlePlayApp.app({appId: appToScrape, country: 'gb'});

    gPlayResults.then(function (result) {
        res.send({
            appObject: result
        })
    });
});

/**
 * Assign the search request to the appToScrape variable.
 * Redirect to the main page for population.
 */
app.post('/', (req, res) => {
    appToScrape = req.body.appToSearch;

    res.redirect('/gplay');
});

app.listen(port, () => console.log(`Listening on port: ${port}`));




// com.mojang.minecraftpe
