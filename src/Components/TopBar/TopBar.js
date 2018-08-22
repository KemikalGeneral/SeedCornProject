import React, {Component} from 'react';
import './topbarStyles.css';

export default class TopBar extends Component {
    render() {
        return (
            <div className="topBar">

                <form action="/search" method="post">
                    <input type="text" name="appToSearch" placeholder="Enter ID parameter from Google Play Store URL (e.g. com.android.chrome)"/>
                    <input type="submit" value="Search"/>
                </form>

                <div>
                    From: <input type="date"/>
                    To: <input type="date"/>
                </div>

                <form action="/save" method="post">
                    <input type="submit" value="Save Reviews"/>
                </form>

            </div>
        );
    }
}
