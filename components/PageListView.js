import { FlatList, StyleSheet } from 'react-native';
import React from 'react';
import sortByDate from '../util/sortByDate';
import PageElement from './PageElement';
import Colors from '../constants/Colors';

export default function PageListView(props) {
  return (
    <FlatList
      style={styles.container}
      keyExtractor={(item, index) => index.toString()}
      data={props.pages
        .concat(props.accomplishments)
        .sort(sortByDate)
        .reverse()}
      renderItem={({ item }) => (
        <PageElement
          key={item._id}
          fullPage={false}
          page={item}
          emoji={!props.hideEmoji}
          toEdit={() => props.edit(item)}
          deletePage={() => props.deletePage(item)}
          openImages={() => props.openImages(item)}
        />
      )}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.white,
  },
});
