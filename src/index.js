const scanner = require('node-wifi-scanner');
const axios = require('axios'); 
require('dotenv').config();

async function scan(){
  let networksScanner = [];
  scanner.scan((err, networks) => {
    if (err) {
      console.error(err);
      return;
    }
    networks.map(network=>{
        const networkFound = {
            macAddress:network.mac,
            signalStrength:network.rssi,
            channel:network.channel
        };
        networksScanner.push(networkFound);
    });
  });
  const geolocationResponse = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.API_KEY_GOOGLE_MAPS}`,networksScanner);
  const geoCodingResponse =  await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${geolocationResponse.data.location.lat},${geolocationResponse.data.location.lng}&key=${process.env.API_KEY_GOOGLE_MAPS}`);
  console.log(geoCodingResponse.data.results);
}

scan();