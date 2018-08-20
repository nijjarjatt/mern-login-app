import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const style = {
  textAlign: 'center'
}
class Home extends Component {
  render() {

    return (
      <div> 
        <MuiThemeProvider>
          <div style={style}>
            <h1>Welcome to your home page</h1>
          </div>
        </MuiThemeProvider>
      </div>
    );

    
  }
}


export default Home;
