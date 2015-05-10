/** 
* @author Naveen Kumar <imnaveenyadav@gmail.com> 
* version: 1.0.0 
* https://github.com/NaveenKY/MobileNumber/
*/ 

;(function ( $, window, document, undefined ) {

	"use strict";
	var mobileNumber = "mobileNumber",
		defaults = {
			format: "XX-XXXXXXXXXX",
			delimiter: '-',
			width: 250
	};

	// The actual MobileNumber constructor
	function MobileNumber ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = mobileNumber;
		this.init();
	}

	// Avoid MobileNumber.prototype conflicts
	$.extend(MobileNumber.prototype, {
		init: function () {
			this.prepareElement();
		},
		prepareElement: function () {
			var formatArray = this.settings.format.split("-");
			var className=this.settings.className?'mobileNumberFormatter '+this.settings.className:'mobileNumberFormatter';
			var $input = '', that=this;
			var perNumberWidth = this.settings.width / this.settings.format.length;
			formatArray.forEach(function(chunk, index){
				$input += '<input type="text" id="'+that.element.id+'_'+index+'" class="'+className+'" style="width:'+perNumberWidth*chunk.length+'px;" />';
				if(index != (formatArray.length-1)) {
					$input += ' '+that.settings.delimiter+' ';
				}
			});
			this.element.innerHTML = '';
			this.element.innerHTML = $input;
		},
		set: function(value) {
			var $chunks = $(this.element).children();
			var number = value.split('-');
			if(number.length <= $chunks.length) {
				$chunks.toArray().forEach(function($input, index){
					$input.value = number[index]?number[index]:'';
				});
			} else {
				number.forEach(function(chunkValue, index){
					if(index < $chunks.length) {
						$chunks[index].value = chunkValue;
					} else {
						$chunks[$chunks.length-1].value += chunkValue;
					}
				});
			}
		},
		get: function(value) {
			var $chunks = $(this.element).children();
			var number = '';
			$chunks.toArray().forEach(function($input, index){
				number+= $input.value;
				if(index < $chunks.length-1) {number+='-';}
			});
			return number;
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn.mobileNumber = function (option, _relatedTarget) {
		var value, that=this;
	        this.each(function () {
        	    var $this = $(this),
			data = $this.data("plugin_" + mobileNumber),
	                options = $.extend({}, MobileNumber.defaults, typeof option === 'object' && option);
        	    if (typeof option === 'string') {
			if ($.inArray(option, ["set", "get"]) < 0) {
                	    throw new Error("Unknown method: " + option);
                	}
	                value = data[option](_relatedTarget);
	            }
        	    if ( !$.data( this, "plugin_" + mobileNumber  ) ) { 
        	    	$.data( this, "plugin_" + mobileNumber , new MobileNumber( this, options ) ); 
        	    }
        	});
	        return typeof value === 'undefined' ? this : value;
	};
	$.fn.mobileNumber.methods = ["set", "get"];

})( jQuery, window, document );
