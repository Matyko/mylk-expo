import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '../constants/Colors';

export default function CalendarElement(props) {
    console.log(props.date);
  return (
    <View style={styles.cElement}>
      <Text style={styles.cText}>{props.date}</Text>
      {!!props.events.length && (
        <View>
          {props.events.map(e => {
            return (
              <View
                  key={e._id}
                style={[
                  styles.cEvent,
                  { backgroundColor: e.mood ? e.mood.color : Colors.primaryBackground },
                ]}/>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cElement: {},
  cText: {},
  cEvent: {},
});
