import React, { Component } from 'react';
import { Platform, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import mLogger from '../util/mLogger';
import WEATHER_CONSTS from '../util/weatherConsts';

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
  }

  componentWillMount() {
    this._getLocationAsync();
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

  render() {
    return (
      <View>
        {this.state.loading && <ActivityIndicator />}
        {!this.state.loading && (
          <View>
            <Ionicons name={this.prefix + this.state.icon} size={40} color={this.state.color} />
            {this.state.name && <Text style={textStyle}>{this.state.temp}°C {this.state.name}</Text>}
          </View>
        )}
      </View>
    );
  }
}

const textStyle = {
  fontWeight: 'bold',
  letterSpacing: 1,
  textTransform: 'uppercase',
};
