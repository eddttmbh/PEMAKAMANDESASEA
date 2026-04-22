var map = L.map('map', {
zoomControl: false
}).setView([1.4295,124.800],15);

L.control.zoom({
position: 'topright'
}).addTo(map);

// basemap
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var satelit = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');
L.control.layers({"OSM":osm,"Satelit":satelit}).addTo(map);

console.log(json_PETADESASEA_2);

// routing
function bukaRute(lat,lng){
window.open(`https://www.google.com/maps?q=${lat},${lng}`);
}

// tooltip + popup
function bindLayer(l,nama,html){
l.bindTooltip(nama,{sticky:true});
l.on('click',()=>l.bindPopup(html).openPopup());
}

function popupDesa(f){
return `
<h3>Desa Sea</h3>

<b>Informasi Geografis</b><br><br>

Kecamatan: ${f.properties.WADMKC || "-"}<br>
Kabupaten: ${f.properties.WADMKK || "-"}<br>
Provinsi: ${f.properties.WADMPR || "-"}<br>
Luas Wilayah: ${f.properties.LUAS || "-"} km²<br><br>
`
}

// style
function style(c){return {color:c,fillOpacity:.6};}

// layers
var kristenLayer=L.geoJSON(json_PemakamanKristenSea_3,{
style:()=>style("#00e676"),
onEachFeature:(f,l)=>{
let c=l.getBounds().getCenter();
bindLayer(l,"Kristen",`Pemakaman Kristen<br><button onclick="bukaRute(${c.lat},${c.lng})">Rute</button>`);
}
}).addTo(map);

var kristen2Layer=L.geoJSON(json_PemakamanSeaKristen_5,{
style:()=>style("#00b0ff"),
onEachFeature:(f,l)=>{
let c=l.getBounds().getCenter();
bindLayer(l,"Kristen 2",`Pemakaman Kristen 2<br><button onclick="bukaRute(${c.lat},${c.lng})">Rute</button>`);
}
}).addTo(map);

var islamLayer=L.geoJSON(json_PemakamanSeaIslam_4,{
style:()=>style("#ff9100"),
onEachFeature:(f,l)=>{
let c=l.getBounds().getCenter();
bindLayer(l,"Islam",`Pemakaman Islam<br><button onclick="bukaRute(${c.lat},${c.lng})">Rute</button>`);
}
}).addTo(map);

var desaLayer = L.geoJSON(json_PETADESASEA_2,{
style:{color:"#999"},
onEachFeature:(f,l)=>{

l.bindTooltip("Desa Sea",{sticky:true});

l.on('click',()=>{
l.bindPopup(popupDesa(f)).openPopup();
});

}
}).addTo(map);

// highlight
function highlight(layer){
layer.eachLayer(l=>{
l.setStyle({weight:4});
setTimeout(()=>l.setStyle({weight:2}),1000);
});
}

// zoom
function zoomToLayer(t){
if(t==="kristen"){map.fitBounds(kristenLayer.getBounds());highlight(kristenLayer);}
if(t==="kristen2"){map.fitBounds(kristen2Layer.getBounds());highlight(kristen2Layer);}
if(t==="islam"){map.fitBounds(islamLayer.getBounds());highlight(islamLayer);}

if(t==="desa"){
let f=json_PETADESASEA_2.features.filter(x=>x.properties.WADMKK==="Minahasa");
let tmp=L.geoJSON(f);
map.fitBounds(tmp.getBounds(),{maxZoom:16});
highlight(desaLayer);
}
}

map.on("mousemove", function(e){

let lat = e.latlng.lat.toFixed(5);
let lng = e.latlng.lng.toFixed(5);

document.getElementById("coordinate-info").innerHTML =
`Lat: ${lat} | Lng: ${lng}`;

});

map.on("move", function(){
document.getElementById("compass").style.transform = "rotate(0deg)";
});

// toggle layer
function toggleLayer(t,cb){
let l={kristen:kristenLayer,kristen2:kristen2Layer,islam:islamLayer,desa:desaLayer}[t];
cb.checked?map.addLayer(l):map.removeLayer(l);
}

// filter
function filterKategori(v){
map.addLayer(kristenLayer);
map.addLayer(kristen2Layer);
map.addLayer(islamLayer);

if(v==="kristen") map.removeLayer(islamLayer);
if(v==="islam"){
map.removeLayer(kristenLayer);
map.removeLayer(kristen2Layer);
}
}

// mode
function toggleMode(){
document.body.classList.toggle("light");
}

// sidebar
function toggleSidebar(){
const sidebar = document.getElementById("sidebar");
sidebar.classList.toggle("collapsed");
}
