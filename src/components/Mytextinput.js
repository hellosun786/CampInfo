/*Custom TextInput*/
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const Mytextinput = props => {
  const textStyle = {...styles.text,...props.style}
  return (
      <TextInput
        ref = {props.InputRef}
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor="#bbb"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        returnKeyType={"next"}
        autoCapitalize={props.autoCapitalize != undefined ? props.autoCapitalize : "sentences"}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        blurOnSubmit={false}
        value={props.value}
        maxLength = {props.maxLength}
        style={textStyle}
        editable={props.editable}
      />
  );
};

const styles = StyleSheet.create({
  text: {
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    borderColor: '#007FFF',
    borderWidth: 1,
    height:40,
  },
});

export default Mytextinput;