import React, { Component } from 'react';
import _ from 'lodash';

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
            bank: 0,
            stack: {
                5: 10,
                25: 10,
                50: 10,
                100: 10,
                1000: 10,
                5000: 10,
            },
        };

        this.doExchage.bind(this);
    }

    doExchage(volume) {
        const toVolume = parseInt(volume);
        return ({ volume }) => {
            const fromVolume = parseInt(volume);
            let state = { ...this.state };

            if (toVolume === fromVolume) {
                return;
            }

            if (toVolume < fromVolume) {
                state.stack[fromVolume] -= 1;
                state.stack[toVolume] += fromVolume / toVolume;
            }

            if (toVolume > fromVolume && state.stack[fromVolume] >= (toVolume / fromVolume)) {
                state.stack[toVolume] += 1;
                state.stack[fromVolume] -= (toVolume / fromVolume);
            }

            this.setState(state);
        };
    }

    render() {
        return (
            <DnD style={styles.mainContainer}>
                <View style={styles.draggableContainer}>
                    {_.map(this.state.stack, (count, volume) => {
                        let inner;
                        if (count <= 0) {
                            inner = (
                                <View
                                    style={styles.empty}
                                >
                                    <Text style={styles.text}>
                                        {volume}
                                    </Text>
                                </View>
                            );
                        } else {
                            inner = (
                                <View key={volume}>
                                    <Draggable
                                        disable={volume === '0'}
                                        meta={{ volume }}
                                        style={styles.circle}
                                    >
                                        <Text style={styles.text}>
                                            { volume }x{ count }
                                        </Text>
                                    </Draggable>
                                </View>
                            );
                        }
                        return (
                            <DropZone
                                key={volume}
                                onDrop={this.doExchage(volume)}
                            >
                                {inner}
                            </DropZone>
                        );
                    })}
                </View>
                <DropZone
                    onDrop={(meta) => {
                        let state = { ...this.state };
                        state.bank += parseInt(meta.volume);
                        state.stack[meta.volume] -= 1;
                        this.setState(state);
                    }}
                    style={styles.dropZone}
                >
                    <Text style={styles.text}>Bank</Text>
                    <Text style={styles.text}>{this.state.bank}</Text>
                </DropZone>
            </DnD>
        );
    }
}
