<template>
    <client-only>
        <l-map
            style="z-index: 0;"
            :zoom="15"
            :center="location"
            ref="singlemap"
            attributionControl="false"
            :options="{zoomControl: false, minZoom: 11}"
        >
            <template v-for="tileUrl in tileUrls">
                <l-tile-layer :url="tileUrl" :key="tileUrl"></l-tile-layer>
            </template>
            <l-marker
                :lat-lng="location"
                @click="onMarkerClick()"
            >
            </l-marker>
        </l-map>
    </client-only>
</template>

<script>
import { apiKey } from "../../constants";
export default {
    props: ['location'],
    data() {
        return {
            tileUrls: [
                `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
                `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
            ]
        }
    },
    methods: {
        onMarkerClick() {
            this.$emit("markerselected");
        }
    }
}
</script>