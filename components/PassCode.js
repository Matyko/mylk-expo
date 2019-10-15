import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Dots from './Dots';

export default class PassCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      confirmation: '',
      codeLength: props.codeLength || 4,
      codeEntered: false,
      hasError: false,
    };
    this.animatedValue = new Animated.Value(0);
    this.numbers = [];
    this.setup();
  }

  setup() {
    for (let i = 0; i < 9; i++) {
      this.numbers.push(
        <TouchableOpacity key={i + 1} onPress={() => this.handlePress(i + 1)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{i + 1}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    this.numbers.push(
      <TouchableOpacity key={0} onPress={() => this.handlePress(0)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>0</Text>
        </View>
      </TouchableOpacity>
    );
    this.numbers.push(
      <View key="empty">
        <View style={[styles.button, { opacity: 0 }]}>
          <Text style={styles.buttonText} />
        </View>
      </View>
    );
    this.numbers.push(
      <TouchableOpacity key="backspace" onPress={() => this.backspace()}>
        <View style={[styles.button, { borderColor: 'transparent' }]}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-backspace' : 'md-backspace'}
            size={35}
            color={Colors.white}
          />
        </View>
      </TouchableOpacity>
    );
  }

  async handlePress(num) {
    const code = this.state.code + num;
    await this.setState({ ...this.state, ...{ code } });
    if (code.length === this.state.codeLength) {
      this.codeEntered();
    }
  }

  async backspace() {
    const code = this.state.code.substring(0, this.state.code.length - 1);
    await this.setState({ ...this.state, ...{ code } });
  }

  errorAnimation = () => {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedValue, {
        toValue: -1.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedValue, {
        toValue: 0.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => this.props.animationEnd);
  };

  codeEntered() {
    if (this.props.confirmNeeded) {
      const code1 = this.state.code;
      const code2 = this.state.confirmation;
      if (!code2) {
        this.setState({ ...this.state, ...{ code: '', confirmation: this.state.code } });
      } else if (
        code1.length !== this.state.codeLength ||
        code2.length !== this.state.codeLength ||
        code1 !== code2
      ) {
        this.setState({ ...this.state, ...{ code: '', confirmation: '' } });
        this.errorAnimation();
      } else {
        this.setState({ ...this.state, ...{ codeEntered: true } });
        this.props.codeEntered(this.state.code);
      }
    } else if (this.props.passCode && this.props.passCode !== this.state.code) {
      setTimeout(() => this.setState({ ...this.state, ...{ code: '', confirmation: '' } }), 300);
      this.errorAnimation();
    } else {
      this.setState({ ...this.state, ...{ codeEntered: true } });
      this.props.codeEntered(this.state.code);
    }
  }

  render() {
    const numbers = new Array(9);

    return (
      <View
        style={{
          ...styles.container,
          ...(this.props.backgroundColor ? { backgroundColor: this.props.backgroundColor } : {}),
        }}>
        <Animated.View
          style={{
            transform: [
              {
                translateX: this.animatedValue.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-25, 25],
                }),
              },
            ],
          }}>
          {!!this.state.confirmation && (
            <Text
              style={{
                position: 'absolute',
                color: Colors.white,
                transform: [{ translateY: -20 }],
              }}>
              Confirm code
            </Text>
          )}
          <Dots
            num={this.state.code.length}
            maxNum={this.state.codeLength}
            codeEntered={this.state.codeEntered}
          />
        </Animated.View>
        <View style={styles.buttonHolder}>{this.numbers}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBackground,
  },
  buttonHolder: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    marginVertical: 20,
  },
  button: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    margin: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
  },
});
