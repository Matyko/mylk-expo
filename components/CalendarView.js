import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import CalendarElement from './CalendarElement';

export default function CalendarView(props) {
  const days = ['Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.', 'Sun.'];
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
  firstDate.setDate(1);
  const firstDay = firstDate.getDay();
  const num = new Date(props.date.getFullYear(), props.date.getMonth(), 0).getDate();
  const daysInMonth = new Array(num);

  const rows = [];
  let date = 1;
  for (let i = 0; i < 6; i++) {
      rows[i] = [];
    for (let j = 0; j < 7; j++) {
      if (date < daysInMonth) {
        if (firstDay <= j) {
          rows[i].push(
            <View style={styles.cell}>
              <CalendarElement
                date={date}
                key={date}
                events={props.events.filter(e => new Date(e.timeStamp).getDate() === date)}
              />
            </View>
          );
        } else {
          rows[i].push(<View key={j} style={styles.cell} />);
        }
        date++;
      } else {
        break;
      }
    }
  }

  console.log(rows)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button style={styles.headerButton}>Prev.</Button>
        <Text style={styles.headerText}>
          {props.date.getFullYear()} - {monthNames[props.date.getMonth()]}
        </Text>
        <Button style={styles.headerButton}>Next</Button>
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
      flex: 1,
      backgroundColor: 'gray'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
      backgroundColor: 'green',
      flexGrow: 0
  },
  headerButton: {},
  headerText: {},
  body: {
    flexDirection: 'column',
      backgroundColor: 'yellow',
      flexGrow: 1
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: 'black',
  },
});
