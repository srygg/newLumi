'use strict';

var {Router, Route, Schema, Animations, TabBar} = require('react-native-router-flux');
var React = require('react-native');

// var Initial = require('./scenes/initial');
var Login = require('./scenes/login');
var CreateAccount = require('./scenes/createAccount');
var Contacts = require('./scenes/contacts');
var Chats = require('./scenes/chats');

// var Loading = require('./scenes/loading');
// var Reload = require('./scenes/reload');
// var Profile = require('./scenes/profile');
// var Me = require('./scenes/me');

var RightButtons  = require('./NavBarParts/RightActionButtons');
var LeftButtons   = require('./NavBarParts/LeftActionButtons');
var BarTitleView  = require('./NavBarParts/BarTitleView');
var MynavigationView = require('./scenes/mynavigationView');

require('./beforeActions');
require('./afterActions');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  Navigator,
  DeviceEventEmitter,
} = React;

var renderTitle =  function(navigator, index, state) {
  return  <BarTitleView 
        navigator={navigator}
          index={index}
          state={state}/>;
};

var renderRightButton = function(navigator, index, state) {
  let currentReoute = state.routeStack[index];
    return <RightButtons routeName={currentReoute.name}/>;
};

var renderLeftButton = function(navigator, index, state) {
  let currentReoute = state.routeStack[index];
  return <LeftButtons routeName={currentReoute.name} 
      navigator={navigator}
      index={index}
      state={state}/>;
};

var Lumi = React.createClass({

  getInitialState: function() {
    return {
       drawerLockMode : "locked-closed" 
    };
  },

  _setLockMode: function(val) {
    this.setState({
      drawerLockMode: val ||  "locked-closed"
    });
  },

  _openDrawer: function(value){
    if(value){
      this.refs["DRAWER"].openDrawer();
    }else{
      this.refs["DRAWER"].closeDrawer();
    }
    
  },
  
  render: function() {
    return (
      <DrawerLayoutAndroid
        drawerLockMode={this.state.drawerLockMode}
        drawerWidth={200}
        ref={'DRAWER'}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => <MynavigationView openDrawer={this._openDrawer}></MynavigationView>}>
      
        <Router hideNavBar={false} 
            barButtonTextStyle={{
              color: '#f4cb0d'
            }}

            barButtonIconStyle={{
              tintColor: '#f4cb0d'
            }}

            navigationBarStyle={{
              backgroundColor: '#00437a'
            }}

            setLockMode={this._setLockMode}

            openDrawer={this._openDrawer}

            renderTitle={ renderTitle }
            renderLeftButton={ renderLeftButton }
            renderRightButton={ renderRightButton }

            titleStyle = {{color:'#f4cb0d',}}>
          <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
          <Route name="login" component={Login} initial={true} title="login" schema="modal"/>
          <Route name="createAccount" component={CreateAccount}  title="New Account" schema="modal"/>
          <Route name="contacts" component={Contacts}  title="Contacts"/>
          <Route name="chats" component={Chats}  title="Chats"/>
        </Router>
      </DrawerLayoutAndroid>
      
    );
  }
});

var styles = StyleSheet.create({
  
});

AppRegistry.registerComponent('Lumi', () => Lumi);



