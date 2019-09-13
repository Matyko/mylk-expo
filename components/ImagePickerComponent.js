import React from 'react';
import {Button, Image, Platform, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import mLogger from "../util/mLogger";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import TouchableHighlight from "react-native-web/dist/exports/TouchableHighlight";

export default class ImagePickerComponent extends React.Component {
    state = {
        image: null,
    };

    render() {
        let { image } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                    name={Platform.OS === 'ios' ? 'ios-photos' : 'md-photos'}
                    size={35}
                    color={Colors.light}
                    onPress={() => this._pickImage()}
                />
                <Ionicons
                    name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
                    size={35}
                    color={Colors.light}
                    onPress={() => this._takeImage()}
                />
                {image &&
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>
        );
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        });

        mLogger(`image selected: ${JSON.stringify(result)}`);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    _takeImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        });

        mLogger(`image taken: ${JSON.stringify(result)}`);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    }
}
