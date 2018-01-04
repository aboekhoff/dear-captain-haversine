const fs = require('fs')
const rawdata = fs.readFileSync('alaska_airports_II.json', 'utf8')
const airports = JSON.parse(rawdata)

/*
//Haversine formula 
//takes two latitude longitude pairs as inputs  and outputs d, the distance between two points in metres 
//you can assume that this formula is correct and works as expected. 
var R = 6371000; // metres
var φ1 = lat1.toRadians();
var φ2 = lat2.toRadians();
var Δφ = (lat2-lat1).toRadians();
var Δλ = (lon2-lon1).toRadians();

var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

var d = R * c;
*/

const { cos, sin, atan2, sqrt, PI } = Math 

const R = 6371000;

Number.prototype.toRadians = function(number) {
  return this.valueOf() * (PI/180)
}

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371000; // metres
  var φ1 = lat1.toRadians();
  var φ2 = lat2.toRadians();
  var Δφ = (lat2-lat1).toRadians();
  var Δλ = (lon2-lon1).toRadians();
  
  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  var d = R * c;

  return d
}

function insert(distance, airport, array) {
  array.push({ airport, distance })
  array.sort((a, b) => a.distance - b.distance)
  if (array.length > 3) { array.pop() }
}

const results = []

for (let i = 0; i < airports.length; i++) {
  const airport1 = airports[i]
  const nearest = []
  const entry = { base: airport1, nearest }

  results.push(entry)

  for (let j = 0; j < airports.length; j++) {
    if (j === i) { continue }
    const airport2 = airports[j]
    const dist = distance(airport1.Lat, airport1.Lon, airport2.Lat, airport2.Lon)
    insert(dist, airport2, nearest)
  }

  console.log(entry)
}

fs.writeFileSync('result.json', JSON.stringify(results, null, 2))