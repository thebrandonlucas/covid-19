import * as React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import shortid from 'shortid'
import { VictoryBar, VictoryChart, VictoryLine, VictoryTheme, VictoryZoomContainer } from "victory-native";

import { TotalCountView } from '../components/TotalCountView'
import { RegionPicker } from '../components/RegionPicker'
import { CustomDatePicker } from '../components/CustomDatePicker'

export default function Dashboard() {
  let [dateData, setDateData] = useState(null)
  let [dates, setDates] = useState(null)
  let [coronaData, setCoronaData] = useState(null)
  let [totals, setTotals] = useState(null)
  let [dateTotals, setDateTotals] = useState(null)

  let [zoomDomain, setZoomDomain] = useState({ x: [new Date(2020, 0, 22), new Date()] })

  // let [selectedDateData, setSelectedDateData] = useState(null)
  // let [selectedRegionData, setSelectedRegionData] = useState(null)

  const initializeData = async () => {
    const responseDateData = JSON.parse(await getLocalData('coronaDateData'))
    const responseDates = Object.keys(responseDateData)
    // const responseTotals = JSON.parse(await getLocalData('totals'))
    setDateData(responseDateData)
    setDates(responseDates)

    const todayDateFormatted = responseDates[responseDates.length - 1]
    const todayData = responseDateData[todayDateFormatted]
    setCoronaData(todayData)
    // setSelectedRegionData(todayData)
    // setSelectedDateData(todayData)

   

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

//     Alert.alert(
//   'Alert Title',
//   JSON.stringify(totalsByDate),
//   [
//     {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
//     {
//       text: 'Cancel',
//       onPress: () => console.log('Cancel Pressed'),
//       style: 'cancel',
//     },
//     {text: 'OK', onPress: () => console.log('OK Pressed')},
//   ],
//   {cancelable: false},
// );

    const initTotals = getTotals(todayData)
    setTotals(initTotals)
  } 

  const handleZoom = (domain) => {
    setZoomDomain(domain)
  }

  useEffect(() => {
    initializeData()
  }, [])

  return (
    <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      {
        totals !== null &&
        ([
          <TotalCountView count={totals.confirmed - totals.recovered - totals.deaths} type="Active" color="red" key={shortid.generate()}/>,
          <TotalCountView count={totals.recovered} type="Recovered" color="#3a3" key={shortid.generate()}/>,
          <TotalCountView count={totals.deaths} type="Deaths" color="black" key={shortid.generate()}/>,
          <TotalCountView count={totals.confirmed} type="Total Confirmed" color="blue" key={shortid.generate()}/>,
        ])
      }
      {
        // (coronaData && selectedRegionData) && 
        // <RegionPicker totalData={coronaData} regions={selectedRegionData} setSelectedRegionData={setSelectedRegionData} />
      }
      {/*<DatePicker dates={dates} setDates={setDates} />*/}
      {
        dateTotals && 
        <View style={{alignSelf: 'center'}}>
          <VictoryChart width={375} style={{alignSelf: 'center'}}>
            <VictoryLine
              style={{
                data: { stroke: "blue" },
                parent: { border: "1px solid #ccc"}
              }}
              data={dateTotals.confirmed}
            />
            <VictoryLine
              style={{
                data: { stroke: "#3a3" },
                parent: { border: "1px solid #ccc"}
              }}
              data={dateTotals.recovered}
            />
            <VictoryLine
              style={{
                data: { stroke: "black" },
                parent: { border: "1px solid #ccc"}
              }}
              data={dateTotals.deaths}
            />
            <VictoryLine
              style={{
                data: { stroke: "red" },
                parent: { border: "1px solid #ccc"}
              }}
              data={dateTotals.active}
            />
          </VictoryChart>
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
});
