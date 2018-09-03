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

    returnedAppResults = googlePlayApp.app({appId: appToScrape, country: 'gb'});
    returnedReviewResults = googlePlayApp.reviews({appId: appToScrape});

    returnedAppResults.then(function (appData) {
        returnedReviewResults.then(function (reviewData) {
            // console.log('Reviews: ', reviewData);
            // console.log('App data: ', appData);

            // dbHelper.findAll();

            dbHelper.getListOfAppNames(function (listOfNames) {
                // console.log('ListOfNames: ', listOfNames);

                res.send({
                    appObject: appData,
                    reviewsObject: reviewData,
                    savedAppData: listOfNames
                });
            });
        })
    });
});

/**
 * Split the URL and assign the id search parameter to the appToScrape variable.
 * Redirect to the main page for population.
 */
app.post('/search', (req, res) => {
    console.log('==================== /search ====================');
    appToScrape = req.body.appToSearch;
    const splitName = appToScrape.split('id=');
    appToScrape = splitName[1];

    res.redirect('/index');
});

/**
 * Use the promise's callback from the search results to save the current app and associated reviews.
 */
app.post('/save', (req, res) => {
    console.log('========== ========== ========== ========== New Save ========== ========== ========== ==========');
    if (returnedAppResults == null) {
        console.log('No app selected to save');
        res.redirect('/index');
    } else {

        returnedAppResults.then(function (appData) {
            returnedReviewResults.then(function (reviewData) {

                // Loop through the reviewData and create and array of reviews to save to the app
                let allReviewsArray = [];

                for (let review of reviewData) {
                    let reviewArray = [];

                    reviewArray.push(review.text);
                    reviewArray.push(review.score);
                    reviewArray.push(review.date);

                    allReviewsArray.push(reviewArray);
                }

                // Save app and associated review data
                dbHelper.insertNewAppAndReview(
                    //App data
                    appData.title, appData.developer, appData.size, appData.version,
                    // Review data
                    allReviewsArray
                );

                // Redirect back to the home screen
                res.redirect('/index');
            });
        });
    }
});

app.get('/names', (req, res) => {
    dbHelper.getListOfAppNames(function (listOfNames) {
        console.log('ListOfNames: ', listOfNames);

        res.send({
            appObject: listOfNames
        });
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
