import React from 'react';
import {Platform, StyleSheet, Text, View} from "react-native";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import {CheckBox} from "react-native-elements";

export default function TaskElement({task, setChecked}) {

    const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
    const icon = new Date().getTime() < Date.parse(task.due) ? `${prefix}radio-button-off` : `${prefix}alert`;

    return (
        <View style={styles.taskElement}>
            {icon &&
            <View style={styles.taskElementIcon}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={Colors.tabIconDefault}
                />
            </View>
            }
            <Text style={styles.taskElementTitle}>{task.due} - {task.title}</Text>
            <View style={styles.checkBoxContainer}>
                <CheckBox
                    checked={task.checked}
                    onPress={() => setChecked()}
                />
            </View>
        </View>
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
        flexGrow: 1,
        lineHeight: 50
    },
    taskElementIcon: {
        alignSelf: 'center',
        flexGrow: 0,
        marginRight: 5
    },
    checkBoxContainer: {
        flexGrow: 0
    }
});
