import React, {Component} from 'react';
import './App.css';

export default class App extends Component {
    state = {
        appObject: {}
    };

    // When the component mounts, callApi() is called and returns the appObject
    // The returned appObject is then assigned to the client's appObject under a promise
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({
                appObject: res.appObject
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

                <p>title: {this.state.appObject.title}.</p>
                <p>contentRatingDescription: {this.state.appObject.contentRatingDescription}.</p>
                <p>description: {this.state.appObject.description}.</p>
                <p>developer: {this.state.appObject.developer}.</p>
                <p>familyGenre: {this.state.appObject.familyGenre}.</p>
                <p>genre: {this.state.appObject.genre}.</p>
                <p>headerImage: {this.state.appObject.headerImage}.</p>
                <p>icon: {this.state.appObject.icon}.</p>
                <p>installs: {this.state.appObject.installs}.</p>
                <p>price: {this.state.appObject.price}.</p>
                <p>priceText: {this.state.appObject.priceText}.</p>
                <p>ratings: {this.state.appObject.ratings}.</p>
                <p>released: {this.state.appObject.released}.</p>
                <p>reviews: {this.state.appObject.reviews}.</p>
                <p>score: {this.state.appObject.score}.</p>

            </div>
        );
    }
}
