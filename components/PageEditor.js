import React, { Component } from "react";
import {Input, Button} from 'react-native-elements';
import {View, StyleSheet} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import ImagePickerComponent from "./ImagePickerComponent";
import FancyButton from "./FancyButton";

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

    savePage() {
        let page = {
            text: this.state.text,
            date: this.state.date,
            images: this.state.images,
            created_at: new Date()
        };
        if (this.props.page) {
            page = {...this.props.page, ...page};
        }
        mLogger(`saving page: ${page}`);
        this.props.savePage(page);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <View style={styles.formElement}>
                        <ImagePickerComponent
                            images={this.state.images}
                            imageAdded={images => this.setState({...this.state, ...{images}})}/>
                    </View>
                    <View style={styles.formElement}>
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
                </View>
                <View style={styles.lastElement}>
                    <FancyButton
                        title="Save"
                        pressFn={() => this.savePage()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10
    },
    formElement: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 20
    },
    textInputContainer: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
        flexGrow: 1,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.primaryBackground,
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
    }
});
