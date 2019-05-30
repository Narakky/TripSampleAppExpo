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
     `AsyncStorage内の'${key}'を削除しました。`,
     [
       { text: 'OK' },
     ],
     { cancelable: false }
   );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ padding: 20 }}>
          <Button
            title="設定画面1へ遷移"
            onPress={() => this.props.navigation.navigate('setting1')}
          />
        </View>
        
        <View style={{ padding: 20 }}>
          <Button
            title="ウェルカム画面を表示するようにする"
            buttonStyle={{ backgroundColor: 'red' }}
            onPress={() => this.onResetButtonPress('isInitialized')}
          />
        </View>

        <View style={{ padding: 20 }}>
          <Button
            title="すべての評価データを削除する"
            buttonStyle={{ backgroundColor: 'red' }}
            onPress={() => this.onResetButtonPress('allReviews')}
          />
        </View>
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