import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './displayPageStyles.css';
import AppNameListItem from './AppNameListItem/AppNameListItem';

export default class App extends Component {
    state = {
        appObject: {},
        reviewsObject: [{}],
        savedAppData: [{}],
    };

    // When the component mounts, callApi() is called and returns the appObject and the reviewsObject.
    // The returned objects are then assigned to the client's appObject under a promise.
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({
                appObject: res.appObject,
                reviewsObject: res.reviewsObject,
                savedAppData: res.savedAppData,
            }))
            .catch(err => console.log('Error: ', err));
    }

    // Called from component mounting, returns a JSON of the appObject
    callApi = async () => {
        const response = await fetch('/index');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        return body;
    };

    // Return the current date to populate the date fields with
    getDate = () => {
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

    dummyData =
        [
            {app_name: 'Dummy name 1'},
            {app_name: 'Dummy name 2'},
            {app_name: 'Dummy name 3'}
        ];

    render() {
        return (
            <div>
                <div className="topBar">
                    <Link to="/index" className="FAB">Back to Search</Link>
                </div>

                <div className="displayPageContainer">

                    <div className="sectionContainer">
                        <input type="submit" value="Show all saved apps"/>

                        <hr/>

                        <p className="sectionHeading">Refine search</p>

                        <form action="#">
                            {/*Review rating*/}
                            <div className="formRow">
                                <p>Review rating</p>
                                <input type="number" min="0" max="5" placeholder="0-5"/>
                            </div>

                            {/*Dates*/}
                            <div>
                                <div className="formRow">
                                    <p>Date from</p>
                                    <input id="dateFrom"
                                           type="date"
                                           min="2008-08-22"
                                           max={this.getDate()}
                                           defaultValue={this.getDate()}/>
                                </div>

                                <div className="formRow">
                                    <p>Back to</p>
                                    <input id="dateTo"
                                           type="date"
                                           min="2008-08-22"
                                           max={this.getDate()}
                                           defaultValue="2008-08-22"/>
                                </div>
                            </div>

                            <hr/>

                            <input type="submit" value="Refine"/>
                        </form>
                    </div>

                    <div className="sectionContainer">
                        <AppNameListItem appNameData={this.dummyData}/>
                        {/*<AppNameListItem appNameData={this.state.savedAppData}/>*/}
                    </div>

                </div>
            </div>
        );
    }
}
