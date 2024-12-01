import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';


const NavBar = ({ navigation }) => {
  if (!navigation) {
    console.error('El objeto navigation no se recibió correctamente en NavBar.');
    return null;
  }

  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Plots', { plotId: 1 })}
      >
        <Image
          source={require('../assets/air.png')}
          style={styles.navImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={require('../assets/home.png')}
          style={styles.navImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Map')}
      >
        <Image
          source={require('../assets/location.png')}
          style={styles.navImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#22B8008F',
  },
  navButton: {
    padding: 10,
  },
  navImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default NavBar;
