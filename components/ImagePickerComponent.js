import React from 'react';
import { Image, Platform, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Colors from '../constants/Colors';
import mLogger from '../util/mLogger';

export default class ImagePickerComponent extends React.Component {
  state = {
    images: this.props.images ? this.props.images : [],
    deleteMode: false,
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    this._setImage(result);
  };

  _takeImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    this._setImage(result);
  };

  _deleteImage(image) {
    const images = this.state.images.filter(e => e !== image);
    this.setState({ images });
    if (this.props.imageAdded) {
      this.props.imageAdded(images);
    }
  }

  _setImage(result) {
    mLogger(`image used: ${JSON.stringify(result)}`);

    const images = this.state.images.slice();
    images.push(result.uri);

    if (!result.cancelled) {
      this.setState({ images });
    }

    if (this.props.imageAdded) {
      this.props.imageAdded(images);
    }
  }

  render() {
    const { images } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-photos' : 'md-photos'}
            size={35}
            color={Colors.primaryBackground}
            style={styles.icon}
            onPress={() => this._pickImage()}
          />
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
            size={35}
            color={Colors.primaryBackground}
            style={styles.icon}
            onPress={() => this._takeImage()}
          />
        </View>
        <View style={styles.imageContainer}>
          {images.map(image => {
            return (
              <TouchableOpacity
                key={image}
                onLongpress={() =>
                  this.setState({ ...this.state, ...{ deleteMode: !this.state.deleteMode } })
                }>
                <Image source={{ uri: image }} style={styles.image} />
                {this.state.deleteMode && (
                  <View style={styles.deleteButton}>
                    <Ionicons
                      name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
                      size={35}
                      color={Colors.danger}
                      onPress={() => this._deleteImage(image)}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 35,
    marginBottom: 15,
  },
  icon: {
    margin: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  image: {
    margin: 5,
    width: 70,
    height: 70,
  },
});
