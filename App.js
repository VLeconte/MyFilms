import React from 'react';
import {Text, View} from 'react-native';

import { DrawerNavigator} from 'react-navigation';
import ConnectScreen from './screens/ConnectScreen'
import HomeScreen from './screens/HomeScreen'
import UserScreen from './screens/UserScreen'
import StatScreen from './screens/StatScreen'
console.disableYellowBox = true;
const Navigation = DrawerNavigator({
    Connect : {screen : ConnectScreen},
    Home : {screen : HomeScreen},
    User : {screen : UserScreen},
    Stat : {screen : StatScreen},
    },
    {
        order:['Home','User','Stat','Connect'],
        initialRouteName:'Connect',
        drawerBackgroundColor :'#D32F2F',
        contentOptions:
        {
            activeTintColor:'black',
            activeBackgroundColor:'#009688',
            inactiveTintColor:'black',
            inactiveBackgroundColor:'#FFFFFF'
        }
    }
);
export default Navigation;