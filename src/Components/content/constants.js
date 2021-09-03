export const VIEW_REQUEST_CONFIG = {
	FFS: {
		title: 'Farm Field Schools',
		context: {
			url: ''
		},
		maps: {
			url: 'http://api-ffs.mahapocra.gov.in/3rd-party/ffsService/farm-fields',
		},
		data: {
			url: ''
		}
	},
	'Skymet Weather Data': {
		title: 'Weather Data',
		context: {
			url: '/weather/context',
		},
		maps: {
			urls: {
				locations: 'weather/locations'
			},
			default_layer_type: 'point',
			default_map_title: 'Weather Stations',
			default_map_renderer: 'client' // station-locations from <lon, lat>'s
		}
	}
}