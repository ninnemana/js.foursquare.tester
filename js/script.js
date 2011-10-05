/* Author:

*/
var client_id = 'SSDOFH2ELO2LIXK0BFXSQLYPGJDLEH00IU0GQ25ML35ZHQYS';
var redirect_url = 'http://cloud9ide.com/ninnemana/html5-boilerplate/workspace/index.html';
var token = '';
var lat = '';
var long= '';
var map;
$(function(){
    
    if($.bbq.getState('access_token')){
        token = $.bbq.getState('access_token');
        $.bbq.pushState({}, 2);
    }else if($.bbq.getState('error')){
        var err = $.bbq.getState('error');
        alert(err);
    }else{
        auth();
    }
    
    navigator.geolocation.getCurrentPosition(function(data){
        console.log(data);
       lat = data['coords']['latitude'];
       long = data['coords']['longitude'];
       console.log(lat + ':'+long);
       map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: new google.maps.LatLng(lat, long),
          mapTypeId: google.maps.MapTypeId.ROADMAP            
        }); 
        loadVenues();
    });
});

function auth(){
    var url = 'https://foursquare.com/oauth2/authenticate?client_id=';
    url += client_id;
    url += '&response_type=token&redirect_uri='+redirect_url;
    window.location.href = url;   
}
    
function loadVenues(){
    $.getJSON('https://api.foursquare.com/v2/venues/explore?ll='+lat+','+long+ '&oauth_token='+token,{},function(data){
        venues = data['response']['groups'][0]['items'];
        console.log(venues);
        $.each(venues,function(i,venue){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(venue['venue']['location']['lat'],venue['venue']['location']['lng']),
                map: map,
                title: venue['venue']['name']
            });
        });
    });
}