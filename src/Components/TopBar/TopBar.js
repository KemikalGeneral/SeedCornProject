import React, {Component} from 'react';
import './topbarStyles.css';
import {Link} from "react-router-dom";

export default class TopBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            textInputValue: '',
            isUrlValid: true
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            textInputValue: event.target.value
        });
    }

    render() {
        return (
            <div className="topBar">

                {/*Search form*/}
                <form action="/search" method="post">
                    <input type="text"
                           name="appToSearch"
                           value={this.state.textInputValue}
                           placeholder="Google Play Store app URL (e.g. https://play.google.com/store/apps/details?id=com.android.chrome)"
                           onChange={this.handleChange}/>

                    {this.state.textInputValue.startsWith('https://play.google.com/store/apps/')
                        ?
                        <input type="submit" value="Search"/>
                        :
                        <input type="submit" value="Search" style={{color: 'red'}} disabled={true}/>}
                </form>

                {/*Save reviews*/}
                <form className="save" action="/save" method="post">
                    <input type="submit" value="Save App and Reviews"/>
                </form>

                <Link to="/displayPage" className="FAB">Go to Display</Link>

            </div>
        );
    }
}
