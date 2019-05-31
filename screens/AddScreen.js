import React from 'react';
import {
  StyleSheet, Text, View,
  LayoutAnimation, UIManager,
  Dimensions
} from 'react-native';
import { Header, Icon } from 'react-native-elements';

// 評価ランクに関する定数
const GREAT = 'sentiment-very-satisfied';

// 地図のズームサイズ
const MAP_ZOOM_RATE = 15.0;
const INITIAL_STATE = {
  // プルダウンメニューが開いているか閉じているか
  countryPickerVisible: false,
  dateFromPickerVisible: false,
  dateToPickerVisible: false,
  // プルダウンメニューで選択された日付を格納
  chosenDateFrom: new Date().toLocaleString('ja'),
  chosenDateTo: new Date().toLocaleString('ja'),
  // 旅行の評価データ用
  tripDetail: {
    country: '国を選択してください。',
    dateFrom: 'from',
    dateTo: 'to',
    imageURIs: [
      require('../assets/add_image_placeholder.png'),
      require('../assets/add_image_placeholder.png'),
      require('../assets/add_image_placeholder.png'),
    ],
    rank: '',
  },
  // 地図描画用
  initialRegion: {
    latitude: 35.658581, // 東京タワー
    longitude: 139.745433, // 東京タワー
    latitudeDelta: MAP_ZOOM_RATE,
    longitudeDelta: MAP_ZOOM_RATE * 2.25
  },
};

class AddScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = INITIAL_STATE;
  }
  
  componentDidUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          // ステータスバーの色
          statusBarProps={{ barStyle: 'light-content' }}
          // ヘッダーの色
          backgroundColor="deepskyblue"
          // 左上のアイコン
          leftComponent={{
            icon: 'close',
            color: '#fff',
            onPress: () => {
              this.setState({
                ...INITIAL_STATE,
                tripDetail: {
                  ...INITIAL_STATE.tripDetail,
                  imageURIs: [
                    require("../assets/add_image_placeholder.png"),
                    require("../assets/add_image_placeholder.png"),
                    require('../assets/add_image_placeholder.png'),
                  ],
                }
              });

              // ホームに戻る
              this.props.navigation.navigate('home');
            }
          }}
          // ヘッダタイトルとスタイル
          centerComponent={{ text: '追加', style: styles.headerStyle }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default AddScreen;