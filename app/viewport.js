import React, { Component } from 'react';

import {
    View,
    Text,
} from 'react-native';

import { Draggable, DnD, DropZone } from './dnd';
import styles from './styles';

export default class Viewport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0,
        };
    }

    render() {
        return (
            <DnD style={styles.mainContainer}>
                <DropZone
                    onDrop={(meta) => this.setState({ counter: this.state.counter + meta.value })}
                    style={styles.dropZone}
                >
                    <Text style={styles.text}>Drop me here!</Text>
                    <Text style={styles.text}>{this.state.counter}</Text>
                </DropZone>
                <View style={styles.draggableContainer}>
                    {[5, 25, 50, 100, 1000, 5000].map((value) => (
                        <View key={value}>
                            <Draggable
                                meta={{ value }}
                                style={styles.circle}
                            >
                                <Text style={styles.text}>
                                    { value }
                                </Text>
                            </Draggable>
                        </View>
                   ))}

                </View>
            </DnD>
        );
    }
}
