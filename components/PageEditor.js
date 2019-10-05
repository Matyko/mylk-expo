import React, { Component } from "react";
import {Input} from 'react-native-elements';
import {View, StyleSheet, Text, ScrollView} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import ImagePickerComponent from "./ImagePickerComponent";
import FancyButton from "./FancyButton";
import {Page} from "../models/Page";

export default class PageEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: props.page ? props.page.isFullDay : 'date',
            date: props.page ? props.page.date : formatDate(new Date),
            text: props.page ? props.page.text : '',
            images: props.page ? props.page.images : [],
            errors: {
                desc: ''
            },
        };
    }

    setDate(date) {
        this.setState({...this.state, ...{date: date}});
    }

    setText(text) {
        this.setState({...this.state, ...{text: text}})
    }

    async savePage() {
        let page;
        if (this.props.page) {
            page = new Page(this.props.page)
        } else {
            page = new Page({
                text: this.state.text,
                date: this.state.date,
                images: this.state.images,
            });
        }
        mLogger(`saving page: ${page}`);
        await this.props.savedPage(await page.save());
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    <View style={styles.formElement}>
                        <Text style={styles.label}>Date</Text>
                        <DatePicker
                            style={styles.datePicker}
                            date={this.state.date}
                            mode={this.state.mode}
                            placeholder="select date"
                            format={`YYYY-MM-DD${this.state.mode === 'datetime' ? ' HH:mm' : ''}`}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36,
                                    flexGrow: 1,
                                    borderColor: 'transparent',
                                    borderBottomColor: Colors.light
                                }
                            }}
                            onDateChange={date => this.setDate(date)}
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                        <Input
                            containerStyle={styles.textInput}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder='How was your day...'
                            errorMessage={this.state.errors.desc}
                            multiline={true}
                            numberOfLines={10}
                            value={this.state.text}
                            onChangeText={text => this.setText(text)}
                        />
                    </View>
                    <View style={styles.formElement}>
                        <Text style={{...styles.label, ...{marginBottom: 20}}}>Add images</Text>
                        <ImagePickerComponent
                            images={this.state.images}
                            imageAdded={images => this.setState({...this.state, ...{images}})}/>
                    </View>
                </View>
                <View style={styles.lastElement}>
                    <FancyButton
                        title="Save"
                        pressFn={() => this.savePage()}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
        backgroundColor: Colors.white,
    },
    formElement: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
        minHeight: 40
    },
    textInputContainer: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.light,
        justifyContent: 'flex-start'
    },
    form: {
      flexGrow: 1
    },
    datePicker: {
        height: 30,
        width: 200,
    },
    lastElement: {
        justifyContent: 'flex-end',
        margin: 20
    },
    label: {
        paddingVertical: 5,
    }
});
