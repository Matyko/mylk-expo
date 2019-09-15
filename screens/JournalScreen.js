import React, { Component } from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import FloatingActionButton from "../components/FloatingActionButton";
import ModalComponent from "../components/ModalComponent";
import sortByDate from "../util/sortByDate";
import Colors from "../constants/Colors";
import PageElement from "../components/PageElement";
import PageEditor from "../components/PageEditor";
import TasksScreen from "./TasksScreen";

export default class JournalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [{id: 1, date: 1, text: 1}],
            modalVisible: false
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    {this.state.pages.sort(sortByDate).map(e => {
                        return <PageElement
                            key={e.id}
                            page={e}/>
                    })}
                </ScrollView>
                <FloatingActionButton pressFunction={() => this.setState({modalVisible: true})}/>
                <ModalComponent
                    closeModal={() => this.setState({modalVisible: false})}
                    modalVisible={this.state.modalVisible}
                >
                    <PageEditor></PageEditor>
                </ModalComponent>
            </View>
        );
    }
}

TasksScreen.navigationOptions = {
    title: 'Journal',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: Colors.white,
    }
});
