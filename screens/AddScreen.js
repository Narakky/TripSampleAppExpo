import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Picker, DatePickerIOS,
  TouchableOpacity, Image,
  LayoutAnimation, UIManager,
  Dimensions, Platform, AsyncStorage,
} from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import Geocoder from 'react-native-geocoding';
import { MapView, Permissions, ImagePicker, } from 'expo';

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

const SCREEN_WIDTH = Dimensions.get('window').width;

class AddScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = INITIAL_STATE;
  }
  
  componentDidUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  // 国名選択用ピッカーを描画する
  renderCountryPicker() {
    if (this.state.countryPickerVisible === true) {
      return (
        <Picker
          selectedValue={this.state.tripDetail.country}
          onValueChange={async (itemValue) => {
            Geocoder.setApiKey('AIzaSyA77nerNziNxlXfQYd9QtwkaflB9jpppUo');
            let result = await Geocoder.getFromLocation(itemValue);

            this.setState({
              ...this.state,
              tripDetail: {
                ...this.state.tripDetail,
                country: itemValue,
              },
              initialRegion: {
                latitude: result.results[0].geometry.location.lat,
                longitude: result.results[0].geometry.location.lng,
                latitudeDelta: MAP_ZOOM_RATE,
                longitudeDelta: MAP_ZOOM_RATE * 2.25,
              }
            });
          }}
        >
          <Picker.Item label={INITIAL_STATE.tripDetail.country} value={INITIAL_STATE.tripDetail.country} />
          <Picker.Item label="日本" value="日本" />
          <Picker.Item label="アメリカ" value="アメリカ" />
          <Picker.Item label="イギリス" value="イギリス" />
          <Picker.Item label="中国" value="中国" />
          <Picker.Item label="アフリカ" value="アフリカ" />
          <Picker.Item label="ブラジル" value="ブラジル" />
        </Picker>
      );
    }
  }

  // 日付from用ピッカーを描画する
  renderDateFromPicker() {
    if (this.state.dateFromPickerVisible === true) {
      switch (Platform.OS) {
        case 'ios':
          return (
            <DatePickerIOS
              mode="date"
              date={new Date(this.state.chosenDateFrom)}
              onDateChange={(date) => {
                const dateString = date.toLocaleString('ja');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateFrom: dateString.split(' ')[0], // 2019/06/04 17:00:00 -> 2019/06/04
                  },
                  chosenDateFrom: dateString,
                  chosenDateTo: dateString, // 初期選択付
                });
              }}
            />
          );
      
        case 'android':
          return (
            <DatePicker
              mode="date"
              date={new Date(this.state.chosenDateFrom)}
              format='YYYY-MM-DD'
              confirmBtnText="OK"
              cancelBtnText="キャンセル"
              onDateChange={(date) => {
                // date = 2019-06-04 17:00

                // 2019-06-04 17:00 -> 2019-06-04 17:00:00
                let dateString = `${date}:00`;
                // 2019-06-04 17:00:00 -> 2019/06/04 17:00:00 
                dateString = dateString.replace(/-/g, '/');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateFrom: dateString.split(' ')[0],
                  },
                  chosenDateFrom: dateString,
                  chosenDateTo: dateString,
                });
              }}
            />
          );

        default:
          return <View />;
      }
    }
  }

  renderDateToPicker() {
    if (this.state.dateToPickerVisible === true) {
      switch (Platform.OS) {
        case 'ios':
          return (
            <DatePickerIOS
              mode="date"
              minimumDate={new Date(this.state.chosenDateFrom)}
              date={new Date(this.state.chosenDateTo)}
              onDateChange={(date) => {
                const dateString = date.toLocaleString('ja');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateTo: dateString.split(' ')[0],
                  },
                  chosenDateTo: dateString,
                });
              }}
            />
          );
      
        case 'android':
          return (
            <DatePicker
              mode="date"
              minDate={new Date(this.state.chosenDateFrom)}
              date={new Date(this.state.chosenDateTo)}
              format="YYYY-MM-DD"
              confirmBtnText="OK"
              cancelBtnText="キャンセル"
              onDateChange={(date) => {
                let dateString = `${date}:00`;
                dateString = dateString.replace(/-/g, '/');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateTo: dateString.split(' ')[0],
                  },
                  chosenDateTo: dateString,
                });
              }}
            />
          );

        default:
          return <View />
      }
    }
  }

  // 地図を描画する
  renderMap() {
    // 国が選択された時かつ国選択プルダウンが閉じた時
    if (this.state.tripDetail.country !== INITIAL_STATE.tripDetail.country &&
      this.state.countryPickerVisible === false) {
        // 地図を描画する
        return (
          <MapView
            style={{ height: SCREEN_WIDTH }}
            scrollEnabled={false}
            cacheEnabled={Platform.OS === 'android'}
            initialRegion={this.state.initialRegion}
          />
        );
    }
  }

  // 画像タップ時
  onImagePress() = async (index) => {
    // スマホ内に保存されているカメラロールアクセス権を読み取る
    let cameraRollPermission = await AsyncStorage.getItem('cameraRollPermission');
    
    // 未許可の場合
    if (cameraRollPermission != 'granted') {
      // 許可を取る
      let permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      // ユーザが許可しなかった場合
      if (permission.status !== 'granted') {
        // 何もしない
        return;
      }
      
      // カメラロールアクセス状況をスマホ内に保存する
      await AsyncStorage.setItem('cameraRollPermission', permission.status);
    }

    
  }

  // 写真選択
  renderImagePicker() {
    // 国が選択された時かつ、国選択プルダウンが閉じた場合
    if (this.state.tripDetail.country !== INITIAL_STATE.tripDetail.country &&
      this.state.countryPickerVisible === false) {
        return (
          <View style={{ flexDirection: 'row' }}>
            {this.state.tripDetail.imageURIs.map((imageURI, index) => {
              return (
                <TouchableOpacity
                  key={index}
                >
                  <Image
                    style={{
                      width: SCREEN_WIDTH / this.state.tripDetail.imageURIs.length,
                      height: SCREEN_WIDTH / this.state.tripDetail.imageURIs.length,
                    }}
                    source={imageURI}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        );
    }
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

        <ScrollView style={{ flex: 1 }}>
          <ListItem
            title="国名: "
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    color: this.state.tripDetail.country === INITIAL_STATE.tripDetail.country ? 'gray' : 'black'
                  }}
                >
                  { this.state.tripDetail.country }
                </Text>
              </View>
            }
            // プルダウンメニューが開いていれば上矢印、閉じていれば下矢印
            rightIcon={{ name: this.state.countryPickerVisible === true ? 'keyboard-arrow-up' : 'keyboard-arrow-down' }}
            // 項目欄ListItemがタップされた時
            onPress={() => this.setState({
              // 国選択ピッカーの表示切り替え
              countryPickerVisible: !this.state.countryPickerVisible,
              // 出国日選択プルダウンは閉じる
              dateFromPickerVisible: false,
              // 帰国日選択プルダウンは閉じる
              dateToPickerVisible: false,
            })}
          />
          { this.renderCountryPicker() }

          <ListItem
            title="日付: "
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    color: this.state.tripDetail.dateFrom === INITIAL_STATE.tripDetail.dateFrom ? 'gray' : 'black'
                  }}
                >
                  {this.state.tripDetail.dateFrom}
                </Text>
              </View>
            }
            rightIcon={{ name: this.state.dateFromPickerVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down' }}
            onPress={() => this.setState({
              countryPickerVisible: false,
              dateFromPickerVisible: !this.state.dateFromPickerVisible,
              dateToPickerVisible: false,
            })}
          />
          {this.renderDateFromPicker()}

          <ListItem
            title=""
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    color: this.state.tripDetail.dateTo === INITIAL_STATE.tripDetail.dateTo ? 'gray' : 'black',
                  }}
                >
                  {this.state.tripDetail.dateTo}
                </Text>
              </View>
            }
            rightIcon={{ name: this.state.dateToPickerVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down' }}
            onPress={() => this.setState({
              countryPickerVisible: false,
              dateFromPickerVisible: false,
              dateToPickerVisible: !this.state.dateToPickerVisible,
            })}
          />
          {this.renderDateToPicker()}

          {this.renderMap()}

          {this.renderImagePicker()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemStyle: {
    paddingTop: 5,
    paddingLeft: 20,
  },
});

export default AddScreen;