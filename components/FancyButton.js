import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native";
import Colors from "../constants/Colors";

export default class FancyButton extends Component {

    press() {
        if (this.props.pressFn && !this.props.loading) {
            this.props.pressFn()
        }
    }

    longPress() {
        if (this.props.longPressFn && !this.props.loading) {
            this.props.longPressFn()
        }
    }

    render() {
        const loaderColor = this.props.filled ? Colors.primaryText : Colors.primaryBackground;
        return (
            <TouchableOpacity
                onLongPress={() => this.longPress()}
                onPress={() => this.press()}>
                <View
                    style={{...(this.props.filled ?
                        styles.containerFilled :
                        styles.container),
                    ...(this.props.backgroundColor ?
                        {backgroundColor: this.props.backgroundColor} :
                        {}),
                    ...(this.props.borderColor ?
                        {borderColor: this.props.borderColor} :
                        {})}}>
                    {!this.props.loading &&
                    <Text
                        style={{...(this.props.filled ?
                            styles.textFilled :
                            styles.text),
                            ...(this.props.textColor ?
                        {color: this.props.textColor} :
                        {})}}>{this.props.title}</Text>}
                    {this.props.loading &&
                        <ActivityIndicator color={this.props.textColor ? this.props.textColor : loaderColor}/>
                    }
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
