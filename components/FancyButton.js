import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import Colors from "../constants/Colors";

export default class FancyButton extends Component {

    press() {
        if (this.props.pressFn) {
            this.props.pressFn()
        }
    }

    longPress() {
        if (this.props.longPressFn) {
            this.props.longPressFn()
        }
    }

    render() {
        return (
            <TouchableOpacity
                onLongPress={() => this.longPress()}
                onPress={() => this.press()}>
                <View
                    style={this.props.filled ?
                        styles.containerFilled :
                        styles.container}>
                    <Text
                        style={this.props.filled ?
                            styles.textFilled :
                            styles.text}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.transparent,
        borderColor: Colors.primaryBackground,
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 10,
        marginVertical: 22,
        minHeight: 40
    },
    containerFilled: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.primaryBackground,
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 10,
        marginVertical: 22,
        minHeight: 40
    },
    text: {
        borderColor: Colors.transparent,
        color: Colors.primaryBackground,
    },
    textFilled: {
        borderColor: Colors.transparent,
        color: Colors.primaryText
    }
});
