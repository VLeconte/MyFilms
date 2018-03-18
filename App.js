import React from 'react';
import {Text, View} from 'react-native';

import { DrawerNavigator} from 'react-navigation';
import ConnectScreen from './screens/ConnectScreen'
import HomeScreen from './screens/HomeScreen'

const Navigation = DrawerNavigator({
    Connect : {screen : ConnectScreen},
    Home : {screen : HomeScreen},
    },
    {
        order:['Home','Connect'],
        initialRouteName:'Connect',
        drawerBackgroundColor :'#D32F2F',
        contentOptions:
        {
            activeTintColor:'black',
            activeBackgroundColor:'#4CAF50',
            inactiveTintColor:'black',
            inactiveBackgroundColor:'#FFFFFF'
        }
    }
);
export default Navigation;