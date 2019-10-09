import React, { Component } from 'react';
import {
  DatePickerAndroid,
  TimePickerAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
  DatePickerIOS,
  Picker,
} from 'react-native';
import mLogger from '../util/mLogger';
import Colors from '../constants/Colors';
import getHumanizedData, { getHumanizedDate, getHumanizedTime } from '../util/formatDate';

const constants = {
  TODAY: 'Today',
  TOMORROW: 'Tomorrow',
  DATETIME: 'datetime',
  DATE: 'date',
  TIME: 'time',
  ALL_DAY: 'All day',
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
  NIGHT: 'Night',
  CUSTOM: 'Custom',
};

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    this.state = {
      dateTime: this.props.date || today,
      humanizedDate: '',
      humanizedTime: '',
      humanizedDateTime: '',
      showIOS: false,
      datePickerVal: constants.TODAY,
      timePickerVal: constants.ALL_DAY,
    };
    this.isIOS = Platform.OS === 'ios';
  }

  async componentWillMount() {
    await this.getHumanizedData(this.state.dateTime);
  }

  async getHumanizedData(date) {
    const humanizedDate = getHumanizedDate(date);
    const humanizedTime = getHumanizedTime(date);
    const humanizedDateTime = humanizedDate + ' ' + humanizedTime;
    await this.setState({
      ...this.state,
      ...{
        humanizedDate,
        humanizedTime,
        humanizedDateTime,
      },
    });
  }

  async startSelect(mode) {
    if (this.isIOS) {
      this.showIOS();
    } else {
      await this.selectAndroid(mode);
    }
  }

  async selectAndroid(mode) {
    if (mode === constants.DATE) {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: this.state.dateTime,
          minDate: new Date(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          await this.setDate(new Date(year, month, day));
        }
      } catch ({ code, message }) {
        mLogger('Cannot open date picker', message);
      }
    }

    if (mode === constants.TIME) {
      try {
        const { action, hour, minute } = await TimePickerAndroid.open({
          hour: this.state.dateTime.getHours(),
          minute: this.state.dateTime.getMinutes(),
          is24Hour: true,
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          const date = new Date(this.state.dateTime.getTime());
          date.setHours(+hour);
          date.setMinutes(+minute);
          await this.setDate(date);
        }
      } catch ({ code, message }) {
        mLogger('Cannot open time picker', message);
      }
    }
  }

  async setDate(dateTime) {
    await this.setState({ ...this.state, ...{ dateTime } });
    await this.getHumanizedData(dateTime);
    this.props.onDateChange({
      humanizedDate: this.state.humanizedDateTime,
      date: this.state.dateTime,
    });
  }

  async handleDateChange(val) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    switch (val) {
      case constants.TODAY:
        await this.setDate(today);
        break;
      case constants.TOMORROW:
        await this.setDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
        break;
      default:
        await this.startSelect(constants.DATE);
        break;
    }
  }

  async handleTimeChange(val) {
    const date = new Date(this.state.dateTime.getTime());
    switch (val) {
      case constants.MORNING:
        date.setHours(9);
        date.setMinutes(0);
        await this.setDate(date);
        break;
      case constants.AFTERNOON:
        date.setHours(12);
        date.setMinutes(0);
        await this.setDate(date);
        break;
      case constants.EVENING:
        date.setHours(18);
        date.setMinutes(0);
        await this.setDate(date);
        break;
      case constants.NIGHT:
        date.setHours(21);
        date.setMinutes(0);
        await this.setDate(date);
        break;
      default:
        this.startSelect(constants.TIME);
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => this.handleDateChange()}>
          <Text style={{ color: this.props.textColor || Colors.black }}>
            {getHumanizedDate(this.state.dateTime)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => this.handleTimeChange()}>
          <Text style={{ color: this.props.textColor || Colors.black }}>
            {getHumanizedTime(this.state.dateTime)}
          </Text>
        </TouchableOpacity>
        {this.state.showIOS && (
          <DatePickerIOS
            date={this.state.date}
            mode={this.props.mode}
            onDateChange={this.setDate}
          />
        )}
      </View>
    );
  }
}
