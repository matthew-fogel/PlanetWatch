/**
 * @format
 */

import {Navigation} from 'react-native-navigation';

import PlanetList from './PlanetList';
import Home from './Home';
import PlanetDetail from './PlanetDetail';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  }
);

async function getIcons() {
  const icons = await Promise.all([
    Ionicons.getImageSource('md-home', 25, '#4d089a'),
    Ionicons.getImageSource('planet', 25, '#4d089a'),
  ])
  const [ home, planet ] = icons;
  return { home, planet };
}

Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('PlanetList', () => PlanetList);
Navigation.registerComponent('PlanetDetail', () => PlanetDetail);

async function startApplication() {
  const icons = await getIcons();

  Navigation.setRoot({
    root: {
        stack: {
            children: [
                {
                    component: {
                        name: 'Home'
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
                              icon: icons.home
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
                              icon: icons.planet
                            }
                          }
                        }
                      }
                    ]
                  },
                }
            ]
        }
    }
  })

}

Navigation.events().registerAppLaunchedListener(() => {
  startApplication()
})
