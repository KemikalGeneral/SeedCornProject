import React, {Component} from 'react';
import './topbarStyles.css';

export default class TopBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

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
                    <input type="text"
                           name="appToSearch"
                           value={this.state.value}
                           placeholder="Google Play Store app URL (e.g. https://play.google.com/store/apps/details?id=com.android.chrome)"
                           onChange={this.handleChange}/>

                    {this.state.value.startsWith('https://play.google.com/store/apps/') ?
                        <input type="submit" value="Search"/> : <input type="submit" value="Search" style={{color:'red'}} disabled={true}/>}
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
