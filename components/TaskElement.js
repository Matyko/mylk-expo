import React from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableWithoutFeedback} from "react-native";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import {CheckBox} from "react-native-elements";
import parseDate from "../util/parseDate";
import GestureRecognizer from 'react-native-swipe-gestures';
import Emoji from "react-native-emoji";
import getHumanizedData from "../util/formatDate";

export default function TaskElement({task, setChecked, deleteTask, toEdit}) {

    const DIRECTIONS = {
        RIGHT: 'RIGHT',
        LEFT: 'LEFT'
    };

    const showHidden = () => {
        if (deleteVisible) {
            deleteVisible = false;
            shrink.start();
        } else {
            deleteVisible = true;
            grow.start();
        }
    };

    const onSwipe = (gestureName) => {
        switch (gestureName) {
            case DIRECTIONS.LEFT:
                if (deleteVisible) {
                    showHidden()
                } else {
                    setChecked()
                }
                break;
            case DIRECTIONS.RIGHT:
                if (task.checked) {
                    setChecked()
                } else {
                    showHidden()
                }
                break;
        }
    };

    const getIcon = () => {
        const currentTime = new Date().getTime();
        const dueTime = task.timeStamp;
        return currentTime < dueTime || task.checked ? task.repeats ? `${prefix}refresh` : null : `${prefix}alert`;
    };


    const AnimatedClose = Animated.createAnimatedComponent(Ionicons);
    const animVal = new Animated.Value(0.01);
    const grow = Animated.spring(animVal,{toValue: 1, bounciness: 1});
    const shrink = Animated.spring(animVal, {toValue: 0, bounciness: 1});
    const interpolateIcon = animVal.interpolate({inputRange:[0,1], outputRange:[0,1]});
    const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
    const icon = getIcon();

    let deleteVisible = false;

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 30
    };

    return (
        <GestureRecognizer
            onSwipeLeft={() => onSwipe(DIRECTIONS.RIGHT)}
            onSwipeRight={() => onSwipe(DIRECTIONS.LEFT)}
            config={config}>
            <TouchableWithoutFeedback
                onLongPress={() => showHidden()}
                onPress={() => toEdit()}
            >
                <View style={{...styles.taskElement, ...{opacity: task.checked ? 0.6 : 1}}}>
                    <View style={styles.checkBoxContainer}>
                        <CheckBox
                            checked={task.checked}
                            onPress={() => setChecked()}
                            checkedColor={Colors.primaryBackground}
                        />
                    </View>
                    <View style={styles.taskElementTitle}>
                        <Text numberOfLines={1}>{task.title}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={styles.taskElementIcon}>
                                {icon &&
                                <Ionicons
                                    name={icon}
                                    size={20}
                                    color={Colors.tabIconDefault}
                                />
                                }
                                {task._emojis && task._emojis.map(e => {
                                    return <Text key={e.key}>{e.emoji}</Text>
                                    })
                                }
                            </View>
                            <Text numberOfLines={1}>{getHumanizedData(task.timeStamp)}</Text>
                        </View>
                    </View>
                    <View style={{flexGrow: 0, flexShrink: 1, flexBasis: 'auto', width: 40}}>
                        <AnimatedClose
                            name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
                            size={30}
                            color={Colors.primaryBackground}
                            style={{
                                position: 'absolute',
                                left: 5,
                                top: 8,
                                transform:[{scale: interpolateIcon}]}}
                            onPress={() => deleteTask()}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </GestureRecognizer>
    )
}

const styles = StyleSheet.create({
    taskElement: {
        backgroundColor: Colors.white,
        flexDirection: "row",
        borderRadius: 10,
        flex: 1,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
        padding: 10,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    taskElementTitle: {
        alignSelf: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'column',
        flexBasis: 'auto',
        overflow: 'hidden',
        lineHeight: 50
    },
    taskElementIcon: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto',
        alignSelf: 'center',
        flexDirection: 'row',
        marginRight: 5
    },
    checkBoxContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto'
    }
});
