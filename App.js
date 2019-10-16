import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import firebase from 'firebase';
import timerFix from './util/timerWarningFix';
import AppNavigator from './navigation/AppNavigator';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB7hQ1BKUnW77ZbVf3Wh1vxd1luqhOfSlU',
  authDomain: 'mylk-3110c.firebaseapp.com',
  databaseURL: 'https://mylk-3110c.firebaseio.com',
  projectId: 'mylk-3110c',
  storageBucket: '',
  messagingSenderId: '884642600594',
  appId: '1:884642600594:web:d10cd17a9e4ef90065384b',
};

firebase.initializeApp(firebaseConfig);

timerFix();

const auth = { loggedIn: false };

firebase.auth().onAuthStateChanged(user => {
  if (user != null) {
    auth.loggedIn = true;
  }
});

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {(Platform.OS === 'ios' && <StatusBar barStyle="default" />) || (
          <StatusBar translucent={true} />
        )}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/video/11.mp4')
    ]),
    Font.loadAsync({
      ...Ionicons.font,
      'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
      'nunito-black': require('./assets/fonts/Nunito-Black.ttf'),
      'nunito-extralight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
      'laila-regular': require('./assets/fonts/Laila-Regular.ttf'),
      'laila-bold': require('./assets/fonts/Laila-Bold.ttf'),
      'laila-light': require('./assets/fonts/Laila-Light.ttf'),
    }).then(() => {
      const customTextProps = {
        style: {
          fontFamily: 'nunito-regular',
        },
      };
      setCustomText(customTextProps);
      setCustomTextInput(customTextProps);
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
