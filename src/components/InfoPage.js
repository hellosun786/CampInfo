import React from 'react';
import {FlatList, Text, View, Alert } from 'react-native';
import Myitem from './Myitem';
import Mytextinput from './Mytextinput';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

import Mytext from './Mytext.js';

export default class InfoPage extends React.Component {
  constructor(props){
    super(props);
    
    const { navigation } = this.props;
    const campdata = navigation.getParam('campdata', {c_id:0, camp:'', c_place:'', c_date:'', p_id:0});
    this.state = {
      c_id:campdata.c_id,
      pdata:[],
      txtName:React.createRef(),
      p_name:'',
    };   
    
    this.get_info = this.get_info.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text style={{fontSize:18,fontWeight:'bold'}}>Patient list</Text>,      
    };
  };

  update_info = (item) => {
    this.props.navigation.navigate({routeName:'PatientInfo',params:{campdata:item}});
  };

  view_info = (item) => {
    this.props.navigation.navigate({routeName:'ViewInfo',params:{campdata:item}});
  };

  delete_info = (item) => {
    if(item.p_id && item.p_id > 0){          
      db.transaction( tx=> {
        tx.executeSql(
          'DELETE FROM tb_Patients WHERE p_c_id=? AND p_id=?',
          [this.state.c_id, item.p_id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              this.get_info();
            } else {
              alert('Delete failed.');
            }
          }
        );
      });
    }
  };

  get_info =()=>{
    var info = this.fetch_info();
    return this.state.pdata;
  }

  fetch_info =()=>{
    var cmd = '';
    if(this.state.p_name.trim() == ''){
      cmd = "SELECT * FROM tb_Patients WHERE p_c_id=?";
    }else{
      cmd = "SELECT * FROM tb_Patients WHERE p_c_id=? and p_name like '"+this.state.p_name+"%'";
    }
    return new Promise((resolve,reject)=>{
      db.transaction(txn => {   
        txn.executeSql(
          cmd,
          [this.state.c_id],
          (txn, res)=>{
            var temp = [];
            for(let i=0; i<res.rows.length; i++){              
              if(res.rows.item(i).reg_no) {
                temp.push(res.rows.item(i));
              }
            }
            this.setState({pdata:temp});          
            resolve(temp);          
          });
      },null,null);
    });
  }

    render() {
      return (
        <View>          
        <Mytextinput
          InputRef={this.state.txtName}
          placeholder="Search Patient"
          maxLength={50}
          onChangeText={p_name =>{ this.setState({p_name}); this.get_info();}}
          value={this.state.p_name}
          style={{marginLeft:10, marginRight:10}}
        />
        <FlatList
          data={this.get_info()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Myitem 
              text={item.reg_no + " - " + item.p_name} 
              borderWidth={0} borderColor="#fff" backgroundColor="#cddFeF" Left={10} Right={10} 
              style={{marginTop: 10, marginLeft:4}}
              buttonStyle1={{marginTop: 4, marginLeft:5, marginRight:5, color:'#FF0000', fontSize:22, fontWeight:'bold'}}
              title1={'X'}
              customClick1 = {()=>{
                Alert.alert(
                  'Delete patient info',
                  'Do you want to delete patient info?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => this.delete_info(item),
                    },
                    {
                      text: 'No',
                    },
                  ],
                  { cancelable: false }
                );                
              }}
              buttonStyle2={{marginTop: 2, marginRight:10, color:'#58ACFA', fontSize:24, fontWeight:'bold'}}
              title2={'...'}
              customClick2 = {()=>this.update_info({c_id:this.state.c_id, camp:'', c_place:'', c_date:'', p_id:item.p_id})}
              customClick0 = {()=>this.view_info({c_id:this.state.c_id, camp:'', c_place:'', c_date:'', p_id:item.reg_no})}
              >
            </Myitem>
          )}
        />
      </View>
      );
    }
  }