import React, { Component } from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import FloatingActionButton from "../components/FloatingActionButton";
import ModalComponent from "../components/ModalComponent";
import sortByDate from "../util/sortByDate";
import Colors from "../constants/Colors";
import PageElement from "../components/PageElement";
import PageEditor from "../components/PageEditor";
import ImageViewer from "react-native-image-zoom-viewer";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';

export default class JournalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            modalVisible: false,
            editedPage: null,
            visibleImages: [],
            accomplishments: [],
            imageModalVisible: false
        }
    }

    openImages(page) {
        const visibleImages = page.images.map(e => {
            return { url: e }
        });
        this.setState({...this.state, ...{visibleImages, imageModalVisible: true}})
    }

    async componentWillMount() {
        // TODO ONLY FOR DEBUGGING REMOVE LATER
        // await Storage.setItem(STORAGE_CONSTS.PAGES, JSON.stringify([]));
        await this.getPages();
        this.props.navigation.addListener('willFocus', () => this.getPages());
    }

    async getPages() {
        const result = await Storage.getItem(STORAGE_CONSTS.PAGES);
        const pages = result ? JSON.parse(result) : [];
        this.setState({...this.state, ...{pages}});
    }

    async savePage(task) {
        if (task.hasOwnProperty('id')) {
            await this.updatePage(task)
        } else {
            await this.createPage(task)
        }
    }

    async createPage(page) {
        const pages = this.state.pages.slice();
        page._id = new Date().getTime().toString() + pages.length;
        pages.push(page);
        this.updatePages(pages)
    }

    async updatePage(page) {
        const pages = this.state.pages.map(e => {
            if (e._id === page._id) {
                return page;
            }
            return e;
        });
        this.updatePages(pages);
    }

    async updatePages(pages) {
        await Storage.setItem(STORAGE_CONSTS.PAGES, JSON.stringify(pages));
        this.setState({...this.state, ...{pages, modalVisible: false}});
    }

    deletePage(page) {
        const pages = this.state.pages.filter(e => e !== page)
        this.updatePages(pages);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    {this.state.pages.concat(this.state.accomplishments).sort(sortByDate).map(page => {
                        return <PageElement
                            key={page._id}
                            page={page}
                            toEdit={() => this.setState({...this.state, ...{editedPage: page, modalVisible: true}})}
                            deletePage={() => this.deletePage(page)}
                            openImages={() => this.openImages(page)}/>
                    })}
                </ScrollView>
                <FloatingActionButton pressFunction={() => this.setState({...this.state, ...{modalVisible: true}})}/>
                <ModalComponent
                    closeModal={() => this.setState({...this.state, ...{modalVisible: false, editedPage: false}})}
                    modalVisible={this.state.modalVisible}
                    title="Create a page"
                >
                    <PageEditor
                        savePage={page => this.savePage(page)}
                        page={this.state.editedPage}
                    />
                </ModalComponent>
                <ModalComponent
                    closeModal={() => this.setState({...this.state, ...{visibleImages: [], imageModalVisible: false}})}
                    modalVisible={this.state.imageModalVisible}>
                    <ImageViewer imageUrls={this.state.visibleImages}/>
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
