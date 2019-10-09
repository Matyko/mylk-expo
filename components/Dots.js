import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import Colors from '../constants/Colors';

export default class Dots extends Component {
  constructor(props) {
    super(props);
    this.dots = [];
  }

  render() {
    this.dots = [];
    for (let i = 0; i < this.props.maxNum; i++) {
      if (i < this.props.num) {
        this.dots.push(<View key={`filled-${i}`} style={{ ...styles.dot, ...styles.filledDot }} />);
      } else {
        this.dots.push(<View key={i} style={styles.dot} />);
      }
    }

    return (
      <View style={styles.dotHolder}>
        {!this.props.codeEntered && this.dots}
        {this.props.codeEntered && <ActivityIndicator color={Colors.white} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dotHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    borderColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    width: 10,
    height: 10,
    margin: 5,
  },
  filledDot: {
    backgroundColor: Colors.white,
  },
});
