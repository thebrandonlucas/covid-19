import * as React from 'react';
import { View, Text } from 'react-native'

export function TotalCountView(props) {
  return (
    <View>
      <Text>{props.count}</Text>
    </View>
  )
}