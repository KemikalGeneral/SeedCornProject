import React, {Component} from 'react';
import './displayReviewListItemStyles.css';

export default class DisplayReviewListItem extends Component {
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
                                console.log('p: ', reviewSentiment);
                            } else if (reviewSentiment >= 2) {
                                className = 'displayReviewContainer neutral';
                                console.log('Nu: ', reviewSentiment);
                            } else if (reviewSentiment >= 1) {
                                className = 'displayReviewContainer negative';
                                console.log('n: ', reviewSentiment);
                            } else if (reviewSentiment >= 0) {
                                className = 'displayReviewContainer';
                                console.log('e: ', reviewSentiment);
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
                                    <form action="/runSentimentAnalysis" method="post">
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

                                        <input className="runButton"
                                               type="submit"
                                               value="Run"
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