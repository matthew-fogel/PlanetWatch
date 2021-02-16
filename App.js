/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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

import RNLocation from 'react-native-location'

import {data} from 'astronomia'

import planetposition from 'astronomia/src/planetposition'
import rise from 'astronomia/src/rise';
import { JDToDate, CalendarGregorian, Calendar} from 'astronomia/src/julian'

RNLocation.configure({
  distanceFilter: 100
})

let location;

function useLocation() {

  const [viewLocation, isViewLocation] = useState([]);
  const permissionHandler = async () => {

    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse' // or 'fine'
      }
    });
    
    if(!permission) {
      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse",
          rationale: {
            title: "We need to access your location",
            message: "We use your location to show where you are on the map",
            buttonPositive: "OK",
            buttonNegative: "Cancel"
          }
        }
      }).then(granted => {
        if (granted) {
          RNLocation.getLatestLocation({timeout: 100})
          .then(latestLocation => {
            isViewLocation(latestLocation);
          })
        }
      })
    } else {
      RNLocation.getLatestLocation({timeout: 100})
      .then(latestLocation => {
        isViewLocation(latestLocation);
      })
    }
  }

  return {viewLocation, permissionHandler}
}

const earth = new planetposition.Planet(data.vsop87Bearth)
const jupiter = new planetposition.Planet(data.vsop87Bjupiter)

const today = Date.now()

const Planet = (props) => {

  //use hooks for location state
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler()
  const date = new Date()
  //todo - update planetRise object with latitude and longitude
  const planetRise = new rise.PlanetRise(date, viewLocation.latitude, viewLocation.longitude, earth, jupiter, { date: true})
  let riseTime = planetRise.times()['rise'].toLocaleTimeString()
  let setTime = planetRise.times()['set'].toLocaleTimeString()

  return (
    <View>
      <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Welcome</Text>
      <Text style={styles.sectionDescription}>
        <Text style={styles.highlight}>Jupiter</Text> rises at {riseTime} and sets at {setTime} today.
      </Text>
      </View>
      <View style={styles.location}>
        <Text style={styles.body}>Latitude: {viewLocation.longitude}</Text>
        <Text style={styles.body}>Longitude: {viewLocation.latitude}</Text>
      </View>
  </View>
  );
}

const App: () => React$Node = () => {

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>
              PlanetWatch
            </Text>
          </View>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <Planet name='Jupiter' />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  location: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: '40%'
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.black,
    color: Colors.white,
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
  header: {
    backgroundColor: '#00304E',
  },
  appTitle: {
    color: Colors.white,
    fontSize: 32,
  }
});

export default App;
