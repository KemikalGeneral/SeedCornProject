import React, {Component} from 'react';
import './appNameListItemStyles.css';

export default class AppNameListItem extends Component {
    render() {

        console.log('appNameProps: ', this.props.appNameData);

        return(
            <div>

                {
                    this.props.appNameData.map((data) => {
                        return (
                            <div className="appNameListItemContainer">

                                <p>{data.app_name}</p>

                            </div>
                        )

                    })
                }

            </div>
        );

    }
}