
const BackendAPI = {

    getSymbols : function() {
      return fetch("http://localhost:5000/symbols").then(res => res.json());
    },

    getTickerLastClose : function(ticker) {
      return fetch("http://localhost:5000/symbol/"+ticker).then(res => res.json());
    },

    getTickerVolatility : function(ticker) {
      return fetch("http://localhost:5000/symbol/volatility/"+ticker).then(res => res.json());
    },

    calculateBlackScholesOption: function(data) {
      return fetch(
        "http://localhost:5000/option/calculator/black-scholes",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
        }).then(res => res.json());
    }
}

export default BackendAPI;