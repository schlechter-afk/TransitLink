import "mapbox-gl/dist/mapbox-gl.css";
import * as React from "react";
import "./renderMap.css";
import mapboxgl from "mapbox-gl";
import { Navigate, useNavigate } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2NobGVjaHRlciIsImEiOiJjbGdqYmV0enAwMHp1M2RxcW41cHlzaGgwIn0.ZOqUOagi52sjIg3_bLSYdQ";

export default function RenderMap(props) {
  const queryString = window.location.search;
  const urlSearchParams = new URLSearchParams(queryString);
  const addresses = urlSearchParams.getAll("addresses");
  console.log(addresses);
  const navigate = useNavigate();

  if(addresses.length == 2){
  var address1 = addresses[0];
  var address2 = addresses[1];

  console.log(address1, address2);

  var area1, area2, city1, city2, state1, state2, country1, country2;

  var address1_parts = address1.split(",");
  area1 = address1_parts[0];
  city1 = address1_parts[1];
  state1 = address1_parts[2];
  country1 = address1_parts[3];

  var address2_parts = address2.split(",");
  area2 = address2_parts[0];
  city2 = address2_parts[1];
  state2 = address2_parts[2];
  country2 = address2_parts[3];}

  const [to, setTo] = React.useState(null);
  const [from, setFrom] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function get_val() {
    const res = await fetch(
      `http://api.positionstack.com/v1/forward?access_key=ee3971df95dbf67d21afac82eb97036d&query=1600 ${area1} ${city1} ${state1} ${country1}`,
      {
        method: "GET",
      }
    );
    const resp = await res.json();

    console.log("labda", resp);
    const toPoint = [resp.data[0].longitude, resp.data[0].latitude];
    setTo(toPoint);
    const res2 = await fetch(
      `http://api.positionstack.com/v1/forward?access_key=ee3971df95dbf67d21afac82eb97036d&query=1600 ${area2} ${city2} ${state2} ${country2}`,
      {
        method: "GET",
      }
    );
    const resp2 = await res2.json();
    const fromPoint = [resp2.data[0].longitude, resp2.data[0].latitude];
    setFrom(fromPoint);

    const res3 = await fetch(
      `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${resp.data[0].latitude},${resp.data[0].longitude}&destinations=${resp2.data[0].latitude},${resp2.data[0].longitude}&travelMode=driving&key=Ai1TzwjShWGCR98HfRW_6gRDbEJfescVr3DBRwpRkmsnHm0ZiJYgDbnSyqsUGKe_`,
      {
        method: "GET",
      }
    );
    const resp3 = await res3.json();
    console.log(
      "dist",
      resp3.resourceSets[0].resources[0].results[0].travelDistance
    );
    setDistance(resp3.resourceSets[0].resources[0].results[0].travelDistance);

    setLoading(true);

    console.log("exit");
    console.log(toPoint, fromPoint, distance);
  }

  React.useEffect(() => {
    if(addresses.length < 2){
      console.log("entry");
      navigate("/quoterequests")
    }
    get_val();
  }, []);

  React.useEffect(() => {
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/mapbox/streets-v11",
      center: [79.384, 21.101],
      zoom: 5,
    });

    map.on("load", () => {
      if (to && from) {
        var greenMarker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(to)
          .addTo(map);

        var purpleMarker = new mapboxgl.Marker({ color: "green" })
          .setLngLat(from) 
          .addTo(map); 
      }
    });

    console.log("dist", distance);

    if (distance !== null) {
      var value = document.getElementById("map-overlay");
      value.innerHTML = "Distance: " + distance.toFixed([2]) + " kms";
    }
  }, [loading]);

  return (
    <div id="map-container">
      <div id="map"></div>
      <div id="map-overlay">Distance: </div>
    </div>
  );
}