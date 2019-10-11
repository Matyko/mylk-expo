import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';
import Emoji from 'react-native-emoji';
import Colors from '../constants/Colors';
import getHumanizedData from '../util/formatDate';

export default function TaskElement({ task, setChecked, deleteTask, toEdit, emoji }) {
  const DIRECTIONS = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
  };

  const showHidden = () => {
    if (deleteVisible) {
      deleteVisible = false;
      shrink.start();
    } else {
      deleteVisible = true;
      grow.start();
    }
  };

  const onSwipe = gestureName => {
    switch (gestureName) {
      case DIRECTIONS.LEFT:
        if (deleteVisible) {
          showHidden();
        } else {
          setChecked();
        }
        break;
      case DIRECTIONS.RIGHT:
        if (task.checked) {
          setChecked();
        } else {
          showHidden();
        }
        break;
    }
  };

  const getIcon = () => {
    const currentTime = new Date().getTime();
    const dueTime = task.timeStamp;
    return currentTime < dueTime || task.checked
      ? task.repeats
        ? `${prefix}refresh`
        : null
      : `${prefix}alert`;
  };
  const animVal = new Animated.Value(0);
  const grow = Animated.spring(animVal, { toValue: 1, bounciness: 1 });
  const shrink = Animated.spring(animVal, { toValue: 0, bounciness: 1 });
  const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
  const icon = getIcon();

  let deleteVisible = false;

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 30,
  };

  return (
    <GestureRecognizer
      style={{ flex: 1, flexDirection: 'row' }}
      onSwipeLeft={() => onSwipe(DIRECTIONS.RIGHT)}
      onSwipeRight={() => onSwipe(DIRECTIONS.LEFT)}
      config={config}>
      <TouchableWithoutFeedback onLongPress={() => showHidden()} onPress={() => toEdit()}>
        <View style={{ ...styles.taskElement, ...{ opacity: task.checked ? 0.6 : 1 } }}>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              checked={task.checked}
              onPress={() => setChecked()}
              checkedColor={Colors.primaryBackground}
            />
          </View>
          <View style={styles.taskElementTitle}>
            <Text numberOfLines={1}>{task.title}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={styles.taskElementIcon}>
                {icon && <Ionicons name={icon} size={20} color={Colors.tabIconDefault} />}
                {emoji && task._emojis &&
                  !!task._emojis.length &&
                  task._emojis.map(e => {
                    return <Emoji key={e} name={e} />;
                  })}
              </View>
              <Text numberOfLines={1}>{getHumanizedData(task.timeStamp)}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={{
          flexGrow: 0,
          flexBasis: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          maxWidth: animVal.interpolate({ inputRange: [0, 1], outputRange: [0.01, 50] }),
          overflow: 'hidden',
          marginRight: animVal.interpolate({ inputRange: [0, 1], outputRange: [15, 7.5] }),
          marginLeft: animVal.interpolate({ inputRange: [0, 1], outputRange: [0, 7.5] }),
        }}>
        <Animated.View
          style={{
            transform: [
              { scale: animVal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) },
            ],
          }}>
          <TouchableOpacity onPress={() => deleteTask()}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
              size={30}
              color={Colors.primaryText}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  taskElement: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
  },
  taskElementTitle: {
    alignSelf: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    flexBasis: 'auto',
    overflow: 'hidden',
    lineHeight: 50,
  },
  taskElementIcon: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    marginRight: 5,
  },
  checkBoxContainer: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
  },
});
