import React from 'react';
import {Text, View} from 'react-native';

import { DrawerNavigator} from 'react-navigation';
//Permet la gestion de la navigation entre les pages avec le menu

import ConnectScreen from './screens/ConnectScreen'
//Fichier correspondant à la page de connexion

import HomeScreen from './screens/HomeScreen'
//Fichier correspondant à la page d'accueil'

import UserScreen from './screens/UserScreen'
//Fichier correspondant à la page Mes Films

import StatScreen from './screens/StatScreen'
//Fichier correspondant à la page de statistiques

console.disableYellowBox = true;
//Permet de ne pas afficher les warning dans Expo

//Menu sur le côté
const Navigation = DrawerNavigator({
    Connect : {screen : ConnectScreen},
    Home : {screen : HomeScreen},
    User : {screen : UserScreen},
    Stat : {screen : StatScreen},
    },
    {
        order:['Home','User','Stat','Connect'],
        //Ordre d'affichage des éléments dans le menu

        initialRouteName:'Connect',
        //Page initiale

        drawerBackgroundColor :'#D32F2F',
        contentOptions:
        {
            //Style du menu
            activeTintColor:'black',
            activeBackgroundColor:'#009688',
            inactiveTintColor:'black',
            inactiveBackgroundColor:'#FFFFFF'
        }
    }
);
export default Navigation;