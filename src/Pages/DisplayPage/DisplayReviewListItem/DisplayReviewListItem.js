import React, {Component} from 'react';

export default class DisplayReviewListItem extends Component {
    render() {
        return (
            <div>

                {
                    this.props.displayReviewData.map((data) => {
                        return (
                            <div className="reviewContainer">

                                <div className="reviewHeader">
                                    <p>{data.reviewScore} &#9733;</p>
                                    <p>{data.reviewDate}</p>
                                </div>
                                <p>{data.reviewText}</p>

                            </div>
                        )
                    })
                }

            </div>
        );
    }
}