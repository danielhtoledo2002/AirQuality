
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';




const AirQualityBox = ({ gas, value, quality, trend, color }) => {
    return (
      <View style={[styles.qualityBox, { borderColor: color }]}>
        <Text style={[styles.gasText, { color }]}>{gas} {trend === 'up' ? '↑' : '↓'}</Text>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={[styles.qualityText, { color }]}>{quality}</Text>
        <TouchableOpacity style={styles.trendButton}>
          <Text style={styles.trendText}>Ver Tendencia ↗️</Text>
        </TouchableOpacity>
      </View>
    );
  };



  const styles = StyleSheet.create({


    qualityBox: {
        width: '45%',
        borderWidth: 2,
        borderRadius: 10,


        alignItems: 'center',
        justifyContent: 'space-between',
    
        marginBottom: 20,
        padding:10
      },
      gasText: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      valueText: {
        fontSize: 18,
        marginVertical: 5,
      },
      qualityText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      trendButton: {
        marginTop: 10,
      },
      trendText: {
        fontSize: 14,
        color: '#000000',
      },


  })

export default AirQualityBox