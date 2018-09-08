import React, {Component} from 'react';
import './searchPageStyles.css';
import Review from './Reviews/Review';
import TopBar from '../Components/TopBar/TopBar';

export default class SearchPage extends Component {
    state = {
        appData: {},
        reviewData: [{}],
    };

    // When the component mounts, callApi() is called and returns the appData and the reviewData.
    // The returned objects are then assigned to the client's appData under a promise.
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({
                appData: res.appData,
                reviewData: res.reviewData,
            }))
            .catch(err => console.log('Error: ', err));
    }

    // Called from component mounting, returns a JSON of the appData
    callApi = async () => {
        const response = await fetch('/index');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        return body;
    };

    render() {
        console.log("==================== Render ====================");
        return (
            <div className="App">

                <TopBar />

                <div className="mainBody">

                    {/*App details*/}
                    <div className="appDetailsContainer">
                        <div className="appHeader">

                            <img src={this.state.appData.icon}
                                 alt="App icon"
                                 width="300"
                                 height="300"
                            />

                            <div className="appHeaderElements">
                                {/*Title and developer*/}
                                <div>
                                    <p className="appTitle">{this.state.appData.title}</p>
                                    <p className="appDeveloper">{this.state.appData.developer}</p>
                                </div>

                                {/*Price, downloads, and ratings*/}
                                <p>
                                    <p>{this.state.appData.priceText}</p>
                                    <p>{this.state.appData.installs} downloads</p>
                                    <p>{this.state.appData.score} stars from &nbsp;
                                        {this.state.appData.ratings} ratings</p>
                                </p>

                                {/*Genre*/}
                                <p>
                                    {this.state.appData.genre}
                                    {this.state.appData.familyGenre}
                                    {this.state.appData.contentRatingDescription}
                                </p>
                            </div>
                        </div>

                        <p className="appDescription">{this.state.appData.description}</p>

                        <p>First released: {this.state.appData.released}</p>

                        <p>Total Number of Reviews: {this.state.appData.reviews}</p>
                    </div>

                    {/*Review details*/}
                    <div className="appReviewsContainer">
                        <Review reviewData={this.state.reviewData}/>
                    </div>

                </div>
            </div>
        );
    }
}
