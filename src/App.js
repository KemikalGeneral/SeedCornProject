import React, {Component} from 'react';
import './App.css';
import Review from './Components/Reviews/Review';
import TopBar from './Components/TopBar/TopBar';

export default class App extends Component {
    state = {
        appObject: {},
        reviewsObject: [{}]
    };

    // When the component mounts, callApi() is called and returns the appObject and the reviewsObject.
    // The returned objects are then assigned to the client's appObject under a promise.
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({
                appObject: res.appObject,
                reviewsObject: res.reviewsObject
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

    render() {
        console.log("==================== Render ====================");
        return (
            <div className="App">

                <TopBar />

                <div className="mainBody">

                    {/*App details*/}
                    <div className="appDetailsContainer">
                        <div className="appHeader">

                            <img src={this.state.appObject.icon}
                                 alt="App icon"
                                 width="300"
                                 height="300"
                            />

                            <div className="appHeaderElements">
                                {/*Title and developer*/}
                                <div>
                                    <p className="appTitle">{this.state.appObject.title}</p>
                                    <p className="appDeveloper">{this.state.appObject.developer}</p>
                                </div>

                                {/*Price, downloads, and ratings*/}
                                <p>
                                    <p>{this.state.appObject.priceText}</p>
                                    <p>{this.state.appObject.installs} downloads</p>
                                    <p>{this.state.appObject.score} stars from &nbsp;
                                        {this.state.appObject.ratings} ratings</p>
                                </p>

                                {/*Genre*/}
                                <p>
                                    {this.state.appObject.genre}
                                    {this.state.appObject.familyGenre}
                                    {this.state.appObject.contentRatingDescription}
                                </p>
                            </div>
                        </div>

                        <p className="appDescription">{this.state.appObject.description}</p>

                        <p>First released: {this.state.appObject.released}</p>

                        <p>Total Number of Reviews: {this.state.appObject.reviews}</p>
                    </div>

                    {/*Review details*/}
                    <div className="appReviewsContainer">
                        <Review reviewData={this.state.reviewsObject}/>
                    </div>

                </div>

            </div>
        );
    }
}
