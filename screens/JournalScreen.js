import React, { Component } from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import FloatingActionButton from "../components/FloatingActionButton";
import ModalComponent from "../components/ModalComponent";
import sortByDate from "../util/sortByDate";
import Colors from "../constants/Colors";
import PageElement from "../components/PageElement";
import PageEditor from "../components/PageEditor";

export default class JournalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [{id: 1, date: '2019-10-31', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}],
            modalVisible: false,
            editedPage: null
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
                    title="Create a page"
                >
                    <PageEditor

                    />
                </ModalComponent>
            </View>
        );
    }
}

JournalScreen.navigationOptions = {
    title: 'Journal',
    headerStyle: {
        backgroundColor: Colors.primaryBackground,
        height: 79,
    },
    headerTitleStyle: {
        color: Colors.primaryText,
        lineHeight: 79,
        fontWeight: 'bold',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: Colors.white,
    }
});
