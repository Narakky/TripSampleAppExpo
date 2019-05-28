import React from 'react';
import { StyleSheet, Text, View, Image, Platform, StatusBar } from 'react-native';
import {
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation';

import { Provider } from 'react-redux';
import store from './store';

import WelcomeScreen from './screens/WelcomeScreen';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';
import ProfileScreen from './screens/ProfileScreen';
import Setting1Screen from './screens/Setting1Screen';
import Setting2Screen from './screens/Setting2Screen';

export default class App extends React.Component {
  render() {
    // ヘッダー
    const headerNavigationOptions = {
      headerStyle: {
        backgroundColor: 'deepskyblue',
        marginTop: (Platform.OS === 'android' ? 24 : 0)
      },
      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
    };

    // ホーム関連
    const HomeStack = createStackNavigator({
      home: {
        screen: HomeScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: '旅行サンプルアプリ',
          headerBackTitle: 'ホーム',
        }
      },
      detail: {
        screen: DetailScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: '詳細',
        }
      }
    });

    // ホームのナビゲーション
    HomeStack.navigationOptions = ({ navigation }) => {
      return {
        tabBarVisible: (navigation.state.index === 0)
      };
    };

    // 追加画面関連
    const AddStack = createStackNavigator({
      add: {
        screen: AddScreen,
        navigationOptions: {
          header: null,
        },
      }
    });

    // 追加画面のナビゲーション
    AddStack.navigationOptions = ({ navigation }) => {
      return {
        tabBarVisible: (navigation.state.index === -1)
      };
    };

    // プロフィール画面関連
    const ProfileStack = createStackNavigator({
      profile: {
        screen: ProfileScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: 'プロフィール',
          // headerBackTitleは指定しなければheaderTitleを流用するので戻るボタンにタイトルを表示させたい場合は省略可
          // headerBackTitle: 'プロフィール',
        },
      },
      setting1: {
        screen: Setting1Screen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: '設定1',
          // headerBackTitle: '設定1',
        },
      },
      setting2: {
        screen: Setting2Screen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: '設定2',
          // headerBackTitle: '設定2',
        },
      }
    });

    // プロフィール画面のナビゲーション
    ProfileStack.navigationOptions = ({ navigation }) => {
      return {
        tabBarVisible: (navigation.state.index === 0)
      };
    };

    // メインのタブ
    const MainTab = createBottomTabNavigator({
      // ホーム
      homeStack: {
        screen: HomeStack,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image
              style={{ height: 25, width: 25, tintColor: tintColor }}
              source={ require('./assets/home.png') }
            />
          ),
          title: 'ホーム',
        }
      },
      // 追加
      addStack: {
        screen: AddStack,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image
              style={{ width: 60, height: 60, tintColor: 'deepskyblue' }}
              source={ require('./assets/add.png') }
            />
          ),
          title: '',
        },
      },
      // プロフィール
      profileStack: {
        screen: ProfileStack,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image
              style={{ height: 25, width: 25, tintColor }}
              source={ require('./assets/profile.png') }
            />
          ),
          title: 'プロフィール',
        }
      }
    }, {
      swipeEnabled: false, // Android用
    });

    // ナビゲーションコンテナ（Welcome画面も隠れたタブ扱いにする）
    const NavigatorTab = createAppContainer(
      createSwitchNavigator({
        welcome: { screen: WelcomeScreen },
        main: { screen: MainTab }
      })
    );

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <NavigatorTab />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
  },
});
