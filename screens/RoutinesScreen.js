import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Colors from '../constants/Colors';
import RoutineElement from '../components/RoutineElement';

export default class RoutinesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routines: [
        {
          _id: 'testid',
          name: 'test',
          icon: 'moon',
        },
        {
          _id: 'testid1',
          name: 'test',
          icon: 'moon',
        },
        {
          _id: 'testid2',
          name: 'test',
          icon: 'moon',
        },
        {
          _id: 'testid3',
          name: 'test',
          icon: 'moon',
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.routinesContainer}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.routines}
          renderItem={({ item }) => <RoutineElement key={item._id} data={item} />}
        />
      </View>
    );
  }
}

RoutinesScreen.navigationOptions = {
  title: 'Routines',
  headerStyle: {
    backgroundColor: Colors.primaryBackground,
    height: 79,
  },
  headerTitleStyle: {
    color: Colors.primaryText,
    lineHeight: 79,
    fontFamily: 'laila-bold',
    fontWeight: 'normal',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  routinesContainer: {
    flexGrow: 1,
    paddingTop: 16,
  },
});
