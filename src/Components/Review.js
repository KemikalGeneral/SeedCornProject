import React, {Component} from 'react';
import './reviewStyleSheet.css';

export default class Review extends Component {
    render() {
        return (
            <div className="reviewsContainer">
                {
                    this.props.reviewData.map((data) => {
                        return (
                            <div className="individualReviewContainer">

                                <div className="reviewHeader">
                                    <p>{data.score} stars</p>
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
