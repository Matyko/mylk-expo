import React from 'react';
import Emoji from "react-native-emoji";
import { View } from "react-native";

export default function EmojiAddon(props) {
    return (
        <View style={{flexDirection: 'row'}}>
            <Emoji name={props.name} style={{flexGrow: 0, fontSize: (props.fontSize || 25), marginLeft: (props.marginLeft || 5)}}/>
            <View style={{flexGrow: 1}}>
                {props.children}
            </View>
        </View>
    )
}

