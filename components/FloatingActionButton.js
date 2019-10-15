import { Animated, Platform, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import Colors from '../constants/Colors';

function useForceUpdate() {
  const [value, setState] = useState(true);
  return () => setState(!value);
}

let open = false;
const animVal = new Animated.Value(0);
const animate = (val) => {
  Animated.spring(animVal, {
    toValue: val,
  }).start();
};

export default function FloatingActionButton({ iconName, pressFunction, isLeft, subButtons }) {
  const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
  const icon = open ? prefix + 'close' : iconName ? prefix + iconName : `${prefix}add`;
  const position = isLeft ? { left: 10 } : { right: 10 };
  const forceUpdate = useForceUpdate();

  const mainButton = () => {
    if (subButtons && subButtons.length) {
      open = !open;
      animate(open ? 1 : 0);
    }
    if (pressFunction) {
      pressFunction();
    }
    forceUpdate();
  };

  const subButtonTap = (event, fn) => {
    event.stopPropagation();
    fn();
    open = false;
    forceUpdate();
  };

  return (
    <View style={{ ...styling, ...position }}>
      <View style={mainButtonStyle}>
        <TouchableOpacity onPress={() => pressFunction()}>
          <Ionicons name={icon} size={25} color={Colors.primaryText} onPress={() => mainButton()} />
        </TouchableOpacity>
      </View>
      {subButtons && !!subButtons.length && (
        <View style={[hidden, { transform: [{ translateY: -60 * subButtons.length }] }]}>
          {subButtons.map((button, index) => (
            <Animated.View
              key={button.icon}
              style={[
                hiddenButton,
                {
                  transform: [
                    {
                      translateY: animVal.interpolate({
                        inputRange: [0, 1],
                        outputRange: [(subButtons.length - index) * 50, 0],
                      }),
                    },
                    { scale: animVal.interpolate({ inputRange: [0, 1], outputRange: [0.01, 1] }) },
                  ],
                },
              ]}>
              <TouchableOpacity onPress={event => subButtonTap(event, button.fn)}>
                <Ionicons name={prefix + button.icon} size={25} color={Colors.primaryText} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
}

const styling = {
  marginTop: 8,
  marginBottom: 8,
  marginLeft: 15,
  marginRight: 15,
  bottom: 10,
  position: 'absolute',
};

const mainButtonStyle = {
  flexDirection: 'row',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
  padding: 10,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.primaryBackground,
  borderRadius: 60,
  width: 50,
  height: 50,
};

const hidden = {
  flexDirection: 'column',
  flex: 1,
  top: -10,
  left: 0,
  alignItems: 'center',
  backgroundColor: Colors.transparent,
  position: 'absolute',
  zIndex: 2,
};

const hiddenButton = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.primaryBackground,
  borderRadius: 60,
  width: 50,
  height: 50,
  margin: 5,
};
