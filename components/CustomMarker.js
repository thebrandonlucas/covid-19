import * as React from 'react';
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

const green = 'rgba(0, 255, 0, 0.7)'
const red = 'rgba(255, 0, 0, 0.7)'
const blue = 'rgba(0, 0, 255, 0.7)'

export function CustomMarker(props) {
	let getBackgroundColor = (mapType) => {
		if (mapType === 'confirmedCases') {
			return red
		} else if (mapType === 'recovered') {
			return green
		} else if (mapType === 'activeCases') {
			return blue
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
	}
});
