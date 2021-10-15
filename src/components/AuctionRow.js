import React, { Component } from 'react';

class AuctionRow extends Component {
    render() {
        var actionButton;
        if (this.props.cancelAuction != null) {
            actionButton = <div className="cancel">
                <button onClick={this.props.cancelAuction}>Cancel</button>
            </div>;
        } else if (this.props.buyGridCell != null) {
            actionButton = <div className="buy">
                <button onClick={this.props.buyGridCell}>Buy</button>
            </div>;
        }

        return (
            <div className="auctionRow">
                <div className="coordinates"><i className="fa fa-map-marker"></i> {this.props.data.location}</div>
                <div className="gridCellId">{this.props.data.id}</div>
                <div className="grade">{this.props.data.grade}</div>
                <div className="colour" style={{ backgroundColor: this.props.data.colourHex }}>{this.props.data.team}</div>
                <div className="seller" title={this.props.data.seller}>{this.props.data.sellerDisplay}</div>
                <div className="price">{this.props.data.price} BNB</div>
                {actionButton}
            </div>
        );
    }
}

export default AuctionRow;