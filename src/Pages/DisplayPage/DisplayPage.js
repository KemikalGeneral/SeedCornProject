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
        console.log('CDM');
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
        this.componentDidMount();
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

                        {/*Refine search*/}
                        <div>
                            <p className="sectionHeading">Refine search</p>

                            <form action="/refineByRating" method="post">
                                {/*Review rating*/}
                                <div className="formRow">
                                    <p>Review rating</p>
                                    <input name="rating" type="number" min="1" max="5" placeholder="1-5"
                                           required={true}/>
                                </div>

                                <input type="submit" value="Refine by rating"/>
                            </form>

                            <hr/>

                            {/*Dates*/}
                            <form action="/refineByDate" method="post">
                                <div>
                                    <div className="formRow">
                                        <p>Date from</p>
                                        <input id="dateFrom"
                                               name="dateFrom"
                                               type="date"
                                               min="2008-08-22"
                                               max={this.getDate()}
                                               defaultValue={this.getDate()}
                                               required={true}/>
                                    </div>

                                    <div className="formRow">
                                        <p>Back to</p>
                                        <input id="dateTo"
                                               name="backTo"
                                               type="date"
                                               min="2008-08-22"
                                               max={this.getDate()}
                                               defaultValue="2008-08-22"
                                               required={true}/>
                                    </div>
                                </div>

                                <input type="submit" value="Refine by date"/>
                            </form>
                        </div>

                        {/*<hr/>*/}

                        {/*Sentiment analysis*/}
                        {/*<div>*/}
                        {/*<p className="sectionHeading">Sentiment Analysis</p>*/}

                        {/*<div>*/}
                        {/*<form action="/#" method="post">*/}
                        {/*<input type="submit" value="Run Sentiment Analysis"/>*/}
                        {/*</form>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                    </div>

                    {/*Apps section section*/}
                    <div className="sectionContainer">
                        {this.state.savedAppsNames.length !== 0 ?
                            <DisplayAppListItem
                                appNameData={this.state.savedAppsNames}
                                callbackFromParent={this.appNameCallback}
                            />
                            :
                            <p>No saved apps</p>
                        }
                    </div>

                    {/*Reviews section*/}
                    {/*Display the no reviews message if an app hasn't been selected*/}
                    <div className="sectionContainer">
                        {this.state.reviewsFromAppName.length === 0 ?
                            <p>&#8678; Select an app to display its reviews...</p>
                            :
                            <DisplayReviewListItem
                                displayReviewData={this.state.reviewsFromAppName}
                                callbackFromParent={this.appNameCallback}
                            />
                        }
                    </div>

                </div>
            </div>
        );
    }
}