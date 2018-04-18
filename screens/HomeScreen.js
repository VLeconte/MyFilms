import React from 'react';
import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
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
const filmPoster='';
const renderedImages=null;


export default class HomeScreen extends React.Component {
  static navigationOptions={
    drawerLabel: 'Accueil',
  }

  constructor(props) {
    super(props);
    this.state = { 
      recherche: '',
      dataSource:'',
      isLoading:false,
      modalFilm:false,
      filmSelectedID:'',
      filmSelectedPoster:'',
      starNote:5,
      filmTitre:'',
    };
  }

  onStarRatingPress(rating) {
    
      starCount=rating
      this.setState({starNote:rating})
    
  }

  /*componentDidMount(){
    return fetch('http://www.omdbapi.com/?apikey=aa5829d5&s=guardians+of+the+galaxy&r=json.json')
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
  }*/

  async openUpPicker() {
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
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
}

  rechercheFilm(){
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

    try{
      leUser = firebase.auth().currentUser;


      uid = leUser.uid;
    }
    catch(error){
      console.log(error);
    }
  }

  addMovie(){
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
    filmExiste=false;
    }
    else
    {
      firebase.database().ref(uid).push(movie)
    }
  }

  checkMovie(idFilm){
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
  }}).then((filmExiste)=>(this.setState({modalFilm:true,starNote:starCount})))
}
  
  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    if(this.state.searchList!=null)
    {
    renderedImages =  this.state.searchList.map((films,index) => {
      if(films.Poster=="N/A")
      {
        films.Poster='http://www.all-result.com/v3/assets/images/imdbnoimage.jpg'
      }
    return (<TouchableHighlight key={index} onPress={() => {this.setState({modalFilm:true,filmSelectedPoster:films.Poster,filmSelectedID:films.imdbID,filmTitre:films.Title}),this.checkConnexion(),this.checkMovie(films.imdbID)}}>
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
