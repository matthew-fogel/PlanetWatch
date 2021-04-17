/**
 * PlanetList
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
  Image,
  StatusBar,
  Button,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {data} from 'astronomia'
import planetposition from 'astronomia/src/planetposition'
import sunrise from 'astronomia/src/sunrise'
import julian from 'astronomia/src/julian'
import RNLocation from 'react-native-location'

var moment = require('moment'); // require

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

const getSunrise = (props) => {
  //use hooks for location state
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler()
  const gregorianDate = new Date()
  const date = new julian.Calendar(gregorianDate)
  //todo - update sunrise object with latitude and longitude
  const sun = new sunrise.Sunrise(date, viewLocation.latitude, viewLocation.longitude)
  let riseTime = sun.rise()
  return moment(riseTime.toDate()).format()
}

const getSunset = (props) => {
  //use hooks for location state
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler()
  const gregorianDate = new Date()
  const date = new julian.Calendar(gregorianDate)
  //todo - update sunrise object with latitude and longitude
  const sun = new sunrise.Sunrise(date, viewLocation.latitude, viewLocation.longitude)
  let setTime = sun.set()
  return moment(setTime.toDate()).format()
}

const getLatitude = (props) => {
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler();
  return viewLocation.latitude;
}

const getLongitude = (props) => {
  const {viewLocation, permissionHandler} = useLocation()
  permissionHandler();
  return viewLocation.longitude;
}

const Sun = (props) => {

  let today = new Date().toString();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sun: rises at {getSunrise({planet: props.planetObject})} and sets at {getSunset({planet: props.planetObject})}.</Text>
          <Text style={styles.sectionTitle}>Lat is {getLatitude()}, and long is {getLongitude()}</Text>
        </View>
      </View>
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
    height: "100%",
    alignItems: 'center'
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
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 0,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 32,
  },
  planetImage: {
    margin: 1,
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    resizeMode: 'cover'
  }
});

export default Sun;
