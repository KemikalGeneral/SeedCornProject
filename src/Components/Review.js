import React, {Component} from 'react';

export default class Review extends Component {
    render() {
        return(
            <div>
                {
                    this.props.reviewData.map((data) => {
                        return(
                            <div>

                                <hr/>

                                <p>{data.date} ({data.score})</p>
                                <p>{data.text}</p>

                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
