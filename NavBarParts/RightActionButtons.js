/* 
* @Author: dingxizheng
* @Date:   2016-01-27 19:50:46
* @Last Modified by:   dingxizheng
* @Last Modified time: 2016-02-25 22:56:15
*/

'use strict';

var React       = require('react-native');
var GlobalEvent = require('../GlobalEvent');
var Icon        = require('react-native-vector-icons/MaterialIcons');
// var {Avatar, List, Subheader, Icon, IconToggle} = require('react-native-material-design');
var GCM = require('../gcmdata');
var {Avatar, List, Subheader, IconToggle} = require('react-native-material-design');

var {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} = React;

var {
	Actions
} = require('react-native-router-flux');


var ActionButtons = React.createClass({

	getInitialState: function() {
		return {
			buttons: [],
			notification_count:null,
		};
	},

	componentWillMount: function() {
		var self = this;
		GlobalEvent.trigger('right_buttons_mounted', 
			this.setButtons, 
			function(callback, layoutCallback) { 
				self.onMounted = callback;
				self.onLayout = layoutCallback;
			}.bind(this)
		);

		GCM.subscribe(this._onMessage);
	},

	_onMessage(msg){
		
		var counter = 0;
		//fetch from the server first..
		for (var i = 0; i < GCM.messages.length; i++) {
      
	      if(GCM.messages[i].key3 === 'addFriendRequest' && GCM.messages[i].key4 === 'unread'
	        && GCM.messages[i].key2 === global.SESSION.user._id){
	        counter++;
	      }
	    }

	    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",counter);
	    this.setState({
	    	notification_count: counter,
	    });
	},

	componentDidMount: function() {
		this.onMounted();
	},

	setButtons: function(buttons) {
		this.setState({
			buttons: buttons
		});
	},

	render: function() {
		return (
			<View style={styles.barRightButton} onLayout={this.onLayout}>
			{this.state.buttons.map(function(b, i) {

				return (
					<TouchableOpacity key={i} onPress={b.onPress || console.log } style={styles.barButtonIconWrapper}>
			            { function(){ 
			              if (b.icon) {
			              	if(this.state.notification_count > 0){
								return (
					            	<IconToggle
										color="paperGrey900"
										badge={{ value: this.state.notification_count }}>
					            		<Icon name={b.icon} style={styles.barButtonIcon} />
					            	</IconToggle>
				            	)
							}else{
								return <Icon name={b.icon} style={styles.barButtonIcon} />
							}
				            
				          } else{
				          	return <Text style={styles.barButtonText}>{b.text}</Text>
				          }
			            }.bind(this).call()}
			        </TouchableOpacity>
				);

			}.bind(this))}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	barRightButton: {
		paddingRight: 4,
	    paddingBottom: 6,
	    flexDirection: 'row',
	    justifyContent: 'flex-end',
	    flex: 1
	},
	barButtonIconWrapper: {
		marginTop: 8,
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 8,
		paddingLeft: 8,
	},
	barButtonIcon: {
	    color: "#f4cb0d",
	    fontSize: 22,
	    margin: 12,
	},
	barButtonText: {
	    color: "#f4cb0d",
	    fontSize: 17
	}
});

module.exports = ActionButtons;