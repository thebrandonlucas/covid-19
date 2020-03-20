import * as React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import shortid from 'shortid'

import { TotalCountView } from '../components/TotalCountView'

export default function Dashboard() {
  let [dailyData, setDailyData] = useState(null)
  let [totals, setTotals] = useState(null)

  const initializeData = async () => {
    const totals = JSON.parse(await getLocalData('totals'))
    setTotals(totals)
  } 

  useEffect(() => {
    initializeData()
  }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {
        totals !== null &&
        ([
            <TotalCountView count={totals.confirmed - totals.recovered - totals.deaths} type="Active" color="red" key={shortid.generate()}/>,
            <TotalCountView count={totals.recovered} type="Recovered" color="#3a3" key={shortid.generate()}/>,
            <TotalCountView count={totals.deaths} type="Deaths" color="black" key={shortid.generate()}/>,
            <TotalCountView count={totals.confirmed} type="Total Confirmed" color="blue" key={shortid.generate()}/>,
        ])
      }
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
  contentContainer: {
    alignItems: 'center', 
  }, 
});
