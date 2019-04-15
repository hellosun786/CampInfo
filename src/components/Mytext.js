/*Custom Text*/
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const Mytext = props => {
const textStyle = {...styles.text,...props.style}
return (
  <View
      style={{
        marginLeft: props.Left != undefined ? props.Left : 35,
        marginRight: props.Right != undefined ? props.Right : 35,
        marginTop: 10,
        borderColor: props.borderColor != undefined ? props.borderColor : '#007FFF',
        borderWidth: props.borderWidth != undefined ? props.borderWidth : 1,
        height:props.height != undefined ? props.height : 40,
        backgroundColor: props.backgroundColor != undefined ? props.backgroundColor : '#fff',
      }}>
    <Text style={textStyle}>{props.text}</Text>
  </View>
  );
};
 
const styles = StyleSheet.create({
  text: {
    color: '#000',
    marginTop: 10,
    marginLeft:4
  },
});
 
export default Mytext;