import React, { Component } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { View } from 'react-native';
import FloatingActionButton from '../components/FloatingActionButton';
import ModalComponent from '../components/ModalComponent';
import Colors from '../constants/Colors';
import PageEditor from '../components/PageEditor';
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import { getAllStatic } from '../models/BaseModel';
import { Page } from '../models/Page';
import mLogger from '../util/mLogger';
import CalendarView from '../components/CalendarView';
import PageListView from '../components/PageListView';
import PageFlatView from '../components/PageFlatView';

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
      listView: true,
      flatView: false,
      calendarView: false,
      hideEmoji: false,
      currentMonth: 0,
      calendarDate: new Date(),
      events: [],
      filterDate: null,
    };
    this.DIRECTIONS = {
      RIGHT: 'RIGHT',
      LEFT: 'LEFT',
    };
    this.config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 30,
    };
  }

  openImages(page) {
    const visibleImages = page.images.map(e => {
      return { url: e };
    });
    this.setState({ ...this.state, ...{ visibleImages, imageModalVisible: true } });
  }

  async componentWillMount() {
    this.props.navigation.setParams('listView', true);
    await this.getPages();
    this.props.navigation.addListener('willFocus', async () => {
      this.getPages();
      const hideEmoji = (await Storage.getItem(STORAGE_CONSTS.HIDE_EMOJI)) || false;
      this.setState({ ...this.state, ...{ hideEmoji } });
    });
  }

  async getPages() {
    const pages = await getAllStatic(STORAGE_CONSTS.PAGES, Page);
    const events = this.getEvents(pages);
    this.setState({
      ...this.state,
      ...{ pages, currentPage: pages[0], events },
    });
  }

  getEvents(pages) {
    return pages.filter(e => {
      const date = new Date(e.timeStamp);
      return (
        date.getFullYear() === this.state.calendarDate.getFullYear() &&
        date.getMonth() === this.state.calendarDate.getMonth()
      );
    });
  }

  async savedPage(pages) {
    this.setState({ ...this.state, ...{ pages, modalVisible: false } });
  }

  async deletePage(page) {
    const pageObj = new Page(page);
    try {
      const pages = await pageObj.delete();
      if (this.state.currentPage === page) {
        const index = this.state.pages.indexOf(page);
        const prev = this.state.pages[index - 1];
        const next = this.state.pages[index + 1];
        if (prev) {
          this.setState({ ...this.state, ...{ currentPage: prev } });
        } else if (next) {
          this.setState({ ...this.state, ...{ currentPage: next } });
        } else {
          this.setState({ ...this.state, ...{ currentPage: undefined } });
        }
      }
      this.setState({ ...this.state, ...{ pages, modalVisible: false } });
    } catch (e) {
      mLogger('Could not remove page');
    }
  }

  hasSameDate(page) {
    if (this.state.filterDate) {
      const date = new Date(page.timeStamp);
      const sameYear = this.state.filterDate.getFullYear() === date.getFullYear();
      const sameMonth = this.state.filterDate.getMonth() === date.getMonth();
      const sameDay = this.state.filterDate.getDate() === date.getDate();
      return sameYear && sameMonth && sameDay;
    } else {
      return true;
    }
  }

  async handleDatePress(filterDate) {
    if (this.state.filterDate && this.state.filterDate.getTime() === filterDate.getTime()) {
      await this.setState({ ...this.state, ...{ filterDate: null } });
      await this.setState({ ...this.state, ...{ listView: false } });
    } else {
      await this.setState({ ...this.state, ...{ filterDate } });
      await this.setState({ ...this.state, ...{ listView: true } });
    }
  }

  async changeCalendarDate(next) {
    const calendarDate = new Date(this.state.calendarDate);
    calendarDate.setMonth(calendarDate.getMonth() + (next ? 1 : -1));
    await this.setState({ ...this.state, ...{ calendarDate } });
    const events = this.getEvents(this.state.pages);
    await this.setState({ ...this.state, ...{ events, filterDate: null, listView: false } });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.calendarView && (
          <CalendarView
            date={this.state.calendarDate}
            events={this.state.events}
            onDatePress={date => this.handleDatePress(date)}
            onDateChange={next => this.changeCalendarDate(next)}
            filterDate={this.state.filterDate}
          />
        )}
        {this.state.listView && (
          <PageListView
            edit={page =>
              this.setState({ ...this.state, ...{ editedPage: page, modalVisible: true } })
            }
            accomplishments={this.state.accomplishments}
            pages={this.state.pages.filter(e => this.hasSameDate(e))}
            hideEmoji={this.state.hideEmoji}
            deletePage={page => this.deletePage(page)}
            openImages={page => this.openImages(page)}
          />
        )}
        {this.state.flatView && (
          <PageFlatView
            edit={page =>
              this.setState({ ...this.state, ...{ editedPage: page, modalVisible: true } })
            }
            accomplishments={this.state.accomplishments}
            pages={this.state.pages}
            hideEmoji={this.state.hideEmoji}
            deletePage={page => this.deletePage(page)}
            openImages={page => this.openImages(page)}
          />
        )}
        <FloatingActionButton
          pressFunction={() => this.setState({ ...this.state, ...{ modalVisible: true } })}
        />
        <FloatingActionButton
          isLeft={true}
          iconName="menu"
          subButtons={[
            {
              icon: 'apps',
              fn: () =>
                this.setState({
                  ...this.state,
                  ...{ flatView: true, listView: false, calendarView: false, filterDate: null },
                }),
            },
            {
              icon: 'list',
              fn: () =>
                this.setState({
                  ...this.state,
                  ...{ flatView: false, listView: true, calendarView: false, filterDate: null },
                }),
            },
            {
              icon: 'calendar',
              fn: () => {
                this.setState({
                  ...this.state,
                  ...{ flatView: false, listView: false, calendarView: true, filterDate: null },
                });
              },
            },
          ]}
        />
        <ModalComponent
          closeModal={() =>
            this.setState({ ...this.state, ...{ modalVisible: false, editedPage: false } })
          }
          modalVisible={this.state.modalVisible}
          title="Create a page">
          <PageEditor savedPage={pages => this.savedPage(pages)} page={this.state.editedPage} />
        </ModalComponent>
        <ModalComponent
          closeModal={() =>
            this.setState({ ...this.state, ...{ visibleImages: [], imageModalVisible: false } })
          }
          modalVisible={this.state.imageModalVisible}>
          <ImageViewer imageUrls={this.state.visibleImages} />
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
    fontFamily: 'nunito-black',
    fontWeight: 'normal',
  },
};
