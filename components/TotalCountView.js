import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export function TotalCountView(props) {
  return (
    <View style={styles.container}>
      <Text>{props.type}</Text>
      <Text style={[styles.countText, {color: props.color}]}>{props.count}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', 
    justifyContent: 'center', 
    alignContent: 'center', 
    backgroundColor: '#fafafa',
    width: '90%', 
    borderRadius: 3, 
    borderWidth: 1, 
    margin: 10, 
  },
  typeText: {

  }, 
  countText: {

  },
  
});