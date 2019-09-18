import React from 'react';
import {View, StyleSheet, ActivityIndicator, Animated} from "react-native";
import Colors from "../constants/Colors";

export default function Dots(props) {
    let animatedValue = new Animated.Value(0.2);
    const dots = [];

    for (let i = 0; i < props.maxNum; i++) {
        if (i < props.num) {
            dots.push(
                <View key={`filled-${i}`} style={{...styles.dot, ...styles.filledDot}}/>
            )
        } else {
            dots.push(
                <View key={i} style={styles.dot}/>
            )
        }
    }

    const handleAnimation = () => {
        Animated.sequence([
            Animated.timing(animatedValue, {toValue: 1.0, duration: 150, easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(animatedValue, {toValue: -1.0, duration: 300, easing: Easing.linear, useNativeDriver: true}),
            Animated.timing(animatedValue, {toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true})
        ]).start();
    };

    return (
        <View style={{...styles.dotHolder, ...{
                transform: [{
                    translateX: 0
                    // TODO shake animation
                    //     animatedValue.interpolate({
                    //     inputRange: [-1, 1],
                    //     outputRange: [-10, 10]
                    // })
                }]}}}>
            {!props.codeEntered && dots}
            {props.codeEntered &&
            <ActivityIndicator
                color={Colors.white}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    dotHolder: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dot: {
        borderColor: Colors.white,
        borderRadius: 10,
        borderWidth: 1,
        width: 10,
        height: 10,
        margin: 5
    },
    filledDot: {
        backgroundColor: Colors.white
    }
});
