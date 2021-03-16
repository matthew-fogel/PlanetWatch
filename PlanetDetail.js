/**
 * Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import {Navigation} from 'react-native-navigation';
 import React, { useState} from 'react';
 import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   View,
   Text,
   StatusBar,
   Button,
   FlatList,
   TouchableOpacity,
   Modal,
 } from 'react-native';
 
 import { 
   Overlay
 } from 'react-native-elements'
 
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
 
 const earth = new planetposition.Planet(data.vsop87Bearth)

 RNLocation.configure({
   distanceFilter: 100
 })

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

const today = Date.now()

const getPlanetRise = (props) => {
  //use hooks for location state
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler()
  const date = new Date()
  //todo - update planetRise object with latitude and longitude
  const planetRise = new rise.PlanetRise(date, viewLocation.latitude, viewLocation.longitude, earth, props.planet, { date: true})
  let riseTime = planetRise.times()['rise'].toLocaleTimeString()
  return riseTime;
}

const getPlanetSet = (props) => {

  //use hooks for location state
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler()
  const date = new Date()
  //todo - update planetRise object with latitude and longitude
  const planetRise = new rise.PlanetRise(date, viewLocation.latitude, viewLocation.longitude, earth, props.planet, { date: true})
  let setTime = planetRise.times()['set'].toLocaleTimeString()
  return setTime;
}

const PlanetDetail = (props) => {

  let today = new Date().toString();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Planet Details for {props.planetName}: rises at {getPlanetRise({planet: props.planetObject})} and sets at  {getPlanetSet({planet: props.planetObject})}</Text>
        </View>
        <Button
          title='Back'
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

export default PlanetDetail;
