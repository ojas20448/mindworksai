const MarketController = require("../controllers/market.controller");

module.exports = (app) => {
    app.get("/api/crypto/ticker", MarketController.getTicker);
    app.get("/api/crypto/market-data", MarketController.getMarketData);
    app.get("/api/crypto/markets", MarketController.getMarkets);
    app.get("/api/crypto/ohlcv", MarketController.getOHLCV);
    app.get("/api/coins", MarketController.getCoinList);
    app.get("/api/coins/top50", MarketController.getTop50);
};
