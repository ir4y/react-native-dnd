import React from 'react';
import _ from 'lodash';

import {
    View,
    PanResponder,
    Animated,
} from 'react-native';

function execForMached(dropZones, gesture, fn) {
    const { moveX, moveY } = gesture;
    _.map(dropZones, (ref) => {
        ref.view.measure((fx, fy, width, height, px, py) => {
            const matchY = moveY > py && moveY < py + height;
            const matchX = moveX > px && moveX < px + width;
            if (matchX && matchY) {
                fn(ref);
            }
        });
    });
}

export const DnD = React.createClass({
    childContextTypes: {
        onPanResponderMove: React.PropTypes.func.isRequired,
        onPanResponderRelease: React.PropTypes.func.isRequired,
        registerDropZone: React.PropTypes.func.isRequired,
    },

    getChildContext() {
        return {
            onPanResponderMove: (meta, nativeEvent, gesture) =>
                execForMached(this.dropZones, gesture, (ref) => ref.onOver(meta)),
            onPanResponderRelease: (meta, nativeEvent, gesture) =>
                execForMached(this.dropZones, gesture, (ref) => ref.onDrop(meta)),
            registerDropZone: this.registerDropZone,
        };
    },

    componentWillMount() {
        this.dropZones = [];
    },

    registerDropZone(ref) {
        this.dropZones.push(ref);
    },

    render() {
        return <View {...this.props} />;
    },
});

export const Draggable = React.createClass({
    propTypes: {
        meta: React.PropTypes.object.isRequired, // eslint-disable-line
        children: React.PropTypes.node.isRequired,
        style: View.propTypes.style,
    },

    contextTypes: {
        onPanResponderMove: React.PropTypes.func.isRequired,
        onPanResponderRelease: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            pan: new Animated.ValueXY(),
        };
    },

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (nativeEvent, gesture) => {
                this.state.pan.setValue({ x: gesture.dx, y: gesture.dy });
                this.context.onPanResponderMove(this.props.meta, nativeEvent, gesture);
            },
            onPanResponderRelease: (nativeEvent, gesture) => {
                this.state.pan.setValue({ x: 0, y: 0 });
                this.context.onPanResponderRelease(this.props.meta, nativeEvent, gesture);
            },
        });
    },

    render() {
        return (
            <Animated.View
                {...this.panResponder.panHandlers}
                style={[this.state.pan.getLayout(), this.props.style, { zIndex: 10000 }]}
            >
                {this.props.children}
            </Animated.View>
        );
    },
});

export const DropZone = React.createClass({
    propTypes: {
        onDrop: React.PropTypes.func.isRequired,
        onOver: React.PropTypes.func,
    },

    contextTypes: {
        registerDropZone: React.PropTypes.func.isRequired,
    },

    getDefaultProps() {
        return {
            onOver: _.identity,
        };
    },

    componentWillMount() {
        this.context.registerDropZone(this);
    },


    onDrop(meta) {
        this.props.onDrop(meta);
    },

    onOver(meta) {
        this.props.onOver(meta);
    },

    render() {
        const { onDrop, onOver, ...props } = this.props; // eslint-disable-line
        return (
            <View
                ref={(ref) => { this.view = ref; }}
                {...props}
            />
        );
    },
});
