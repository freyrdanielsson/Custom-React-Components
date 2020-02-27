/**
    Props:
    Required
        menu - React element that will be fitted in the menu
        title - String used for menu header
    Optional
        threshold - Double indicating the drag threshold for menu popup/close

    
    Usage:
    <SwipeableMenu props>
        <div>
            <p>Replace me with any single React element or an array of React elements!<p>
        </div>
    </SwipeableMenu>
 */

import React from "react";
import { motion } from "framer-motion";

import { MenuToggle } from './menuToggleSVG/menuToggleSVG';

import "./SwipeableMenu.css";

class SwipeableMenu extends React.Component {
    state = {
        dropped: false,
    }
    // DOM Refs
    menuHandle;
    wrapper;
    content;
    clickTarget;
    icon;
    // Drag & Drop
    dragStartY = 0;
    position = 0;
    dragged = false;

    constructor(props) {
        super(props);

        this.menuHandle = null;
        this.wrapper = null;
        this.content = null;
        this.clickTarget = null;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onDragStartMouse = this.onDragStartMouse.bind(this);
        this.onDragStartTouch = this.onDragStartTouch.bind(this);
        this.onDragEndMouse = this.onDragEndMouse.bind(this);
        this.onDragEndTouch = this.onDragEndTouch.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.popUp = this.popUp.bind(this);
        this.popDown = this.popDown.bind(this);
        this.addToggler = this.addToggler.bind(this);
    }

    componentDidMount() {
        window.addEventListener("mouseup", this.onDragEndMouse);
        window.addEventListener("touchend", this.onDragEndTouch);
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.onDragEndMouse);
        window.removeEventListener("touchend", this.onDragEndTouch);
    }


    onDragStartMouse(evt) {
        this.clickTarget = evt.target;
        this.onDragStart(evt.clientY);
        window.addEventListener("mousemove", this.onMouseMove);
    }


    onDragStartTouch(evt) {
        this.clickTarget = evt.target;
        const touch = evt.targetTouches[0];
        this.onDragStart(touch.clientY);
        window.addEventListener("touchmove", this.onTouchMove);
    }


    onDragStart(clientY) {
        this.dragged = true;
        this.dragStartY = clientY;
        this.menuHandle.className = "SwipeMenu__Handle";
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

            if (this.position > this.menuHandle.offsetWidth * threshold || this.position === 0) {
                this.popDown();
            } else {
                if (evt.path.find(i => i.className === 'SwipeMenu__Header')) {
                    this.popUp();
                }
            }

            this.menuHandle.className = "BouncingMenu__Handle";
        }
    }

    popDown() {
        this.position = '90%';
        this.menuHandle.style.transform = `translateY(${this.position})`;
        this.setState({ dropped: true });
    }

    popUp() {
        this.position = 0;
        this.setState({ dropped: false });
    }

    addToggler() {
        if (this.props.add) {
            this.state.dropped ? this.popUp() : this.popDown();
        }
    }


    onMouseMove(evt) {
        const position = evt.clientY - this.dragStartY;

        if (position > 0 && !this.state.dropped) {
            this.position = position;
        } else {
            // this.position = evt.clientY + position;
        }
    }

    onTouchMove(evt) {
        const touch = evt.targetTouches[0];
        const position = touch.clientY - this.dragStartY;
        if (position > 0 && !this.state.dropped) {
            this.position = position;
        }
    }

    updatePosition() {
        // Litle tricky, we must requestAnimationFrame not only
        // onDragStart but also if an item is currently being dragged
        if (this.dragged) {
            requestAnimationFrame(this.updatePosition);
        }

        this.menuHandle.style.transform = `translateY(${this.position}px)`;
    }

    render() {
        return (
            <div className={`SwipeMenu ${this.props.className}`}>
                <div className="SwipeMenu__Wrapper" ref={div => (this.wrapper = div)}>
                    <div
                        ref={div => (this.menuHandle = div)}
                        onMouseDown={e => this.onDragStartMouse(e)}
                        onTouchStart={e => this.onDragStartTouch(e)}
                        onTouchEnd={e => e.preventDefault()}
                        className="BouncingMenu__Handle"
                    >
                        <div className="SwipeMenu__Header">
                            <h3 className="SwipeMenu__Header-text"> {this.props.title} </h3>

                            <motion.nav
                                initial={false}
                                animate={this.state.dropped ? "open" : "closed"}
                            >
                                <MenuToggle />
                            </ motion.nav>

                        </div>
                        <div ref={div => (this.content = div)} className="SwipeMenu__Content">
                            {this.props.menu}
                        </div>
                    </div>

                    <div className="SwipeMenu__Default" onClick={this.addToggler}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default SwipeableMenu;