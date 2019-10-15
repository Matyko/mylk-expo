import React, { Component } from 'react';
import { Input } from 'react-native-elements';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import formatDate from '../util/formatDate';
import Colors from '../constants/Colors';
import mLogger from '../util/mLogger';
import ImagePickerComponent from './ImagePickerComponent';
import FancyButton from './FancyButton';
import { Page } from '../models/Page';
import DateTimePicker from './DateTimePicker';
import MoodPicker from './MoodPicker';

export default class PageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.page ? new Date(props.page.timeStamp) : new Date(),
      humanizedDate: props.page ? props.page.humanizedDate : '',
      text: props.page ? props.page.text : '',
      images: props.page ? props.page.images : [],
      mood: props.page ? props.page.mood : null,
      errors: {
        desc: '',
      },
    };
  }

  async savePage() {
    const og = this.props.page || {};
    const page = new Page({
      ...og,
      ...{
        mood: this.state.mood,
        text: this.state.text,
        timeStamp: this.state.date.getTime(),
        humanizedDate: this.state.humanizedDate,
        images: this.state.images,
      },
    });
    mLogger(`saving page: ${JSON.stringify(page)}`);
    const pages = await page.save();
    if (pages) {
      await this.props.savedPage(pages);
    } else {
      mLogger(`could not save page: ${page}`);
    }
  }

  setDate(date) {
    this.setState({
      ...this.state,
      ...{ date },
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <View
            style={[styles.formElement, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <View>
              <Text style={styles.label}>Date</Text>
              <DateTimePicker
                date={this.state.date}
                mode={'date'}
                onDateChange={date => this.setDate(date)}
              />
            </View>
            <View>
              <Text style={{ ...styles.label, ...{ marginBottom: 20 } }}>Add images</Text>
              <ImagePickerComponent
                images={this.state.images}
                imageAdded={images => this.setState({ ...this.state, ...{ images } })}
              />
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <Input
              containerStyle={styles.textInput}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              placeholder="How was your day..."
              errorMessage={this.state.errors.desc}
              multiline={true}
              numberOfLines={10}
              value={this.state.text}
              onChangeText={text => this.setState({ ...this.state, ...{ text } })}
            />
          </View>
        </View>
        <View style={styles.lastElement}>
          <MoodPicker
            onPick={mood => this.setState({ ...this.state, ...{ mood } })}
            selected={this.state.mood}
          />
          <FancyButton title="Save" pressFn={() => this.savePage()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: Colors.white,
  },
  formElement: {
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    minHeight: 40,
  },
  textInputContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  textInput: {
    borderWidth: 0,
    borderRadius: 6,
    borderColor: Colors.light,
    justifyContent: 'flex-start',
  },
  form: {
    flexGrow: 1,
  },
  datePicker: {
    height: 30,
    width: 200,
  },
  lastElement: {
    margin: 20,
  },
  label: {
    paddingVertical: 5,
  },
});
