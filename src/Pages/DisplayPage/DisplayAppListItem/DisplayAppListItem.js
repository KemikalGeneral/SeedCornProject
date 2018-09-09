import React, {Component} from 'react';
import './displayAppListItemStyles.css';

export default class DisplayAppListItem extends Component {

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
                                           value={data}
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
