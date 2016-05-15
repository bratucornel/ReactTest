var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var Api = require('./utils/api');

var query = '';
var cities = [];
var citiesWeather = [];
var currentCity = 0;

var Weather = React.createClass({
    
    getInitialState: function() {
        return {
            weather: '',
            temp: 0,
            humidity: 0,
            wind: 0
        }
    },
    
        componentWillMount: function() {
        query = location.search.split('=')[1];
        
        if(query !== undefined) {
            cities = query.split(',');
            
            if(cities.length > 1) {
                setInterval((function(){
                    currentCity++;
                    if(currentCity === cities.length) {
                        currentCity = 0;
                    }
                    this.fetchData();
                }).bind(this), 5000);
            }
        }
        else {
            cities[0] = 'Bucharest';
        }
        
        setInterval(function(){
            citiesWeather = [];
        }, (1000*60*5));
        
        this.fetchData();
    },
    fetchData: function() {
    //getdatafromcache
    if(citiesWeather[currentCity]) {
        this.updateData();
    }
    else {
        Api.get(cities[currentCity])
        .then(function(data){
            citiesWeather[currentCity] = data;
            this.updateData();
        }.bind(this));
    }
},
updateData: function() {
    this.setState({
        weather: citiesWeather[currentCity].weather[0].id,
        temp: Math.round(citiesWeather[currentCity].main.temp - 273.15),
        humidity: Math.round(citiesWeather[currentCity].main.humidity),
        wind: Math.round(citiesWeather[currentCity].wind.speed)
    });
},

    render: function() {
//      rendermethod ???
        var weatherClass = classNames('wi wi-owm-' + this.state.weather);
        var bgColorClass = 'weather-widget ';
        
        if(this.state.temp >= 30) {
            bgColorClass += 'very-warm';
        } else if (this.state.temp > 20 && this.state.temp < 30) {
            bgColorClass += 'warm';
        } else if (this.state.temp > 10 && this.state.temp < 20) {
            bgColorClass += 'normal';
        } else if (this.state.temp > 0 && this.state.temp < 10) {
            bgColorClass += 'cold';
        } else if (this.state.temp <= 0) {
            bgColorClass += 'very-cold';
        }
        
        return <div className={bgColorClass}>
            <h1 className="city">{cities[currentCity]}</h1>
            <div className="weather">
                <i className="{weatherClass}"></i>
            </div>
            <section className="weather-details">
                <div className="temp"><span className="temp-number">{this.state.temp}</span><span className="wi wi-degrees"></span></div>
                <div className="humidity"><i className="wi wi-raindrop"></i>{this.state.humidity} %</div>
                <div className="wind"><i className="wi wi-small-craft-advisory"></i>{this.state.wind} <span className="vel">Km/h</span></div>
            </section>
        </div>
//        end
    } 
});

//assign react comp to a dom el

var element = React.createElement(Weather, {});
ReactDOM.render(element, document.querySelector('.container'));


    

