/*Custom Button*/
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
const Mybutton = props => {
  return (
    <TouchableOpacity onPress={props.customClick}
      style={{
        alignItems: 'center',
        backgroundColor: props.backgroundColor != undefined ? props.backgroundColor : '#f05555',
        color: '#ffffff',
        padding: 10,
        marginTop: props.marginTop != undefined ? props.marginTop : 15,
        marginLeft: 35,
        marginRight: 35,
        marginBottom:props.marginBottom != undefined ? props.marginBottom : 10
      }}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
 
const styles = StyleSheet.create({
  text: {
    color: '#ffffff',
  },
});
export default Mybutton;