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


export default class HomeScreen extends React.Component {
  static navigationOptions={
    drawerLabel: 'Accueil',
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
      starCount: 3.5,
      dateFilmSelected:new Date(),

    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  componentDidMount(){
    return fetch('http://www.omdbapi.com/?apikey=aa5829d5&t=guardians+of+the+galaxy&r=json.json')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          searchList: ['',[responseJson]],
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  async openUpPicker() {
    try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: new Date(),
          mode: "spinner"
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          this.setState({dateFilmSelected:(new Date(year,month,[day]))})
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

      Alert.alert(leUser.email);

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
      note:this.state.starCount,
      date:this.state.dateFilmSelected.getTime(),
    }
    firebase.database().ref(uid).push(movie);
  }
  

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    const renderedImages =  this.state.searchList.map((films,index) => {
    return (<TouchableHighlight key={index} onPress={() => {this.setState({modalFilm:true}),this.setState({filmSelectedPoster:films.Poster}),this.setState({filmSelectedID:films.imdbID})}}>
    <View style={{flex:1,flexDirection:'column',width: viewportWidth,alignItems:'center'}}>
    <Image source={{uri: films.Poster}} style={{height:426, width:320,resizeMode:'cover',marginTop:'3%',borderColor:'#FF5252',borderWidth:4}} />
    <Text style={{backgroundColor:'#FFFFFF',color:'#212121',width:320,fontWeight:'bold',textAlign:'center'}}> {films.Title}</Text>
    </View>
    </TouchableHighlight>);
    });


    return (
      <View style={styles.container}>
        <View style={{
            borderBottomColor: '#009688',
            borderBottomWidth: 2,
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
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
              </View>

              <View style={styles.TIModalInscription}>

                <Button 
                onPress={()=>{this.openUpPicker()}}
              
              
              title={this.state.dateFilmSelected.getDate()+"-"+(this.state.dateFilmSelected.getMonth()+1)+"-"+this.state.dateFilmSelected.getFullYear()}
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
      </View>
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
    backgroundColor:'#009688',
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
