import * as React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';

export default function Dashboard() {
  let [dailyData, setDailyData] = useState(null)
  let [totals, setTotals] = useState(null)

  useEffect(() => {
    getLocalData('totals').then((response) => {
      console.log(response)
      setTotals(JSON.parse(response))
    }).catch(e => {
      console.log(e)
    })
  }, [])
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View>
        <Text>{totals.confirmed}</Text>
        <Text>{totals.deaths}</Text>
        <Text>{totals.recovered}</Text>
      </View>
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
