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
      },
    bottomTabs: {
        id: 'BOTTOM_TABS_LAYOUT',
        children: [
        {
          stack: {
            id: 'Home',
            children: [
              {
                component: {
                    id: 'Home',
                    name: 'Home'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./home.png')
              }
            }
          }
        },
        {
          stack: {
            id: 'PlanetList',
            children: [
              {
                component: {
                  id: 'PlanetList',
                  name: 'PlanetList'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./home.png')
              }
            }
          }
        }
      ]
    },
  }
);


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

