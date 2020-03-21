import * as React from 'react';
import { useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import shortid from 'shortid'

const ITEM_HEIGHT = 10

export function CustomDatePicker(props) {
  let [date, setDate] = useState('All')

  return (
    <View style={styles.list}>
    <Picker
      selectedValue={region}
      style={{height: 50, width: '100%'}}
      onValueChange={(itemValue, itemIndex) => {
      }}>
      <Picker.Item label="All" value='all' />
     
        
    </Picker>

    {/*

    

    */}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    alignItems: 'center', 
  }, 
  regionContainer: {
    padding: 10, 
  }, 
  list: {
    height: '50%', 
    width: '90%', 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: 'black', 
    alignSelf: 'center', 
  }, 
});