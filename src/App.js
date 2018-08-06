import React, {Component} from 'react';
import './App.css';
import Review from './Components/Review';

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
        const response = await fetch('/gplay');
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

                {/*Form to submit the app name*/}
                <form action="/" method="post">
                    <input type="text" name="appToSearch" />
                    <input type="submit" value="Search"/>
                </form>

                {/*App details*/}
                <p>title: <span>{this.state.appObject.title}</span></p>
                <p>contentRatingDescription: <span>{this.state.appObject.contentRatingDescription}</span></p>
                <p>description: <span>{this.state.appObject.description}</span></p>
                <p>developer: <span>{this.state.appObject.developer}</span></p>
                <p>familyGenre: <span>{this.state.appObject.familyGenre}</span></p>
                <p>genre: <span>{this.state.appObject.genre}</span></p>
                <p>headerImage: <span>{this.state.appObject.headerImage}</span></p>
                <p>icon: <span>{this.state.appObject.icon}</span></p>
                <p>installs: <span>{this.state.appObject.installs}</span></p>
                <p>price: <span>{this.state.appObject.price}</span></p>
                <p>priceText: <span>{this.state.appObject.priceText}</span></p>
                <p>ratings: <span>{this.state.appObject.ratings}</span></p>
                <p>released: <span>{this.state.appObject.released}</span></p>
                <p>reviews: <span>{this.state.appObject.reviews}</span></p>
                <p>score: <span>{this.state.appObject.score}</span></p>

                {/*Review details*/}
                <Review reviewData={this.state.reviewsObject} />

            </div>
        );
    }
}
