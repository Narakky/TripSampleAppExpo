import React from 'react';
import {
  ScrollView, View, Text,
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
      initialRegion: {
        latitude: 33.595361,
        longitude: 130.362195,
        latitudeDelta: MAP_ZOOM_RATE,
        longitudeDelta: MAP_ZOOM_RATE * 2.25,
      },
    };
  }
  

  render() {
    return (
      <View style={{ flex: 1 }}>
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