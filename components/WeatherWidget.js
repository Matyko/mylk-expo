import React, { Component } from 'react';
import { Platform, Text, View, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import mLogger from '../util/mLogger';
import WEATHER_CONSTS from '../util/weatherConsts';
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import Colors from '../constants/Colors';

export default class WeatherWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      permission: false,
      icon: props.isNight ? 'moon' : 'sunny',
      color: props.isNight ? '#902cff' : '#ffa800',
      loading: true,
      name: '',
      temp: 0,
    };
    this.prefix = Platform.OS === 'ios' ? 'ios-' : 'md-';
    this.animVal = new Animated.Value(0);
  }

  async componentDidMount() {
    const enabled = (await Storage.getItem(STORAGE_CONSTS.WEATHER)) || false;
    if (enabled) {
      this._getLocationAsync();
    } else {
      this.setState({ ...this.state, ...{ loading: false } });
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      await this.setState({ location });
      this._getWeather();
    } catch (e) {
      mLogger('Could not get location data');
    }
  };

  _getWeather = async () => {
    try {
      const locationResponse = await fetch(
        `https://www.metaweather.com/api/location/search/?lattlong=${this.state.location.coords.latitude},${this.state.location.coords.longitude}`
      );
      const locationJson = await locationResponse.json();
      const { woeid } = locationJson[0];
      const weatherResponse = await fetch(`https://www.metaweather.com/api/location/${woeid}`);
      const weatherJson = await weatherResponse.json();
      const weather = weatherJson.consolidated_weather[0];
      const temp = weather.the_temp;
      const { icon, color, name } = WEATHER_CONSTS[weather.weather_state_abbr];
      await this.setState({
        ...this.state,
        ...{ icon, color, name, temp },
      });
      this.forceUpdate();
    } catch (e) {
      mLogger('Could not get weather data');
    } finally {
      this.setState({ ...this.state, ...{ loading: false } });
    }
  };

  async toggle() {
    if (this.state.isOpen) {
      await this.setState({ ...this.state, ...{ isOpen: false } });
      Animated.spring(this.animVal, {
        toValue: 0,
      }).start();
    } else {
      await this.setState({ ...this.state, ...{ isOpen: true } });
      Animated.spring(this.animVal, {
        toValue: 1,
      }).start();
    }
  }

  render() {
    const style = [
      {
        maxHeight: this.animVal.interpolate({ inputRange: [0, 1], outputRange: [0.01, 60] }),
      },
    ];
    return (
      <TouchableOpacity onPress={() => this.toggle()}>
        <View>
          {this.state.loading && <ActivityIndicator />}
          {!this.state.loading && (
            <View
              style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={this.prefix + this.state.icon} size={40} color={this.state.color} />
              </View>
              {!!this.state.name && (
                <Animated.View style={[{ overflow: 'hidden' }, style]}>
                  <Text style={textStyle}>{this.state.name}</Text>
                  <Text style={textStyle}>{this.state.temp}°C</Text>
                </Animated.View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const textStyle = {
  fontWeight: 'bold',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginTop: 5,
  color: Colors.light,
  textAlign: 'center',
};
