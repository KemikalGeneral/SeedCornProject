const sqlite3 = require('sqlite3').verbose();
let db;

/**
 * DatabaseHelper class contains all the database call as functions.
 * If needed, create a new instance of this class in the new file: e.g...
 * * const DatabaseHelper = require('./src/Database/DatabaseHelper').DatabaseHelper;
 * * const dbHelper = new DatabaseHelper();
 * * dbHelper.insert();
 */

//TODO expand the functions to take parameters

class DatabaseHelper {
    constructor() {
        console.log('Database constructor');
        db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                return console.error(err.message);
            }
            db.run("CREATE TABLE IF NOT EXISTS app (name TEXT)");
            console.log('Database connected');
        });
    };

    open () {
        db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                return console.error(err.message);
            }
            db.run("CREATE TABLE IF NOT EXISTS app (name TEXT)");
            console.log('Database connected');
        });
    }

    insert () {
        // this.open();
        db.run("INSERT INTO app(name) VALUES(?), (?), (?)", ['1', '2', '3'], function (err) {
            console.log('========== INSERT ==========');
            if (err) {
                return console.error(err.message);
            }

            console.log(`Row inserted: ${this.lastID}`);
        });
    };

    each () {
        // this.open();
        db.each("SELECT * FROM app", (err, row) => {
            console.log('========== EACH ==========');
            if (err) {
                throw err;
            }

            console.log(`Each row: ${row.name}`);
        });
    };

    all () {
        // this.open();
        db.all("SELECT * FROM app", (err, rows) => {
            console.log('========== ALL ==========');
            console.log('All rows: ', rows);

            rows.forEach((row) => {
                console.log('ForEachRow: ', row.name);
            });
        });
    };

    close () {
        db.close((err) => {
            console.log('========== CLOSE ==========');
            if (err) {
                return console.error(err.message);
            }
            console.log('Closing database');
        });
    };

    setUp () {
        // this.insert();
        // this.each();
        // this.all();
        // this.close();
    };
}

module.exports = {DatabaseHelper : DatabaseHelper};