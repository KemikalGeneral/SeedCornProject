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

let reviewsFromAppName = [];

/**
 * Using the appToScrape variable as the appId,
 * search the Google Play Store for the requested app and return as a Promise.
 * Use a callback to get the data to pass back to the front end.
 */
app.get('/index', (req, res) => {
    console.log('==================== /index ====================');

    returnedAppResults = googlePlayApp.app({
        appId: appToScrape,
        country: 'gb'
    });
    returnedReviewResults = googlePlayApp.reviews({
        appId: appToScrape,
        sort: googlePlayApp.sort.NEWEST
    });

    returnedAppResults.then(function (appData) {
        returnedReviewResults.then(function (reviewData) {
            // console.log('Reviews: ', reviewData);
            // console.log('App data: ', appData);

            dbHelper.getListOfAppNames(function (listOfNames) {
                res.send({
                    appData: appData,
                    reviewData: reviewData,
                    savedAppsNames: listOfNames
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

/**
 * Loop through all the apps and create an array of unique names for the list.
 * Return a JSON of names.
 */
app.get('/getAllSavedAppNames', (req, res) => {
    console.log('==================== /getAllSavedAppNames ====================');

    dbHelper.findAll(function (data) {
        // If no apps are found in DB, show a message
        let uniqueNames = [];
        if (data.length === 0) {
            console.log('Nothing found in database');
            uniqueNames.push('No apps saved');
        } else {
            // Create an array of unique app names
            let lastName = data[0].app_name;
            uniqueNames = [lastName];

            for (let app of data) {
                if (app.app_name !== lastName) {
                    uniqueNames.push(app.app_name);
                    lastName = app.app_name;
                }
            }
        }
        res.send({
            savedAppsNames: uniqueNames,
            reviewsFromAppName: reviewsFromAppName
        });
    });
});

/**
 * Loop through all the apps and create review object out of the apps with a matching name to the query.
 * Assign the array of reviews and redirect to /displayPage to view them.
 */
app.post('/getReviewsFromAppName', (req, res) => {
    console.log('==================== /getReviewsFromAppName ====================');

    const appName = req.body.getReviewsFromAppName;

    dbHelper.findAll(function (data) {
        let reviewsForApp = [];
        for (let app of data) {
            if (app.app_name === appName) {
                let newReviewObject = {
                    reviewId: app.review_id,
                    reviewText: app.review_text,
                    reviewScore: app.review_score,
                    reviewDate: app.review_date,
                    reviewSentiment: app.review_sentiment
                };

                reviewsForApp.push(newReviewObject);
            }
        }
        reviewsFromAppName = reviewsForApp;

        res.redirect('/displayPage');
    });
});

/**
 * Take the reviewId and the reviewText from the incoming body.
 * Use the reviewText to send to the sentiment analyser,
 * and use the reviewId to save the sentiment result to the selected review.
 */
app.post('/runSentimentAnalysis', (req, res) => {
    console.log('==================== /runSentimentAnalysis ====================');
    const exec = require('child_process').spawn('java', ['-jar', './StanfordNlp.jar', req.body.reviewText]);

    exec.stdout.on('data', function (data) {
        dbHelper.addSentimentResult(data.toString(), req.body.reviewId);
    });

    res.redirect('/displayPage');
});

/**
 * Not yet being used
 */
app.post('/refineByRating', (req, res) => {
    console.log('refine: ', req.body.rating);

    dbHelper.findAll(function (data) {
        let reviewsForApp = [];
        for (let app of data) {
            if (app.review_score === req.body.rating) {
                let newReviewObject = {
                    reviewId: app.review_id,
                    reviewText: app.review_text,
                    reviewScore: app.review_score,
                    reviewDate: app.review_date,
                    reviewSentiment: app.review_sentiment
                };
                reviewsForApp.push(newReviewObject);
            }
        }
        reviewsFromAppName = reviewsForApp;

        res.redirect('/displayPage');
    });
});

/**
 * Not yet being used
 */
app.post('/refineByDate', (req, res) => {
    console.log('from: ', req.body.dateFrom);
    console.log('to: ', req.body.backTo);

    const selectedDate = new Date(req.body.dateFrom);
    const selectedGetDate = selectedDate.getDate();
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();

    dbHelper.findAll(function (data) {
        let reviewsForApp = [];
        for (let app of data) {

            const reviewDate = new Date(app.review_date);
            const reviewGetDate = reviewDate.getDate();
            const reviewYear = reviewDate.getFullYear();
            const reviewMonth = reviewDate.getMonth();

            if (
                selectedGetDate === reviewGetDate
                && selectedMonth === reviewMonth
                && selectedYear === reviewYear) {

                let newReviewObject = {
                    reviewId: app.review_id,
                    reviewText: app.review_text,
                    reviewScore: app.review_score,
                    reviewDate: app.review_date,
                    reviewSentiment: app.review_sentiment
                };
                reviewsForApp.push(newReviewObject);
            }
        }
        reviewsFromAppName = reviewsForApp;

        res.redirect('/displayPage');
    });
});

// Port listener
app.listen(port, () => console.log(`Listening on port: ${port}`));