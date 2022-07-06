<script>
import _ from 'lodash';

export default {
  props: ['apiKey'],
  mounted() {
    const leaflet = require("leaflet");
    const DomEvent = leaflet.DomEvent;
    const Esri = require('esri-leaflet');
    const EsriGeocoder = require('esri-leaflet-geocoder');
    const self = this;

    const CustomGeoSearch = EsriGeocoder.Geosearch.extend({
      geocodeSuggestion: function (e) {
        e.stopPropagation();
        e.preventDefault();
      },
      geocodeSuggestionClicked: function (e) {
        EsriGeocoder.Geosearch.prototype.geocodeSuggestion.call(this, e);
        self.$emit("searchSignboard");
        self.$emit("setText", e.target.innerText);
      },
      onAdd: function(map) {
        EsriGeocoder.Geosearch.prototype.onAdd.call(this, map);
        DomEvent.addListener(this._suggestions, 'click', this.geocodeSuggestionClicked, this);
        return this._wrapper;
      }
    });

    const apiKey = '8c4e8d0a1f8647c1b8de797ba72ff169';
    EsriGeocoder.Suggest.prototype.params.key = '8c4e8d0a1f8647c1b8de797ba72ff169';
    EsriGeocoder.Geocode.prototype.params.key = '8c4e8d0a1f8647c1b8de797ba72ff169';
    EsriGeocoder.GeocodeService.prototype.metadata = function(callback, context) {
      return this._request('get', '', {
        key: '8c4e8d0a1f8647c1b8de797ba72ff169'
      }, callback, context);
    };

    let geocodeAddress = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/loc/address`,
      label: 'Address Point',
      maxResults: 15,
      supportsSuggest: true,
    });

    let geocodeBuilding = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib1000/buildings/building`,
      label: 'Building',
      maxResults: 15
    });

    let geocodeBuildingLic = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ic1000/buildinglicence`,
      label: 'Building Licence',
      maxResults: 15
    });

    let geocodeGeocomm = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/loc/geocomm`,
      label: 'Geo Community',
      maxResults: 15
    });
    let geocodePlacePoint = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib5000/poi/placepoint`,
      label: 'Place',
      maxResults: 15
    });
    let geocodePoiPoint = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib5000/poi/poipoint`,
      label: 'POI',
      maxResults: 15
    });

    let geocodeSite = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib1000/buildings/site`,
      label: 'Site',
      maxResults: 15
    });

    let geocodeSubSite = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib1000/buildings/subsite`,
      label: 'SubSite',
      maxResults: 15
    });

    let geocodeLot = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ic1000/lot`,
      label: 'LOT',
      maxResults: 15
    });

    let geocodeTenancyPoly = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc//ic1000/tenancypoly`,
      label: 'LOT',
      maxResults: 15
    });

    let geocodeGLA = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ic1000/gla`,
      label: 'GLA',
      maxResults: 15
    });

    let geocodeVGS = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ls/vacantgovsite`,
      label: 'VGS',
      maxResults: 15
    });

    let geocodeStInt = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/loc/streetintersection`,
      label: 'Streets Intersection',
      maxResults: 15
    });

    let geocodeStreets = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib1000/transportation/streetcentrelines`,
      label: 'Streets',
      maxResults: 15
    });

    let geocodeLocalControl = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/tc/localcontrol`,
      label: 'Local Control',
      maxResults: 15
    });

    let geocodeHControl = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/tc/GeodeticHControl`,
      label: 'GeodeticHControl',
      maxResults: 15
    });

    let geocodeVControl = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/tc/GeodeticVControl`,
      label: 'GeodeticVControl',
      maxResults: 15
    });

    let geocodeUtility = EsriGeocoder.geocodeServiceProvider({
      url: `https://api.hkmapservice.gov.hk/ags/gc/ib1000/utilities/utilitypoint`,
      label: 'Utility Point',
      maxResults: 50
    });

    const searchEl = new CustomGeoSearch({
      expanded: true,
      collapseAfterResult: false,
      allowMultipleResults: false,
      zoomToResult: true,
      useMapBounds: false,
      providers: [geocodeAddress, geocodeBuilding, geocodeBuildingLic, geocodeGeocomm, geocodePlacePoint, geocodePoiPoint, geocodeSite, geocodeSubSite, geocodeStInt, geocodeStreets, geocodeLot, geocodeTenancyPoly, geocodeGLA, geocodeVGS, geocodeUtility, geocodeLocalControl, geocodeHControl, geocodeVControl]
    });

    searchEl.on('results', (data) => {
      this.results = _.get(data, 'result[0]');
    });
    searchEl.addTo(this.$parent.mapObject);
  },
  render: function () {
    return null;
  }
}

</script>
