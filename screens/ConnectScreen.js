import React from 'react';
import * as firebase from 'firebase';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, Button, Alert, Modal ,Image} from 'react-native';

var mailId='';
var mdp='';
var newMailId='';
var newMdp1='';
var newMdp2='';
var mdpLost='';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

firebase.initializeApp({
  apiKey: "AIzaSyBHLLPacp0x4Jjw9nZkFdslFt2FjvzvQa8",
  authDomain: "myfilms-54dd2.firebaseapp.com",
  databaseURL: "https://myfilms-54dd2.firebaseio.com",
  projectId: "myfilms-54dd2",
  storageBucket: "myfilms-54dd2.appspot.com",
  messagingSenderId: "1048699367292"
});


export default class ConnectScreen extends React.Component {

  static navigationOptions = {
    drawerLabel: 'Deconnexion',
    drawerLockMode:'locked-closed',
  }
  
  async signup(email, pass) {
    
    try {
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);
          this.props.navigation.navigate("Home",{});

        


    } catch (error) {
      Alert.alert("Le compte n'a pas été créé",error.toString())
    }

}

async login(email, pass) {
    
  try {
      await firebase.auth()
          .signInWithEmailAndPassword(email, pass);
          this.props.navigation.navigate("Home",{});


  } catch (error) {
    Alert.alert("Connexion impossible",error.toString())
  }

}

  onFocus() {
    this.setState({
      backgroundColor: 'green'
    })
  }

  constructor(props) {
    super(props);
    this.state = { showInscription: false,showPasswordLost: false  };
  }



  render() {
    var { navigate } = this.props.navigation;
    return (

      <ImageBackground source={require('./connectImg.png')} style={styles.container}>
        <Image source={require('./LogoC.png')} style={{height:'20%',width:'68%',marginTop:'20%',marginBottom:'10%'}}/>
        <View>
          <View style={{
            backgroundColor: this.state.text,
            borderBottomColor: 'white',
            borderBottomWidth: 2,
            margin: 15,
          }}
          >
            <TextInput

              placeholderTextColor='#B7C3C1'
              underlineColorAndroid='transparent'
              style={styleTI.container}
              placeholder="Adresse e-mail"
              onChangeText={(a) => mailId=a}
              onFocus={() => this.onFocus()}
            />
          </View>
          <View style={{
            backgroundColor: this.state.text,
            borderBottomColor: 'white',
            borderBottomWidth: 2,
            margin: 15,
          }}
          >
            <TextInput
              placeholderTextColor='#B7C3C1'
              underlineColorAndroid='transparent'
              style={styleTI.container}
              placeholder="Mot de passe"
              secureTextEntry={true}
              onChangeText={(a) => mdp=a}
              onFocus={() => this.onFocus()}
            />
          </View>
          <View style={styles.styleButton}>
            <Button
              onPress={() => this.login(mailId,mdp)}
              title="Connexion"
              color="#00C618"
            />
          </View>
        </View>
        <View style={styles.viewBas}>
        
        <View style={styles.styleButton}>
            <Button
            onPress={() => this.setState({ showPasswordLost: true })}
              title="Mot de passe oublié"
              color="#0288D1"
            />
          </View>

          <View style={styles.styleButton}>
            <Button
              onPress={() => this.setState({ showInscription: true })}
              title="Inscription"
              color="#0288D1"
            />
          </View>

          
          
        </View>

        <Modal
          visible={this.state.showInscription}
          transparent={true}
          animationType='fade'
          onRequestClose={() => this.setState({ showInscription: false })} >
          <View style={styles.modalOutter}>
            <View style={styles.modalInscriptionInner}>

              <View style={styles.TIModalInscription}>
                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Adresse mail"
                  onFocus={() => this.onFocus()}
                  onChange={(a) => newMailId=a.nativeEvent.text}
                />
              </View>
              
              <View style={styles.TIModalInscription}>

                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Mot de passe"
                  secureTextEntry={true}
                  onFocus={() => this.onFocus()}
                  onChange={(a) => newMdp1=a.nativeEvent.text}
                />
              </View>

              <View style={styles.TIModalInscription}>

                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Confirmation mot de passe"
                  secureTextEntry={true}
                  onFocus={() => this.onFocus()}
                  onChange={(a) => newMdp2=a.nativeEvent.text}
                />
              </View>

              <View style={styles.styleButton}>
                <Button
                  onPress={() => {
                    this.setState({ showInscription: false });
                  this.signup(newMailId ,newMdp2);
                }
                }
                  title="S'inscrire"
                  color="#303F9F"
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={this.state.showPasswordLost}
          transparent={true}
          animationType='fade'
          onRequestClose={() => this.setState({ showPasswordLost: false })} >
          <View style={styles.modalOutter}>
            <View style={styles.modalPasswordLostInner}>

              <View style={styles.TIModalInscription}>
                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Adresse mail"
                  onFocus={() => this.onFocus()}
                  onChange={(a)=> mdpLost=a.nativeEvent.text}
                />
              </View>

              <View style={styles.styleButton}>
                <Button
                  onPress={() => {
                    this.setState({ showPasswordLost: false }),
                    firebase.auth().sendPasswordResetEmail(mdpLost).then(()=>Alert.alert('Mail envoyé !','Le mail a bien été envoyé')).catch((error)=>Alert.alert("Le mail n'a pas pu être envoyé",error.toString()))}}
                  title="recuperer mon mot de passe"
                  color="#D32F2F"
                />
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground >
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: viewportWidth,
    height: viewportHeight,
    flexDirection: 'column',
  },

  viewBas: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  styleButton: {
    margin: 30,
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
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '60%',
  },

  modalPasswordLostInner: {
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '30%',
  },

  TIModalInscription: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    margin: 15,
  },
});

const styleTI = StyleSheet.create({
  container: {
    height: 40,
    width: 320,
    margin: 1,
    color: '#FEFEE2',
    fontSize: 20,

  },

  containerModalInscription: {
    height: 40,
    width: 320,
    margin: 1,
    color: 'black',
    fontSize: 20,
  },
});