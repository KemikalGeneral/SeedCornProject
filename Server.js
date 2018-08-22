const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const googlePlayApp = require('google-play-scraper');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const DatabaseHelper = require('./src/Database/DatabaseHelper').DatabaseHelper;
const dbHelper = new DatabaseHelper();

let appToScrape = 'com.android.chrome';
let returnedAppResults;
let returnedReviewResults;

/**
 * Using the appToScrape variable as the appId,
 * search the Google Play Store for the requested app and return as a Promise.
 * Use a callback to get the data to pass back to the front end.
 */
app.get('/index', (req, res) => {
    console.log('==================== /index ====================');
    if (appToScrape.length < 1) {
        appToScrape = 'com.android.chrome';
    }
    returnedAppResults = googlePlayApp.app({appId: appToScrape, country: 'gb'});
    returnedReviewResults = googlePlayApp.reviews({appId: appToScrape});

    returnedAppResults.then(function (appData) {
        returnedReviewResults.then(function (reviewData) {
            // console.log('Reviews: ', reviewData);
            // console.log('App data: ', appData);
            res.send({
                appObject: appData,
                reviewsObject: reviewData
            });
        })
    });
});

/**
 * Assign the search request to the appToScrape variable.
 * Redirect to the main page for population.
 */
app.post('/search', (req, res) => {
    console.log('==================== /search ====================');
    appToScrape = req.body.appToSearch;

    res.redirect('/index');
});

/**
 * Use the promise's callback from the search results to save the current app and associated reviews.
 *
 * Currently doesn't save reviews as the returned data needs mapping from its array.
 */
app.post('/save', (req, res) => {
    console.log('========== ========== ========== ========== New Save ========== ========== ========== ==========');
    returnedAppResults.then(function (appData) {
        returnedReviewResults.then(function (reviewData) {

            dbHelper.insertNewAppAndReview(
                //App data
                appData.title, appData.developer, appData.size, appData.version,
                // Review data - need to be mapped as will come as part of an array
                'review text', 'score', 'date');
            dbHelper.findAll();
            dbHelper.findOne();
        });
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
