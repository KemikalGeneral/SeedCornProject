import React, {Component} from 'react';
import './displayAppListItemStyles.css';

export default class DisplayAppListItem extends Component {

    handleClick = (appName) => {
        this.props.callbackFromParent(appName.target.value);
        console.log('data: ', appName.target.value);
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
                                           value={data}
                                           name="getReviewsFromAppName"
                                           onClick={(appName) => this.handleClick(appName)}
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
