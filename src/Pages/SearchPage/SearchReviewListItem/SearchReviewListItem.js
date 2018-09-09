import React, {Component} from 'react';
import './searchReviewListItemStyles.css';

export default class SearchReviewListItem extends Component {
    render() {
        return (
            <div>
                {
                    this.props.reviewData.map((data) => {
                        return (
                            <div className="reviewContainer">

                                <div className="reviewHeader">
                                    <p>{data.score} &#9734;</p>
                                    <p>{data.date}</p>
                                </div>
                                <p>{data.text}</p>

                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
