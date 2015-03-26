/*
 * EM Slider
 *
 * class for range filter
 * Depends on library: EM Layer, Scriptaculous
 *
 */
var EM_Slider = Class.create();
EM_Slider.prototype = {
	initialize: function(options) {
		var config = Object.extend({
			min: 0,
			max: 0,
			from: 0,
			to: 0,
			query: '',
			valTpl: '',
			
			fromHandle: 'from',
			toHandle: 'to',
			track: 'track',
			spans: ['range']
		}, options || { });
		this.config = config;

		this.control = new Control.Slider([config.fromHandle, config.toHandle], config.track, {
			range:$R(config.min, config.max),
			sliderValue:[config.from, config.to],
			restricted:true,
			spans: config.spans,
			onSlide: this.onSlide.bind(this),
			onChange: this.onChange.bind(this)
		});
		
		this.onSlide([config.from, config.to]);
	},
	
	onSlide: function(value) {
		var from, to;
		/*if (value[0] > 1000 && (value[0]+1000 < value[1])){
			value[0] = value[0] - value[0]%1000;
		} else if (value[0]+1000 > value[1]) {
			value[0] = value[0] - value[0]%1000;
		}*/
		if ((0 != value[0]%1000) && (value[0] > 1000) && (value[0] + 1000 < value[1] || value[0]+1000 > value[1])) {
			value[0] = value[0] - value[0]%1000;
		}
		
		from = this.formatValue(Math.round(value[0]));

		if ((0 != value[1]%1000) && (value[1]-1000 > value[0] || value[1]-1000 < value[0])) {
			value[1] = value[1] - value[1]%1000 + 1000;
		}
		
		if (value[1] == value[0]) {
			value[1] = value[1] + 1000;
		}
		
		to = this.formatValue(Math.round(value[1]));
		
		$('from-val').update(from);
		$('to-val').update(to);
	},
	
	onChange: function(value) {
		var from, to, params;
		from = Math.round(value[0]);
		to = Math.round(value[1]);
		
		/*if (from != this.config.from &&  (from > 1000) && (from+1000 < to)) {
			from = from - from%1000;
		} else if (from + 1000 > to) {
			from = from - from%1000;
		}*/
		
		if ((0 != from%1000) && (from != this.config.from) && (from > 1000) && (from+1000 < to || from+1000 > to) ) {
			from = from -from%1000;
		}
		
		if ((0 != to%1000) && (to-1000 > from || to-1000 < from)) {
			to = to - to%1000 + 1000;
		} 
		if (from == to) {
			to = to + 1000;
		}
		
		if (from == this.config.from && to == this.config.to)
			return;
        if(from == this.config.min){
            from = ''
        }
        if(to == this.config.max){
            to = '';
        }
		var params = this.getQueryString(from, to);
		em_layer.update(params);	// global layer object
	},
	
    formatMoney: function(number, places, symbol, thousand, decimal) {
        number = number || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "$";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },
    
	formatValue: function(value) {
		return this.config.valTpl.replace('_value_', this.formatMoney(value, 0, '', '.', '.'));
	},
	
	getQueryString: function(from, to) {
		if (from == this.config.min && to == this.config.max)
			return this.config.removeUrl;	// get reset query
		return this.config.query.replace('_from_', from).replace('_to_', to);
	}
}