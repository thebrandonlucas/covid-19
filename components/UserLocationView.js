import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const red = 'red'
const green = '#3a3'
const blue = 'blue'

export function UserLocationView(props) {
	let stateCases, countryCases
	let type
	let color

	// in case no user data
	try {
		if (props.mapType === 'confirmedCases') {
			stateCases = props.userData.regionCases.confirmed
			countryCases = props.userData.countryCases.confirmed
			type = 'Total'
			color = blue
		} if (props.mapType === 'activeCases') {
			stateCases = props.userData.regionCases.confirmed - props.userData.regionCases.recovered - props.userData.regionCases.deaths
			countryCases = props.userData.countryCases.confirmed - props.userData.countryCases.recovered - props.userData.countryCases.deaths
			type = 'Active'
			color = red
		} if (props.mapType === 'recovered') {
			stateCases = props.userData.regionCases.recovered
			countryCases = props.userData.countryCases.recovered
			type = 'Recovered'
			color = green
		}
	} catch(e) {
		console.warn(e)
	}

	return (
		// FIXME: get numbers for US Recovered, currently 0
		props.mapType !== 'recovered' &&
		<View style={styles.container}>
			<Text>{type} cases in&nbsp;
				{props.userData.region}: <Text style={{color}}>{stateCases}</Text>,&nbsp;
				{props.userData.country}: <Text style={{color}}>{countryCases}</Text>
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center'
	}
});
