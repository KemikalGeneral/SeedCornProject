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
 * Take the reviewId and the reviewText from the incoming body, and create a review (as a single string,
 * separated by a delimiter).
 * Use the review data to send to the sentiment analyser.
 * Process the data coming back and save the ID and average score.
 */
app.post('/runSingleSentimentAnalysis', (req, res) => {
    console.log('==================== /runSingleSentimentAnalysis ====================');

    const delimiter = '!#delimiter#!';
    const reviewDelimiter = '!#reviewDelimiter#!';
    const reviewId = req.body.reviewId;
    const reviewText = req.body.reviewText;

    // Build review string to analyse.
    let review = '';
    review += reviewId;
    review += delimiter;
    review += reviewText;
    review += delimiter;

    // Feed the NLP Jar the single review string and process the returning data.
    const exec = require('child_process').spawn('java', ['-jar', './StanfordNlp.jar', review]);
    exec.stdout.on('data', function (data) {
        if (data.toString() === '') {
            console.log('no data: ');
        }

        // Split the data string into reviews.
        let reviews = data.toString().split(reviewDelimiter);
        for (let review of reviews) {

            // Split each review into its elements for saving.
            let splitReviews = review.split(delimiter);

            // Iterate through the splitReviews array adding the ID and average score to the reviewIdAndScore array.
            // Pass the reviewIdAndScore array through to the addSentimentResult DB method for saving.
            let reviewIdAndScore = [];
            const splitReviewsLength = splitReviews.length;
            for (let i = 0; i < splitReviewsLength; i++) {
                const currentReview = splitReviews[i];

                if (currentReview.trim().length !== 0) {
                    if (i === 0) {
                        reviewIdAndScore.push(currentReview);
                    } else if (i === 1) {
                        reviewIdAndScore.push(parseFloat(currentReview).toFixed(2));
                    }
                }

                if (i === splitReviewsLength - 1) {
                    dbHelper.addSentimentResult(reviewIdAndScore);
                }
            }
        }
    });

    res.redirect('/displayPage');
});

/**
 * Take the reviewId and the reviewText from the incoming body, and create a single string containing all reviews
 * (as a single string, separated by a delimiter).
 * Use the review data to send to the sentiment analyser.
 * Process the data coming back and save the IDs and average scores.
 */
app.post('/runBatchSentimentAnalysis', (req, res) => {
    console.log('==================== /runBatchSentimentAnalysis ====================');

    const delimiter = '!#delimiter#!';
    const reviewDelimiter = '!#reviewDelimiter#!';

    // Build allReviews string to analyse.
    let allReviews = '';
    for (let review of reviewsFromAppName) {
        allReviews += review.reviewId;
        allReviews += delimiter;
        allReviews += review.reviewText;
        allReviews += delimiter;
    }

    // Feed the NLP Jar the single review string and process the returning data.
    const exec = require('child_process').spawn('java', ['-jar', './StanfordNlp.jar', allReviews]);
    exec.stdout.on('data', function (data) {

        // Split the string into reviews.
        let reviews = data.toString().split(reviewDelimiter);
        for (let review of reviews) {

            // Split each review into its elements for saving.
            let splitReviews = review.split(delimiter);
            let reviewId = '';
            let reviewSentence = '';
            let reviewScore = '';
            let averageScore = 0;

            // Iterate through the splitReviews array adding the ID and average score to the reviewIdAndScore array.
            // Pass the reviewIdAndScore array through to the addSentimentResult DB method for saving each review.
            let reviewIdAndScore = [];
            const splitReviewsLength = splitReviews.length;
            for (let i = 0; i < splitReviewsLength; i++) {
                const currentReview = splitReviews[i];

                if (currentReview.trim().length !== 0) {
                    if (i === 0) {
                        reviewIdAndScore.push(currentReview);
                        // reviewId = currentReview;
                        // console.log('reviewId: ', reviewId);
                    } else if (i === 1) {
                        reviewIdAndScore.push(parseFloat(currentReview).toFixed(2));
                        // averageScore = currentReview;
                        // console.log('averageScore: ', averageScore);
                    } else if ((i & 1) === 0) {
                        // reviewSentence = currentReview;
                        // console.log('reviewSentence: ', reviewSentence);
                    } else if ((i & 1) !== 0) {
                        // reviewScore = currentReview;
                        //
                        // console.log('id: ', reviewId);
                        // console.log('score: ', reviewScore);
                    }
                }

                if (i === splitReviewsLength - 1) {
                    dbHelper.addSentimentResult(reviewIdAndScore);
                }
            }
        }
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