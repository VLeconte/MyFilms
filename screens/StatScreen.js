import React from 'react';
import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
import PureChart from 'react-native-pure-chart';
import {DatePickerAndroid ,StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, ActivityIndicator, Button, Alert, Image, ScrollView , Modal, TouchableHighlight} from 'react-native';

const{width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
//Permet de récupérer la hauteur et largeur de l'écran d'affichage

//Stocke l'utilisateur actuellement connecté
const activeUser = null;

//Stocke l'"uid" permettant de trouver l'utilisateur connecté dans la base de données
const uid =null;

//Stocke les films présents dans la base de donéées de l'utilisateur
const mesFilms=[];

//Stocke les données permettant d'afficher le graphique
const completDataNotesFilms=[{
  seriesName: 'series1',
  data: [
    {x: '2018-02-01', y: 30},
    {x: '2018-02-02', y: 200},
    {x: '2018-02-03', y: 170},
    {x: '2018-02-04', y: 250},
    {x: '2018-02-05', y: 10}
  ],
  color: '#297AB1'
}]


export default class StatScreen extends React.Component {
  static navigationOptions={
    drawerLabel: 'Statistiques',
  }

  constructor(props) {
    super(props);
    this.state = { 
      //Stocke le fait que l'application est en train de charger des éléments
      isLoading:true,

      //Permet d'entrainer l'affichage du graphique quand les films ont été chargés
      mesFilmsState:[],
    };
  }




  componentDidMount() {
    //Récupère les données à l'ouverture de la page et rempli les données nécessaires au graphique
    mesFilms = []

    this.checkConnexion().then((blabla) => {
      try {
        return firebase.database().ref(uid).orderByChild('dateInverse').once("value", (data) => {
          data.forEach(function (childessai) {
            mesFilms.push(childessai.val())
          })
        })

      }

      catch (error) {
        console.log(error)
      }
    }).then((euuuh) => {
      let essaiDates = []
      this.setState({ isLoading: false, mesFilmsState: mesFilms })
      this.state.mesFilmsState.forEach(function (film) {
        let dateFilm = new Date(film.date)
        essaiDates.push({ x: film.titre, y: film.note })
      })
      this.setState({ mesFilmsDate: essaiDates })
    })
  }


  async checkConnexion() {
    //Récupère les éléments permettant d'accèder à l'utilisateur
    try {
      activeUser = firebase.auth().currentUser;


      uid = activeUser.uid;
    }
    catch (error) {
      console.log(error);
    }
  }

  
  


  
  
  render() {
    //Affichage
    if(this.state.isLoading){
      //Met un écran de chargement en cas d'attente nécessaire au lancement de la page
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    
    if(this.state.mesFilmsDate!=null)
    {let dataNotesFilms=this.state.mesFilmsDate
    completDataNotesFilms = [
      {
        seriesName: 'NotesFilms',
        data: dataNotesFilms,
        color: '#297AB1'
      }
    ]
  }
  
    
    return (

      
      <ImageBackground source={require('./StatCinemaGood.jpeg')} style={styles.container}>
        <Text style={{fontSize:40,fontWeight: 'bold',color:'#FF5252',paddingBottom:'3%'}}>
          Statistiques
          </Text>
          <View style={{width:'90%'}}>

        <PureChart data={completDataNotesFilms} height={400} width={'100%'} type='line' customValueRenderer={(index, point) => {
      return (
        <Text style={{textAlign: 'center', paddingTop:'2%'}}>{point.x}</Text>
      )
    }} />

        </View>
      </ImageBackground>
    );
  }}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: viewportWidth, 
    height:viewportHeight,
    flexDirection: 'column',
    paddingTop:'3%',
  },
});
