/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'; // Version can be specified in package.json
import HomeScreen from './src/components/HomeScreen';
import InfoPage from './src/components/InfoPage';
import PatientInfo from './src/components/PatientInfo';
import ViewInfo from './src/components/ViewInfo';
import AppSetup from './src/components/AppSetup';

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    InfoPage: InfoPage,
    PatientInfo: PatientInfo,
    ViewInfo: ViewInfo,
    AppSetup: AppSetup,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <AppContainer/>
    );
  }
}
