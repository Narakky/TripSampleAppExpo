import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
       selectedIndex: 0,
    };
  }
  
  onButtonGroupPress = (selectedIndex) => {
    this.setState({ selectedIndex });
  }

  render() {
    const buttonList = [
      'すべて',
      '良い（0）',
      '普通（0）',
      '悪い（0）',
    ];

    return (
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={buttonList}
          selectedIndex={this.state.selectedIndex}
          onPress={this.onButtonGroupPress}
        />
      </View>
    );
  }
}

export default HomeScreen;