import * as React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import shortid from 'shortid'
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";
import { TotalCountView } from '../components/TotalCountView'
import { RegionPicker } from '../components/RegionPicker'
import { CustomDatePicker } from '../components/CustomDatePicker'

export default function Dashboard() {
  let [dateData, setDateData] = useState(null)
  let [dates, setDates] = useState(null)
  let [coronaData, setCoronaData] = useState(null)
  let [totals, setTotals] = useState(null)
  let [dateTotals, setDateTotals] = useState(null)
  let [isLoading, setIsLoading] = useState(true)

  const initializeData = async () => {
    const responseDateData = JSON.parse(await getLocalData('coronaDateData'))
    const responseDates = Object.keys(responseDateData)
    setDateData(responseDateData)
    setDates(responseDates)

    const todayDateFormatted = responseDates[responseDates.length - 1]
    const todayData = responseDateData[todayDateFormatted]
    setCoronaData(todayData)

    let totalsByDate = {
      active: [], 
      confirmed: [], 
      recovered: [], 
      deaths: [], 
    }
    for (let i = 0; i < responseDates.length; i++) {
      const data = responseDateData[responseDates[i]]
      const tempTotals = getTotals(data)
      const formattedDate = getFormattedDate(responseDates[i])
      totalsByDate.confirmed.push({x: formattedDate, y: tempTotals.confirmed})
      totalsByDate.recovered.push({x: formattedDate, y: tempTotals.recovered})
      totalsByDate.deaths.push({x: formattedDate, y: tempTotals.deaths})
      const active = tempTotals.confirmed - tempTotals.recovered - tempTotals.deaths 
      totalsByDate.active.push({x: formattedDate, y: active})
    }
    setDateTotals(totalsByDate)
    const initTotals = getTotals(todayData)
    setTotals(initTotals)
    setIsLoading(false)
  } 

  useEffect(() => {
    initializeData()
  }, [])

  return (
    isLoading 
    ? 
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <Text style={{marginBottom: 20, fontSize: 20}}>Loading Data...</Text>
      <ActivityIndicator size='large' color='#000' />
    </View>
    :
    <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.totalsContainer}>
        <Text style={styles.chartTitle}></Text>
        {
          totals !== null &&
          ([
              <TotalCountView count={totals.confirmed - totals.recovered - totals.deaths} type="Active" color="red" key={shortid.generate()}/>,
              <TotalCountView count={totals.recovered} type="Recovered" color="#3a3" key={shortid.generate()}/>,
              <TotalCountView count={totals.deaths} type="Deaths" color="black" key={shortid.generate()}/>,
              <TotalCountView count={totals.confirmed} type="Total Confirmed" color="blue" key={shortid.generate()}/>,
          ])
        }
      </View>
      {
        dateTotals && 
        <View style={styles.victoryContainer}>
          <VictoryChart width={375} style={{alignSelf: 'center', marginTop: 0}} domainPadding={{x: 25}}>
            <VictoryAxis dependentAxis tickFormat={(tick) => `${tick/1000}k`}/>
            <VictoryAxis scale={{x: "time"}} />
            <VictoryLine
              style={{
                data: { stroke: "blue", strokeWidth: 5 },
                parent: { border: "3px solid #ccc"}
              }}
              animate={{
                duration: 3000,
                onLoad: { duration: 2000 }
              }}
              data={dateTotals.confirmed}
            />
            <VictoryLine
              style={{
                data: { stroke: "#3a3", strokeWidth: 5 },
                parent: { border: "3px solid #ccc"}
              }}
              animate={{
                duration: 4000,
                onLoad: { duration: 3000 }
              }}
              data={dateTotals.recovered}
            />
            <VictoryLine
              style={{
                data: { stroke: "black", strokeWidth: 5 },
                parent: { border: "3px solid #ccc"}
              }}
              animate={{
                duration: 5000,
                onLoad: { duration: 4000 }
              }}
              data={dateTotals.deaths}
            />
            <VictoryLine
              style={{
                data: { stroke: "red", strokeWidth: 5 },
                parent: { border: "3px solid #ccc"}
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
              data={dateTotals.active}
            />
          </VictoryChart>
          <View style={styles.chartLegend}>
            <Text style={[styles.legendText, {backgroundColor: 'red'}]}>Active</Text>
            <Text style={[styles.legendText, {backgroundColor: '#3a3'}]}>Recovered</Text>
            <Text style={[styles.legendText, {backgroundColor: 'black'}]}>Deaths</Text>
            <Text style={[styles.legendText, {backgroundColor: 'blue'}]}>Confirmed</Text>
          </View>
        </View>
      }
    </View>
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

function getTotals(data) {
  let confirmed = 0, deaths = 0, recovered = 0
  for (let i = 0; i < data.length; i++) {
    confirmed += Number(data[i].Confirmed)
    deaths += Number(data[i].Deaths)
    recovered += Number(data[i].Recovered)
  }
  return {confirmed, deaths, recovered}
}

function getSelectedTotals(data, allTotals) {
  if (allTotals === true) {
    return getTotals(data)
  } else {
    let confirmed = 0, deaths = 0, recovered = 0
    confirmed += Number(data.Confirmed)
    deaths += Number(data.Deaths)
    recovered += Number(data.Recovered)
    return {confirmed, deaths, recovered}
  }
}

function getFormattedDate(string) {
  const parts = string.split('-')
  return new Date(parts[2], parts[0] - 1, parts[1])
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    alignItems: 'center', 
  }, 
  totalsContainer: {
    
  }, 
  chartTitle: {
    fontSize: 20, 
    marginTop: 20, 
    marginBottom: 0, 
    fontWeight: 'bold', 
  }, 
  victoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chartLegend: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
  }, 
  legendText: {
    color: '#fff', 
    padding: 5,
    margin: 10, 
  }, 
});
