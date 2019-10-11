import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

export default class HomeScreenPill extends Component {
  handlePress() {
    if (this.props.handlePress) {
      this.props.handlePress();
    }
  }

  render() {
    return (
      <TouchableOpacity style={styles.infoPill} onPress={() => this.handlePress()}>
        <View style={{ width: '80%' }}>
          <Text
            style={{
              color: Colors.primaryText,
            }}>
            {this.props.text}
          </Text>
        </View>
        {this.props.icon && (
          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons
              name={(Platform.OS === 'ios' ? 'ios-' : 'md-') + this.props.icon}
              size={35}
              color={Colors.primaryText}
            />
            {!!this.props.count && (
              <View
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  bottom: 0,
                  right: 5,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: Colors.primaryBackground,
                  backgroundColor: Colors.white,
                }}>
                <Text style={{ color: Colors.primaryBackground, fontWeight: 'bold' }}>
                  {this.props.count}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  infoPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    backgroundColor: Colors.primaryBackground,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
