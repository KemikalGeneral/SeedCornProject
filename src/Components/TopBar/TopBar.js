import React, {Component} from 'react';
import './topbarStyles.css';

export default class TopBar extends Component {
    render() {

        // Return the current date to populate the date fields with
        const getDate = () => {
            const dateToday = new Date();
            const dateDay = dateToday.getDate();
            let dayToday = dateDay;
            if (dateDay.toString().length < 2) {
                dayToday = `0${dateDay}`;
            }
            const dateMonth = dateToday.getMonth() + 1;
            let monthToday = dateMonth;
            if (dateMonth.toString().length < 2) {
                monthToday = `0${dateMonth}`;
            }
            const yearToday = dateToday.getFullYear();

            return yearToday + '-' + monthToday + '-' + dayToday;
        };

        return (
            <div className="topBar">

                {/*Search form*/}
                <form action="/search" method="post">
                    <input type="text" name="appToSearch" placeholder="Enter ID parameter from Google Play Store URL (e.g. com.android.chrome)"/>
                    <input type="submit" value="Search"/>
                </form>

                {/*Dates*/}
                <div>
                    From: <input type="date" id="dateFrom" max="2018-08-22" defaultValue={getDate()}/>

                    To: <input type="date" id="dateTo" defaultValue="0001-01-01"/>
                </div>

                {/*Limit Review*/}
                <div>
                    Limit: <input type="number" id="limitReviews" step="10" min="0" defaultValue="40"/>
                </div>

                {/*Save reviews*/}
                <form className="save" action="/save" method="post">
                    <input type="submit" value="Save Reviews"/>
                </form>

            </div>
        );
    }
}
