import React from 'react';
import { Platform,StyleSheet, Text,TextInput, View,Button,ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

require('./ConnexionBD.js');

const leUser = null;
const uid =null;
const nbUser=1;
const user = new Array(0);
const myUser = [];
const userCo=null;

export default class App extends React.Component {
  state={
    gaga:null
  }
  addUser(){
    let maRef=firebase.database().ref();
    let tintin ={
      name:'tintin3',
      id:'coucou'
    }
    firebase.database().ref(uid).push(tintin);
    alert('Ajout ok')
  }
  componentWillMount=async()=>{
    let email="quentin.fumeau@gmail.com";
    let pass = "123456";

    try{
      await firebase.auth().signInWithEmailAndPassword(email,pass);
      console.log("log in !")
      leUser = firebase.auth().currentUser;
    }
    catch(error){
      console.log(error);
    }
    userCo = firebase.auth().currentUser;
    this.setState({gaga:true})
    if(userCo){
      uid = userCo.uid
    }
    else{
      console.log('pas connecté')
    }
  }
  connexion = async () => {
    let email="quentin.fumeau@gmail.com";
    let pass = "123456";

    try{
      await firebase.auth().signInWithEmailAndPassword(email,pass);
      console.log("log in !")
      leUser = firebase.auth().currentUser;
    }
    catch(error){
      console.log(error);
    }
  }
  infos(){
    if(leUser!=null){
      uid = leUser.uid; 
      console.log(uid);
    }
    else{
      console.log('vide');
    }
  }
 recupUser(){
   console.log("ok")
   try{
      firebase.database().ref(uid).on('value',(data)=>{
        
      //myUser = data.val()
      
      //console.log('les valeurs sont :'+myUser)
     
    })
    firebase.database().ref(uid).on('child_added',(data)=>{
      user.push(data.key)
      //myUser = data.val()
      console.log("les clés sont :"+user[0]+" et "+user)
      
    })
    
  }
  catch(error){
    console.log(error)
  }
  }
  caMarche(){
    console.log('première clé: '+user[0])
    console.log(myUser[user[0]].name)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>email</Text>
        <TextInput 
          style={{width:'50%'}}
          />
        <Text>mot de passe</Text>
        <TextInput
          style={{width:'50%'}}
          />
        <Button title='Envoyer' onPress={()=>this.addUser()} disabled={false}/>
        <Button title='recevoir' onPress={()=>this.recupUser()}/>
        <Button title='sign up' onPress={()=>this.connexion()}/>
        <Button title='display' onPress={()=>this.infos()}/>
        <Button title='Ca marche' onPress={()=>this.caMarche()}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop : '5%'
  },
});