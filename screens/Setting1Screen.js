import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';

class Setting1Screen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>This is Setting1Screen...</Text>

        <Button
          title="設定2画面へ遷移する"
          onPress={() => this.props.navigation.navigate('setting2')}
        />
      </View>
    );
  }
}

export default Setting1Screen;