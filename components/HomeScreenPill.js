import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from "react-native";
import Colors from "../constants/Colors";

export default class HomeScreenPill extends Component {

    handlePress() {
        if (this.props.handlePress) {
            this.props.handlePress();
        }
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.infoPill}
                onPress={() => this.handlePress()}>
                <Text style={styles.infoPillText}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    infoPill: {
        flex: 1,
        borderRadius: 10,
        padding: 20,
        backgroundColor: Colors.primaryBackground,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: -3
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 1
            }
        }),
    },
    infoPillText: {
        color: Colors.primaryText
    }
});
