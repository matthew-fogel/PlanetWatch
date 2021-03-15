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

const DATA = [
  {
    id: 'mercury',
    planet: mercury,
    title: 'Mercury',
  },
  {
    id: 'venus',
    planet: venus,
    title: 'Venus',
  },
  {
    id: 'mars',
    planet: mars,
    title: 'Mars',
  },
  {
    id: 'jupiter',
    planet: jupiter,
    title: 'Jupiter',
  },
  {
    id: 'saturn',
    planet: saturn,
    title: 'Saturn',
  },
  {
    id: 'uranus',
    planet: uranus,
    title: 'Uranus',
  },
  {
    id: 'neptune',
    planet: neptune,
    title: 'Neptune',
  },
];

const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text>
      Today, {item.title} rises at {getPlanetRise({planet: item.planet})} and sets at {getPlanetSet({planet: item.planet})}
    </Text>
  </TouchableOpacity>
);

const PlanetList = (props) => {

  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    return (
      <Item
        item={item}
        onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'PlanetDetail',
            options: {
              topBar: {
                title: {
                  text: 'PlanetDetail'
                }
              },
              bottomTabs: {
                visible: true
              }
            },
            passProps: {
              planetName: item.title,
              planetObject: item.planet
            }
          },
        })}
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <View style={styles.body}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </View>
  );
};

/*

const PlanetList = (props) => {

  return (
    <View style={styles.body}>
      <Planet name='Mercury' planet={mercury} />
      <Planet name='Venus' planet={venus} />
      <Planet name='Mars' planet={mars} />
      <Planet name='Jupiter' planet={jupiter} />
      <Planet name='Saturn' planet={saturn} />
      <Planet name='Uranus' planet={uranus} />
      <Planet name='Neptune' planet={neptune} />
    </View>
  );
};
*/
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default PlanetList;
