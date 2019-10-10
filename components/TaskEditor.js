import React, { Component } from 'react';
import { Input } from 'react-native-elements';
import { View, StyleSheet, Picker, Text, Platform, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import mLogger from '../util/mLogger';
import { Task } from '../models/Task';
import DateTimePicker from './DateTimePicker';

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

  open() {
    this.setState({ ...this.state, ...{ isOpen: true } });
    Animated.spring(this.state.animVal, {
      toValue: 1,
    }).start();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps.task && new Date(nextProps.task.timeStamp));
    const state = {
      date: (nextProps.task && new Date(+nextProps.task.timeStamp)) || new Date(),
      title: (nextProps.task && nextProps.task.title) || '',
      repeats: (nextProps.task && nextProps.task.repeats) || false,
      humanizedDate: (nextProps.task && nextProps.task.humanizedDate) || 'Today',
    };
    this.setState({ ...this.state, ...state });
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
      { maxHeight: this.state.animVal.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }) },
    ];
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.formRow, style]}>
          {this.isOpen && (
            <View style={[styles.formElement, { flexGrow: 3 }]}>
              <Text style={styles.label}>Date</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <DateTimePicker
                  onDateChange={({ date, humanizedDate }) =>
                    this.setState({
                      ...this.state,
                      ...{
                        humanizedDate,
                        date,
                      },
                    })
                  }
                  date={this.state.date}
                  textColor={Colors.primaryText}
                  borderColor={Colors.primaryText}
                />
              </View>
            </View>
          )}
          <View style={[styles.formElement, { flexGrow: 2 }]}>
            <Text style={styles.label}>Repeats</Text>
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
        </Animated.View>
        <View style={styles.formRow}>
          <View style={styles.formElement}>
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
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'}
              size={35}
              color={Colors.primaryText}
              onPress={() => this.saveTask()}
            />
          </Animated.View>
        </View>
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
    flexGrow: 0,
    minWidth: 30,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: Colors.primaryText,
    marginBottom: 10,
  },
});
