import React from 'react';
import {Text, View, ScrollView, Alert, Picker} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Mybutton from './Mybutton';
import Mytextinput from './Mytextinput';
import {SegmentedControls } from 'react-native-radio-buttons';
import Mytext from './Mytext';

var db = openDatabase({ name: 'UserDatabase.db' });

export default class PatientInfo extends React.Component {
    constructor(props){
      super(props);

      const { navigation } = this.props;
      const campdata = navigation.getParam('campdata', {c_id:0, camp:'', c_place:'', c_date:'', p_id:0});
      this.state = {
        p_c_id:campdata.c_id,
        p_id:campdata.p_id,
        reg_no:1, p_name:'', p_age:'', p_sex:'Male',
        p_add:'', p_mob:'', p_habits:'', p_illness:'', p_habitsPick:'', p_illnessPick:'',
        p_height:'', p_weight:'', p_iweight:'', p_BMI:'',
        p_pulse:'', p_bp:'', p_bp2:'', p_glucose:'', p_ecg:'', p_ecgPick:'', p_remark:'', p_remarkPick:'',
        txtRegNo : React.createRef(), txtName : React.createRef(), txtAge : React.createRef(),
        txtAddr : React.createRef(), txtMob : React.createRef(), txtHabit : React.createRef(), txtIllness : React.createRef(),
        txtHeight : React.createRef(), txtWeight : React.createRef(), txtIWeight : React.createRef(),
        txtPulse : React.createRef(), txtBP : React.createRef(), txtBP2 : React.createRef(), txtGlucose : React.createRef(), txtECG : React.createRef(), txtRemark : React.createRef(),
        ecgdata:[],
        remdata:[],
        pageLoad: false,
      };
      
      this.load_regno = this.load_regno.bind(this);
      this.loadSettings = this.loadSettings.bind(this);
      this.loadSettings();

      if(this.state.p_id && this.state.p_id>0){
        db.transaction(txn=>{
          txn.executeSql("SELECT reg_no, p_name, p_age, p_sex, p_add, p_habits, p_illness, p_height, p_weight, p_iweight, p_pulse, p_bp, p_glucose, p_ecg, p_remark, p_status FROM tb_Patients WHERE p_id=? AND p_c_id = ?", [this.state.p_id, this.state.p_c_id],
            (txn, res)=>{
              if(res.rows.length > 0)
              {                
                let vPatient = res.rows.item(0);
                this.setState({reg_no:vPatient.reg_no+''});
                this.setState({p_name:vPatient.p_name});
                this.setState({p_age:vPatient.p_age+''});
                this.setState({p_sex:vPatient.p_sex});
                this.setState({p_add:vPatient.p_add});
                this.setState({p_mob:vPatient.p_status});
                this.setState({p_habits:vPatient.p_habits});
                this.setState({p_illness:vPatient.p_illness});
                this.setState({p_height:vPatient.p_height+''});
                this.setState({p_weight:vPatient.p_weight+''});
                this.setState({p_iweight:vPatient.p_iweight+''});
                this.setState({p_pulse:vPatient.p_pulse+''});
                this.setState({p_bp: vPatient.p_bp});
                this.setState({p_glucose:vPatient.p_glucose+''});
                this.setState({p_ecg:vPatient.p_ecg});
                this.setState({p_remark:vPatient.p_remark});
                this.get_bmi(vPatient.p_height, vPatient.p_weight);
                this.setState({p_habitsPick: (vPatient.p_habits.split(',').length>0?vPatient.p_habits.split(',')[0]:vPatient.p_habits)});
                this.setState({p_illnessPick: (vPatient.p_illness.split(',').length>0?vPatient.p_illness.split(',')[0]:vPatient.p_illness)});
                this.setState({pageLoad:true});
              }                        
            }
          );
        });
      }else{
        this.load_regno();
      }      
    }

    load_regno(){
      db.transaction(txn => {   
        txn.executeSql(
          "SELECT max(ifnull(reg_no, 0)) as reg_no FROM tb_Patients WHERE p_c_id=?",
          [this.state.p_c_id],
          (txn, res)=>{
            var temp = [];
            for(let i=0; i<res.rows.length; i++){
              if(res.rows.item(i).reg_no) {
                this.setState({reg_no:parseInt(res.rows.item(i).reg_no,10)+1});
              }
            }
          }
        );
      });
    }

    loadSettings(){
      db.transaction(txn=>{
        txn.executeSql("SELECT s_id, s_type, s_text FROM tb_Settings a ORDER BY s_num", [],
          (txn, res)=>{
            var tempecg = [];
            var temprem = [];
            for(let i=0; i<res.rows.length; i++){
              if(res.rows.item(i).s_type=='ECG') {
                tempecg.push(res.rows.item(i));
              }else if(res.rows.item(i).s_type=='REM') {
                temprem.push(res.rows.item(i));
              }
            }          
            this.setState({ecgdata:tempecg});
            this.setState({remdata:temprem});
          }
        );
      }); 
    }

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: <Text style={{fontSize:18,fontWeight:'bold'}}>Patient information</Text>,
        };
      };

      save_info = () => {
        var that = this;
        const {p_c_id } = this.state;
        const {reg_no } = this.state;
        const {p_name } = this.state;
        const {p_age } = this.state;
        const {p_sex } = this.state;
        const {p_add } = this.state;
        const {p_mob } = this.state;
        const {p_habits } = this.state;
        const {p_illness } = this.state;
        const {p_height } = this.state;
        const {p_weight } = this.state;
        const {p_iweight } = this.state;
        const {p_pulse } = this.state;
        const {p_bp } = this.state;
        const {p_bp2 } = this.state;
        const {p_glucose } = this.state;
        const {p_ecg } = this.state;
        const {p_remark } = this.state;
        if(p_c_id && p_c_id != 0){
        if(reg_no && reg_no > 0){
          if(p_name && p_name.trim() != ""){
            let txtQuery = '';
            let arrQuery = [];
            if(this.state.p_id && this.state.p_id>0){
              txtQuery = 'UPDATE tb_Patients SET reg_no=?, p_name=?, p_age=?, p_sex=?, p_add=?, p_habits=?, p_illness=?, p_height=?, p_weight=?, p_iweight=?, p_pulse=?, p_bp=?, p_glucose=?, p_ecg=?, p_remark=?, p_status=? WHERE p_id=? AND p_c_id=?';
              arrQuery = [reg_no, p_name, p_age, p_sex, p_add, p_habits, p_illness, p_height, p_weight, p_iweight, p_pulse, p_bp, p_glucose, p_ecg, p_remark, p_mob, this.state.p_id, p_c_id];  
            }else{
              txtQuery = 'INSERT INTO tb_Patients (p_c_id, reg_no, p_name, p_age, p_sex, p_add, p_habits, p_illness, p_height, p_weight, p_iweight, p_pulse, p_bp, p_glucose, p_ecg, p_remark, p_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
              arrQuery = [p_c_id, reg_no, p_name, p_age, p_sex, p_add, p_habits, p_illness, p_height, p_weight, p_iweight, p_pulse, p_bp, p_glucose, p_ecg, p_remark, p_mob]; 
            }
            db.transaction(tx=> {
              tx.executeSql(
                txtQuery,
                arrQuery,
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    this.setState({reg_no:reg_no+1});
                    this.setState({p_name:''});
                    this.setState({p_age:''});
                    this.setState({p_sex:'Male'});
                    this.setState({p_add:''});
                    this.setState({p_mob:''});
                    this.setState({p_habits:''});
                    this.setState({p_illness:''});
                    this.setState({p_height:''});
                    this.setState({p_weight:''});
                    this.setState({p_iweight:''});
                    this.setState({p_pulse:''});
                    this.setState({p_bp:''});
                    this.setState({p_bp2:''});
                    this.setState({p_glucose:''});
                    this.setState({p_ecg:''});
                    this.setState({p_remark:''});
                    this.setState({p_BMI:''});
                    this.setState({p_habitsPick:''});
                    this.setState({p_illnessPick:''});
                    this.state.txtName.current.focus();
                    Alert.alert(
                      'Success',
                      'Record saved successfully',
                      [{text: 'OK',
                      onPress:()=>{
                        if(this.state.p_id && this.state.p_id>0){
                          this.props.navigation.navigate({routeName:'InfoPage'}); 
                        }                            
                      }
                      },{text: 'Print',
                      onPress:()=>{
                        this.props.navigation.navigate({routeName:'ViewInfo',params:{campdata:{c_id:p_c_id, camp:'', c_place:'', c_date:'', p_id:reg_no}}});                        
                      }
                      },],
                      { cancelable: false }
                    );
                  } else {
                    alert('Save failed');
                  }
                }
              );
            });
          }else{
            alert('Please enter Name');
          }
        }else{
          alert('Please enter Registration No.');
        }
      }else{
        alert('Please select Camp');
      }
      };

      clear_info = () => {
        this.setState({reg_no:''});
        this.setState({p_name:''});
        this.setState({p_age:''});
        this.setState({p_sex:'Male'});
        this.setState({p_add:''});
        this.setState({p_mob:''});
        this.setState({p_habits:''});
        this.setState({p_illness:''});
        this.setState({p_height:''});
        this.setState({p_weight:''});
        this.setState({p_iweight:''});
        this.setState({p_pulse:''});
        this.setState({p_bp:''});
        this.setState({p_bp2:''});
        this.setState({p_glucose:''});
        this.setState({p_ecg:''});
        this.setState({p_remark:''});
        if(this.state.p_id && this.state.p_id>0){
          this.props.navigation.navigate({routeName:'InfoPage'}); 
        }else{
          this.load_regno();
        }
      };

      get_iWeight(height, sex){
        var overInch = (parseFloat(height)*0.3937)-60;
        var baseW = 0, xW = 2.3;
        if(sex.toUpperCase() != 'FEMALE'){
          baseW = 50;
        }else{
          baseW = 45.5;
        }
        var iWeight = baseW + (overInch * xW);
        iWeight = Math.round(iWeight*10)/10;
        if(!isNaN(iWeight)){
          this.setState({ p_iweight:iWeight+''});
        }else{
          this.setState({ p_iweight:''});
        }  
      }

      get_bmi(height, weight){
        var heightMeter = parseFloat(height)/100;
        var bmi = parseFloat(weight)/(heightMeter*heightMeter);
        bmi = Math.round(bmi*10)/10;
        if(!isNaN(bmi)){
          this.setState({ p_BMI:bmi+''});
        }else{
          this.setState({ p_BMI:''});
        }  
      }

      get_listValues(value, selectedValue){
        if(selectedValue == '') return selectedValue;
  
        let lvalue = ', '+value+',';
        if(lvalue.indexOf(', '+selectedValue+',')==-1){
          return value == ''? selectedValue : value +', '+selectedValue;
        }
        return value;
      }

    render() {
      const options = [
        'Male',
        'Female'
      ];
      
      function setSelectedOption(selectedOption){
        this.setState({ p_sex: selectedOption});
        this.get_iWeight(this.state.p_height,selectedOption);
      }     
      
      var ecgItems = this.state.ecgdata.map(function(item) {
        return (
          <Picker.Item label={item.s_text} value={item.s_text} />
        );
      });

      var remItems = this.state.remdata.map(function(item) {
        return (
          <Picker.Item label={item.s_text} value={item.s_text} />
        );
      });

      return (
        <View style={{ backgroundColor: 'white', flex: 1, marginBottom:15 }}>
        <ScrollView keyboardShouldPersistTaps='always'>
            <Mytextinput
              InputRef={this.state.txtRegNo}
              placeholder="Registration No (digit)"
              onChangeText={reg_no => this.setState({ reg_no })}
              maxLength={20} keyboardType="numeric" editable={false}
              value={this.state.reg_no + ''}
              onSubmitEditing={() => this.state.txtName.current.focus()}
              style={{color:'black'}}
            />
            <Mytextinput
              InputRef={this.state.txtName}
              placeholder="Name"
              onChangeText={p_name => this.setState({ p_name })}
              keyboardType={'default'}
              autoCapitalize = "words"
              maxLength={50}
              value = {this.state.p_name}
              onSubmitEditing={() => this.state.txtAge.current.focus()}
            />
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{
                width:180,
                marginLeft:35,
                marginTop:10
              }}>
                <SegmentedControls
                    options={ options }
                    containerBorderRadius={1}
                    containerStyle={{height:40}}
                    onSelection={ setSelectedOption.bind(this) }
                    selectedOption = {this.state.p_sex}
                />  
              </View>
              <Mytextinput
                InputRef={this.state.txtAge}
                placeholder="Age"
                onChangeText={p_age => this.setState({ p_age })}
                maxLength={3}
                keyboardType="numeric"
                style={{marginLeft:0, width:90}}
                maxLength={3}
                value={this.state.p_age}
                onSubmitEditing={() => this.state.txtMob.current.focus()}
              />              
            </View>
            <Mytextinput
              InputRef={this.state.txtMob}
              placeholder="Mobile"
              onChangeText={p_mob => this.setState({ p_mob })}
              maxLength={10}
              keyboardType="numeric"
              value = {this.state.p_mob}
              onSubmitEditing={() => this.state.txtHabit.current.focus()}
            />
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', 
                  borderColor: '#007FFF', borderWidth:1,
                  marginLeft:35, marginRight:35, marginTop:10}}
                  >
              <Mytextinput
                InputRef={this.state.txtHabit}
                placeholder="Addiction"
                maxLength={250}
                value ={this.state.p_habits}
                style={{flex:1, height:38, marginLeft:0, marginRight:20,marginTop:0, borderWidth:0, color:'black'}}
                editable={false}
              />
              <Picker
                selectedValue={this.state.p_habitsPick}
                style={{ height: 38, width:20, borderColor: '#007FFF', borderWidth:1 }}
                onValueChange={(itemValue, itemIndex) => { this.setState({p_habits: this.get_listValues(this.state.p_habits, itemValue)}); this.setState({p_habitsPick:itemValue});}}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Tobacco" value="Tobacco" />
                <Picker.Item label="Smoking" value="Smoking" />
                <Picker.Item label="Drinking" value="Drinking" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', 
                  borderColor: '#007FFF', borderWidth:1,
                  marginLeft:35, marginRight:35, marginTop:10}}
                  >
              <Mytextinput
                InputRef={this.state.txtIllness}
                placeholder="Previous illness"
                maxLength={250}
                value={this.state.p_illness}
                style={{flex:1, height:38, marginLeft:0, marginRight:20,marginTop:0, borderWidth:0, color:'black'}}
                editable={false}
              />
              <Picker
                selectedValue={this.state.p_illnessPick}
                style={{ height: 38, width:20, borderColor: '#007FFF', borderWidth:1 }}
                onValueChange={(itemValue, itemIndex) => { this.setState({p_illness: this.get_listValues(this.state.p_illness, itemValue)}); this.setState({p_illnessPick:itemValue});}}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Diabetes" value="Diabetes" />
                <Picker.Item label="BP" value="BP" />
                <Picker.Item label="Cardiovascular disease" value="Cardiovascular disease" />
                <Picker.Item label="Cerebrovascular attack" value="Cerebrovascular attack" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Mytextinput
                InputRef={this.state.txtHeight}
                placeholder="Height"
                onChangeText={p_height => {this.setState({ p_height }); this.get_iWeight(p_height,this.state.p_sex); this.get_bmi(p_height, this.state.p_weight);}}
                keyboardType="numeric"
                style={{marginRight:0, width:180}}
                FlexAlign="flex-start"
                value={this.state.p_height}
                onSubmitEditing={() => this.state.txtWeight.current.focus()}
              />
              <Mytextinput
                InputRef={this.state.txtIWeight}
                placeholder="Ideal weight"
                onChangeText={p_iweight => this.setState({ p_iweight })}
                keyboardType="numeric" editable={false}
                style={{marginLeft:0, width:90, color:'black'}}
                FlexAlign="flex-end"
                value={this.state.p_iweight}
                onSubmitEditing={() => this.state.txtPulse.current.focus()}
              />
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Mytextinput
                InputRef={this.state.txtWeight}
                placeholder="Weight"
                onChangeText={p_weight => {this.setState({ p_weight }); this.get_bmi(this.state.p_height, p_weight);}}
                keyboardType="numeric"
                style={{marginRight:0, width:180}}
                FlexAlign="center"   
                value={this.state.p_weight}
                onSubmitEditing={() => this.state.txtPulse.current.focus()}
              />
              <Mytextinput
                InputRef={this.state.txtBMI}
                placeholder="BMI"
                keyboardType="numeric" editable={false}
                style={{marginLeft:0, width:90, color:'black'}}
                FlexAlign="flex-end"
                value={this.state.p_BMI}
                onSubmitEditing={() => this.state.txtBP.current.focus()}
              />
            </View>            
            <Mytextinput
              InputRef={this.state.txtBP}
              placeholder="Blood pressure (mm of Hg)"
              onChangeText={p_bp => this.setState({ p_bp })}
              keyboardType="phone-pad"
              value={this.state.p_bp}
              onSubmitEditing={() => this.state.txtGlucose.current.focus()}
            />
            <Mytextinput
              InputRef={this.state.txtGlucose}
              placeholder="Blood glucose level (mg%)"
              onChangeText={p_glucose => this.setState({ p_glucose })}
              keyboardType="numeric"
              value={this.state.p_glucose}
              onSubmitEditing={() => this.state.txtRemark.current.focus()}
            />
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', 
              borderColor: '#007FFF', borderWidth:1,
              marginLeft:35, marginRight:35, marginTop:10}} >
              <Mytextinput
                InputRef={this.state.txtRemark}
                placeholder="Remark"
                onChangeText={p_remark => this.setState({ p_remark })}
                multiline = {true}
                numberOfLines = {2}
                maxLength={400}
                style={{flex:1, height:60, marginLeft:0, marginRight:20,marginTop:0, borderWidth:0, color:'black'}}
                value={this.state.p_remark}
              />
              <Picker
                selectedValue={this.state.p_remarkPick}
                style={{ height: 60, width:20, borderColor: '#007FFF', borderWidth:1 }}
                onValueChange={(itemValue, itemIndex) => { if(this.state.pageLoad){ this.setState({pageLoad:false}); return; } this.setState({p_remark: itemValue}); this.setState({p_remarkPick:itemValue});}}>
                <Picker.Item label="" value="" />
                {remItems}
              </Picker>
            </View>
            <Mybutton
              title="Submit"
              customClick={this.save_info.bind(this)}
            />
            <Mybutton
              title="Clear"
              backgroundColor="#666"
              customClick={this.clear_info.bind(this)}
              marginTop={0}
            />
        </ScrollView>
      </View>
      );
    }
  }
