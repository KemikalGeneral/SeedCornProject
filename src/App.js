import React, {Component} from 'react';
import './App.css';

export default class App extends Component {
    state = {
        title: '',
        review: ''
    };

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({
                title: res.title,
                review: res.review
            }))
            .catch(err => console.log('Error: ', err));
    }

    callApi = async () => {
        const response = await fetch('/gPlay');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        return body;
    };

    render() {
        console.log("==================== app log ====================");
        console.log("State: ", this.state);
        return (
            <div className="App">

                <p>Title: {this.state.title}.</p>
                <p>Review: {this.state.review}.</p>

            </div>
        );
    }
}
