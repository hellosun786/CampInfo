/*Custom Text*/
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
const Myitem = props => {
return (
  <View
      style={{
        marginLeft: props.Left != undefined ? props.Left : 35,
        marginRight: props.Right != undefined ? props.Right : 35,
        marginTop: props.marginTop != undefined ? props.marginTop : 10,
        borderColor: props.borderColor != undefined ? props.borderColor : '#007FFF',
        borderWidth: props.borderWidth != undefined ? props.borderWidth : 1,
        height:40,
        backgroundColor: props.backgroundColor != undefined ? props.backgroundColor : '#fff',
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
      }}>
    <View style={{flex: 1, flexDirection: 'row'}}>
      <TouchableOpacity onPress={props.customClick1}>
        <Text style={props.buttonStyle1}>{props.title1}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.customClick0}>
        <Text style={props.style}>{props.text}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={props.customClick2}>
      <Text style={props.buttonStyle2}>{props.title2}</Text>
    </TouchableOpacity>
  </View>
  );
};
 
export default Myitem;