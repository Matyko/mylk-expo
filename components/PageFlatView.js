import { FlatList, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import sortByDate from '../util/sortByDate';
import PageElement from './PageElement';
import Colors from '../constants/Colors';

export default function PageFlatView(props) {
  return (
    <FlatList
      style={styles.container}
      horizontal={true}
      snapToInterval={Dimensions.get('window').width}
      snapToAlignment="start"
      initialNumToRender={5}
      keyExtractor={(item, index) => index.toString()}
      data={props.pages
        .concat(props.accomplishments)
        .sort(sortByDate)
        .reverse()}
      renderItem={({ item }) => (
        <PageElement
          key={item._id}
          fullPage={true}
          page={item}
          emoji={!props.hideEmoji}
          toEdit={() => props.edit(item)}
          deletePage={() => props.deletePage(item)}
          openImages={() => props.openImages(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.white,
  },
});
