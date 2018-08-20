import React, { Component } from 'react';
import { render } from 'react-dom'
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Home from './components/Home';


import './App.css';

const style = {
  margin: 15,
  textAlign: 'center'
};

const pStyle = {
    color: 'red',
    padding: '20px',
    display: 'block',
    width: '200px',
    margin: '40px auto',
    border: '2px solid red',
    borderRadius: '2px'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {error: false};
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(event) {
    const user = {
      username: this.state.username,
      password: this.state.password
    };
    axios.post(`http://localhost:3000/authenticate`, user)
    .then(res => {
      this.setState({error: false})
      hashHistory.push('home');
    }, () => {
      this.setState({error: true})
    })
  }
  
  render() {
    let errorDiv;
    const error = this.state.error;

    if (error) {
      errorDiv = <p style={pStyle}>Error Logging In</p>
    } else {
      errorDiv = null
    }

    return (
      <div style={style}> 
        <MuiThemeProvider>
          <div>
            <h1>Login</h1>
            
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange = {(event,newValue) => this.setState({username:newValue})}
              />

            <br/>

            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange = {(event,newValue) => this.setState({password:newValue})}
              />

            <br/>
            <RaisedButton label="Submit" disabled={!this.state.username || !this.state.password} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
            
            {errorDiv}
          </div>
        </MuiThemeProvider>
      </div>
    );

    
  }
}

render((
  <Router history={hashHistory}>
    <Route path="/">
      <IndexRoute component={App} />
      <Route path="home" component={Home} />
    </Route>
  </Router>
), document.getElementById('root'))

export default App;
