import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AirQualityBox from '../.components/AirQuality';
import RangePicker from '../.components/AnalizeRange';


const HomeScreen = ({navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calidad del Aire</Text>
      </View>

      <RangePicker/>

      <View style={styles.mainContent}>


        <View style={styles.airQualityContainer}>
          <AirQualityBox
            gas="CO"
            value="192 mg/m³"
            quality="Calidad Mala"
            trend="up"
            color="#A52A2A"
          />
          <AirQualityBox
            gas="SO"
            value="42 mg/m³"
            quality="Calidad Media"
            trend="up"
            color="#22B8008F"
          />
          <AirQualityBox
            gas="O3"
            value="42 mg/m³"
            quality="Calidad Media"
            trend="down"
            color="#32CD32"
          />
          <AirQualityBox
            gas="NO"
            value="20 mg/m³"
            quality="Calidad Buena"
            trend="up"
            color="#32CD32"
          />
        </View>
      </View>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
   
  },
  header: {
    paddingTop: 40, 
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  mainContent: {
    flex: 1, 
    justifyContent: 'center',
   
  },
  
  airQualityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    padding:10
  },

});

export default HomeScreen;
