"use strict";

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const googlePlayApp = require('google-play-scraper');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const DatabaseHelper = require('./src/Database/DatabaseHelper').DatabaseHelper;
const dbHelper = new DatabaseHelper();

let appToScrape = 'com.mojang.minecraftpe';

/**
 * Using the appToScrape variable as the appId,
 * search the Google Play Store for the requested app and return as a Promise.
 * Use a callback to get the data to pass back to the front end.
 */
app.get('/gplay', (req, res) => {
    console.log('==================== /gPlay ====================');
    if (appToScrape.length < 1) {
        appToScrape = 'com.mojang.minecraftpe';
    }
    const gPlayResults = googlePlayApp.app({appId: appToScrape, country: 'gb'});
    const gpReviews = googlePlayApp.reviews({appId: appToScrape});

    gPlayResults.then(function (data) {
        gpReviews.then(function (reviews) {
            // console.log(reviews);
            res.send({
                appObject: data,
                reviewsObject: reviews
            });

            dbHelper.insert();
            dbHelper.each();
            dbHelper.all();
            // dbHelper.close();
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
