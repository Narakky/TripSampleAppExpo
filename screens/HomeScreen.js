import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>This is HomeScreen!!!</Text>

        <Button
          title='詳細画面に遷移'
          onPress={() => this.props.navigation.navigate('detail')}
        />
      </View>
    );
  }
}

export default HomeScreen;