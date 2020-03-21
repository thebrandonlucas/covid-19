import * as React from 'react';
import { useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import shortid from 'shortid'

const ITEM_HEIGHT = 10

export function RegionPicker(props) {
  let [region, setRegion] = useState('All')

  const onRegionPress = (e) => {
    props.setSelectedRegionData(e)
    // console.log(e)
  }

  const renderItem = ({ item }) => {
    let name
    if (item['Province/State'] === '') {
      name = item['Country/Region']
    } else {
      name = item['Province/State']
    }
    return (
      <TouchableOpacity style={styles.regionContainer} onPress={() => onRegionPress(item)}>
        <Text>{name}</Text>
      </TouchableOpacity>
    )
  }

  const ItemSeparatorComponent = () => 
  (
    <View
      style={{
        height: 1,  
        width: "90%",  
        backgroundColor: "#aaa",  
      }}
    />
  )

  const keyExtractor = () => {
    return shortid.generate()
  }

  // optimization
  const getItemLayout = (data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  );

  return (
    <View style={styles.list}>

    {/*
<Picker
      selectedValue={region}
      style={{height: 50, width: '100%'}}
      onValueChange={(itemValue, itemIndex) => {
        setRegion(itemValue.name)
        props.setSelectedRegionData(itemValue.point)
      }}>
      <Picker.Item label="All" value='all' />
      {props.totalData.map((point, i) => {
        let name
        if (point['Province/State'] === '') {
          name = point['Country/Region']
        } else {
          name = point['Province/State']
        }
        // const value = {point: point, name: name}
        return (
          <Picker.Item label={name} value={name} key={shortid.generate()}/>
        )
      })}
    </Picker>
    

    */}
      <FlatList
        data={props.totalData}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        initialNumToRender={1000}
        maxToRenderPerBatch={20}
        windowSize={20}
      />
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