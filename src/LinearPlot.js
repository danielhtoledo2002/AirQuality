import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AirQualityBox from "../.components/AirQuality";
import RangePicker from "../.components/AnalizeRange";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

const screenWidth = Dimensions.get("window").width;

const Plots = () => {
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


  // Investigar cuales son los rangos chidos 
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
            rangeStart = new Date(now.getTime() - 1440 * 60 * 1000);
            break;
          case 'Última Semana':
            rangeStart = new Date(now.getTime() - 10080 * 60 * 1000);
            break;
          default:
            rangeStart = new Date();
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
          data.push(pollutionData.co);
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
      </View>

      <RangePicker onSelect={setSelectedRange} />

      <View style={styles.mainContent}>
        <View style={styles.airQualityContainer}>
          {chartData.datasets[0].data.length > 0 ? (
            <AirQualityBox
              gas="CO"
              value={`${airQualityValue} mg/m³`}
              quality={`Calidad ${quality}`}
              trend={trend}
              color={color}
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
              width={screenWidth - 40}
              height={220}
              yAxisSuffix=" mg/m³"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: "#f5f5f5",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#f5f5f5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ff0000",
                },
                propsForLabels: {
                  fontSize: 10,
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
    paddingHorizontal: 20,
    paddingBottom: 10,
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
