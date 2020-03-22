import * as React from 'react';
import { useState, useEffect } from 'react'
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity, View,
  Dimensions, Button, Picker, AsyncStorage, ActivityIndicator
} from 'react-native';
import { Slider } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
var maps = require('react-native-maps')
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import csv from 'csvtojson'
import shortid from 'shortid'

import { MonoText } from '../components/StyledText';
import { CustomMarker } from '../components/CustomMarker'
import { MapTypeButton } from '../components/MapTypeButton'
import { UserLocationView } from '../components/UserLocationView'
import states from '../constants/states.json'

export default function HomeScreen() {
  let [initialRegion, setInitialRegion] = useState(null)
  let [userData, setUserData] = useState(null)
  let [coronaData, setCoronaData] = useState(null)
  let [dateData, setDateData] = useState(null)
  let [dates, setDates] = useState(null)
  let [sliderValue, setSliderValue] = useState(0)
  let [mapType, setMapType] = useState('activeCases')
  let [geoCoords, setGeoCoords] = useState(null)
  let [isLoading, setIsLoading] = useState(true)

  const getUserLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.9022,
      longitudeDelta: 0.1,
    }
    return {location, region}
  }

  const getUserAddress = async (location) => {
    const response = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    return response[0]
  }

  const handleSliderValueChange = (e) => {
    setSliderValue(e)
    const index = dates[e]
    setCoronaData(dateData[index])
  }

  const initializeData = async () => {
    const location = await getUserLocation()
    const region = {
      latitude: location.region.latitude, 
      longitude: location.region.longitude, 
      latitudeDelta: 10, 
      longitudeDelta: 10, 
    }
    setInitialRegion(region)
    const address = await getUserAddress(location.location)

    var today = getDateString(new Date())
    // const lastDate = await getLocalData('date')

    // get new data if new day (or if first app load)
    // if (today !== lastDate) {
      const dateData = await getAllDatesData()
      const data = await getCoronaData(new Date())
      const totals = getTotals(data)
      const userData = getUserData(data, address)
      setLocalData('coronaDateData', JSON.stringify(dateData))
      setLocalData('coronaData', JSON.stringify(data))
      setLocalData('userData', JSON.stringify(userData))
      setLocalData('totals', JSON.stringify(totals))
      setDateData(dateData)
      const dates = Object.keys(dateData)
      setDates(dates)
      setSliderValue(dates.length - 1)
      setGeoCoords(getGeoCoords(data))
      setCoronaData(data)
      setUserData(userData)
      setIsLoading(false)
    // } else {
    //   const data = JSON.parse(await getLocalData('coronaData'))
    //   const userData = JSON.parse(await getLocalData('userData'))
    //   const dateData = JSON.parse(await getLocalData('coronaDateData'))
    //   const dates = Object.keys(dateData)
    //   setDates(dates)
    //   setDateData(dateData)  
    //   setSliderValue(dates.length - 1)    
    //   setGeoCoords(getGeoCoords(data))
    //   setCoronaData(data)
    //   setUserData(userData)
    // }
  }

  useEffect(() => {
    initializeData()
  }, [])

  return (
    isLoading 
    ? 
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <Text style={{marginBottom: 20, fontSize: 20}}>Loading Map...</Text>
      <ActivityIndicator size='large' color='#000' />
    </View>
    :
    <View style={styles.container}>
      {
        initialRegion !== null &&
        <View>
          <MapTypeButton mapType={mapType} setMapType={setMapType}></MapTypeButton>
          {
            userData !== null && 
            <UserLocationView userData={userData} mapType={mapType} />
          }
          {
            dateData && dates && 
            <View style={{alignSelf: 'center', alignItems: 'center'}}>
              <Text>Timeline: {dates[sliderValue].slice(1)}</Text>
              <Slider
                style={{width: 300, height: 40}}
                minimumValue={0}
                maximumValue={dates.length - 1}
                step={1}
                minimumTrackTintColor="#4af"
                maximumTrackTintColor="#ccc"
                value={sliderValue}
                onValueChange={handleSliderValueChange}
              />
            </View>
          }
          <MapView style={styles.mapStyle}
            initialRegion={initialRegion}
            showsUserLocation={true}
            zoomEnabled={true}
            minZoomLevel={0}
            maxZoomLevel={20}
            scrollEnabled={true}
            rotateEnabled={true}
            loadingEnabled={true}
          >
            {coronaData !== null && geoCoords && coronaData.map((point) => {
              let name
              if (point['Province/State'] === '') {
                name = point['Country/Region']
              } else {
                name = point['Province/State']
              }
              // don't display if past name in dataset is different than current name
              // i.e. "United States Virgin Islands" vs "Virgin Islands, U.S."
              // FIXME: this solution won't display Countries/Regions with different previous names
              // and if there is no Latitude/Longitude given
              const todayCoordsExist = geoCoords[name] !== undefined
              const pointCoordsExist = point.Latitude !== undefined
              if (todayCoordsExist || pointCoordsExist) {
                let latlng
                if (pointCoordsExist) {
                  latlng = { latitude: Number(point.Latitude), longitude: Number(point.Longitude) }
                } else if (todayCoordsExist) {
                  latlng = { latitude: geoCoords[name].latitude, longitude: geoCoords[name].longitude}
                }  
                let numCases = 1
                if (mapType === 'confirmedCases') {
                  numCases = point['Confirmed']
                } else if (mapType === 'activeCases') {
                  numCases = point['Confirmed'] - point['Deaths'] - point['Recovered']
                } else if (mapType === 'recovered') {
                  numCases = point['Recovered']
                } else {
                  numCases = 0
                }
                if (numCases > 0) {
                  return (
                    <CustomMarker
                      key={shortid.generate()}
                      coordinate={latlng}
                      title={name}
                      description={String(numCases)}
                      radius={Math.cbrt(numCases) * 3}
                      mapType={mapType}
                    ></CustomMarker>
                  )
                } else {
                  return null
                }
              }
            })}
          </MapView>
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

async function setLocalData(name, data) {
  try {
    await AsyncStorage.setItem(name, data)
  } catch (error) {
    console.log('Error storing ' + name + ' data: ', error)
  }
}

async function getCoronaData(currentDate) {
  var csvData
  const currentDateFormatted = getDateString(currentDate)
  const response = await fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/' + currentDateFormatted + '.csv', {
    method: 'GET'
  })
  if (response.status === 404) {
    let date = new Date()
    date.setDate(currentDate.getDate() - 1)
    const yesterday = getDateString(date)
    const responseYesterday = await fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/' + yesterday + '.csv', {
      method: 'GET'
    })
    csvData = await responseYesterday.text()
  } else {
    csvData = await response.text()
  }
  return await convertCSVtoJson(csvData)
}

async function convertCSVtoJson(csvData) {
  var data = []
  await csv().fromString(csvData).subscribe((json) => {
    data.push(json)
  })
  return data
}

function getTotals(data) {
  let confirmed = 0, deaths = 0, recovered = 0
  for(let i = 0; i < data.length; i++) {
    confirmed += Number(data[i].Confirmed)
    deaths += Number(data[i].Deaths)
    recovered += Number(data[i].Recovered)
  }
  return {confirmed, deaths, recovered}
}

// FIXME: only gets location data for US
function getUserStateCases(data, countryCode, state) {
  if (countryCode === 'US') {
    for (let i = 0; i < data.length; i++) {
      if (states[state] === data[i]['Province/State']) {
        const confirmed = Number(data[i].Confirmed)
        const recovered = Number(data[i].Recovered)
        const deaths = Number(data[i].Deaths)
        return {confirmed, recovered, deaths}
      }
    }
  }
  return null
}

// FIXME: current Hopkins data doesn't provide all countries (like US)
// only aggregates data for US, not china or other countries reporting many counts
function getUserCountryCases(data, country) {
  if (country === 'US') {
    let confirmed = 0, recovered = 0, deaths = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i]['Country/Region'] === 'US') {
        confirmed += Number(data[i].Confirmed)
        recovered += Number(data[i].Recovered)
        deaths += Number(data[i].Deaths)
      }
    }
    return {confirmed, recovered, deaths}
  } else {
    // countries without multiple states
    for (let i = 0; i < data.length; i++) {
      if (country === data[i]['Country/Region'] && data[i]['Province/State'] === '') {
          const confirmed = Number(data[i].Confirmed)
          const recovered = Number(data[i].Recovered)
          const deaths = Number(data[i].Deaths)
          return {confirmed, recovered, deaths}
      }
    }
  }
  return null
}

async function getAllDatesData() {
  var today = getDateString(new Date())
  let dateData = JSON.parse(await getLocalData('coronaDateData'))
  let date
  // if first time loading app, get all date data
  if (dateData === null || dateData === undefined) {
    dateData = {}
    // day before first day of COVID-19 tracking
    date = new Date(2020, 0, 21)
  } else {
    const dates = Object.keys(dateData)
    const lastLoadedDate = dates[dates.length - 1]
    date = getFormattedDate(lastLoadedDate)
  }

  let formattedDate = getDateString(date)
  let i = 0
  while (formattedDate !== today && i < 1000) {
    i += 1
    date = new Date(date.setDate(date.getDate() + 1))
    formattedDate = getDateString(date)
    const data = await getCoronaData(date)
    dateData[formattedDate] = data
  }
  return dateData
}

function getUserData(data, address) {
  const userStateCases = getUserStateCases(data, address.isoCountryCode, address.region)
  const userCountryCases = getUserCountryCases(data, address.isoCountryCode)
  const region = states[address.region]
  const countryCode = address.isoCountryCode
  return {
    region: region, 
    country: countryCode, 
    regionCases: userStateCases, 
    countryCases: userCountryCases
  }
}

// associate lat and long with name of country
function getGeoCoords(data) {
  let coordMapping = {}
  for (let i = 0; i < data.length; i++) {
    let name
    const point = data[i]
    if (point['Province/State'] === '') {
      name = point['Country/Region']
    } else {
      name = point['Province/State']
    }
    coordMapping[name] = {latitude: Number(point.Latitude), longitude: Number(point.Longitude)}
  }
  return coordMapping
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = (date.getDate()).toString().padStart(2, '0');
  return month + '-' + day + '-' + year
}

function getFormattedDate(string) {
  const parts = string.split('-')
  return new Date(parts[2], parts[0] - 1, parts[1])
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    height: '90%'
  },

});
