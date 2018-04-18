import React from 'react';
import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
import PureChart from 'react-native-pure-chart';
import {DatePickerAndroid ,StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, ActivityIndicator, Button, Alert, Image, ScrollView , Modal, TouchableHighlight} from 'react-native';

const{width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const leUser = null;
const uid =null;
const nbUser=1;
const user = new Array(0);
const myUser = [];
const userCo=null;
const filmExiste=false;
const filmExisteDate=new Date(1521982140000);
const filmExisteRef='';
const starCount=5;
const mesFilms=[];
const sampleData=[{
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
      recherche: '',
      dataSource:'',
      isLoading:true,
      modalFilm:false,
      filmSelectedID:'',
      filmSelectedPoster:'',
      starNote:5,
      mesFilmsState:[],
      mesFilmsData:[],
    };
  }




    componentDidMount(){
    mesFilms=[]
    this.checkConnexion().then((blabla)=>{
    try{
      return firebase.database().ref(uid).orderByChild('dateInverse').once("value", (data)=> {
        data.forEach(function(childessai)
        {
          mesFilms.push(childessai.val())
        })})
        
      }
      
  catch(error){
    console.log(error)
  }}).then((euuuh)=>{
    let essaiDates=[]
    this.setState({isLoading:false,mesFilmsState:mesFilms})
    this.state.mesFilmsState.forEach(function(film){
      let dateFilm=new Date(film.date)
      essaiDates.push({x:film.titre,y:film.note})
      })
      this.setState({mesFilmsDate:essaiDates})


    })
    
    
  
  }


  async checkConnexion()  {

    try{
      leUser = firebase.auth().currentUser;


      uid = leUser.uid;
    }
    catch(error){
      console.log(error);
    }
  }

  
  


  
  
  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    
    /*let sampleData = [
      {
        seriesName: 'NotesDates',
        data: this.state.mesFilmsDate,
        color: '#297AB1'
      },
    ]*/
    if(this.state.mesFilmsDate!=null)
    {let bcd=this.state.mesFilmsDate
    sampleData = [
      {
        seriesName: 'series1',
        data: bcd,
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

        <PureChart data={sampleData} height={400} width={'100%'} type='line' customValueRenderer={(index, point) => {
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

  TI: {
    height: 40,
    width: 320,
    margin: 1,
    color: '#212121',
    fontSize: 20,
    backgroundColor:'#FFFFFF',
  },

  starRate: {
    padding:'4%',
  },

  modalOutter: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: viewportWidth,
    height: viewportHeight,
  },

  modalInscriptionInner: {
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '90%',
  },

  TIModalInscription: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    margin: 15,
  },

  containerModalInscription: {
    height: 40,
    width: 320,
    margin: 1,
    color: 'black',
    fontSize: 20,
  },
});
