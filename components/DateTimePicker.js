import React, { Component, useEffect } from 'react';
import {
  DatePickerAndroid,
  TimePickerAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
  DatePickerIOS,
} from 'react-native';
import mLogger from '../util/mLogger';
import Colors from '../constants/Colors';
import { getHumanizedDate, getHumanizedTime } from '../util/formatDate';

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

export default function DateTimePicker(props) {
  const isIOS = Platform.OS === 'ios';
  const today = new Date();

  today.setHours(0);
  today.setMinutes(0);

  let dateTime = props.date || today;
  let showIOS = false;

  const startSelect = mode => {
    if (isIOS) {
      showIOS = true;
    } else {
      selectAndroid(mode);
    }
  };

  const selectAndroid = async mode => {
    if (mode === constants.DATE) {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: this.state.dateTime,
          minDate: new Date(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          await setDate(new Date(year, month, day));
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
  };

  const setDate = date => {
    showIOS = false;
    dateTime = date;
    props.onDateChange(dateTime);
  };

  const date = getHumanizedDate(dateTime);
  const time = getHumanizedTime(dateTime);

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => startSelect(constants.DATE)}>
        <Text style={{ color: props.textColor || Colors.black }}>{date}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => startSelect(constants.TIME)}>
        <Text style={{ color: props.textColor || Colors.black }}>{time}</Text>
      </TouchableOpacity>
      {showIOS && <DatePickerIOS date={dateTime} mode={props.mode} onDateChange={this.setDate} />}
    </View>
  );
}
