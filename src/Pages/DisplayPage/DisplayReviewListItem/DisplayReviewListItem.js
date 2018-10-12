import React, {Component} from 'react';
import './displayReviewListItemStyles.css';

export default class DisplayReviewListItem extends Component {

    handleClick = (event, name) => {
        this.props.callbackFromParent(name);
    };

    render() {
        return (
            <div>

                {
                    this.props.displayReviewData.map((data) => {

                        const reviewBackground = () => {
                            let className = '';
                            const reviewSentiment = data.reviewSentiment;

                            if (reviewSentiment >= 3) {
                                className = 'displayReviewContainer positive';
                            } else if (reviewSentiment >= 2) {
                                className = 'displayReviewContainer neutral';
                            } else if (reviewSentiment >= 1) {
                                className = 'displayReviewContainer negative';
                            } else {
                                className = 'displayReviewContainer';
                            }

                            return className;
                        };

                        return (
                            <div className={reviewBackground()}>
                                <div>
                                    <div className="reviewHeader">
                                        <p>{data.reviewScore} &#9733;</p>
                                        <p>{data.reviewDate}</p>
                                    </div>
                                    <p>{data.reviewText}</p>
                                </div>

                                <div className="runButtonContainer">
                                    <form action="/runSingleSentimentAnalysis" method="post">
                                        <input type="text"
                                               name="reviewId"
                                               value={data.reviewId}
                                               hidden={true}
                                        />

                                        <input type="text"
                                               name="reviewText"
                                               value={data.reviewText}
                                               hidden={true}
                                        />

                                        <input className="button runButton"
                                               type="submit"
                                               value="Run"
                                               onClick={(event) => this.handleClick(event, data.reviewId)}
                                        />
                                    </form>

                                    {data.reviewSentiment !== null ?
                                        <p className="sentimentScore">{data.reviewSentiment}</p>
                                        :
                                        <p>!</p>
                                    }
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        );
    }
}