import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// Pages
import SearchPage from '../Components/SearchPage/SearchPage';
import DisplayPage from '../Components/DisplayPage/DisplayPage';

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={SearchPage}/>
                    <Route exact path="/index" component={SearchPage}/>
                    <Route path="/displayPage" component={DisplayPage}/>
                </div>
            </Router>
        );
    }
}
