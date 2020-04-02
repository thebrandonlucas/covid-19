import * as React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import MapView, { Marker, Circle } from 'react-native-maps';
import { CustomMarker } from '../components/CustomMarker'
import shortid from 'shortid'

export const MapViewComponent = React.memo(function MapViewComponent(props) {
    // get names of keys for geo coordinates
    // TODO: refactor for simplicity
    const getNameKey = (point, keyType) => {
        let name = ''
        let keyRegion, keyCountry
        try {
            if (props.keyType === 'old') {
                keyRegion = props.dataKeys['old']['region']
                keyCountry = props.dataKeys['old']['country']
                if (point[keyRegion] === '') {
                    name = point[keyCountry]
                } else {
                    name = point[keyRegion].concat(', ').concat(point[keyCountry])
                }
            } else if (props.keyType === 'new') {
                keyRegion = props.dataKeys['new']['region']
                keyCountry = props.dataKeys['new']['country']
                if (point['Admin2'] === '') {
                    if (point[keyRegion] === '') {
                        name = point[keyCountry]
                    } else {
                        name = point[keyRegion].concat(', ').concat(point[keyCountry])
                    }
                } else {
                    name = point['Admin2'].concat(', ').concat(point[keyRegion]).concat(', ').concat(point[keyCountry])
                }
            }
        } catch (e) {
            console.log(point, e)
        }
        return name
    }

    return (
        <MapView style={styles.mapStyle}
            initialRegion={props.initialRegion}
            showsUserLocation={true}
            zoomEnabled={true}
            minZoomLevel={0}
            maxZoomLevel={20}
            scrollEnabled={true}
            rotateEnabled={true}
            loadingEnabled={true}
        >
            {props.coronaData !== null && props.geoCoords && props.coronaData.map((point) => {
                let name = getNameKey(point, props.keyType)
                // const nameKey = getNameKey(point, keyType, keyCountry, keyRegion)
                // don't display if past name in dataset is different than current name
                // i.e. "United States Virgin Islands" vs "Virgin Islands, U.S."
                // FIXME: this solution won't display Countries/Regions with different previous names
                // and if there is no Latitude/Longitude given
                const keyLatitude = props.dataKeys[props.keyType].lat
                const keyLongitude = props.dataKeys[props.keyType].long
                
                const todayCoordsExist = props.geoCoords[name] !== undefined
                const pointCoordsExist = point[keyLatitude] !== undefined && point[keyLongitude] !== undefined                
                if (todayCoordsExist || pointCoordsExist) {
                    let latlng
                    if (pointCoordsExist) {
                    latlng = { latitude: Number(point[keyLatitude]), longitude: Number(point[keyLongitude]) }
                    } else if (todayCoordsExist) {
                    latlng = { latitude: props.geoCoords[name].latitude, longitude: props.geoCoords[name].longitude}
                    }
                    let numCases = 1
                    if (props.mapType === 'confirmedCases') {
                    numCases = point['Confirmed']
                    } else if (props.mapType === 'activeCases') {
                    numCases = point['Confirmed'] - point['Deaths'] - point['Recovered']
                    } else if (props.mapType === 'recovered') {
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
                            mapType={props.mapType}
                        ></CustomMarker>
                    )
                    } else {
                        return null
                    }
                }
            })}
        </MapView>
    )
})

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