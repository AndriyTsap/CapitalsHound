import { Component, OnInit } from '@angular/core';
import { CapitalsService } from './capitals.service';
declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.template.html',
    providers: [CapitalsService]
  })

export class AppComponent {
    constructor(public capitalsService: CapitalsService)  {}

    capitalsResponse: any;
    sortedCapResponse: any;
    errorMessage: any;


    ngOnInit() { 
        var mapProp = {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions( { suppressMarkers: true, suppressInfoWindows: true } );
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                }, function() {
            })
        } 
        var autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */ (
              document.getElementById('autocomplete')), {
            types: ['(cities)']
        });
        
        var capService=this.capitalsService;
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            var selectedPlace=place.geometry.location;
            var closestCap=capService.closestCapital({lat:selectedPlace.lat(), lng:selectedPlace.lng()});
            let closestCapLocation={ lat:closestCap.GeoPt[0], lng: closestCap.GeoPt[1] };

            let marker = new google.maps.Marker({
                position: closestCapLocation,
                title:"Hello World!"
            });

            marker.setMap(map);

            console.log(closestCap);

            if (place.geometry) {
                map.panTo(place.geometry.location);
                var request = {
                    origin: place.geometry.location,
                    destination: closestCapLocation,
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    optimizeWaypoints: true,
                    provideRouteAlternatives: true,
                    avoidHighways: true,
                    avoidTolls: true
                };

                directionsService.route(request, (result: any, status: any) => {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);
                        var routes = result.routes;
                        var leg = routes[0].legs;
                        var lenght = leg[0].distance.text;
                        var duration = leg[0].duration.text;
                    }
                });   
            }
        });

        var aut: any;
        aut=document.getElementById('autocomplete');
        aut.addEventListener('blur', function() {aut.value="";});

               
    }

    handleLocationError(browserHasGeolocation: any, infoWindow: any, pos: any) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                                'Error: The Geolocation service failed.' :
                                'Error: Your browser doesn\'t support geolocation.');
    }   
}
