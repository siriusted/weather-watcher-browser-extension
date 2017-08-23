var app = new Vue({
  el: '#app',
  data: {
    title: 'Weather Watcher',
    isAvailable: false,
    errorMessage: '',
    weatherData: {}
  },
  computed: {
    location: function() {
      return this.weatherData.name + ', ' + this.weatherData.sys.country;
    },
    windSpeed: function() {
      return (this.weatherData.wind.speed * 3.6).toFixed(2);
    },
    description: function() {
      return this.weatherData.weather[0].description;
    },
    temperature: function() {
      return this.weatherData.main.temp;
    },
    humidity: function() {
      return this.weatherData.main.humidity;
    },
    minTemp: function() {
      return this.weatherData.main.temp_min;
    },
    maxTemp: function() {
      return this.weatherData.main.temp_max;
    },
    iconClass: function() {
      return 'owf-' + this.weatherData.weather[0].id
    }

  },
  created: function() {
    this.getPosition();
  },
  filters: {
    capitalize: function(val) {
      if (!val) return ''
      return val.toString().charAt(0).toUpperCase() + val.slice(1)
    }
  },
  methods: {
    getPosition: function() {
      var self = this;
      if (!navigator.geolocation) {
        this.location = 'Geolocation is not supported in your browser';
        return;
      }

      function success(pos) {
        const link =
          'https://api.openweathermap.org/data/2.5/weather?APPID=adfb4f4555c4ea1714b082c7f54477ee&units=metric' +
          '&lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;
        self.fetchData(link);
      }

      function error() {
        self.errorMessage = 'Unable to retrieve your location';
      }

      navigator.geolocation.getCurrentPosition(success, error);
    },

    fetchData: function(link) {
      var self = this;
      fetch(link)
        .then(function(response) {
          if (response.status !== 200) {
            self.isAvailable = false;
            self.errorMessage = 'Apparently, there is a problem. Status Code: ' + response.status;
            return;
          }

          response.json().then(function(data) {
            self.isAvailable = true;
            self.weatherData = data;
          });
        })
        .catch(function(err) {
          self.isAvailable = false;
          self.errorMessage = 'Fetch error. Status Code: ' + err;
        });
    }
  }
});