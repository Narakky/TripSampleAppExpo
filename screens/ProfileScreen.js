import React from 'react';
import {
  StyleSheet, View, Text,
  AsyncStorage, Alert
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import * as actions from '../actions';

class ProfileScreen extends React.Component {
  onResetButtonPress = async (key) => {
   await AsyncStorage.removeItem(key);

    if (key === 'allReviews') {
      this.props.fetchAllReviews();
    }

   Alert.alert(
     'Reset',
     `'${key}' in AsyncStorage has been removed.`,
     [
       { text: 'OK' },
     ],
     { cancelable: false }
   );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>This is ProfileScreen!!</Text>

        <Button
          title="設定画面1へ遷移"
          onPress={() => this.props.navigation.navigate('setting1')}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allReviews: state.review.allReviews,
  };
};

export default connect(mapStateToProps, actions)(ProfileScreen);