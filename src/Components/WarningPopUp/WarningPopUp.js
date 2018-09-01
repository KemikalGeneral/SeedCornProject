import React, {Component} from 'react';
import './warningPopUp.css';

export default class WarningPopUp extends Component {
    render() {
        return(
            <div className="warningPopUpContainer">

                <p>This is not a valid Google Play Store URL</p>

            </div>
        );
    }
}