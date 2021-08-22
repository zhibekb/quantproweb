const API_URL = process.env.NEXT_PUBLIC_API_URL

const BackendAPI = {

    getSymbols : function() {
      return fetch(API_URL + "/symbols").then(res => res.json());
    },

    getTickerLastClose : function(ticker) {
      return fetch(API_URL + "/symbol/"+ticker).then(res => res.json());
    },

    getTickerVolatility : function(ticker) {
      return fetch(API_URL + "/symbol/volatility/"+ticker).then(res => res.json());
    },

    calculateBlackScholesOption: function(data) {
      return fetch(
        API_URL + "/option/calculator/black-scholes",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
        }).then(res => res.json());
    },

    calculateMonteCarloOption: function(data) {
      return fetch(
        API_URL + "/option/calculator/monte-carlo",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
        }).then(res => res.json());
    }

}


export default BackendAPI;