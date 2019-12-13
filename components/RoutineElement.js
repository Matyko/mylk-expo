import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

export default function RoutineElement({ data }) {
  return (
    <View style={styles.routineElement}>
      <LinearGradient
        start={[1, 0]}
        end={[-0.5, 1]}
        colors={[Colors.primaryBackground, Colors.transparent]}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      <View style={styles.routineElementIcon}>
        {data.icon && (
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-' + data.icon : 'md-' + data.icon}
            size={35}
            color={Colors.white}
          />
        )}
      </View>
      <Text style={styles.routineElementTitle}>{data.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  routineElement: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    margin: 16,
    marginTop: 0,
    overflow: 'hidden',
  },
  routineElementTitle: {
    alignSelf: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    flexBasis: 'auto',
    overflow: 'hidden',
    color: Colors.white,
    lineHeight: 50,
  },
  routineElementIcon: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    marginRight: 5,
    padding: 16,
  },
});
