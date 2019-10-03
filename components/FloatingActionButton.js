import {Platform, TouchableOpacity} from "react-native";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function FloatingActionButton({iconName, pressFunction, isLeft}) {
    const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
    const icon = iconName ? prefix + iconName : `${prefix}add`;
    const position = isLeft ? {left: 10} : {right: 10}

    return (
        <TouchableOpacity style={{...styling, ...position}}
              onPress={() => pressFunction()}>
            <Ionicons
                name={icon}
                size={25}
                color={Colors.primaryText}
                onPress={() => pressFunction()}
            />
        </TouchableOpacity>
    )
}

const styling = {
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBackground,
    borderRadius: 60,
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 10
};
