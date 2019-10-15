import { Platform, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import Colors from '../constants/Colors';

function useForceUpdate() {
  const [value, setState] = useState(true);
  return () => setState(!value);
}

let open = false;

export default function FloatingActionButton({ iconName, pressFunction, isLeft, subButtons }) {
  const prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
  const icon = open ? prefix + 'close' : iconName ? prefix + iconName : `${prefix}add`;
  const position = isLeft ? { left: 10 } : { right: 10 };
  const forceUpdate = useForceUpdate();

  const mainButton = () => {
    if (subButtons && subButtons.length) {
      open = !open;
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
      {subButtons && !!subButtons.length && open && (
        <View style={[hidden, { transform: [{ translateY: -60 * subButtons.length }] }]}>
          {subButtons.map(button => (
            <View key={button.icon} style={hiddenButton}>
              <TouchableOpacity onPress={event => subButtonTap(event, button.fn)}>
                <Ionicons name={prefix + button.icon} size={25} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>
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
