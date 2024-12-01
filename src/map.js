import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 
import RangePicker from '../.components/AnalizeRange';

const MapScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.header}>
        <Text style={styles.title}>Ruta del Aire</Text>
      </View>

      <RangePicker />

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.4326, 
            longitude: -99.1332,
            latitudeDelta: 0.05, 
            longitudeDelta: 0.05,
          }}
        >
        
          <Marker
            coordinate={{ latitude: 19.4326, longitude: -99.1332 }}
            title="CDMX"
            description="Calidad del aire: Mala"
          />
        </MapView>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  mapContainer: {
    height: 400, 
    width: Dimensions.get('window').width - 40, 
    marginHorizontal: 20, 
    borderRadius: 20, 
    overflow: 'hidden',
    marginTop:30,
  },
  map: {
    flex: 1, 
  },
});

export default MapScreen;
