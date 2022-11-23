const ipInput = document.querySelector(".ip-input");
const ipSubmit = document.querySelector(".ip-submit");
const ipAdd = document.querySelector(".ip-address")
const ipLocation = document.querySelector(".ip-location");
const ipTimezone = document.querySelector(".ip-timezone");
const ipIsp = document.querySelector(".ip-isp");

const secret_api = 'f62c08003cb646dcb698199c8a40cc6f';
const url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=f62c08003cb646dcb698199c8a40cc6f';
const url2 = 'https://ipgeolocation.abstractapi.com/v1/?api_key=';


const validIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

var longitude=0;
var lattitude=0;

fetch(url)
.then(res => res.json())
.then(data => {
            updateDetails(data);
            mymap.panTo(new L.LatLng(data.latitude, data.longitude));
            marker.setLatLng([data.latitude, data.longitude]).update();
})
.catch(err => {
    const Err = new Error(err);
});

ipSubmit.addEventListener('click', e => {
    e.preventDefault();
    if(ipInput.value != '' || ipInput.value != null){
        getIpDetails(ipInput.value);
    }
    ipInput.placeholder = 'Please enter an IP address';
    
})

const getIpDetails = (default_ip) =>{
    if(validIP.test(default_ip)){
        var ip_url = `${url2}${secret_api}&ip_address=${default_ip}`
        fetch(ip_url)
        .then(res => res.json())
        .then(data => {
            updateDetails(data);
            mymap.panTo(new L.LatLng(data.latitude, data.longitude));
            marker.setLatLng([data.latitude, data.longitude]).update();
        })
        .catch((res)=>{
            error = new Error(res)
            const message = err.message.split(':')
            ipInput.placeholder = message[1]; 
        })  
    }else{
        ipInput.value = '';
        ipInput.placeholder = 'Invalid ip address';
    }
    
}

const updateDetails=(data)=>{
    ipAdd.innerHTML = data.ip_address;
    ipLocation.innerHTML = `${data.city}, ${data.country}`;
    const time = data.timezone.current_time.split(':');
    ipTimezone.innerHTML = `${data.timezone.abbreviation} - ${time[0]}:${time[1]}`;
    ipIsp.innerHTML = data.connection.isp_name;
    ipInput.innerHTML = 'Search for an IP address or domain';
}

var mymap = L.map('map').setView([lattitude, longitude], 13);
var marker = L.marker([lattitude, longitude]).addTo(mymap);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1  
}).addTo(mymap)

document.addEventListener('keydown', (e) => {
    if(e.keyCode == 13 || e.key == "Enter" || e.code == "Enter"){
        ipSubmit.click();
    }
})