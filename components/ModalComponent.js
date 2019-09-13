import React, {Component} from 'react';
import {Modal, Platform, Text, TouchableHighlight, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default class ModalComponent extends Component {

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}>
                <View style={styling}
                      onPress={() => this.props.closeModal()}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
                        size={35}
                        color={Colors.light}
                        onPress={() => this.props.closeModal()}
                    />
                </View>
                <View style={{marginTop: 22, flex: 1}}>
                    {this.props.children}
                </View>
            </Modal>
        );
    }
}

const styling = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    position: 'absolute',
    top: 10,
    right: 10,
};
