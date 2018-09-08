import React, {Component} from 'react';
import './appNameListItemStyles.css';

export default class AppNameListItem extends Component {

    handleClick = (event, name) => {
        this.props.callbackFromParent(name);
    };

    render() {
        return (
            <div>

                {
                    this.props.appNameData.map((data) => {
                        return (
                            <div className="appNameListItemContainer">

                                <form action="/getReviewsFromAppName" method="post">
                                    <input type="submit"
                                           value={data.app_name}
                                           name="getReviewsFromAppName"
                                           onClick={(event) => this.handleClick(event, data.app_name)}
                                    />
                                </form>

                            </div>
                        )
                    })
                }

            </div>
        );
    }
}
