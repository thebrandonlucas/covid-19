import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
export function MapTypeButton(props) {
    // const context = React.useContext(AppContext)
    console.log(props.mapType)
    return (
        <View style={styles.container}>
            <TouchableOpacity title="Confirmed" style={styles.mapTypeButton} onPress={() => { props.setMapType('confirmedCases') }}>
                <Text style={styles.textStyleConfirmed}>Confirmed</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Active" style={styles.mapTypeButton} onPress={() => { props.setMapType('activeCases') }}>
                <Text style={styles.textStyleActive}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Recovered" style={styles.mapTypeButton} onPress={() => { props.setMapType('recovered') }}>
                <Text style={styles.textStyleRecovered}>Recovered</Text>
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
        color: 'red',
    },
    mapTypeButton: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: "solid",
        textAlign: "center",
    },
    textStyleConfirmed: {
        color: 'red',
        textAlign: "center",
    },
    textStyleActive: {
        color: 'blue',
        textAlign: "center"
    },
    textStyleRecovered: {
        color: 'green',
        textAlign: "center"
    }
})
