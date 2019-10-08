import React, { Component } from "react";
import {Input} from 'react-native-elements';
import {View, StyleSheet, Text, ScrollView} from "react-native";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import ImagePickerComponent from "./ImagePickerComponent";
import FancyButton from "./FancyButton";
import {Page} from "../models/Page";
import DateTimePicker from "./DateTimePicker";

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

    async savePage() {
        let page;
        if (this.props.page) {
            page = new Page(this.props.page)
        } else {
            page = new Page({
                text: this.state.text,
                date: this.state.date.getTime(),
                images: this.state.images,
            });
        }
        mLogger(`saving page: ${page}`);
        const pages = await page.save();
        if (pages) {
            await this.props.savedPage(pages);
        } else {
            mLogger(`could not save page: ${page}`)
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    <View style={styles.formElement}>
                        <Text style={styles.label}>Date</Text>
                        <DateTimePicker
                            date={this.state.date}
                            mode={this.state.mode}
                            onDateChange={date => this.setState({...this.state, ...{date: date}})}
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
                            onChangeText={text => this.setState({...this.state, ...{text: text}})}
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
