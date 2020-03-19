import * as React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';

import { TotalCountView } from '../components/TotalCountView'

export default function Dashboard() {
  let [dailyData, setDailyData] = useState(null)
  let [totals, setTotals] = useState(null)

  useEffect(() => {
    getLocalData('totals').then((response) => {
      setTotals(JSON.parse(response))
    }).catch(e => {
      console.log(e)
    })
  }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TotalCountView count={totals.confirmed} />
        <TotalCountView count={totals.recovered} />
        <TotalCountView count={totals.deaths} />
    </ScrollView>
  );
}

async function getLocalData(name) {
  let data = null
  try {
    data = await AsyncStorage.getItem(name)
  } catch (error) {
    console.log('Error retrieving ' + name + ' data: ', error)
  }
  return data
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
});
