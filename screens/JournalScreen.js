import React, { Component } from "react";
import {ScrollView, StyleSheet} from "react-native";
import FloatingActionButton from "../components/FloatingActionButton";
import ModalComponent from "../components/ModalComponent";
import sortByDate from "../util/sortByDate";
import Colors from "../constants/Colors";
import PageElement from "../components/PageElement";
import PageEditor from "../components/PageEditor";
import ImageViewer from "react-native-image-zoom-viewer";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import GestureRecognizer from "react-native-swipe-gestures";
import {getAllStatic} from "../models/BaseModel";
import {Page} from "../models/Page";

export default class JournalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            modalVisible: false,
            editedPage: null,
            visibleImages: [],
            accomplishments: [],
            imageModalVisible: false,
            currentPage: null,
            listView: true
        };
        this.DIRECTIONS = {
            RIGHT: 'RIGHT',
            LEFT: 'LEFT'
        };
        this.config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 30
        };
    }

    openImages(page) {
        const visibleImages = page.images.map(e => {
            return { url: e }
        });
        this.setState({...this.state, ...{visibleImages, imageModalVisible: true}})
    }

    async componentWillMount() {
        this.props.navigation.setParams('listView', true);
        await this.getPages();
        this.props.navigation.addListener('willFocus', () => this.getPages());
    }

    async getPages() {
        const pages = await getAllStatic(STORAGE_CONSTS.PAGES, Page);
        this.setState({...this.state, ...{pages, currentPage: pages[0]}});
    }

    async savePage(task) {
        if (task.hasOwnProperty('_id')) {
            await this.updatePage(task)
        } else {
            await this.createPage(task)
        }
    }

    async createPage(page) {
        const pages = this.state.pages.slice();
        page._id = new Date().getTime().toString() + pages.length;
        pages.push(page);
        this.setState({...this.state, ...{currentPage: page}});
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
        pages = pages.sort(sortByDate);
        await Storage.setItem(STORAGE_CONSTS.PAGES, pages);
        this.setState({...this.state, ...{pages, modalVisible: false}});
    }

    async deletePage(page) {
        await Storage.deleteListItem(STORAGE_CONSTS.PAGES, this.state.pages, page);
        const pages = this.state.pages.filter(e => e !== page);
        if (this.state.currentPage === page) {
            const index = this.state.pages.indexOf(page);
            const prev = this.state.pages[index - 1];
            const next = this.state.pages[index + 1];
            if (prev) {
                this.setState({...this.state, ...{currentPage: prev}})
            } else if (next) {
                this.setState({...this.state, ...{currentPage: next}})
            } else {
                this.setState({...this.state, ...{currentPage: undefined}})
            }
        }
        this.setState({...this.state, ...{pages, modalVisible: false}});
    }

    onSwipe = (gestureName) => {
        if (!this.state.listView) {
            const currentPageIndex = this.state.pages.indexOf(this.state.currentPage);
            switch (gestureName) {
                case this.DIRECTIONS.LEFT:
                    const next = this.state.pages[currentPageIndex + 1];
                    if (next) {
                        this.setState({...this.state, ...{currentPage: next}})
                    }
                    break;
                case this.DIRECTIONS.RIGHT:
                    const previous = this.state.pages[currentPageIndex - 1];
                    if (previous) {
                        this.setState({...this.state, ...{currentPage: previous}})
                    }
                    break;
            }
        }
    };

    render() {
        const viewMode = this.state.listView ? {} : {flexDirection: 'row'};
        return (
            <GestureRecognizer
                style={{flex: 1}}
                onSwipeRight={() => this.onSwipe(this.DIRECTIONS.RIGHT)}
                onSwipeLeft={() => this.onSwipe(this.DIRECTIONS.LEFT)}
                config={this.config}>
                <ScrollView
                    style={{...styles.container, ...viewMode}}
                    pagingEnabled={!this.state.listView}
                    horizontal={!this.state.listView}>
                    {this.state.pages.concat(this.state.accomplishments).sort(sortByDate).map(page => {
                        return <PageElement
                            key={page._id}
                            fullPage={!this.state.listView}
                            page={page}
                            toEdit={() => this.setState({...this.state, ...{editedPage: page, modalVisible: true}})}
                            deletePage={() => this.deletePage(page)}
                            openImages={() => this.openImages(page)}/>
                    })}
                </ScrollView>
                <FloatingActionButton pressFunction={() => this.setState({...this.state, ...{modalVisible: true}})}/>
                <FloatingActionButton
                    isLeft={true}
                    iconName={this.state.listView ? 'apps' : 'list'}
                    pressFunction={() => this.setState({...this.state, ...{listView: !this.state.listView}})}/>
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
            </GestureRecognizer>
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
        fontFamily: 'nunito-black',
        fontWeight: 'normal'
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: Colors.white,
    }
});
