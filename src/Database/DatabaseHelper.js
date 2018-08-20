const sqlite3 = require('sqlite3').verbose();
let db;

/**
 * DatabaseHelper - Contains all the database call as functions.
 * If needed, create a new instance of this class in the new file: e.g...
 * * const DatabaseHelper = require('./src/Database/DatabaseHelper').DatabaseHelper;
 * * const dbHelper = new DatabaseHelper();
 * * dbHelper.insert();
 */

//TODO expand the functions to take parameters

class DatabaseHelper {
    /**
     * Constructor - Upon instantiating a DatabaseHelper class, this creates the tables in the callback.
     * There is the in :memory: version for testing, and the named file which will be created automatically,
     * comment whichever is needed.
     */
    constructor() {
        console.log('Database constructor');
        db = new sqlite3.Database(':memory:', (err) => {
            // db = new sqlite3.Database('./schema.db', (err) => {
            console.log('\n========== CREATE ==========');
            if (err) {
                return console.error(err.message);
            }

            // db.run("DROP TABLE if exists app");
            db.run('create table IF NOT EXISTS app(app_id integer primary key, app_name varchar(100) not null)');
            db.run("create table IF NOT EXISTS review(review_id integer primary key, review_text text not null, app_id integer not null, constraint FK_app_id foreign key (app_id) references app(app_id));");

            console.log('Database connected');
        });
    };

    /**
     * insertNewAppAndReview - takes and app name and the associated review and saves them to their respective tables.
     * Used the row number of the inserted app (lastID) as the foreign key for the review's app_id.
     * @param appName
     * @param reviewText
     */
    insertNewAppAndReview(appName, reviewText) {
        // this.open();

        // Save app details
        db.run("INSERT INTO app(app_name) VALUES(?)", [appName], function (err) {
            console.log('\n========== INSERT - insertNewAppAndReview - app name ==========');
            if (err) {
                return console.error(err.message);
            }
            console.log(`App saved: ${appName}`);

            // Save review details
            db.run("INSERT INTO review(review_text, app_id) VALUES(?, ?)", [reviewText, this.lastID], function (err) {
                console.log('\n========== INSERT - insertNewAppAndReview - review text ==========');
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Review saved: ${reviewText}`);
            });
        });
        // this.close();
    };

    /**
     * FindAll - Find all app and associated review data
     */
    findAll() {
        // this.open();
        db.all("SELECT * FROM app join review on app.app_id = review.app_id", (err, rows) => {
            console.log('\n========== ALL ==========');
            console.log('All rows: \n', rows);

            rows.forEach((row) => {
                console.log('ForEachRow: ', row);
            });
        });
        // this.close();
    };

    /**
     * FindOne - Finds the app and review data for a single app.
     * Currently hardcoded to app_id = 1 for testing, but will take a user-defined parameter.
     */
    findOne() {
        // this.open();
        db.each("SELECT * FROM app join review on app.App_id = review.app_id where app.app_id = 1", (err, row) => {
            console.log('\n========== EACH - app ==========');
            console.log('Row: ', row);
            if (err) {
                throw err;
            }
        });
        // this.close();
    };

    open() {
        // let db = new sqlite3.Database(':memory:');
        // db = new sqlite3.Database(':memory:', (err) => {
        //     if (err) {
        //         return console.error(err.message);
        //     }
        //     db.run("CREATE TABLE IF NOT EXISTS app (name TEXT)");
        //     console.log('Database connected');
        // });
        // return db;
    };

    close() {
        db.close((err) => {
            console.log('========== CLOSE ==========');
            if (err) {
                return console.error(err.message);
            }
            console.log('Closing database');
        });
    };
}

module.exports = {DatabaseHelper: DatabaseHelper};