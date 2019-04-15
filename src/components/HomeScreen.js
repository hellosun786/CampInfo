import React from 'react';
import {Text, TextInput, View, Alert, TouchableOpacity, FlatList, Button} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Mybutton from './Mybutton';
import Mytextinput from './Mytextinput';
import Mytext from './Mytext';
import Myitem from './Myitem';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RNFetchBlob from 'rn-fetch-blob'

var db = openDatabase({ name: 'UserDatabase.db' });

export default class HomeScreen extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        camp:1,
        c_place:'',
        c_date:(new Date()).getDate() + "/"+ parseInt((new Date()).getMonth()+1) +"/"+ (new Date()).getFullYear(),
        isDateTimePickerVisible: false,
        campdata:[],
        txtPlace:React.createRef(),
      };

      db.transaction(txn=>{
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='tb_Camps'", [],
          (tx, res)=>{
            if(res.rows.length == 0){
              txn.executeSql('DROP TABLE IF EXISTS tb_Camps', []);
              txn.executeSql("CREATE TABLE IF NOT EXISTS tb_Camps(c_id INTEGER PRIMARY KEY AUTOINCREMENT, camp VARCHAR(50), c_place VARCHAR(50), c_date TEXT, c_status VARCHAR(10), created_at INTEGER(4) not null default (strftime('%s','now')))",[]);
            }
          }
        );

        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='tb_Patients'", [],
          (tx, res)=>{
            if(res.rows.length == 0){
              txn.executeSql('DROP TABLE IF EXISTS tb_Patients', []);
              txn.executeSql("CREATE TABLE IF NOT EXISTS tb_Patients(p_id INTEGER PRIMARY KEY AUTOINCREMENT, p_c_id INTEGER, reg_no INTEGER, p_name VARCHAR(50), p_age INT(4), p_sex VARCHAR(10), p_add VARCHAR(250), p_habits VARCHAR(250), p_illness VARCHAR(250), p_height FLOAT, p_weight FLOAT, p_iweight FLOAT, p_pulse INT(4), p_bp VARCHAR(10), p_glucose FLOAT, p_ecg VARCHAR(400), p_remark VARCHAR(400), p_status VARCHAR(10), created_at INTEGER(4) not null default (strftime('%s','now')))",[]);
            }
          }
        );

        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='tb_Settings'", [],
          (tx, res)=>{
            if(res.rows.length == 0){
              txn.executeSql('DROP TABLE IF EXISTS tb_Settings', []);
              txn.executeSql("CREATE TABLE IF NOT EXISTS tb_Settings(s_id INTEGER PRIMARY KEY AUTOINCREMENT, s_num INTEGER, s_type VARCHAR(10), s_text VARCHAR(400))",[]);
            }
          }
        );
      });      

      this.loadCamps = this.loadCamps.bind(this);
      this.getRowData = this.getRowData.bind(this);
      this.loadCamps();
    }   

    loadCamps(){
      db.transaction(txn=>{
        txn.executeSql("SELECT c_id, camp, c_place, c_date, 0 as p_id FROM tb_Camps ORDER BY c_id DESC", [],
          (txn, res)=>{
            var temp = [];
            for(let i=0; i<res.rows.length; i++){
              if(res.rows.item(i).camp) {
                temp.push(res.rows.item(i));
                let lcamp = parseInt(res.rows.item(i).camp,10);
                if(!isNaN(lcamp) && (lcamp>this.state.camp || lcamp==this.state.camp)){
                  this.setState({camp:lcamp+1});
                }
              }
            }          
            this.setState({campdata:temp});          
          }
        );
      }); 
    }

      static navigationOptions = ({ navigation }) => {
        var that = this;
        return {
          headerTitle: <Text style={{marginLeft:20,fontSize:18,fontWeight:'bold'}}>Camp information</Text>,
          headerRight: (
            <View style={{marginRight:10}}>
              <Button
                onPress={()=>{
                  navigation.navigate({routeName:'AppSetup'});
                }}
                title="Settings"
                color="#000"
              />
            </View>)
        };
      };

      save_info = () => {
        var that = this;
        //alert('Save started');
        const {camp } = this.state;
        const {c_place } = this.state;
        const {c_date } = this.state;
        if(camp && parseInt(camp.toString().trim(),10)>0 && camp.toString().trim() != ""){
          if(c_place && c_place.trim() != ""){          
            db.transaction( tx=> {
              tx.executeSql(
                'INSERT INTO tb_Camps (camp, c_place, c_date) VALUES (?,?,?)',
                [camp.toString().trim(), c_place.trim(), c_date.trim()],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    this.setState({camp:parseInt(camp.toString().trim(),10)+1});
                    this.setState({c_place:''});
                    this.loadCamps();
                    Alert.alert(
                      'Success',
                      'Camp added successfully',
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
            alert('Please enter Camp place');
          }
          }else{
            alert('Please enter Camp number');
          }
      };

      start_camp = (item) => {
        this.props.navigation.navigate({routeName:'PatientInfo',params:{campdata:item}});
      };

      update_camp = (item) => {
        this.props.navigation.navigate({routeName:'InfoPage',params:{campdata:item}});
      };

      getRowData(row){
        return row.camp+','+row.c_place+','+row.c_date+','+row.reg_no+','+row.p_name+','+row.p_age+','+row.p_sex+','+row.p_add+','+row.p_habits+','+row.p_illness+','+row.p_height+','+row.p_weight+','+row.p_iweight+','+row.p_pulse+','+row.p_bp+','+row.p_glucose+','+row.p_ecg.replace(/(?:\r\n|\r|\n)/g, ' ')+','+row.p_remark.replace(/(?:\r\n|\r|\n)/g, ' ')+'\n';
      }

      export_camp = (item) => {
        const c_id = item.c_id;
        const camp = item.camp;
        const filePath = RNFetchBlob.fs.dirs.DownloadDir + '/CampInfo_'+camp+'.csv';
        
        db.transaction(txn=>{
          txn.executeSql("SELECT camp, c_place, c_date, reg_no, p_name, p_age, p_sex, p_add, p_habits, p_illness, p_height, p_weight, p_iweight, p_pulse, p_bp, p_glucose, p_ecg, p_remark FROM tb_Patients p INNER JOIN tb_Camps c ON p.p_c_id=c.c_id WHERE c.c_id = ?", [c_id],
            (txn, res)=>{
              if(res.rows.length > 0)
              {                
                RNFetchBlob.fs.writeStream(filePath, 'utf8')
                .then((stream) => {
                  stream.write('Camp, Place, Date, Registration No, Name, Age, Sex, Address, Habits, Known illness, Height, Weight, Ideal weight, Pulse per minute, Blood pressure, Blood glucose, ECG, Remark\n');
                  for(let i=0; i<res.rows.length; i++){
                    if(res.rows.item(i).camp) {
                      stream.write(this.getRowData(res.rows.item(i)));    
                    }
                  }                
                  alert('Camp data exported successfully');
                  return stream.close();                  
                })
              }                        
            }
          );
        });        
      };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({c_date:date.getDate() + "/"+ parseInt(date.getMonth()+1) +"/"+ date.getFullYear()});
    this._hideDateTimePicker();
  };

    render() {
      return (
        <View style={{ backgroundColor: 'white', flex: 1, marginBottom:15 }}>
          <Mytextinput
            placeholder="Camp (Number)"
            onChangeText={camp => this.setState({ camp })}
            maxLength={50}
            value={this.state.camp +''}
            autoCapitalize = "words"
            keyboardType="numeric"
            onSubmitEditing={() => this.state.txtPlace.current.focus()}
            editable={false}
            style={{color:'black'}}
          />
          <Mytextinput
            InputRef={this.state.txtPlace}
            placeholder="Camp place (Name)"
            onChangeText={c_place => this.setState({ c_place })}
            maxLength={50}
            value={this.state.c_place}
          />
          <TouchableOpacity onPress={this._showDateTimePicker}>
            <Mytext text={this.state.c_date} style={{marginTop: 10, marginLeft:4}}></Mytext>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
          <Mybutton
            title="Submit"
            customClick={this.save_info.bind(this)}
          />
          <FlatList style={{}}
            data={this.state.campdata}         
            keyExtractor={(item, index) => index.toString()}   
            renderItem={({item}) => (
              <Myitem 
                text={item.c_date + " - " + item.camp + " - " + item.c_place} 
                borderWidth={0} borderColor="#fff" backgroundColor="#cddFeF" Left={10} Right={10} 
                style={{marginTop: 10, marginLeft:4}}
                buttonStyle1={{marginTop: 0, marginLeft:5, marginRight:5, color:'#58ACFA', fontSize:28, fontWeight:'bold'}}
                title1={'⇩'}
                customClick1 = {()=> this.export_camp(item)}
                buttonStyle2={{marginTop: 0, marginRight:10, color:'#58ACFA', fontSize:28, fontWeight:'bold'}}
                title2={'>'}
                customClick2 = {()=> this.start_camp(item)}
                customClick0 = {()=> this.update_camp(item)}
                >
              </Myitem>
            )}
          />        
        </View>
      );
    }
  }
