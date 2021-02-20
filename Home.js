/**
 * Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {Navigation} from 'react-native-navigation';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Home = (props) => {

  let today = new Date().toString();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Welcome. Today is {today}</Text>
        </View>
        <Button
          title='Explore'
          color='#710ce3'
          onPress={() => Navigation.push(props.componentId, {
            component: {
              name: 'PlanetList',
              options: {
                topBar: {
                  title: {
                    text: 'PlanetList'
                  }
                },
                bottomTabs: {
                  visible: true
                }
              }
            }
          })}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.black,
    color: Colors.white,
    height: "100%",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.white,
  },
  highlight: {
    marginTop: 8,
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
  footer: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Home;
