import React from 'react';
import {Text, TextInput, View, Alert, FlatList, Picker, ScrollView} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Mybutton from './Mybutton';
import Mytextinput from './Mytextinput';
import Mytext from './Mytext';
import Myitem from './Myitem';

var db = openDatabase({ name: 'UserDatabase.db' });

export default class AppSetup extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        s_type:'',
        s_typenum:0,
        s_text:'',
        setupdata:[],
        txtType:React.createRef(),
        txtText:React.createRef(),
      };            

      this.loadSettings = this.loadSettings.bind(this);
      this.loadSettings();
    }

    loadSettings(){
      db.transaction(txn=>{
        txn.executeSql("SELECT s_id, s_type, s_text, (select count(*) from tb_Settings b  where a.s_id >= b.s_id) as cnt FROM tb_Settings a ORDER BY s_num", [],
          (txn, res)=>{
            var temp = [];
            for(let i=0; i<res.rows.length; i++){
              if(res.rows.item(i).s_text) {
                temp.push(res.rows.item(i));
              }
            }          
            this.setState({setupdata:temp});          
          }
        );
      }); 
    }

      static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: <Text style={{marginLeft:20,fontSize:18,fontWeight:'bold'}}>Settings</Text>,
        };
      };

      save_settings = () => {
        var that = this;
        const {s_type } = this.state;
        const {s_typenum } = this.state;
        const {s_text } = this.state;
        if(s_type && s_type.trim() != ""){
          if(s_text && s_text.trim() != ""){          
            db.transaction( tx=> {
              tx.executeSql(
                'INSERT INTO tb_Settings (s_type, s_num, s_text) VALUES (?,?,?)',
                [s_type.trim(), s_typenum, s_text.trim()],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    this.setState({s_type:''});
                    this.setState({s_typenum:0});
                    this.setState({s_text:''});
                    this.loadSettings();
                    Alert.alert(
                      'Success',
                      'Setting saved successfully',
                      [
                        {
                          text: 'OK',
                        },
                      ],
                      { cancelable: false }
                    );
                  } else {
                    alert('Save failed');
                  }
                }
              );
            });
          }else{
            alert('Please enter text.');
          }
          }else{
            alert('Please select Field.');
          }
      };

      delete_setting = (item) => {
        if(item.s_id && item.s_id > 0){          
          db.transaction( tx=> {
            tx.executeSql(
              'DELETE FROM tb_Settings WHERE s_id=?',
              [item.s_id],
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
        return this.state.setupdata;
      }

      fetch_info =()=>{
        return new Promise((resolve,reject)=>{
          db.transaction(txn => {   
            txn.executeSql("SELECT s_id, s_type, s_text, (select count(*) from tb_Settings b  where a.s_id >= b.s_id) as cnt FROM tb_Settings a ORDER BY s_num", [],
              (txn, res)=>{
                var temp = [];
                for(let i=0; i<res.rows.length; i++){              
                  if(res.rows.item(i).s_text) {
                    temp.push(res.rows.item(i));
                  }
                }
                this.setState({setupdata:temp});          
                resolve(temp);          
              });
          },null,null);
        });
      }
  
    render() {
      return (
        <View style={{ backgroundColor: 'white', flex: 1}}>
        
            <View style={{flex: 0, flexDirection: 'row', 
                  borderColor: '#007FFF', borderWidth:1,
                  marginLeft:35, marginRight:35, marginTop:10}}
                  >
              <Mytextinput
                InputRef={this.state.txtType}
                placeholder="Field"
                maxLength={10}
                value ={this.state.s_type}
                style={{flex:1, height:38, marginLeft:0, marginRight:20,marginTop:0, borderWidth:0, color:'black'}}
                editable={false}
              />
              <Picker
                selectedValue={this.state.s_type}
                style={{ height: 38, width:20, borderColor: '#007FFF', borderWidth:1}}
                onValueChange={(itemValue, itemIndex) => { this.setState({s_type: itemValue}); this.setState({s_typenum: itemIndex});}}>
                <Picker.Item label="" value="" />
                <Picker.Item label="ECG" value="ECG" />
                <Picker.Item label="Remarks" value="REM" />
              </Picker>
            </View>
            <Mytextinput
              InputRef={this.state.txtText}
              placeholder="Text"
              onChangeText={s_text => this.setState({ s_text })}
              multiline = {true}
              numberOfLines = {2}
              maxLength={400}
              style={{height:60}}
              value={this.state.s_text}
            />
          <Mybutton
            title="Submit"
            customClick={this.save_settings.bind(this)}
          />
          
          <FlatList style={{}}
            data={this.state.setupdata}         
            keyExtractor={(item, index) => index.toString()}   
            renderItem={({item}) => (
              <Myitem 
                text={item.cnt + " - " + item.s_type + " - " + item.s_text} 
                borderWidth={0} borderColor="#fff" backgroundColor="#cddFeF" Left={10} Right={10} 
                style={{marginLeft:4, alignSelf:'center'}}
                buttonStyle1={{marginTop: 4, marginLeft:5, marginRight:5, color:'#FF0000', fontSize:22, fontWeight:'bold'}}
                title1={'X'}
                customClick1 = {()=>{
                  Alert.alert(
                    'Delete setting',
                    'Do you want to delete this setting?',
                    [
                      {
                        text: 'Yes',
                        onPress: () => this.delete_setting(item),
                      },
                      {
                        text: 'No',
                      },
                    ],
                    { cancelable: false }
                  );                
                }}
                >
              </Myitem>
            )}
          />        
        </View>
      );
    }
  }
