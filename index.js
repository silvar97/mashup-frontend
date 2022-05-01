const axios = require("axios");
const fs = require('fs');
const http = require('http');
const endpoint = "http://localhost:8080/graphql";
const headers = {
    "content-type": "application/json",
};
const getNews = {
    "operationName": "fetchData",
    "query": `query fetchData { 
        getNewsForWaves {
            name
            title
            description
          }
            getNewsForBtc {
            name
            title
            description
          }
            getNewsForEth {
            name
            title
            description
          }
    }`,
}
const getAssets = {
    "operationName": "fetchData",
    "query": `query fetchData { 
        getAssets(currency: EURO) {
            id
            name
            price
            change
            volume
          }
    }`,
};
const getHistoryDataWaves = {
    "operationName": "fetchData",
    "query": `query fetchData { 
        getHistoricalDataForWaves(currency: EURO) {
            name
            lastRefreshed
            priceData {
              date
              price
              volume
            }
          }
          getHistoricalDataForBTC(currency: EURO) {
            name
            lastRefreshed
            priceData {
              date
              price
              volume
            }
          }
          getHistoricalDataForETH(currency: EURO) {
            name
            lastRefreshed
            priceData {
              date
              price
              volume
            }
          }
    }`,
};

async function getAssetsFunc() {

}

// console.log(response.data); // data
// console.log(response.errors); // errors if any



const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {

    fs.readFile('./index.html', function (err, html) {
        var historyData;
        var assets;
        var news;
        axios({
            url: endpoint,
            method: 'post',
            headers: headers,
            data: getHistoryDataWaves
        }).then((result) => {
            const obj = JSON.stringify(result.data);
            historyData = obj;
            console.log(historyData)
            html = html.toString().replace("%historyData%", obj);
            if (err) {
                throw err;
            }

            axios({
                url: endpoint,
                method: 'post',
                headers: headers,
                data: getAssets
            }).then((result) => {
                const obj = JSON.stringify(result.data);
                assets = obj;
                console.log(assets)
                html = html.toString().replace("%assets%", obj);
                if (err) {
                    throw err;
                }

                axios({
                    url: endpoint,
                    method: 'post',
                    headers: headers,
                    data: getNews
                }).then((result) => {
                    const obj = JSON.stringify(result.data);
                    news = obj;
                    console.log(news)
                    html = html.toString().replace("%news%", obj);
                    if (err) {
                        throw err;
                    }
                    res.end(html)
                });
            });
        });
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});