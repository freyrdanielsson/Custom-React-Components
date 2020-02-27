import React from 'react';

import './SwipeableList.css';

export default function SwipeableList(props) {
    const { children } = props;
    const childrenWithProps = React.Children.map(children, child => {
        const childProps = {}
        if (!child.props.background) {
            childProps.background = props.background;
        }
        if (!child.props.threshold) {
            childProps.threshold = props.threshold;
        }
        return React.cloneElement(child, childProps);
    })
    return (
        <div className="SwipeList">
            {childrenWithProps}
        </div>
    );
}