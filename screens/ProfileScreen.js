import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';

class ProfileScreen extends React.Component {
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

export default ProfileScreen;