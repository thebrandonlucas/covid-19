import * as React from 'react';
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

export function CustomMarker(props) {
	return (
		<Marker {...props}>
			<View style={[styles.marker, {borderRadius: props.radius}]}>
				
			</View>
		</Marker>
	)
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)', 
    borderRadius: 5, 
    padding: 5
  }
});