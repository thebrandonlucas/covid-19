import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
function activeBackground(mapType) {
    if (mapType === 'activeCases') {
        return '#EEE'
    }
}
function recoveredBackground(mapType) {
    if (mapType === 'recovered') {
        return '#EEE'
    }
}
function totalBackground(mapType) {
    if (mapType === 'confirmedCases') {
        return '#EEE'
    }
}

export function MapTypeButton(props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity title="Active" style={[styles.mapTypeButton, { backgroundColor: activeBackground(props.mapType) }]} onPress={() => { props.setMapType('activeCases') }}>
                <Text style={[styles.textStyle, { color: 'red' }]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Recovered" style={[styles.mapTypeButton, { backgroundColor: recoveredBackground(props.mapType) }]} onPress={() => { props.setMapType('recovered') }}>
                <Text style={[styles.textStyle, { color: '#3a3' }]} color="orange">Recovered</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Total" style={[styles.mapTypeButton, { backgroundColor: totalBackground(props.mapType) }]} onPress={() => { props.setMapType('confirmedCases') }}>
                <Text style={[styles.textStyle, { color: 'blue' }]}>Total</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
        marginBottom: 15,
        height: 75,
        paddingTop: 5,
        paddingBottom: 5
    },
    mapTypeButton: {
        flex: 1,
        textAlign: "center",
        borderRadius: 3,
        paddingTop: 7,
        height: 40,
    },
    textStyle: {
        color: 'red',
        textAlign: "center",
        fontSize: 20,
    },
})
