const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const googlePlayApp = require('google-play-scraper');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let appToScrape = 'com.mojang.minecraftpe';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connected');
});

/**
 * Using the appToScrape variable as the appId,
 * search the Google Play Store for the requested app and return as a Promise.
 * Use a callback to get the data to pass back to the front end.
 */
app.get('/gplay', (req, res) => {
    console.log('==================== /gPlay ====================');
    const gPlayResults = googlePlayApp.app({appId: appToScrape, country: 'gb'});
    const gpReviews = googlePlayApp.reviews({appId: appToScrape});

    gPlayResults.then(function (data) {
        gpReviews.then(function (reviews) {
            // console.log(reviews);
            res.send({
                appObject: data,
                reviewsObject: reviews
            })
        })
    });

    //TODO split into helper functions
    const db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database connected');
    });

    db.serialize(function () {
        console.log('serialize!', db);

        db.run("CREATE TABLE IF NOT EXISTS app (name TEXT)");

        db.run("INSERT INTO app(name) VALUES(?), (?), (?)", ['1', '2', '3'], function(err) {
            console.log('========== INSERT ==========');
            if (err) {
                return console.error(err.message);
            }

            console.log(`Row inserted: ${this.lastID}`);
        });

        db.each("SELECT * FROM app", (err, row) => {
            console.log('========== EACH ==========');
            if (err) {
                throw err;
            }

            console.log(`Each row: ${row.name}`);
        });

        db.all("SELECT * FROM app", (err, rows) => {
            console.log('========== ALL ==========');
            console.log('All rows: ', rows);

            rows.forEach((row) => {
                console.log('ForEachRow: ', row.name);
            });
        });

        db.close((err) => {
            console.log('========== CLOSE ==========');
            if (err) {
                return console.error(err.message);
            }
            console.log('Closing database');
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
