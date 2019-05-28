import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../actions';

class DetailScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 30, padding: 5 }}>{ this.props.detailReview.country }</Text>
            <Text style={{ padding: 5 }}>{ this.props.detailReview.dateFrom } ~ { this.props.detailReview.dateTo }</Text>
          </View>
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