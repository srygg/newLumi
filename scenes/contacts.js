'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var nav = require('../NavbarMixin');
// var apis = require('../apis');
// var Loading = require('./loading');
var Reload = require('./reload');
// var MynavigationView = require('./mynavigationView');
var Friends = require('./friends');
var Recent = require('./recent');
var SearchFriends = require('./searchFriends');
var CustomTabbar = require('./customTabbar').default;
// var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var Icon = require('react-native-vector-icons/FontAwesome');

var GcmAPIS = require('../operations/gcm');
var GcmAndroid = require('react-native-gcm-android');

var { 
  AppRegistry, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  ToastAndroid,
  ListView,
  ScrollView,
  InteractionManager,
  DrawerLayoutAndroid,
  navigationView,
} = React;

var Contacts = React.createClass({

  mixins: [nav],

  // getInitialState: function() {
  //   return {
  //     : 
  //   };
  // },

  openDrawer: function(){
    this.props.openDrawer(true);
  },

  componentDidMount: function(){
    this.props.setLockMode("unlocked");
    this.props.getInfo(global.SESSION.user._id);
    this.setLeftButtons([{
      icon: 'menu',
      onPress: this.openDrawer,
    }]);

    this.setRightButtons([{
      icon: 'inbox',
      onPress: Actions.pop
    }]);  

    GcmAndroid.addEventListener('register', function(token){
            // console.warn('send gcm token', token);
            try{
                GcmAPIS.register({
                  body:{
                    token: token,
                    userid: global.SESSION.user._id
                  }
                });
            }catch(e){
              console.warn(e)
            }            
        });        
    GcmAndroid.requestPermissions();
  },

  render: function() {
    console.log('inital page:',this.props.initialPage);
    return (
      <ScrollableTabView 
        initialPage={this.props.initialPage} 
        tabBarPosition="bottom" 
        style={styles.container}
        tabBarUnderlineColor="#f4cb0d"
        tabBarBackgroundColor="#00437a"
        tabBarActiveTextColor="#f4cb0d"
        tabBarInactiveTextColor="#f4cb0d"
        renderTabBar={() => <CustomTabbar/>}>
        <Recent tabLabel='access-time|Recent'/>
        <Friends tabLabel='group|Friends'/>
        <SearchFriends tabLabel='search|Search'/>
      </ScrollableTabView>
    )        
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    marginTop: 55,
    // padding: 20,
    backgroundColor: '#ffffff',
  },
});

module.exports = Contacts;