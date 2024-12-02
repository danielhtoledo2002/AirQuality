import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import AirQualityBox from "../.components/AirQuality";
import RangePicker from "../.components/AnalizeRange";
import { auth, firestore } from "../firebaseConfig";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import Constants from "expo-constants";

const HomeScreen = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState("Última Hora");

  const handleRangeSelect = (value) => {
    setSelectedRange(value);
  };

  const [averages, setAverages] = useState({
    co: 0,
    so2: 0,
    o3: 0,
    no: 0,
  });
  const apiKey = Constants.expoConfig.extra.apiKey;

  useEffect(() => {
    fetchAirQualityData();
  }, [selectedRange]);

  const fetchAirQualityData = async () => {
    try {
      const data = [];
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
          data.push({
            co: pollutionData.co,
            so2: pollutionData.so2,
            no: pollutionData.no,
            o3: pollutionData.o3,
          });
        }
      });
  
      // Calculate averages
      const totals = {
        co: 0,
        so2: 0,
        o3: 0,
        no: 0,
      };
  
      data.forEach((entry) => {
        totals.co += entry.co;
        totals.so2 += entry.so2;
        totals.o3 += entry.o3;
        totals.no += entry.no;
      });
  
      const count = data.length;
      if (count > 0) {
        setAverages({
          co: (totals.co / count).toFixed(2),
          so2: (totals.so2 / count).toFixed(2),
          o3: (totals.o3 / count).toFixed(2),
          no: (totals.no / count).toFixed(2),
        });
      } else {
        setAverages({
          co: 0,
          so2: 0,
          o3: 0,
          no: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  };
  
  const getQualityInfo = (value, type) => {
    let quality, color, trend;

    switch (type) {
      case "co":
        if (value < 4400) {
          quality = "Calidad Buena";
          color = "#32CD32";
          trend = "down";
        } else if (value < 9400) {
          quality = "Calidad Media";
          color = "#22B8008F";
          trend = "up";
        } else {
          quality = "Calidad Mala";
          color = "#A52A2A";
          trend = "up";
        }
        break;
      default:
        quality = "Calidad Media";
        color = "#22B8008F";
        trend = "up";
    }

    return { quality, color, trend };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calidad del Aire</Text>

        <TouchableOpacity onPress={() => auth.signOut()}>
          <Ionicons name="log-out-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <RangePicker onValueSelect={handleRangeSelect} />

      <View style={styles.mainContent}>
        <View style={styles.airQualityContainer}>
          <AirQualityBox
            gas="CO"
            value={`${averages.co} mg/m³`}
            showButton="1"
            {...getQualityInfo(averages.co, "co")}
          />
          <AirQualityBox
            gas="SO"
            value={`${averages.so2} mg/m³`}
            showButton="1"
            {...getQualityInfo(averages.so2, "so2")}
          />
          <AirQualityBox
            gas="O3"
            value={`${averages.o3} mg/m³`}
            showButton="1"
            {...getQualityInfo(averages.o3, "o3")}
          />
          <AirQualityBox
            gas="NO"
            value={`${averages.no} mg/m³`}
            showButton="1"
            {...getQualityInfo(averages.no, "no")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  airQualityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    padding: 10,
  },
});

export default HomeScreen;
