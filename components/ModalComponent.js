import React, {Component} from 'react';
import {Modal, Platform, Text, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default class ModalComponent extends Component {

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}>
                <View style={{
                    flexGrow: 0,
                    height: 79,
                    backgroundColor: Colors.primaryBackground,
                    paddingLeft: 22,
                    paddingRight: 79}}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        lineHeight: 79,
                        color: Colors.primaryText
                    }}>
                        {this.props.title}
                    </Text>
                </View>
                <View style={styling}
                      onPress={() => this.props.closeModal()}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
                        size={35}
                        color={Colors.primaryText}
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
    top: 22,
    right: 22,
};
