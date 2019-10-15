import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function CalendarElement(props) {

  const today = new Date().getDate();

  return (
    <View>
      <View style={styles.cElement}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.cText, {color: props.date === today ? Colors.primaryText : Colors.dark}]}>{props.date}</Text>
        </View>
        <View style={{ minHeight: 20, justifyContent: 'center', alignItems: 'center' }}>
          {!!props.events.length && (
            <View style={styles.cEvents}>
              {props.events.map(e => {
                return (
                  <View
                    key={e._id}
                    style={[
                      styles.cEvent,
                      { backgroundColor: e.mood ? e.mood.color : Colors.primaryBackground },
                    ]}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cElement: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  cText: {
    textAlign: 'center',
  },
  cEvents: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cEvent: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginTop: 2,
    marginHorizontal: 2,
  },
});
