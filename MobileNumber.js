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
			width: 190
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
					$input += '<span style="display:inline-block;text-align:center;width:'+perNumberWidth+'px;">'+that.settings.delimiter+'</span>';
				}
			});
			this.element.innerHTML = '';
			this.element.innerHTML = $input;
			if(this.settings.number){
				this.set(this.settings.number);
			}
		},
		set: function(value) {
			var $chunks = $(this.element).children('input');
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
			var $chunks = $(this.element).children('input');
			var number = '', that=this;
			$chunks.toArray().forEach(function($input, index){
				number+= $input.value;
				if(index < $chunks.length-1) {number+=that.settings.delimiter;}
			});
			return number;
		},
		isValid: function() {
			var $chunks = $(this.element).children('input'), that=this, valid=true;
			var formatArray = this.settings.format.split("-");
			var $group = $(that.element).parent();
			$chunks.toArray().forEach(function($input, index){
				if(isNaN($input.value) || $input.value.length != formatArray[index].length) {
					$group.removeClass('has-success').addClass('has-error');
					$group.find('.help-block').html("Mobile number must match the format "+that.settings.format+" and should contains only digit").removeClass('hidden');
					valid = false;
				}
			});
			if(valid) {
				$group.removeClass('has-error').addClass('has-success');
				$group.find('.help-block').html('').addClass('hidden');
			}
			return valid;
		},
		enable: function() {
			var $chunks = $(this.element).children('input');
			$chunks.toArray().forEach(function($input, index){
				$input.disabled = false;
			});
		},
		disable: function(value) {
			var $chunks = $(this.element).children('input');
			$chunks.toArray().forEach(function($input, index){
				$input.disabled = true;
			});
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
			if ($.inArray(option, ["set", "get", "isValid", "enable", "disable"]) < 0) {
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
	$.fn.mobileNumber.methods = ["set", "get", "isValid", "enable", "disable"];

})( jQuery, window, document );
