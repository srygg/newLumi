'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var apis = require('../apis');
var UserAPIS = require('../operations/users');
var Spinner = require('react-native-spinkit');

var {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	ToastAndroid,
} = React;

var {height, width} = Dimensions.get('window');

var Profile = React.createClass({

	mixins: [nav],
	getInitialState: function() {
		return {
			avatar: null,
			nickname: null,
			status:null,
			gender:null,
			birthday:null,
			isfriend: false,
			isLoading: false,
		};
	},

	getDestinationUser: async function(value){

	    try{
	      var user = await UserAPIS.queryOne({
	        query:{
	          id: value,
	        }});
	      if(user){
	      	let avatar = apis.BASE_URL+"/"+user.avatar;
	        let birthday = user.birthday.split("T")[0];
	        this.setState({
	        	avatar: avatar, 
	        	status: user.status,	        	
	        	nickname:user.nickname,
	        	username: user.username,
	        	gender: user.gender,
	        	birthday: birthday,
	        });
	      }
	    }catch(e){
	      console.log(e);
	    }
	},

	isFriend: async function(){

		try{
			var user = await UserAPIS.isFriend({
				query:{
					friend_id: this.props.id,
					current_id: global.SESSION.user._id,
				}
			})
			if(user.message === false){
				this.setState({
					isfriend: false,
		        	username: 'no email to show',
		        	gender: 'no gender to show',
		        	birthday: 'no birthday to show',
				});
			}else{
				this.setState({
					isfriend: true,
				});
			}

		}catch(e){
			console.log("err",e)
		}		
	},

	componentDidMount: function(){
	    this.setLeftButtons([{
	      icon: 'navigate-before',
	      onPress: Actions.pop,
	    }]);
  
	    this.getDestinationUser(this.props.id);
	    this.isFriend();
	},

	render: function() {
		var add, requestToAdd;

		
		if(this.state.isLoading){
			var spin = <Spinner size={30} type={'CircleFlip'} color={'grey'}/>
		}

		if(!this.state.isfriend){
			add  =  <TouchableOpacity onPress={() => this.addFriend()}>
				        <View style={styles.add}>
				        	<Text style={styles.addText}> Add </Text>
				        </View>
				        <View style={{marginTop: 10, alignItems : 'center'}}>
				        	{spin}
				        </View>
				    </TouchableOpacity>
		}

		return(
			<View style={styles.container}>
				<View style={styles.avatar}>
					<Avatar size={80} image={<Image source={ {uri:this.state.avatar}}/>} />
					<Text>{this.state.status}</Text>
				</View>

				<View style={styles.info}>
					<View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Nickname </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.nickname} </Text>
						</View>					
		            </View>
		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Email </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.username} </Text>
						</View>					
		            </View>

		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Gender </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.gender} </Text>
						</View>					
		            </View>

		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Birthday </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.birthday} </Text>
						</View>					
		            </View>
		        </View>
		        <View style={styles.info}>
		        	<View style={styles.item}>
						<View style={{marginLeft: 15, width: 70,}}>
							<Icon
								size={20}
								name="collections"/>
						</View>
						<View style={{marginLeft: 15,}}>
							<Text style={styles.contentText}> All Posts </Text>
						</View>					
		            </View>

		            <View style={styles.item}>
						<View style={{marginLeft: 15, width: 70,}}>
							<Icon
								size={20}
								name="group"/>
						</View>
						<View style={{marginLeft: 15,}}>
							<Text style={styles.contentText}> no friends to show </Text>
						</View>					
		            </View>
		        </View>
			    {add}
			    {requestToAdd}
			</View>
		)
	},

	addFriend: async function(){

		this.setState({
			isLoading:true, 
		});
		try{
			let res = await UserAPIS.addFriendRequest(global.SESSION.user._id, {
				body:{
					from: global.SESSION.user.nickname,
	  				to: this.props.id,
				}
			});

			if(res){
				this.setState({
					isLoading: false, 
				});
				ToastAndroid.show(res.message, ToastAndroid.SHORT);
			}
		}catch(e){
			console.log("err",e)
		}
		
	},
});

var styles = StyleSheet.create({
	container:{
		flex:1,
		marginTop: 55,
		backgroundColor: '#f5f5ef'
	},

	avatar:{
		backgroundColor: '#ffffff',
		height: 130,
		justifyContent: 'center',
		alignItems: 'center'
	},

	info: {
		marginTop: 20,
	},

	item:{
		backgroundColor: '#ffffff',
		borderBottomWidth:0.5, 
		borderBottomColor: "#eeeeee",
		flexDirection: 'row',
		height: 35,
		alignItems : 'center'
	},

	title: {
		marginLeft: 10,
		width: 70,
	},

	titleText: {
		fontSize: 14,
	},

	content: {
		marginLeft: 20,
	},

	contentText: {
		color: "#000000",
		fontSize: 14,
	},

	add: {
		borderRadius: 5,
		backgroundColor: 'green',
		marginTop: 30,
		alignItems : 'center',
		justifyContent: 'center',
		height: 40,
		marginLeft: 20,
		marginRight: 20,
	},

	addText: {
		color: "white",
		fontSize: 16,
	},

	overlay: {
		opacity: 0.9,
	    position: 'absolute',
	    left: 0,
	    top: 130,
	    backgroundColor: '#F5FCFF',
	    width: width,
	    height: 250,
	    alignItems: 'center',
	    justifyContent: 'center',
	}  
});

module.exports = Profile;