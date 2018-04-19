import React from 'react';
import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
import {DatePickerAndroid ,StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, ActivityIndicator, Button, Alert, Image, ScrollView , Modal, TouchableHighlight} from 'react-native';

const{width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const leUser = null;
const uid =null;
const filmExiste=false;
const filmExisteDate=new Date();
const filmExisteRef='';
const starCount=5;
const renderedImages=null;


export default class HomeScreen extends React.Component {
  static navigationOptions={
    drawerLabel: 'Accueil',
  }

  constructor(props) {
    super(props);
    this.state = { 
      recherche: '',
      isLoading:false,
      modalFilm:false,
      filmExisteDateState:'',
      filmSelectedID:'',
      filmSelectedPoster:'',
      starNote:5,
      searchList:[],
      filmTitre:'',
    };
  }

  componentDidMount(){
    this.setState({searchList:[]})
  }

  onStarRatingPress(rating) {
    //Modifie le nombre d'etoiles correspondant à la note du film
      starCount=rating
      this.setState({starNote:rating})
    
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

  rechercheFilm(){
    //Récupère une recherche de films sur OMDB Api
    return fetch('http://www.omdbapi.com/?apikey=aa5829d5&s='+this.state.recherche+'&r=json.json')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          searchList: responseJson.Search,
        }, function(){

        });
      })
      .catch((error) =>{
        console.error(error);
      });
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
      titre:this.state.filmTitre,
    }
    if(filmExiste)
    {
    firebase.database().ref(filmExisteRef).update(movie)
    filmExiste=false
    }
    else
    {
      firebase.database().ref(uid).push(movie)
    }
  }


  checkMovie(idFilm){
    //Regarde si un film est déjà présent dans la base de données de l'utilisateur d'après son id imdb
    this.checkConnexion().then((hop)=>{try{
      firebase.database().ref(uid).orderByChild('id').equalTo(idFilm).on( "value",(data)=> {
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
    if(this.state.searchList!=null)
    {
    renderedImages =  this.state.searchList.map((films,index) => {
      //Crée un composant pour chaque film associé à la recherche
      if(films.Poster=="N/A")
      {
        films.Poster='http://www.all-result.com/v3/assets/images/imdbnoimage.jpg'
      }
    return (<TouchableHighlight key={index} onPress={() => {this.checkMovie(films.imdbID),this.setState({modalFilm:true,filmSelectedPoster:films.Poster,filmSelectedID:films.imdbID,filmTitre:films.Title})}}>
    <View style={{flex:1,flexDirection:'column',width:320,alignItems:'center',borderColor:'#FF5252',borderWidth:4,marginBottom:'2%'}}>
    
    <ImageBackground source={{uri: films.Poster}} style={{flex:1,height:422,width:312,justifyContent:'flex-end'}} >
    
    <Text style={{backgroundColor:'rgba(52, 52, 52, 0.9)',color:'white',width:312,fontWeight:'bold',textAlign:'center'}}> {films.Title}</Text>
      </ImageBackground>
      
    </View>
    </TouchableHighlight>);
    })}


    return (
      <ImageBackground source={require('./HomeCinemaGood.jpg')} style={styles.container}>
        <View style={{
            margin: 15,
            flexDirection:'row'
          }}
          >
          <Image source={require('./Logo.png')} style={{height:40, width:40,resizeMode:'cover', marginRight:'2%'}}/>
            <TextInput
              placeholderTextColor='#757575'
              underlineColorAndroid='transparent'
              style={styles.TI}
              placeholder={'Nom du film'}
              onChangeText={(recherche) => this.setState({ recherche })}
              onEndEditing={(trouver) => this.rechercheFilm()}
            />
          </View>
          <ScrollView contentContainerStyle={{margin:0,padding:0,}}>
            {renderedImages}
          </ScrollView>

          <Modal
          //Modal apparaissant lors du clique sur un film
          visible={this.state.modalFilm}
          transparent={true}
          animationType='fade'
          onRequestClose={() => {this.setState({ modalFilm: false}),filmExiste=false}} >
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
                    this.setState({ modalFilm: false});
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

});
