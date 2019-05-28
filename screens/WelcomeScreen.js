import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DATA = [
  { title: 'ステップ1', text: '旅行の思い出を追加しましょう！', uri: require('../assets/welcome_screen1.jpg') },
  { title: 'ステップ2', text: '一覧にすべてのTipsがあります！', uri: require('../assets/welcome_screen2.jpg') },
  { title: 'ステップ3', text: '旅行の詳細をもっと見よう！', uri: require('../assets/welcome_screen3.jpg') },
];

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isInitialized: null 
    };
  }
  
  async componentDidMount() {
    // AsyncStorageのisInitializedから読み込んだ情報を取得
    let isInitializedString = await AsyncStorage.getItem('isInitialized');

    if (isInitializedString === 'true') {
      this.setState({ isInitialized: true });
      this.props.navigation.navigate('main');
    } else {
      this.setState({ isInitialized: false });
    }
  }

  onStartButtonPressed = async () => {
    // AsyncStorageに「ウェルカム画面表示済み」の情報を格納する
    await AsyncStorage.setItem('isInitialized', 'true');

    this.props.navigation.navigate('main');
  }

  renderLastButton(index) {
    if (index === SLIDE_DATA.length - 1) {
      return (
        <Button
          style={{ padding: 10 }}
          buttonStyle={{ backgroundColor: 'deepskyblue' }}
          title="さあ始めよう！"
          onPress={this.onStartButtonPressed}
        />
      );
    }
  }

  renderSlides() {
    return SLIDE_DATA.map((slide, index) => {
      return (
        <View
          key={index}
          style={styles.slideStyle}
        >
          <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{slide.title}</Text>
            <Text style={styles.textStyle}>{slide.text}</Text>
          </View>
          <Image
          style={{ flex: 2 }}
          resizeMode="contain"
          source={slide.uri}
          />
          <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center' }}>
            {this.renderLastButton(index)}
            <Text style={styles.textStyle}>{index + 1} / 3</Text>
          </View>
        </View>
      );
    });
  }

  render() {
    if (this.state.isInitialized === null) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <ScrollView
      horizontal={true}
      pagingEnabled={true}
      style={{ flex: 1 }}>
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slideStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'skyblue',
    width: SCREEN_WIDTH,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: '#FFF',
    fontSize: 20,
    padding: 5,
  }
});

export default WelcomeScreen;