import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import CalendarElement from './CalendarElement';
import Colors, { hexToRgb } from '../constants/Colors';

export default function CalendarView(props) {
  const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const firstDate = new Date(props.date);
  const background = hexToRgb(Colors.primaryBackground);
  const today = new Date().getDate();
  const thisMonth =
    new Date().getFullYear() === props.date.getFullYear() &&
    new Date().getMonth() === props.date.getMonth();
  firstDate.setDate(1);
  const firstDay = firstDate.getDay();
  const daysInMonth = new Date(props.date.getFullYear(), props.date.getMonth() + 1, 0).getDate();
  const rows = [];

  let date = 1;
  let count = 1;
  for (let i = 0; i < 6; i++) {
    if (date < daysInMonth + 1) {
      rows[i] = [];
      for (let j = 0; j < 7; j++) {
        if (date < daysInMonth + 1) {
          if (firstDay <= count) {
            const newDate = new Date(props.date);
            newDate.setDate(date);
            rows[i].push(
              <TouchableOpacity
                onPress={() => props.onDatePress(newDate)}
                key={j}
                style={[
                  styles.cell,
                  (date === today && thisMonth) ||
                  (props.filterDate && date === props.filterDate.getDate())
                    ? {
                        backgroundColor: `rgba(${background.r},${background.g},${background.b},0.5)`,
                      }
                    : {},
                ]}>
                <CalendarElement
                  date={date}
                  events={props.events.filter(e => new Date(e.timeStamp).getDate() === date)}
                />
              </TouchableOpacity>
            );
            date++;
          } else {
            rows[i].push(<View key={j} style={styles.cell} />);
          }
          count++;
        } else {
          rows[i].push(<View key={j} style={styles.cell} />);
        }
      }
    } else {
      break;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.onDateChange(false)} style={styles.headerButton}>
          <Text>Prev.</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.yearText}>{props.date.getFullYear()}</Text>
          <Text style={styles.monthText}>{monthNames[props.date.getMonth()]}</Text>
        </View>
        <TouchableOpacity onPress={() => props.onDateChange(true)} style={styles.headerButton}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          {days.map(day => {
            return (
              <View key={day} style={styles.cell}>
                <Text>{day}</Text>
              </View>
            );
          })}
        </View>
        {rows.map((row, index) => {
          return (
            <View key={index} style={styles.row}>
              {row.map(e => {
                return e;
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexGrow: 1,
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 0,
  },
  headerButton: {
    marginHorizontal: 10,
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
  headerText: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginVertical: 10,
  },
  yearText: {
    fontSize: 28,
    color: Colors.lighter,
  },
  monthText: {
    fontSize: 18,
    color: Colors.light,
  },
  body: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cell: {
    width: '10%',
    margin: 3,
    padding: 3,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
