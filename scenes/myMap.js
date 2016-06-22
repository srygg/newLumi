import React, { Component } from 'react';
var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';
var nav = require('../NavbarMixin');
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
var {Avatar, List} = require('react-native-material-design');
import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

var contents = {
  method: 'GET',
};

var MyMap = React.createClass({
  mixins: [Mapbox.Mixin, nav],

  getInitialState() {
    return {
      center: {
        latitude: 48.421495,
        longitude: -89.261693
      },
      annotations: [
        {
          coordinates: [48.421495, -89.261693],
          type: 'point',
          title: 'Important!',
          subtitle: 'Neat, this is a custom annotation image',
          id: 'marker2',
          annotationImage: {
            url: 'https://cldup.com/7NLZklp8zS.png',
            height: 25,
            width: 25
          }
        }, 
        {
          coordinates: [40.7923, -73.9178],
          type: 'point',
          title: 'Important!',
          subtitle: 'Neat, this is a custom annotation image'
        }, 
        {
          coordinates: [[40.76572150042782,-73.99429321289062],[40.743485405490695, -74.00218963623047],[40.728266950429735,-74.00218963623047],[40.728266950429735,-73.99154663085938],[40.73633186448861,-73.98983001708984],[40.74465591168391,-73.98914337158203],[40.749337730454826,-73.9870834350586]],
          type: 'polyline',
          strokeColor: '#00FB00',
          strokeWidth: 3,
          alpha: 0.5,
          id: 'foobar'
        }, 
        {
          coordinates: [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
          type: 'polygon',
          alpha:1,
          fillColor: '#FFFFFF',
          strokeColor: '#FFFFFF',
          strokeWidth: 1,
          id: 'zap'
        }
      ],
      text: null,
      places:[],
    }
  },
  onUserLocationChange(location) {
    console.log(location);
  },
  onLongPress(location) {
    console.log(location);
  },
  onOpenAnnotation(annotation) {
    console.log(annotation);
  },

  componentDidMount: function() {
     
    let innerScrollView = this._scrollView.refs.InnerScrollView;
    let scrollView = this._scrollView.refs.ScrollView;

    requestAnimationFrame(() => {
        innerScrollView.measure((innerScrollViewX, innerScrollViewY, innerScrollViewWidth, innerScrollViewHeight) => {
            scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
                var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

                if (innerScrollViewHeight < scrollViewHeight) {
                    return;
                }
                // scroll to bottom
                // this._scrollView.scrollTo({y:scrollTo});

                // scroll to top
                this._scrollView.scrollTo({y:0});
            });
        });
    });
  },

  changeText: async function(value){

   
    fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+value+'&types=geocode&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents)
      .then(function (res){
      return res.json();
    })
    .then(function (json){
      console.log("autocomplete!!!!", json.predictions);
      
      var predictions = json.predictions.map(function(item, i){
        return {
          description: item.description
        }
      });

      this.setState({
        places: predictions,
      });

    }.bind(this))
    .catch(function(err){
        console.log('err',err);
      })
  },

  click: function(){
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bg1}>
          <View style={styles.bg2}>
            <TextInput
                style={styles.textInput}
                onChangeText={this.changeText}
                value={this.state.text}   
                underlineColorAndroid='rgba(0,0,0,0)'     
                placeholder={"Search ..."}/>
          </View>
        </View>
        <ScrollView 
          ref={(component) => this._scrollView = component}
          style={{backgroundColor: '#ffffff',}}>

              {this.state.places.map((item,i)=>(

              <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
                  <TouchableOpacity onPress={() => this.click()}>                                    
                  <List            
                    primaryText={item.description}/>
                 </TouchableOpacity>
              </View>
              ))}
        
          </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
  },

  bg1: {
    backgroundColor: '#f5f5f0',
  },

  bg2: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
  },

  textInput: {
    height: 40, 
    fontSize: 18,
    // borderColor: '#ffffff', 
    padding: 4,
    borderWidth: 0,
  },
});

module.exports = MyMap;
