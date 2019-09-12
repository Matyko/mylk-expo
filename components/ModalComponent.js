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
                        name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
                        size={20}
                        color={Colors.lighter}
                        onPress={() => this.props.closeModal()}
                    />
                </View>
                <View style={{marginTop: 22}}>
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
    backgroundColor: Colors.light,
    borderRadius: 60,
    width: 35,
    height: 35,
    position: 'absolute',
    top: 10,
    right: 10,
    transform: [{ rotate: '45deg'}]
};
