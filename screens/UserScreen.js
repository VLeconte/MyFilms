import React from 'react';
import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
import {DatePickerAndroid ,StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, ActivityIndicator, Button, Alert, Image, ScrollView , Modal, TouchableHighlight} from 'react-native';

const{width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
//Permet de récupérer la hauteur et largeur de l'écran d'affichage

//Variables

//Stocke l'utilisateur actuellement connecté
const leUser = null;

//Stocke l'"uid" permettant de trouver l'utilisateur connecté dans la base de données
const uid =null;

//Stocke le fait que le film actuellement selectionné est présent dans la base de données associée à l'utilisateur
const filmExiste=false;

//Stocke la date du film actuellement selectionné si ce dernier est déjà dans la base de données
const filmExisteDate=new Date();

//Stocke la référence du film selectionné si ce dernier est déjà dans la base de données
const filmExisteRef='';

//Stocke la note du film slectionné si ce dernier est déjà dans la base de données
const starCount=5;

//Stocke les films présents dans la base de donéées de l'utilisateur
const mesFilms=[];


export default class UserScreen extends React.Component {
  static navigationOptions={
    drawerLabel: 'Mes films',
  }

  constructor(props) {
    super(props);
    this.state = { 
      //Stocke le fait que l'application est en train de charger des éléments
      isLoading:false,

      //Permet d'afficher ou non le modal de film
      modalFilm:false,

      //Permet de changer la date
      filmExisteDateState:'',

      //Stocke l'id imdb du film selectionné
      filmSelectedID:'',

      //Stocke le lien vers l'affiche du film selectionné
      filmSelectedPoster:'',

      //Stocke la note donnée au film
      starNote:5,

      //Stocke la liste des films recherchés
      searchList:[],

      //Stocke le titre d'un film
      filmTitre:'',
      
      //Permet d'entrainer l'affichage du graphique quand les films ont été chargés
      mesFilmsState:[],
    };
  }

  onStarRatingPress(rating) {
    //Modifie le nombre d'etoiles correspondant à la note du film
      starCount=rating
      this.setState({starNote:rating})
    
  }

  checkMovie(idFilm){
    //Regarde si un film est déjà présent dans la base de données de l'utilisateur d'après son id imdb
    this.checkConnexion().then((hop)=>{try{
      firebase.database().ref(uid).orderByChild('id').equalTo(idFilm).on("value", (data)=> {
        data.forEach(function(childessai)
        {
          filmExiste=true
          filmExisteDate=new Date(childessai.val().date)
          starCount=childessai.val().note
          filmExisteRef=childessai.ref
        })
        })}
    
  
  catch(error){
    console.log(error)
  }}).then((childessai)=>{
    
    this.setState({starNote:starCount,filmExisteDateState:filmExisteDate}),
    starCount=5,
    filmExisteDate=new Date()})
  
  }

    componentDidMount(){
      //Permet l'affichage à l'ouverture de la page
    mesFilms=[]
    this.checkConnexion().then((blabla)=>{
    try{
      return firebase.database().ref(uid).orderByChild('dateInverse').on("value", (data)=> {
        data.forEach(function(childessai)
        {
          mesFilms.push(childessai.val())
        })})
        
      }
      
  catch(error){
    console.log(error)
  }}).then((euuuh)=>{
    this.setState({isLoading:false,mesFilmsState:mesFilms})})
  
  }

  

  async openUpPicker() {
    //Gère le changement de la date de visionnage
    if(this.state.filmExiste)
    {
      datePickup=filmExisteDate
    }
    else
    {
      datePickup=new Date()
    }
    try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: datePickup,
          mode: "spinner"
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          filmExisteDate=new Date(year,month,[day])
          this.setState({filmExisteDateState:filmExisteDate})
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
}

  

  async checkConnexion()  {
    //Récupère les éléments permettant d'accèder à l'utilisateur
    try{
      leUser = firebase.auth().currentUser;


      uid = leUser.uid;
    }
    catch(error){
      console.log(error);
    }
  }

  addMovie(){
    //Ajoute ou modifie un film dans la base de données
    let movie ={
      id:this.state.filmSelectedID,
      poster:this.state.filmSelectedPoster,
      note:starCount,
      date:filmExisteDate.getTime(),
      dateInverse:-filmExisteDate.getTime(),
    }
    if(filmExiste)
    {
    firebase.database().ref(filmExisteRef).update(movie)
    filmExiste=false;
    }
    else
    {
      firebase.database().ref(uid).push(movie)
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

    const renderedImages =  this.state.mesFilmsState.map((films,index) => {
      //Crée un composant pour chaque film associé à la recherche
    return (<TouchableHighlight key={index} onPress={() => {this.setState({modalFilm:true,filmSelectedPoster:films.poster}),this.setState({filmSelectedID:films.id}),this.checkMovie(films.id)}}>
    <View style={{flex:1,flexDirection:'column',width:320,alignItems:'center',borderColor:'#FF5252',borderWidth:4,marginBottom:'2%'}}>
    <ImageBackground source={{uri: films.poster}} style={{flex:1,height:422,width:312,justifyContent:'flex-end'}} >
    
    <Text style={{backgroundColor:'rgba(52, 52, 52, 0.9)',color:'white',width:312,fontWeight:'bold',textAlign:'center'}}> {films.titre}</Text>
      </ImageBackground>
      
    </View>
    </TouchableHighlight>);
    });


    return (
      <ImageBackground source={require('./UserCinemaGood.jpeg')} style={styles.container}>
        
          <ScrollView contentContainerStyle={{margin:0,padding:0,}}>
            {renderedImages}
          </ScrollView>

          <Modal
          //Modal apparaissant lors du clique sur un film
          visible={this.state.modalFilm}
          transparent={true}
          animationType='fade'
          onRequestClose={() => this.setState({ modalFilm: false })} >
          <View style={styles.modalOutter}>
            <View style={styles.modalInscriptionInner}>

            <Image source={{uri: this.state.filmSelectedPoster}} style={{height:426, width:320,resizeMode:'cover',borderColor:'#FF5252',borderWidth:4}} />
              
              <View style={styles.starRate}>

                <StarRating
                    disabled={false}
                    halfStarEnabled={true}
                    emptyStarColor='#FFFFFF'
                    fullStarColor='#4CAF50'
                    halfStarColor='#CDDC39'
                    maxStars={10}
                    rating={this.state.starNote}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
              </View>

              <View style={styles.TIModalInscription}>

                <Button 
                onPress={()=>{this.openUpPicker()}}
              
              
              title={filmExisteDate.getDate()+"-"+(filmExisteDate.getMonth()+1)+"-"+filmExisteDate.getFullYear()}
              color = "#4CAF50"
              />
              </View>

              <View style={{marginTop:'2%'}}>
                <Button
                  onPress={() => {
                    this.setState({ modalFilm: false });
                    this.checkConnexion();
                    this.addMovie();
                }
                }
                  title="Valider"
                  color="#303F9F"
                />
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}




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

});
