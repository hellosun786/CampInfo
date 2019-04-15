import React from 'react';
import {Text, View, Button} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PDFView from 'react-native-view-pdf';
import RNPrint from 'react-native-print';

var db = openDatabase({ name: 'UserDatabase.db' });

export default class ViewInfo extends React.Component {
    constructor(props){
      super(props);

      const { navigation } = this.props;
      const campdata = navigation.getParam('campdata', {c_id:0, camp:'', c_place:'', c_date:'', p_id:0});
      this.state = {
        p_c_id:campdata.c_id,
        p_id:campdata.p_id,
        camp:'', c_place:'', c_date:'',
        reg_no:'', p_name:'', p_age:'', p_sex:'Male',
        p_add:'', p_mob:'', p_habits:'', p_illness:'',
        p_height:'', p_weight:'', p_iweight:'',
        p_pulse:'', p_bp:'', p_glucose:'', p_ecg:'', p_remark:'', pdfPath:'', pdfFile:''       
      };
      
      db.transaction(txn=>{
        txn.executeSql("SELECT camp, c_place, c_date, reg_no, p_name, p_age, p_sex, p_add, p_habits, p_illness, p_height, p_weight, p_iweight, p_pulse, p_bp, p_glucose, p_ecg, p_remark, p_status FROM tb_Patients p INNER JOIN tb_Camps c ON p.p_c_id=c.c_id WHERE reg_no=? AND p_c_id = ?", [this.state.p_id, this.state.p_c_id],
          (txn, res)=>{
            if(res.rows.length > 0)
            {                
              let vPatient = res.rows.item(0);
              this.setState({camp:vPatient.camp});
              this.setState({c_place:vPatient.c_place});
              this.setState({c_date:vPatient.c_date});
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
              this.setState({p_bp:vPatient.p_bp});
              this.setState({p_glucose:vPatient.p_glucose+''});
              this.setState({p_ecg:vPatient.p_ecg});
              this.setState({p_remark:vPatient.p_remark});
              this.setState({pdfFile:'Report_'+vPatient.reg_no});
              this.createPDF();
            }                        
          }
        );
      });      
      
      this.createPDF = this.createPDF.bind(this);
      this.get_content = this.get_content.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
      var that = this;
      return {
        headerTitle: <Text style={{fontSize:18,fontWeight:'bold'}}>View patient information</Text>,
        headerRight: (
          <View style={{marginRight:10}}>
            <Button
              onPress={()=>{
                RNPrint.print({ filePath: navigation.state.params.pdfPath });
              }}
              title="Print"
              color="#000"
            />
          </View>)
      };
    };

    get_content(){
      return `<div style='width:100%;text-align: center;font-family:Mukta;margin-top:5%;border: 1px solid gray;padding:20px 0px;'>
                <h3>डॉ. जी. आर. कुलकर्णी, नेवासा यांच्या सौजन्याने वैद्यकीय तपासणी शिबिर</h3>
                <h1>स्वयम्-आरोग्य</h1>
                <div style='width:auto; text-align: center;padding-top:30px; margin: 2% 7% 2% 7%; border-top:5px solid #457274; border-bottom: 2px solid #457274'>
                    <table style='width:500px;border: 1px solid gray;font-family:Mukta;' align='center'>
                        <tr><td width='250'>शिबिर क्रमांक:</td><td>${this.state.camp}</td></tr>
                        <tr><td>शिबिराचे ठिकाण:</td><td>${this.state.c_place}</td></tr>
                        <tr><td>दिनांक:</td><td>${this.state.c_date}</td></tr>                        
                    </table>
                    <table style='width:500px;border: 1px solid gray;font-family:Mukta;margin-top:5px;' align='center'>
                        <tr><td>नोंदणी क्रमांक:</td><td>${this.state.reg_no}</td></tr>
                        <tr><td width='250'>नाव:</td><td>${this.state.p_name}</td></tr>
                        <tr><td>लिंग:</td><td>${this.state.p_sex.toUpperCase()=="MALE"?'पुरुष':'स्त्री'}</td></tr>
                        <tr><td>वय:</td><td>${this.state.p_age} वर्ष</td></tr>
                        ${(this.state.p_mob == null || this.state.p_mob == '')?'':"<tr><td>मोबाइला क्र.:</td><td>"+this.state.p_mob+"</td></tr>"}
                        ${this.state.p_illness == ''?'':"<tr><td>पुर्वीचे आजार:</td><td>"+this.get_illness(this.state.p_illness)+"</td></tr>"}
                    </table>
                    <table style='width:500px;border: 1px solid gray;font-family:Mukta;margin-top:5px;' align='center'>
                        ${this.state.p_height == ''?'':"<tr><td width='250'>उंची:</td><td>"+this.state.p_height+" <span style='color:#666'>cm</span></td></tr>"}
                        ${this.state.p_weight == ''?'':"<tr><td  width='250'>वजन:</td><td>"+this.state.p_weight+" <span style='color:#666'> kg"+(this.state.p_iweight == ''?'':" (योग्य वजन: "+this.state.p_iweight+" kg)")+"</span></td></tr>"}
                        ${(this.state.p_height == ''||this.state.p_weight == '')?'':"<tr><td  width='250'>बी.एम.आय. (BMI- Weight/Height<sup>2</sup>):</td><td>"+this.get_bmi(this.state.p_height, this.state.p_weight)+" <span style='color:#666'>(18.5-25)</span></td></tr>"}
                        ${this.state.p_bp == ''?'':"<tr><td  width='250'>रक्तदाब (Blood Pressure):</td><td>"+this.state.p_bp+" <span style='color:#666'> (<140/90 mm of Hg)</span></td></tr>"}                        
                        ${this.state.p_glucose == ''?'':"<tr><td  width='250'>रक्तशर्करा (Blood Glucose):</td><td>"+this.state.p_glucose+" <span style='color:#666'> (<160 mg%)</span></td></tr>"}                        
                    </table>
                    ${this.state.p_remark == ''?'':"<table style='width:500px;border: 1px solid gray;font-family:Mukta;margin-top:5px;' align='center'><tr><td width='250'>टिप्पणी:</td><td>"+this.state.p_remark+"</td></tr></table>"}
                    <br/>
                    <table style='width:500px;font-family:Mukta;' align='center'>
                        <tr><td colspan='2' style='font-size: 14px;'>टिप: वरील माहिती तुमच्या नेहमीच्या डॉक्टरांना दाखवुन त्यांचा सल्ला घ्यावा.</td></tr>                        
                    </table>
                    <br/>                    
                </div>
                <h3>|| आरोग्य तपासणी कराल वेळेवर - स्वस्थ तुम्ही रहाल आयुष्यभर ||</h3>
            </div>`;
    }

    get_illness(illness){
      let arrIll = illness.split(',');
      let retVal = '';
      for(let i=0; i<arrIll.length; i++){
        switch(arrIll[i].trim()){
          case "Diabetes": retVal = (retVal == ''? "मधुमेह" : retVal+", "+"मधुमेह"); break; 
          case "BP": retVal = (retVal == ''? "रक्तदाब" : retVal+", "+"रक्तदाब"); break;
          case "Cardiovascular disease": retVal = (retVal == ''? "हृदयविकार" : retVal+", "+"हृदयविकार"); break;
          case "Cerebrovascular attack": retVal = (retVal == ''? "पक्षाघात" : retVal+", "+"पक्षाघात"); break;
          case "Other": retVal = (retVal == ''? "इतर" : retVal+", "+"इतर"); break;
        }
      }
      return retVal;
    }

    get_bmi(height, weight){
      var heightMeter = parseFloat(height)/100;
      var bmi = parseFloat(weight)/(heightMeter*heightMeter);
      return Math.round(bmi*10)/10;  
    }
    
    async createPDF() {
      let options = {
        html: this.get_content(),
        fileName: this.state.pdfFile,
        directory: 'docs',
      };
   
      let file = await RNHTMLtoPDF.convert(options)
      this.setState({pdfPath: file.filePath});
      this.props.navigation.setParams({pdfPath:file.filePath});
    }

    render() {
      const options = [
        'Male',
        'Female'
      ];

      return (
        <View style={{ flex: 1 }}>
        <PDFView
          style={{ flex: 1 }}
          resource={this.state.pdfPath}
          resourceType={'file'}
        />
      </View>
      );
    }
  }
