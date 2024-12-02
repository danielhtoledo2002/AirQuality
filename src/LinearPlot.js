import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AirQualityBox from "../.components/AirQuality";
import RangePicker from "../.components/AnalizeRange";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { Ionicons } from 'react-native-vector-icons';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

const Plots = () => {

  const route = useRoute();
  const gas = route.params.gas || {};
  const boxcolor = route.params.color || {};
  console.log(gas);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2,

      },
    ],
  });
  const [selectedRange, setSelectedRange] = useState('Última Hora');
  const [airQualityValue, setAirQualityValue] = useState(0);

  const handleRangeSelect = (value) => {
    setSelectedRange(value);
  };


  const getAirQualityLabel = (value) => {
    if (value <= 10) return { quality: "Buena", color: "#228B22", trend: "down" };
    if (value <= 20) return { quality: "Moderada", color: "#FFA500", trend: "neutral" };
    if (value <= 30) return { quality: "Mala", color: "#A52A2A", trend: "up" };
    return { quality: "Muy Mala", color: "#8B0000", trend: "up" };
  };

  useEffect(() => {
    const fetchPollutionData = async () => {
      try {
        if (!auth.currentUser) {
          console.error("No user is currently logged in.");
          return;
        }

        const pollutionRef = collection(firestore, "airPollution");

        let rangeStart;
        const now = new Date();
      

        switch (selectedRange) {
          case 'Última Hora':
            rangeStart = new Date(now.getTime() - 60 * 60 * 1000); 
            break;
          case 'Últimas 24 Horas':
            rangeStart = new Date(now.getTime() - 24 * 60 * 60 * 1000); 
            break;
          case 'Última Semana':
            rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); 
            break;
        }

        const q = query(
          pollutionRef,
          where("userId", "==", auth.currentUser.uid),
          where("timestamp", ">=", rangeStart.toISOString()),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);

        const labels = [];
        const data = [];

        querySnapshot.forEach((doc) => {
          const pollutionData = doc.data();
          labels.push(new Date(pollutionData.timestamp).toLocaleTimeString());
          if(gas === "NO")
          {
            data.push(pollutionData.no);
          }
          else if (gas === "SO2")
          {
            data.push(pollutionData.so2);
          }
          else if (gas === "CO")
          {
            data.push(pollutionData.co);
          }
          else
          {
            data.push(pollutionData.o3);
          }
        });

        const lastValue = data[data.length - 1] || 0;

        setChartData({
          labels: labels.slice(-6),
          datasets: [
            {
              data: data.slice(-6),
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        });

        setAirQualityValue(lastValue); 
      } catch (error) {
        console.error("Error fetching pollution data:", error);
      }
    };

    fetchPollutionData();
  }, [selectedRange]);

  const { quality, color, trend } = getAirQualityLabel(airQualityValue);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Calidad del Aire</Text>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Ionicons name="log-out-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      

      <RangePicker onValueSelect={handleRangeSelect} />

      <View style={styles.mainContent}>
        <View style={styles.airQualityContainer}>
          {chartData.datasets[0].data.length > 0 ? (
            <AirQualityBox
              gas={gas}
              value={`${airQualityValue} mg/m³`}
              quality={`Calidad ${quality}`}
              trend={trend}
              color={boxcolor}
            />
          ) : (
            <Text>No data available</Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Historial de Calidad del Aire</Text>
          {chartData.datasets[0].data.length > 0 ? (
            <LineChart
            data={chartData}
            width={screenWidth - 70}
            height={220}
            yAxisSuffix="mg/m³"
            yAxisInterval={1}

            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#f5f5f5",
              color: (opacity = color) => color, 
              labelColor: (opacity = 0) => "black",
          
              propsForDots: {
                r: "6", 
                strokeWidth: "2", 
                fill: color
                
              },
              propsForLabels: {
                fontSize: 9,
              },
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 16,
            
            }}
            formatXLabel={(label) =>
              label.length > 5 ? label.substring(0, 5) : label
            }
          />
          ) : (
            <Text>No data available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',  
    alignItems: 'center',  
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  mainContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  airQualityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
  },
  chartContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Plots;