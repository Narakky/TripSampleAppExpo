import Geocoder from 'react-native-geocoding';
import React from 'react';
import {
  ScrollView, View, Text, ActivityIndicator, Image, TouchableOpacity, Modal,
  Dimensions, Platform
} from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAP_ZOOM_RATE = 15.0;

class DetailScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isMapLoaded: false,
      initialRegion: {
        latitude: 33.595361,
        longitude: 130.362195,
        latitudeDelta: MAP_ZOOM_RATE,
        longitudeDelta: MAP_ZOOM_RATE * 2.25,
      },
      // モーダル画面を表示するか否か
      modalVisible: false,
      // モーダルに表示する画像の場所
      modalImageURI: require('../assets/image_placeholder.png'),
    };
  }

  async componentDidMount() {
    Geocoder.setApiKey('AIzaSyA77nerNziNxlXfQYd9QtwkaflB9jpppUo');
    let result = await Geocoder.getFromLocation(this.props.detailReview.country);
    this.setState({
      isMapLoaded: true,
      initialRegion: {
        latitude: result.results[0].geometry.location.lat,
        longitude: result.results[0].geometry.location.lng,
        latitudeDelta: MAP_ZOOM_RATE,
        longitudeDelta: MAP_ZOOM_RATE * 2.25
      }
    });
  }

  renderImages() {
    // Placeholder画像
    const imagesArray = [
      { isImage: false, uri: require('../assets/image_placeholder.png') },
      { isImage: false, uri: require('../assets/image_placeholder.png') },
      { isImage: false, uri: require('../assets/image_placeholder.png') },
    ];

    for (let i = 0; i<this.props.detailReview.imageURIs.length; i++) {
      imagesArray[i].isImage = true;
      imagesArray[i].uri = this.props.detailReview.imageURIs[i];
    }

    return (
      // 横方向に個数分繰り返す
      <View style={{ flexDirection: 'row' }}>
        { imagesArray.map((image, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => this.setState({
                modalVisible: image.isImage,
                modalImageURI: image.uri
              })
              }
            >
              <Image
                style={{ width: SCREEN_WIDTH/3, height: SCREEN_WIDTH/3 }}
                source={image.uri}
              />
            </TouchableOpacity>
          );
        }) }
      </View>
    );
  }

  render() {
    if (this.state.isMapLoaded === false) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Modal
          // モーダルを表示するかどうか
          visible={this.state.modalVisible}
          // モーダルを表示する際のアニメーション
          animationType="fade"
          // モーダルの背景を半透明にするかどうか
          transparent={false}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({ modalVisible: false })}
            >
              <Image
                style={{ height: SCREEN_WIDTH, width: SCREEN_WIDTH }}
                source={this.state.modalImageURI}
              />
            </TouchableOpacity>
          </View>
        </Modal>

        <ScrollView>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 30, padding: 5 }}>{ this.props.detailReview.country }</Text>
            <Text style={{ padding: 5 }}>{ this.props.detailReview.dateFrom } ~ { this.props.detailReview.dateTo }</Text>
          </View>

          <MapView
            style={{ height: SCREEN_WIDTH }}
            scrollEnabled={false}
            cacheEnabled={Platform.OS === 'android'}
            initialRegion={this.state.initialRegion}
          />

          { this.renderImages() }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    detailReview: state.review.detailReview,
  };
};

export default connect(mapStateToProps, actions)(DetailScreen);