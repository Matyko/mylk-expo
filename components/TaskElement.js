import React from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableWithoutFeedback} from "react-native";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import {CheckBox} from "react-native-elements";
import parseDate from "../util/parseDate";

export default function TaskElement({task, setChecked, deleteTask, toEdit}) {

    const handleLongPress = () => {
        if (deleteVisible) {
            deleteVisible = false;
            shrink.start();
        } else {
            deleteVisible = true;
            grow.start();
        }
    };

    const getIcon = () => {
        const currentTime = new Date().getTime();
        const dueTime = parseDate(task.date);
        return currentTime < dueTime || task.checked ? null : `${prefix}alert`;
    };


    const AnimatedClose = Animated.createAnimatedComponent(Ionicons);
    const animVal = new Animated.Value(0.01);
    const grow = Animated.spring(animVal,{toValue: 1, bounciness: 1});
    const shrink = Animated.spring(animVal, {toValue: 0, bounciness: 1});
    const interpolateIcon = animVal.interpolate({inputRange:[0,1], outputRange:[0,1]});
    const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
    const icon = getIcon();

    let deleteVisible = false;

    return (
        <TouchableWithoutFeedback
            onLongPress={() => handleLongPress()}
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
                    <View style={{flexDirection: 'row'}}>
                        {icon &&
                        <View style={styles.taskElementIcon}>
                            <Ionicons
                                name={icon}
                                size={20}
                                color={Colors.tabIconDefault}
                            />
                        </View>
                        }
                        <Text numberOfLines={1}>{task.date}</Text>
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
    )
}

const styles = StyleSheet.create({
    taskElement: {
        backgroundColor: '#fff',
        flexDirection: "row",
        borderRadius: 10,
        flex: 1,
        shadowColor: "#000",
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
        marginRight: 5
    },
    checkBoxContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto'
    }
});
