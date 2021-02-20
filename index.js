/**
 * @format
 */

import {Navigation} from 'react-native-navigation';

import PlanetList from './PlanetList';
import Home from './Home';

Navigation.setDefaultOptions({
    statusBar: {
      backgroundColor: '#4d089a'
    },
    topBar: {
        title: {
          text: 'PlanetWatch',
          color: 'white',
          fontSize: 32,
        },
        backButton: {
            color: 'white'
          },
        background: {
          color: '#00304E',
        }
      }
  });


Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('PlanetList', () => PlanetList);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'Home'
                        }
                    }
                ]
            }
        }
    })
})
