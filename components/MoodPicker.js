import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Emoji from 'react-native-emoji';
import Colors from '../constants/Colors';
import MOODS from '../constants/Moods';

export default class MoodPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moods: JSON.parse(JSON.stringify(MOODS)),
      selected: props.selected || null,
      opened: props.opened || null,
    };
  }

  open(mood) {
    this.setState({ ...this.state, ...{ opened: mood } });
  }

  select(selectedSynonym) {
    const moods = this.state.moods.map(m => {
      m.selectedSynonym = null;
      if (m.id === this.state.opened.id) {
        m.selectedSynonym = selectedSynonym;
      }
      return m;
    });
    this.setState({ ...this.state, ...{ selected: this.state.opened, opened: null, moods } });
    this.props.onPick(this.state.opened);
  }

  deselect() {
    if (!this.props.fixed) {
      this.setState({ ...this.state, ...{ selected: null } });
      this.props.onPick(null);
    }
  }

  render() {
    return (
      <View>
        {this.state.selected && (
          <View style={styles.wrapper}>
            {!this.props.fixed && <Text style={styles.title}>I'm feeling</Text>}
            <View style={styles.summary}>
              <Emoji style={styles.emoji} name={this.state.selected.emoji} />
              <TouchableOpacity
                style={[styles.textHolder, { backgroundColor: this.state.selected.color }]}
                onPress={() => this.deselect()}>
                <Text style={styles.text}>{this.state.selected.selectedSynonym}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!this.state.selected && (
          <View style={styles.wrapper}>
            <Text style={styles.title}>How are you feeling?</Text>
            {this.state.opened && (
              <View style={styles.popup}>
                {this.state.opened.synonyms.map(synonym => {
                  return (
                    <TouchableOpacity
                      key={synonym}
                      style={[styles.textHolder, { backgroundColor: this.state.opened.color }]}
                      onPress={() => this.select(synonym)}>
                      <Text style={styles.text}>{synonym}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <View style={styles.emojiWrapper}>
              {this.state.moods.map(mood => {
                return (
                  <View key={mood.id}>
                    <TouchableOpacity onPress={() => this.open(mood)}>
                      <Emoji style={styles.emoji} name={mood.emoji} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  emojiWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.lighter,
    position: 'absolute',
    transform: [{ translateY: -100 }],
    padding: 5,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  emojiHolder: {
    margin: 10,
  },
  emoji: {
    fontSize: 25,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light,
  },
  textHolder: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  text: {
    color: Colors.white,
  },
  summary: {
    flexDirection: 'row',
  },
});
