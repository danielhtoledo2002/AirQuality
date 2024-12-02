import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import AirQualityBox from "../.components/AirQuality";
import RangePicker from "../.components/AnalizeRange";
import { auth, firestore } from "../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Constants from "expo-constants";

const HomeScreen = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState("Última Hora");
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
      const now = new Date();
      let rangeStart;

      switch (selectedRange) {
        case "Última Hora":
          rangeStart = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "Últimas 24 Horas":
          rangeStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "Última Semana":
          rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
      }

      const pollutionRef = collection(firestore, "airPollution");
      const q = query(
        pollutionRef,
        where("userId", "==", auth.currentUser.uid),
        where("timestamp", ">=", rangeStart.toISOString()),
        orderBy("timestamp", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const locations = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locations.push(data.location);
      });

      const pollutionData = await Promise.all(
        locations.map(async (loc, index) => {
          const timestamp = querySnapshot.docs[index].data().timestamp;
          const start = new Date(timestamp).getTime() / 1000;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${loc.latitude}&lon=${loc.longitude}&start=${start}&end=${start}&appid=${apiKey}`,
          );
          return await response.json();
        }),
      );

      const totals = {
        co: 0,
        so2: 0,
        o3: 0,
        no: 0,
      };

      pollutionData.forEach((data) => {
        if (data.list && data.list[0]) {
          const components = data.list[0].components;
          totals.co += components.co;
          totals.so2 += components.so2;
          totals.o3 += components.o3;
          totals.no += components.no;
        }
      });

      const count = pollutionData.length;
      setAverages({
        co: (totals.co / count).toFixed(2),
        so2: (totals.so2 / count).toFixed(2),
        o3: (totals.o3 / count).toFixed(2),
        no: (totals.no / count).toFixed(2),
      });
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

      <RangePicker onSelect={setSelectedRange} />

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
