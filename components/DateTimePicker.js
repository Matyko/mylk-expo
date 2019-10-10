import React from 'react';
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
  DATE: 'date',
  TIME: 'time',
};

export default function DateTimePicker(props) {
  const isIOS = Platform.OS === 'ios';
  let dateTime = props.date || new Date();
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
          date: dateTime,
          minDate: new Date(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          dateTime.setFullYear(year);
          dateTime.setMonth(month);
          dateTime.setDate(day);
          props.onDateChange(dateTime);
        }
      } catch ({ code, message }) {
        mLogger('Cannot open date picker', message);
      }
    }

    if (mode === constants.TIME) {
      try {
        const { action, hour, minute } = await TimePickerAndroid.open({
          hour: dateTime.getHours(),
          minute: dateTime.getMinutes(),
          is24Hour: true,
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          dateTime.setHours(+hour);
          dateTime.setMinutes(+minute);
          props.onDateChange(dateTime);
        }
      } catch ({ code, message }) {
        mLogger('Cannot open time picker', message);
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => startSelect(constants.DATE)}>
        <Text style={{ color: props.textColor || Colors.black }}>{getHumanizedDate(dateTime)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => startSelect(constants.TIME)}>
        <Text style={{ color: props.textColor || Colors.black }}>{getHumanizedTime(dateTime)}</Text>
      </TouchableOpacity>
      {showIOS && <DatePickerIOS date={dateTime} mode={props.mode} onDateChange={props.onDateChange} />}
    </View>
  );
}
