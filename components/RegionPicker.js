import * as React from 'react';
import { useState } from 'react'
import { Picker } from 'react-native'

export function RegionPicker(props) {
  let [region, setRegion] = useState('java')

  return (
    <Picker
      selectedValue={region}
      style={{height: 50, width: '100%'}}
      onValueChange={(itemValue, itemIndex) =>
        setRegion(itemValue)
      }>
      <Picker.Item label="Java" value="java" />
      <Picker.Item label="JavaScript" value="js" />
    </Picker>
  )
}
