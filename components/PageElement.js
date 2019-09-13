import React from 'react';
import {Text, View, TouchableHighlight} from "react-native";

export default function PageElement({page, openCamera}) {
    return (
        <View>
            <Text>{page.date}</Text>
            <TouchableHighlight onPress={() => openCamera}>
                <Text>+ Add image</Text>
            </TouchableHighlight>
            <Text>{page.text}</Text>
        </View>
    )
}
