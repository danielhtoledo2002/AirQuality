import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import AirQualityBox from '../.components/AirQuality';
import RangePicker from '../.components/AnalizeRange';

const screenWidth = Dimensions.get('window').width; 

const Plots = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer} 
    >

      <View style={styles.header}>
        <Text style={styles.title}>Calidad del Aire</Text>
      </View>


      <RangePicker />


      <View style={styles.mainContent}>
        <View style={styles.airQualityContainer}>
    
          <AirQualityBox
            gas="CO"
            value="192 mg/m³"
            quality="Calidad Mala"
            trend="up"
            color="#A52A2A"
          />
        </View>


        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Historial de Calidad del Aire</Text>
          <LineChart
            data={{
              labels: ['2016', '2017', '2018', '2019', '2020', '2021'], 
              datasets: [
                {
                  data: [40, 30, 50, 60, 45, 50], 
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, 
                  strokeWidth: 2, 
                },
              ],
            }}
            width={screenWidth - 40} 
            height={220} 
            yAxisSuffix=" mg/m³" 
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#f5f5f5',
              decimalPlaces: 0, 
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ff0000',
              },
            }}
            bezier 
            style={{
              marginVertical: 10,
              borderRadius: 16,
            }}
          />
        </View>
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
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  airQualityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Plots;
