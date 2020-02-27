import React from "react";
import "./SwipeableListItem.css";

class SwipeableListItem extends React.Component {
    // DOM Refs
    listElement;
    wrapper;
    background;
    clickTarget;

    // Drag & Drop
    dragStartX = 0;
    right = 0;
    dragged = false;

    constructor(props) {
        super(props);

        this.listElement = null;
        this.wrapper = null;
        this.background = null;
        this.clickTarget = null;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onDragStartMouse = this.onDragStartMouse.bind(this);
        this.onDragStartTouch = this.onDragStartTouch.bind(this);
        this.onDragEndMouse = this.onDragEndMouse.bind(this);
        this.onDragEndTouch = this.onDragEndTouch.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.onClicked = this.onClicked.bind(this);
        this.onSwiped = this.onSwiped.bind(this);
    }

    componentDidMount() {
        window.addEventListener("click", this.onDragEndMouse);
        window.addEventListener("touchend", this.onDragEndTouch);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.onDragEndMouse);
        window.removeEventListener("touchend", this.onDragEndTouch);
    }


    onDragStartMouse(evt) {
        this.clickTarget = evt.target;
        this.onDragStart(evt.clientX);
        window.addEventListener("mousemove", this.onMouseMove);
    }


    onDragStartTouch(evt) {
        this.clickTarget = evt.target;
        const touch = evt.targetTouches[0];
        this.onDragStart(touch.clientX);
        window.addEventListener("touchmove", this.onTouchMove);
    }


    onDragStart(clientX) {
        this.dragged = true;
        this.dragStartX = clientX;
        this.listElement.className = "SwipeList__Item";
        requestAnimationFrame(this.updatePosition);
    }


    onDragEndMouse(evt) {
        window.removeEventListener("mousemove", this.onMouseMove);
        this.onDragEnd(evt);
    }


    onDragEndTouch(evt) {
        window.removeEventListener("touchmove", this.onTouchMove);
        this.onDragEnd(evt);
    }

    onDragEnd(evt) {
        if (this.dragged) {
            this.dragged = false;

            const threshold = this.props.threshold || 0.3;

            if ((this.right > this.listElement.offsetWidth * threshold) && !this.props.mock) {
                if (this.props.keep) {
                    this.right = 0;
                } else {
                    // fly out
                    this.right = (this.listElement.offsetWidth * 2);
                    // disapear
                    this.wrapper.style.maxHeight = 0;
                }
                this.onSwiped(evt);
            } else {
                this.right === 0 && this.onClicked(evt);
                this.right = 0;
            }

            this.listElement.className = "BouncingListItem";
            this.listElement.style.transform = `translateX(${this.right}px)`;
        }
    }


    onMouseMove(evt) {
        const right = evt.clientX - this.dragStartX;
        if (right > 0) {
            this.right = right;
        }
    }

    onTouchMove(evt) {
        const touch = evt.targetTouches[0];
        const right = touch.clientX - this.dragStartX;
        if (right > 0) {
            this.right = right;
        }
    }

    updatePosition() {
        if (this.props.mock) return;
        // Litle tricky, we must requestAnimationFrame not only
        // onDragStart but also if an item is currently being dragged
        if (this.dragged) {
            requestAnimationFrame(this.updatePosition);
        }

        this.listElement.style.transform = `translateX(${this.right}px)`;

        const opacity = (Math.abs(this.right) / 100).toFixed(2);
        if (opacity < 1 && opacity.toString() !== this.background.style.opacity) {
            this.background.style.opacity = opacity.toString();
        }
        if (opacity >= 1) {
            this.background.style.opacity = "1";
        }
    }

    onClicked(evt) {
        if (this.props.onClicked) {
            this.props.onClicked({ e: evt, target: this.clickTarget });
        }
    }

    onSwiped(evt) {
        if (this.props.onSwiped) {
            this.props.onSwiped({ e: evt, target: this.listElement });
        }
    }


    render() {
        return (
            <>
                <div className="Wrapper" ref={div => (this.wrapper = div)}>
                    <div ref={div => (this.background = div)} className="Background">
                        {this.props.background ? (
                            this.props.background
                        ) : (
                                <span>Delete</span>
                            )}
                    </div>
                    <div
                        ref={div => (this.listElement = div)}
                        onMouseDown={this.onDragStartMouse}
                        onTouchStart={this.onDragStartTouch}
                        className="SwipeList__Item"
                    >
                        {this.props.children}
                    </div>
                </div>
            </>
        );
    }
}

export default SwipeableListItem;