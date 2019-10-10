import React, { Component } from 'react';
import { Input } from 'react-native-elements';
import { View, StyleSheet, Picker, Text, Platform, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import mLogger from '../util/mLogger';
import { Task } from '../models/Task';
import DateTimePicker from './DateTimePicker';
import FancyButton from './FancyButton';

export default class TaskEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      humanizedDate: 'Today',
      title: (props.task && props.task.title) || '',
      repeats: (props.task && props.task.repeats) || false,
      animVal: new Animated.Value(0),
      isOpen: false,
      errors: {
        desc: '',
      },
    };
  }

  async open() {
    await this.setState({ ...this.state, ...{ isOpen: true } });
    Animated.spring(this.state.animVal, {
      toValue: 1,
    }).start();
  }

  async componentWillReceiveProps(nextProps, nextContext) {
    const state = {
      date: (nextProps.task && new Date(+nextProps.task.timeStamp)) || new Date(),
      title: (nextProps.task && nextProps.task.title) || '',
      repeats: (nextProps.task && nextProps.task.repeats) || false,
      humanizedDate: (nextProps.task && nextProps.task.humanizedDate) || 'Today',
    };
    await this.setState({ ...this.state, ...state });
    if (nextProps.task) {
      this.open();
    }
  }

  close() {
    const state = {
      date: new Date(),
      title: '',
      repeats: null,
      humanizedDate: 'Today',
      isOpen: false,
    };
    this.setState({ ...this.state, ...state });
    Keyboard.dismiss();
    Animated.spring(this.state.animVal, {
      toValue: 0,
    }).start();
    this.props.cancel();
  }

  async saveTask() {
    const og = this.props.task || {};
    const task = new Task({
      ...og,
      ...{
        title: this.state.title,
        date: this.state.date.getTime(),
        humanizedDate: this.state.humanizedDate,
        repeats: this.state.repeats,
      },
    });

    await task.cancelNotification();
    await task.createNotification();

    mLogger(`saving task: ${task}`);

    const tasks = await task.save();

    if (tasks) {
      await this.props.savedTask(tasks);
    } else {
      mLogger(`could not save task: ${task}`);
    }
    this.close();
  }

  render() {
    const style = [
      {
        maxHeight: this.state.animVal.interpolate({ inputRange: [0, 1], outputRange: [0.01, 60] }),
      },
    ];
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.formRow, style]}>
          {this.state.isOpen && (
            <View style={[styles.formElement, { flexGrow: 3 }]}>
              <Text style={styles.label}>Date</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <DateTimePicker
                  onDateChange={date => this.setState({ date })}
                  date={this.state.date}
                  textColor={Colors.primaryText}
                  borderColor={Colors.primaryText}
                />
              </View>
            </View>
          )}
          {this.state.isOpen && (
            <View style={[styles.formElement, { flexGrow: 2 }]}>
              <Text style={[styles.label, { marginLeft: 5 }]}>Repeats</Text>
              <Picker
                style={{ color: Colors.primaryText, height: 20 }}
                selectedValue={this.state.repeats}
                onValueChange={repeats => this.setState({ ...this.state, ...{ repeats } })}>
                <Picker.Item label="Never" value={null} />
                <Picker.Item label="Daily" value="day" />
                <Picker.Item label="Weekly" value="week" />
                <Picker.Item label="Monthly" value="month" />
                <Picker.Item label="Yearly" value="year" />
              </Picker>
            </View>
          )}
        </Animated.View>
        <View style={styles.formRow}>
          <View style={[styles.formElement, { padding: 0, marginBottom: 5 }]}>
            {/*<Text style={styles.label}>Task description</Text>*/}
            <Input
              placeholder="Enter task description..."
              errorMessage={this.state.errors.desc}
              value={this.state.title}
              onChangeText={text => this.setState({ ...this.state, ...{ title: text } })}
              placeholderTextColor={Colors.primaryText}
              inputContainerStyle={{ borderColor: Colors.primaryText }}
              inputStyle={{ color: Colors.primaryText }}
              onFocus={() => this.open()}
            />
          </View>
        </View>
        <Animated.View style={[styles.formRow, style]}>
          <Animated.View
            style={[
              styles.saveButton,
              {
                opacity: this.state.animVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.01, 1],
                }),
              },
            ]}>
            <FancyButton
              title="SAVE"
              filled={true}
              borderColor={Colors.primaryText}
              backgroundColor={Colors.primaryText}
              pressFn={() => this.saveTask()}
              textColor={Colors.primaryBackground}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.saveButton,
              {
                opacity: this.state.animVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.01, 1],
                }),
                paddingLeft: 10,
              },
            ]}>
            <FancyButton
              title="CANCEL"
              style={{ width: '100%' }}
              borderColor={Colors.primaryText}
              pressFn={() => this.close()}
              textColor={Colors.primaryText}
            />
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.transparent,
    opacity: 0.8,
  },
  formElement: {
    flexBasis: 1,
    flexShrink: 0,
    flexGrow: 1,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  formRow: {
    flexDirection: 'row',
    flexGrow: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  saveButton: {
    flexGrow: 1,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: Colors.primaryText,
    marginBottom: 10,
  },
});
