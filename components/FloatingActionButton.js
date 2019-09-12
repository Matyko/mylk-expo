import {Platform, View} from "react-native";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function FloatingActionButton({iconName, pressFunction}) {
    const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
    const icon = iconName ? prefix + iconName : `${prefix}add-circle`;

    return (
        <View style={styling} onPress={() => pressFunction()}>
            <Ionicons
                name={icon}
                size={40}
                color={Colors.tabIconDefault}
            />
        </View>
    )
}

const styling = {
    width: 40,
    height: 40,
    // position: 'absolute',
    bottom: 10,
    right: 10,
}
