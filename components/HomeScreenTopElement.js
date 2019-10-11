import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { Component } from 'react';
import Colors from '../constants/Colors';

export default class HomeScreenTopElement extends Component {
  constructor(props) {
    super(props);
    this.state = this.getTime();
    this.interval = setInterval(() => {
      const state = this.getTime;
      this.setState(state);
    }, 1000);
  }

  getTime = () => {
    const isIOS = Platform.OS === 'ios';
    const dateObj = new Date();
    const date = dateObj.toDateString();
    const hours =
      dateObj.getHours().toString().length === 1 ? '0' + dateObj.getHours() : dateObj.getHours();
    const minutes =
      dateObj.getMinutes().toString().length === 1
        ? '0' + dateObj.getMinutes()
        : dateObj.getMinutes();
    const isNight = +hours > 18;
    const icon = isNight ? (isIOS ? 'ios-moon' : 'md-moon') : isIOS ? 'ios-sunny' : 'md-sunny';
    return { date, hours, minutes, icon };
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'column',
          flex: 1,
          marginTop: 20,
          marginBottom: 40,
        }}>
        <Ionicons name={this.state.icon} size={40} color={Colors.primaryBackground} />
        <Text style={[styles.text, { fontSize: 20, marginVertical: 15 }]}>
          {this.state.hours < 12
            ? 'Good morning!'
            : this.state.hours > 19
            ? 'Good evening!'
            : 'Good afternoon!'}
        </Text>
        <Text style={[styles.text, { fontSize: 40 }]}>
          {this.state.hours}:{this.state.minutes}
        </Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>{this.state.date}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    textAlign: 'center',
  },
});
