import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export function TotalCountView(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.typeText}>{props.type}</Text>
      <Text style={[styles.countText, {color: props.color}]}>{props.count}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', 
    justifyContent: 'center', 
    alignContent: 'center', 
    alignSelf: 'center', 
    backgroundColor: '#fafafa',
    width: '90%', 
    margin: 5, 
  },
  typeText: {
    fontSize: 20
  }, 
  countText: {
    fontSize: 20, 
  },
  
});