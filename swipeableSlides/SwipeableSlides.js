/**
    Props:
    Required:
        onSwipedLeft - Handler function for left swipe
        onSwipedRight - Handler function for right swipe
 
    Usage:
        <SwipeableSlides props>
            <div>
                <p>Replace me with any single React element or an array of React elements!<p>
            </div>
        </SwipeableSlides>
 */

import React, { useEffect } from 'react';
import { Draggable, TimelineLite } from 'gsap/all';

import './SwipeableSlides.css';

export default function SwipeableSlides(props) {

    useEffect(() => {
        let draggables = []
        function connectDraggable() {
            draggables = Draggable.create('.swipe-slide-Draggable', {
                allowContextMenu: true, // Leyfa hægri smell
                minimumMovement: 6, //pls have this same as delta in Swipeable
                type: "x",
                cursor: "mouse",
                dragClickables: false,
                onDragEnd: slideCard
            });
        }

        connectDraggable();

        return function disconnectDraggable() {
            draggables[0].kill();
        }

    });

    function slideCard(dir) {
        // means user is swiping vertical
        if (!!this && this.endX === 0) return;

        // this er bara ehv ef þetta var fired með drag
        // hef þetta svona svo ég geti implementað takka seinna
        // sem sendir þa inn dir breytuna
        const endX = (this === undefined) ? 0 : this.endX;
        const dragDir = (this === undefined) ? dir : this.getDirection();
        const slideDir = (dragDir === 'right') ? 1 : -1;

        const slideTimeline = new TimelineLite();
        slideTimeline
            // use class selector bc ref is null here ¯\_(ツ)_/¯
            .to(".swipe-slide-Draggable", 0.4, {
                x: endX + (300 * slideDir),
                opacity: 0
            })
            .set(".swipe-slide-Draggable", { x: -300 * slideDir }, 0.4)
            .to(".swipe-slide-Draggable", 1, {
                x: 0,
                opacity: 1
            })
            .play();

        setTimeout(() => onSwiped(dragDir), 400);
    }

    function onSwiped(dir) {
        if (dir === 'left') {
            props.onSwipedLeft();
        } else {
            props.onSwipedRight();
        }
    }


    return (
        <div className="swipe-slide-Draggable">
            {props.children}
        </div>
    );
}