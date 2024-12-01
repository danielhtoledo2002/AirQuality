import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image source={require('../assets/pulmones.png')} style={styles.logo} />
        <Text style={styles.title}>Fresh Air</Text>
      </View>


      <Image source={require('../assets/planet.gif')} style={styles.worldImage} />

      <Text style={styles.subtitle}>Descubre el aire que respiras</Text>

      <TouchableOpacity style={styles.loginButton}
      onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 100,
  },
 header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', 
  marginBottom: 20,
  width: '135%', 
  paddingHorizontal: 0,
},
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  worldImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;


