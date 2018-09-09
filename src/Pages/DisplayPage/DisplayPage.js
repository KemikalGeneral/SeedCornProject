import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './displayPageStyles.css';
import DisplayAppListItem from './DisplayAppListItem/DisplayAppListItem';
import DisplayReviewListItem from './DisplayReviewListItem/DisplayReviewListItem';

export default class App extends Component {
    state = {
        savedAppsNames: [{}],
        reviewsFromAppName: [{}],
    };

    // When the component mounts, callApi() is called and returns the savedAppsNames and reviewsFromAppName.
    // The returned objects are then assigned to the client's state under a promise.
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({
                savedAppsNames: res.savedAppsNames,
                reviewsFromAppName: res.reviewsFromAppName,
            }))
            .catch(err => console.log('Error: ', err));
    }

    // Called from component mounting, returns a JSON of the saved app data
    callApi = async () => {
        const response = await fetch('/getAllSavedAppNames');
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

    // Get the reviews for the chosen app via the server's /getReviewsFromAppName route
    // and assign them to currentReviews
    appNameCallback = (dataFromChild) => {
        console.log('dateFromChild: ', dataFromChild);
    };

    render() {
        return (
            <div>
                <div className="topBar">
                    <Link to="/index" className="FAB">Back to Search</Link>
                </div>

                <div className="displayPageContainer">

                    {/*Config section*/}
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

                            <div>
                                <input type="submit" value="Refine"/>
                            </div>

                            <hr/>

                            <p className="sectionHeading">Sentiment Analysis</p>

                            <div>
                                <input type="submit" value="Run Sentiment Analysis"/>
                            </div>

                        </form>
                    </div>

                    {/*Apps section section*/}
                    <div className="sectionContainer">
                        <DisplayAppListItem
                            appNameData={this.state.savedAppsNames}
                            callbackFromParent={this.appNameCallback}
                        />
                    </div>

                    {/*Reviews section*/}
                    {/*Display the no reviews message if an app hasn't been selected*/}
                    <div className="sectionContainer">
                        {this.state.reviewsFromAppName.length === 0 ?
                            <p>&#8678; Select an app to display its reviews...</p>
                            :
                            <DisplayReviewListItem displayReviewData={this.state.reviewsFromAppName}/>
                        }
                    </div>

                </div>
            </div>
        );
    }
}
