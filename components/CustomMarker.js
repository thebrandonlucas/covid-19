import * as React from 'react';
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

const green = '#3a3'
const red = 'red'
const blue = 'blue'

export function CustomMarker(props) {
	let getBackgroundColor = (mapType) => {
		if (mapType === 'confirmedCases') {
			return blue
		} else if (mapType === 'recovered') {
			return green
		} else if (mapType === 'activeCases') {
			return red
		}
	}
	return (
		<Marker {...props}>
			<View style={[styles.marker, { width: props.radius, height: props.radius }, { backgroundColor: getBackgroundColor(props.mapType) }]}>
			</View>
		</Marker >
	)
}

const styles = StyleSheet.create({
	marker: {
		borderRadius: 10000,
		padding: 5,
		opacity: 0.7
	}
});
