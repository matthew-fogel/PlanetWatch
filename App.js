/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

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
const mars = new planetposition.Planet(data.vsop87Bmars)
const mercury = new planetposition.Planet(data.vsop87Bmercury)
const neptune = new planetposition.Planet(data.vsop87Bneptune)
const saturn = new planetposition.Planet(data.vsop87Bsaturn)
const uranus = new planetposition.Planet(data.vsop87Buranus)
const venus = new planetposition.Planet(data.vsop87Bvenus)

const today = Date.now()

const Planet = (props) => {

  //use hooks for location state
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler()
  let name = props.name
  const date = new Date()
  //todo - update planetRise object with latitude and longitude
  const planetRise = new rise.PlanetRise(date, viewLocation.latitude, viewLocation.longitude, earth, props.planet, { date: true})
  let riseTime = planetRise.times()['rise'].toLocaleTimeString()
  let setTime = planetRise.times()['set'].toLocaleTimeString()

  return (
    <View>
      <Text style={styles.highlight}>
        {name} 
      </Text>
      <Text style={styles.sectionDescription}>
        Rises at {riseTime} and sets at {setTime}.
      </Text>
  </View>
  );
}

const HomePage = ({navigation}) => {
  let today = new Date().toString()
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
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{today}</Text>
            </View>
            <Button
              title="Explore"
              onPress={() =>
                navigation.navigate('PlanetList')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const PlanetList = ({navigation}) => {
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
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Welcome</Text>
            </View>
            <Planet name='Mercury' planet={mercury} />
            <Planet name='Venus' planet={venus} />
            <Planet name='Mars' planet={mars} />
            <Planet name='Jupiter' planet={jupiter} />
            <Planet name='Saturn' planet={saturn} />
            <Planet name='Uranus' planet={uranus} />
            <Planet name='Neptune' planet={neptune} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomePage"
          component={HomePage}
        />
        <Stack.Screen
          name="PlanetList"
          component={PlanetList}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
  header: {
    backgroundColor: '#00304E',
  },
  appTitle: {
    color: Colors.white,
    fontSize: 32,
  }
});

export default App;
