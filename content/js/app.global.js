// Global-ish variables for the mapping portion of the app

'use strict' 

const DrawerAppGlobal = {
	apiUrl: (window.location.href.includes('localhost:')) ? 'localAPI' : 'prodAPI',
	map: null,
	geocoder: null,
	baseLocation: { lat: 37.09024, lng: -95.712891 },
	currentUser: document.getElementById('txUsr') == null ? null : document.getElementById('txUsr').value,
	colors: {
		COMPATIBLE: '5c821a',
		NONCOMPATIBLE: 'eb8a44',
		VERTEBRATE: '4c474a',
		INVERTEBRATE:  '75b1a9',
		BELT: '8f61aa',
		CELL: 'ddabed'
	},
	mapDataMarkers: [],
	mapDataPolys: [],
	workMarkers: [],
	workPolys: [],


	hasHardware: false
};