/* ----------------------------------------------------------
 *
 * Percentage Circles - pcirc-1.0.js - 1 April 2016
 * Created by Matthew Lord
 * http://www.webdesignlord.com
 *
 * ---------------------------------------------------------- */

$.fn.pcirc = function(opts) {		
	$(this).each(function(){	
		if (typeof opts == "undefined") { opts = new Object(); } 	
		if (typeof opts.backgroundColor == "undefined") { opts.backgroundColor = "eee"; } else { opts.backgroundColor.replace("#",""); }
		if (typeof opts.primaryColor == "undefined") { opts.primaryColor = "006bb2"; } else { opts.primaryColor.replace("#",""); }
		if (typeof opts.secondaryColor == "undefined") { opts.secondaryColor = "e1e1e1"; } else { opts.secondaryColor.replace("#",""); }
		if (typeof opts.hoverColor == "undefined") { opts.hoverColor = "ccc"; } else { opts.hoverColor.replace("#",""); }	
		if (typeof opts.size == "undefined") { opts.size = "10"; }	
		if (typeof opts.width == "undefined") { opts.width = "130"; }
		if (typeof opts.showText == "undefined") { opts.showText = 1; }	
		if (typeof opts.circleText == "undefined") { opts.circleText = ""; }
		if (typeof opts.imgClass == "undefined") { opts.imgClass = 0; }	
		if (typeof opts.animate == "undefined") { opts.animate = 0; }		
		if (typeof opts.animateTime == "undefined") { opts.animateTime = 600; }		
		
		if (typeof $(this).data("percent") !== "undefined") {
			displayPercent = $(this).data("percent"); 
		} else { 				
			if (typeof opts.percent == "undefined") { 
				displayPercent = "0"; 
			}  else {
				displayPercent = opts.percent;
			}
		}
		displayPercent = Math.round(displayPercent);		
		if (displayPercent>100) {
			displayPercent = 100;
		}				
		
		if (opts.circleText=="") {
			displayCircleText = displayPercent + "%";
		} else {
			displayCircleText = opts.circleText;
		}
		
		html = [
			'<div class="pcirc-wrap">',
				'<div class="pcirc-border" data-animate="'+opts.animate+'" data-percent="'+displayPercent+'" data-primary="'+opts.primaryColor+'" data-secondary="'+opts.secondaryColor+'">',
					'<div class="pcirc-circle">',
						'<div class="pcirc-display'+(opts.imgClass!=0?' circle-icon '+opts.imgClass:'')+'">'+displayCircleText+'</div>',
					'</div>',
				'</div>',
				'<div class="pcirc-label"></div>',
			'</div>'
		];
		
		output = html.join('');
		
		labelText = $(this).html();
		$(this).html(output);		
		label = $(this).find(".pcirc-label");	
		percent = Math.floor(360*(displayPercent/100));	
		//console.log(percent);
		
		border = $(this).find(".pcirc-border");			
		circle = $(this).find(".pcirc-circle");	
		display = $(this).find(".pcirc-display");
		if (typeof opts.label !== "undefined") {				
			label.html(opts.label);
		} else {			
			label.html(labelText);
		}
		
		if (label.html()=="") {
			label.hide();
		}
		
		circleSize = opts.width-(opts.size*2);
		
		border.css("width",opts.width+"px");
		border.css("height",opts.width+"px");
		border.css("background","#"+opts.primaryColor);		
		
		circle.css("width",circleSize+"px");
		circle.css("height",circleSize+"px");	
		circle.css("margin-top",-(circle.outerHeight()/2)); 
		circle.css("margin-left",-(circle.outerWidth()/2));	
		circle.css("background-color","#"+opts.backgroundColor);
		//console.log(circle);
		
		display.css("margin-top",-(display.outerHeight()/2)); 
		display.css("margin-left",-(display.outerWidth()/2)); 
		if (opts.showText==0) {
			display.html("");
		}
				
		if (!opts.animate) {		
			if (percent <= 180) {
				border.css('background-image','linear-gradient(' + (90+percent) + 'deg, transparent 50%, #'+opts.secondaryColor+' 50%),linear-gradient(90deg, #'+opts.secondaryColor+' 50%, transparent 50%)');		
			} else {
				border.css('background-image','linear-gradient(' + (percent-90) + 'deg, transparent 50%, #'+opts.primaryColor+' 50%),linear-gradient(90deg, #'+opts.secondaryColor+' 50%, transparent 50%)');		
			}		
		} else {
			border.css('background-image','linear-gradient(' + 90 + 'deg, transparent 50%, #'+opts.secondaryColor+' 50%),linear-gradient(90deg, #'+opts.secondaryColor+' 50%, transparent 50%)'); //Default of 0%.
			var animate = new Object();
			animate.animateTimeout = 10;
			animate.border = border;
			animate.count = 0;
			animate.percent = percent;
			animate.primaryColor = opts.primaryColor;
			animate.secondaryColor = opts.secondaryColor;
			animate.animateTime = opts.animateTime;
			animate.currentTime = 0;
			animate.animateSteps = ((animate.animateTimeout*percent)/opts.animateTime);				
			pcircAnimate(animate);
		}
	});	
};

$.fn.pcircUpdate = function(opts) {
	if (typeof opts == "undefined") { opts = new Object(); } 	
	if (typeof opts.percent == "undefined") { opts.percent = -1; }	
	if (opts.percent != -1) {		
		if (opts.percent>100) {
			opts.percent = 100;
		}
		percent = Math.floor(360*(opts.percent/100));
		border = $(this).find(".pcirc-border");
		display = $(this).find(".pcirc-display");
		primaryColor = border.data("primary");
		secondaryColor = border.data("secondary");		
		origPercent = border.data("percent");
		isAnimate = border.data("animate");
		originalPercent = Math.floor(360*(origPercent/100));
		border.data("percent",opts.percent);		
		if (typeof opts.label != "undefined") {
			label = $(this).find(".pcirc-label");	
			label.html(opts.label);
		}
		
		if (display.html()!="") {
			display.html(opts.percent+"%");
		}
		//console.log("starting...");
		if (originalPercent != percent) {
			if (isAnimate) {
				var animate = new Object();
				animate.animateTimeout = 20;
				animate.border = border;
				animate.count = originalPercent;
				animate.percent = percent;
				animate.primaryColor = primaryColor;
				animate.secondaryColor = secondaryColor;
				animate.animateTime = 200;
				animate.currentTime = 0;
				animate.animateSteps = ((animate.animateTimeout*Math.abs(originalPercent-percent))/animate.animateTime);				
				pcircAnimate(animate);
			} else {
				if (percent <= 180) {
					border.css('background-image','linear-gradient(' + (90+percent) + 'deg, transparent 50%, #'+secondaryColor+' 50%),linear-gradient(90deg, #'+secondaryColor+' 50%, transparent 50%)');		
				} else {
					border.css('background-image','linear-gradient(' + (percent-90) + 'deg, transparent 50%, #'+primaryColor+' 50%),linear-gradient(90deg, #'+secondaryColor+' 50%, transparent 50%)');		
				}
			}	
		} else {
			//console.log("no change");
		}
	}	
};

function pcircAnimate(opts) {	
	setTimeout(function(){	
		if (opts.currentTime == 0) {
			//console.log(Math.round(opts.count));
		}
		if (opts.currentTime <= opts.animateTime) {			
			if (opts.count <= 180) {
				opts.border.css('background-image','linear-gradient(' + Math.round(90+opts.count) + 'deg, transparent 50%, #'+opts.secondaryColor+' 50%),linear-gradient(90deg, #'+opts.secondaryColor+' 50%, transparent 50%)');		
			} else {
				opts.border.css('background-image','linear-gradient(' + Math.round(opts.count-90) + 'deg, transparent 50%, #'+opts.primaryColor+' 50%),linear-gradient(90deg, #'+opts.secondaryColor+' 50%, transparent 50%)');		
			}			
			opts.currentTime = opts.currentTime + opts.animateTimeout;
			if (opts.count < opts.percent) {
				opts.count = opts.count + opts.animateSteps;
			} else {
				opts.count = opts.count - opts.animateSteps;
			}
			pcircAnimate(opts);						
		} else {
			//console.log(Math.round(opts.count));
		}	
	},opts.animateTimeout);
}