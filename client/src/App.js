import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import './App.css';

class HorizontalLinearStepper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      response: '',
      inputValue: '',
      disabledButton: true,
      hintText: "https://www.youtube.com/watch?v=0RkbkRXtqWc"
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleNext = () => {
    const {stepIndex} = this.state;

    if(stepIndex === 0){
      this.callApi(this.state.inputValue)
      .then(res => this.setState({ 
        response: res.express,
        disabledButton:false
      }))
      .catch(err => console.log(err));
    }

    if(stepIndex === 2){
      this.download("hello.txt",this.state.response);
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleChange(event) {
    this.setState({inputValue: event.target.value});
    if(this.state.inputValue === ''){
      this.setState({hintText: "https://www.youtube.com/watch?v=g0lMDKAWaQg"});
    }else{
      this.setState({hintText: ''});
    }
  };

  callApi = async (url) => {
    const response = await fetch(this.youTubeGetID(url));
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };


  youTubeGetID(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }


  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <TextField style={{width: 550}}
        id="youtube-input"
        type="text"
        floatingLabelText="Youtube Link"
        hintText={this.state.hintText}
        onChange={this.handleChange}
        value={this.state.inputValue}
      />;
        
      case 1:
        return 'Please wait until we prepare your file.';
      case 2:
        return 'Your file is ready!';
      default:
        return 'Null';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <MuiThemeProvider style={{width: '100%', margin: 'auto'}}>
      <div className="container">
        <Stepper activeStep={stepIndex} >
          <Step>
            <StepLabel>Please Enter The Youtube Link</StepLabel>
          </Step>
          <Step>
            <StepLabel>Wait a second...</StepLabel>
          </Step>
          <Step>
            <StepLabel>Download Your File</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false, disabledButton:true, response: ''});
                }}
              >
                Click here
              </a> to download a new file.
            </p>
          ) : (
            <div>
              <p>{this.getStepContent(stepIndex)}</p>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0 || stepIndex === 2}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Download' : 'Next'}
                  disabled={stepIndex === 1 && this.state.disabledButton}
                  primary={true}
                  onClick={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
        <p>{this.state.response}</p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default HorizontalLinearStepper;