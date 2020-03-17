import * as React from 'react';
import { useState, useEffect } from 'react'
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity, View,
  Dimensions, Button
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import csv from 'csvtojson'
import { AsyncStorage } from 'react-native';
import shortid from 'shortid'
import { MonoText } from '../components/StyledText';
import { CustomMarker } from '../components/CustomMarker'
import { MapTypeButton } from '../components/MapTypeButton'

export default function HomeScreen() {
  let [initialRegion, setInitialRegion] = useState(null)
  let [userLocation, setUserLocation] = useState(null)
  let [dailyData, setDailyData] = useState(null)
  let [mapType, setMapType] = useState('activeCases')

  const getUserLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.9022,
      longitudeDelta: 0.1,
    }

    setInitialRegion(region)
    return location
  }

  const getUserState = async (location) => {
    const response = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    const address = response['0']
    setUserLocation(address)
  }

  useEffect(() => {
    getUserLocation().then((location) => {
      getUserState(location)
    })

    var today = new Date().toDateString()
    const lastDate = getLocalData('date')
    // get new data if new day
    if (today !== lastDate) {
      getCoronaData().then((csvData) => {
        const data = convertCSVtoJson(csvData)
        setLocalData('daily', JSON.stringify(data))
        setLocalData('date', today)
        setDailyData(data)
      }).catch(e => {
        console.log(e)
      })
    } else {
      getLocalData('daily').then((data) => {
        setDailyData(data)
      }).catch(e => {
        console.log(e)
      })
    }
  }, [])
  return (
    <View style={styles.container}>
      {
        initialRegion != null &&
        <View>
          <MapTypeButton setMapType={setMapType} ></MapTypeButton>
          <MapView style={styles.mapStyle}
            initialRegion={initialRegion}
            // provider="google"
            showsUserLocation={true}
            zoomEnabled={true}
            minZoomLevel={0}
            maxZoomLevel={20}
            scrollEnabled={true}
            rotateEnabled={true}
            loadingEnabled={true}
          >
            {dailyData !== null && dailyData.map((point, i) => {
              let name
              if (point['Province/State'] === '') {
                name = point['Country/Region']
              } else {
                name = point['Province/State']
              }
              const latlng = { latitude: Number(point.Latitude), longitude: Number(point.Longitude) }
              return (
                <CustomMarker
                  key={shortid.generate()}
                  coordinate={latlng}
                  title={name}
                  description={point['Confirmed']}
                  radius={Math.cbrt(point.Confirmed) * 3}
                  mapType={mapType}
                ></CustomMarker>
              )
            })}
          </MapView>
          {
            userLocation !== null &&
            <View>
              <Text>state: {userLocation.region}</Text>
              <Text>country: {userLocation.country}</Text>
            </View>
          }
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

async function getCoronaData() {
  const response = await fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-16-2020.csv', {
    method: 'GET'
  })
  return response.text()
}

function convertCSVtoJson(csvData) {
  let data = []
  csv().fromString(csvData).subscribe((json) => {
    data.push(json)
  })
  return data
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
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
