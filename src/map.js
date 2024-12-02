import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 
import RangePicker from '../.components/AnalizeRange';
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

const MapScreen = () => {
  const [markersData, setMarkersData] = useState({
    data: [],
    labels: [],
    longitude: [],
    latitude: [],
  });

  const [selectedRange, setSelectedRange] = useState('Última Hora');

  const fetchPollutionData = async (selectedRange) => {
    let data = [];
    let labels = [];
    let longitude = [];
    let latitude = [];

    try {
      const pollutionRef = collection(firestore, "airPollution");
      const q = query(
        pollutionRef,
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      let querySnapshot;
      try {
        querySnapshot = await getDocs(q);
      } catch (err) {
        console.error("Error getting docs:", err);
        querySnapshot = { forEach: () => {} };
      }

      let timeRange;
      if (selectedRange === 'Última Hora') {
        timeRange = new Date().getTime() - 60 * 60 * 1000;
      } else if (selectedRange === 'Últimas 24 Horas') {
        timeRange = new Date().getTime() - 24 * 60 * 60 * 1000;
      } else if (selectedRange === 'Última Semana') {
        timeRange = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
      }
      querySnapshot.forEach((doc) => {
        const pollutionData = doc.data();
        let docTimestamp;

        if (pollutionData.timestamp instanceof Timestamp) {
          docTimestamp = pollutionData.timestamp.toMillis();
        } else {
          docTimestamp = new Date(pollutionData.timestamp).getTime();
        }
        if (docTimestamp >= timeRange) {
          labels.push(new Date(docTimestamp).toLocaleTimeString());
          data.push({
            co: pollutionData.co,
            so2: pollutionData.so2,
            no: pollutionData.no,
            o3: pollutionData.o3,
          });
          longitude.push(pollutionData.location.longitude);
          latitude.push(pollutionData.location.latitude);
        }
      });

      setMarkersData({
        data,
        labels,
        longitude,
        latitude,
      });
    } catch (error) {
      console.error("Error fetching pollution data:", error);
    }
  };

  useEffect(() => {
    fetchPollutionData(selectedRange);
  }, []);
  
  useEffect(() => {
    fetchPollutionData(selectedRange);
  }, [selectedRange]);

  const handleRangeSelect = (value) => {
    setSelectedRange(value);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Ruta del Aire</Text>
      </View>

      <RangePicker onValueSelect={handleRangeSelect} />

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.37,
            longitude: -99.14,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {markersData.data.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: markersData.latitude[index],
                longitude: markersData.longitude[index],
              }}
              title={`Fecha: ${markersData.labels[index]}`}
              description={`Niveles de Contaminación - CO: ${item.co}, NO: ${item.no}, SO2: ${item.so2}, O3: ${item.o3}`}
            />
          ))}
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
    marginTop: 30,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
