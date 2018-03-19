import React from 'react';
import * as firebase from 'firebase';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, ActivityIndicator, Button, Alert, Image, ScrollView } from 'react-native';

const{width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class HomeScreen extends React.Component {
  static navigationOptions={
    drawerLabel: 'Accueil',
  }

  constructor(props) {
    super(props);
    this.state = { recherche: '' };
    this.state = { dataSource: '' };
    this.state ={ isLoading: true};
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

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    const renderedImages =  this.state.searchList.map((films,index) => {
    return (<View key={index} style={{flex:1,flexDirection:'column',width: viewportWidth,alignItems:'center'}}>
    <Image source={{uri: films.Poster}} style={{height:426, width:320,resizeMode:'cover',marginTop:'3%',borderColor:'#FF5252',borderWidth:4}} />
    <Text style={{backgroundColor:'#FFFFFF',color:'#212121',width:320,fontWeight:'bold',textAlign:'center'}}> {films.Title}</Text>
    </View>);
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
  }
});
