import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TextInput, Button, Alert, Modal } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class ConnectScreen extends React.Component {

  static navigationOptions = {
    drawerLabel: 'Deconnection',
    //drawerLockMode:'locked-closed',
  }

  onFocus() {
    this.setState({
      backgroundColor: 'green'
    })
  }

  constructor(props) {
    super(props);
    this.state = { id: '' };
    this.state = { mdp: '' };
    this.state = { showInscription: false };
    this.state = { showPasswordLost: false };
  }



  render() {
    var { navigate } = this.props.navigation;
    return (

      <ImageBackground source={require('./connectImg.png')} style={styles.container}>

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
              placeholder="Identifiant"
              onChangeText={(id) => this.setState({ id })}
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
              onChangeText={(mdp) => this.setState({ mdp })}
              onFocus={() => this.onFocus()}
            />
          </View>
          <View style={styles.styleButton}>
            <Button
              onPress={() => navigate("Home", {})}
              title="Connexion"
              color="#00C618"
            />
          </View>
        </View>
        <View style={styles.viewBas}>
          <View style={styles.styleButton}>
            <Button
              onPress={() => this.setState({ showInscription: true })}
              title="Inscription"
              color="#303F9F"
            />
          </View>
          <View style={styles.styleButton}>
            <Button
            onPress={() => this.setState({ showPasswordLost: true })}
              title="Mot de passe oublié"
              color="#D32F2F"
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
                />
              </View>

              <View style={styles.TIModalInscription}>
                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Identifiant"
                  onFocus={() => this.onFocus()}
                />
              </View>

              <View style={styles.TIModalInscription}>

                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Mot de passe"
                  onFocus={() => this.onFocus()}
                />
              </View>

              <View style={styles.TIModalInscription}>

                <TextInput

                  placeholderTextColor='#BDBDBD'
                  underlineColorAndroid='transparent'
                  style={styleTI.containerModalInscription}
                  placeholder="Confirmation mot de passe"
                  onFocus={() => this.onFocus()}
                />
              </View>

              <View style={styles.styleButton}>
                <Button
                  onPress={() => this.setState({ showInscription: false })}
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
                />
              </View>

              <View style={styles.styleButton}>
                <Button
                  onPress={() => this.setState({ showPasswordLost: false })}
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
    justifyContent: 'center',
    width: viewportWidth,
    height: viewportHeight,
    flexDirection: 'column',
    justifyContent: 'center',
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
