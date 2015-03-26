/**
 * EMThemes
 *
 * @license commercial software
 * @copyright (c) 2012 Codespot Software JSC - EMThemes.com. (http://www.emthemes.com)
 */

(function($) {

EM_Theme = {
	PRODUCTSGRID_ITEM_WIDTH: 370,
	PRODUCTSGRID_ITEM_SPACING: 90,
	CROSSSELL_ITEM_WIDTH: 250,
	CROSSSELL_ITEM_SPACING: 90,
	UPSELL_ITEM_WIDTH: 250,
	UPSELL_ITEM_SPACING: 90
};



if (typeof EM == 'undefined') EM = {};
if (typeof EM.tools == 'undefined') EM.tools = {};


var isMobile = /iPhone|iPod|iPad|Phone|Mobile|Android|hpwos/i.test(navigator.userAgent);
var isPhone = /iPhone|iPod|Phone|Android/i.test(navigator.userAgent);


var domLoaded = false, 
	windowLoaded = false, 
	last_adapt_i, 
	last_adapt_width;


/**
 * Auto positioning product items in products-grid
 *
 * @param (selector/element) productsGridEl products grid element
 * @param (object) options
 * - (integer) width: width of product item
 * - (integer) spacing: spacing between 2 product items
 */
EM.tools.decorateProductsGrid = function (productsGridEl, options) {
/*	var $productsGridEl = $(productsGridEl);
	
	if ($productsGridEl.length == 0) return;
	
	var columnCount = Math.floor(($productsGridEl.outerWidth() + options.spacing) / (options.width + options.spacing));
	$productsGridEl.css({'position':'relative'});
	
	for (var i = 0; i < 30; i++) $('.item', $productsGridEl).removeClass('item-col-'+i);
            
	var maxHeight = 0;
	var i = 0;
	$('.item', $productsGridEl).each(function() {
		var prev = $(this).prevAll('.item-col-' + i).first();
        if(prev.length > 0){
            var top = prev.position().top + 380;
        }else{
            var top = 10;
        }
		
		$(this).addClass('item-col-'+i)
			.css({
				'position': 'absolute',
				'width': options.width + 'px',
				'left': 10 + i * (options.spacing + options.width) + 'px',
				'top': top + 'px'
			});
			
		maxHeight = Math.max(maxHeight, $(this).position().top + $(this).outerHeight(true));

		if (++i >= columnCount) i = 0;
	});
	
	$productsGridEl.css({
		'height': maxHeight + options.spacing + 'px'
	});
*/
}

/**
 * Decorate Product Tab
 */ 
EM.tools.decorateProductCollateralTabs = function() {
	$(document).ready(function() {
			if($('.tab-block').length > 1){
            $('.product-collateral').each(function(i) {
			$(this).wrap('<div class="tabs_wrapper_detail collateral_wrapper" />');
            $(this).prepend('<ul class="tabs_control"></ul>');
            $(this).children(".product-collateral-item").addClass("ui-slider-tabs-content-container");
//			var tabs_control = $(document.createElement('ul')).addClass('tabs_control').insertBefore(this);

			$('.tab-block', this).addClass('tab-item').each(function(j) {
				var id = 'box_collateral_'+i+'_'+j;
				$(this).addClass('content_'+id);
                $(this).attr('id',id);
				$('.tabs_wrapper_detail ul').append('<li><a href="#'+id+'">'+$('h2', this).html()+'</a></li>');
			});
            $("div.tabs_wrapper_detail .product-collateral").sliderTabs({
                autoplay: false,
                indicators: true,
                panelArrows: true,
                tabHeight: 32,
                panelArrowsShowOnHover: true
            });
			//initToggleTabs(tabs_wrapper);
		});
		
		// update products position after tab showed
		/*
		$('.tab-block.box-up-sell.tab-item').bind('emtabshow', function() {
			EM.tools.decorateProductsGrid('#upsell-product-table .products-grid', {
				width: EM_Theme.UPSELL_ITEM_WIDTH,
				spacing: EM_Theme.UPSELL_ITEM_SPACING
			});
		});
		*/
		}
	});
};



/**
 * Fix iPhone/iPod auto zoom-in when text fields, select boxes are focus
 */
function fixIPhoneAutoZoomWhenFocus() {
	var viewport = $('head meta[name=viewport]');
	if (viewport.length == 0) {
		$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>');
		viewport = $('head meta[name=viewport]');
	}
	
	var old_content = viewport.attr('content');
	
	function zoomDisable(){
		viewport.attr('content', old_content + ', user-scalable=0');
	}
	function zoomEnable(){
		viewport.attr('content', old_content);
	}
	
	$("input[type=text], textarea, select").mouseover(zoomDisable).mousedown(zoomEnable);
}

/**
 * Adjust elements to make it responsive
 *
 * Adjusted elements:
 * - Image of product items in products-grid scale to 100% width
 */
function responsive() {
	
	// resize products-grid's product image to full width 100% {{{
	var position = $('.products-grid .item').css('position');
	if (position != 'absolute' && position != 'fixed' && position != 'relative')
		$('.products-grid .item').css('position', 'relative');
		
	var img = $('.products-grid .item .product-image img');
	if (!(img.parent().parent().parent().parent().hasClass("category-products"))){
		img.each(function() {
			img.data({
				'width': $(this).width(),
				'height': $(this).height()
			})
		});
		img.removeAttr('width').removeAttr('height').css('width', '100%');
	};
	$('.custom-logo').each(function() {
		$(this).css({
			'max-width': $(this).width(),
			'width': '100%'
		});
	});
}

window.onresize = function(){
	if (typeof em_slider!=='undefined')
        em_slider = new EM_Slider(em_slider.config);
	if (($('#image')!=null)&& (product_zoom != null)){
		$('#image').width(product_zoom.imageDim.width);
        Event.stopObserving($('#zoom_in'), 'mousedown', product_zoom.startZoomIn.bind(product_zoom));
        Event.stopObserving($('#zoom_in'), 'mouseup', product_zoom.stopZooming.bind(product_zoom));
        Event.stopObserving($('#zoom_in'), 'mouseout', product_zoom.stopZooming.bind(product_zoom));

        Event.stopObserving($('#zoom_out'), 'mousedown', product_zoom.startZoomOut.bind(product_zoom));
        Event.stopObserving($('#zoom_out'), 'mouseup', product_zoom.stopZooming.bind(product_zoom));
        Event.stopObserving($('#zoom_out'), 'mouseout', product_zoom.stopZooming.bind(product_zoom));

		//$('#image').height(product_zoom.imageDim.height);
		product_zoom = new Product.Zoom('image', 'track', 'handle', 'zoom_in', 'zoom_out', 'track_hint');;
	}

    var sliderShow = $('#full-width-slider');
    var sliderW = sliderShow.width();
    var sliderh = sliderW/(746/348);
    sliderShow.css('height',sliderh);
    sliderShow.find('.rsOverflow').css('height',sliderh);

    fixAD();
}
function persistentMenu(){

	$(function () {
		$(window).scroll(function () {
			window.freezedTopMenu = (isPhone!=1 && EM_Theme.FREEZED_TOP_MENU) ? 1: 0;
			if ($(this).scrollTop() > 145 && window.freezedTopMenu) {
				$('.hnav').parent(".em_nav").first().addClass('fixed-top');
			} else {
				$('.hnav').parent(".em_nav").first().removeClass('fixed-top');
			}
		});
	});
}
/**
 * Function called when layout size changed by adapt.js
 */
function whenAdapt(i, width) {
	$('body').removeClass('adapt-0 adapt-1 adapt-2 adapt-3 adapt-4 adapt-5 adapt-6')
		.addClass('adapt-'+i);
//    h($("body").attr("class"));

	//disable freezed top menu when in iphone
	window.freezedTopMenu = (isMobile!=1 && EM_Theme.FREEZED_TOP_MENU) ? 1: 0;
	
	if (window.freezedTopMenu && $(window).scrollTop() > 145) {
		$('.hnav').parent(".em_nav").first().addClass('fixed-top');
	} else {
		$('.hnav').parent(".em_nav").first().removeClass('fixed-top');
	}	
	/*EM.tools.decorateProductsGrid('.category-products .products-grid', {
		width: EM_Theme.PRODUCTSGRID_ITEM_WIDTH,
		spacing: EM_Theme.PRODUCTSGRID_ITEM_SPACING
	});
	EM.tools.decorateProductsGrid('#upsell-product-table .products-grid', {
		width: EM_Theme.UPSELL_ITEM_WIDTH,
		spacing: EM_Theme.UPSELL_ITEM_SPACING
	});
	EM.tools.decorateProductsGrid('#crosssell-products-list', {
		width: EM_Theme.CROSSSELL_ITEM_WIDTH,
		spacing: EM_Theme.CROSSSELL_ITEM_SPACING
	});*/
}

// Back to top
function backToTop(){
    // hide #back-top first
	$("#back-top").hide();
	
	// fade in #back-top
	
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#back-top').fadeIn();
		} else {
			$('#back-top').fadeOut();
		}
	});

	// scroll body to 0px on click
	$('#back-top a').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});

}
/**
 * Callback function called when stylesheet is changed by adapt.js
 */
ADAPT_CONFIG.callback = function(i, width) {
        last_adapt_i = i;
        last_adapt_width = width;
        whenAdapt(last_adapt_i, last_adapt_width);
    };

    function fixAD (){
        var winWidth = $(window).width();
        var leftAd=$('.fixAD .left');
        var rightAd=$('.fixAD .right');
        if(winWidth >= (leftAd.width()+rightAd.width()+1040)){
            leftAd.css('left',(winWidth/2-500-leftAd.width()-20));
            rightAd.css('right',(winWidth/2-500-rightAd.width()-20));
            leftAd.show();
            rightAd.show();
        }
        else{
            leftAd.hide();
            rightAd.hide();
        }
    }

function toolbarSearch(){

	$('.cat-search').each(function(){
		$(this).insertUlCategorySearch();
		$(this).selectUlCategorySearch();
	});
    $('.select-language').each(function(){
        $(this).insertUl();
        $(this).selectUl();
    });
    $('.currency').each(function(){
        $(this).insertUl();
        $(this).selectUl();
    });

}

/**
*   Add class mobile
**/
function addClassMobile(){
    if(isMobile == true){
        jQuery('body').addClass('mobile-view');
    }
}

function hoverTopCart(){
	$(function($) {
		
		$('.dropdown-cart').each(function(){
			if(isMobile==true){
				$('.dropdown-cart').find('.amount').attr('href','javascript:void(0);');	
				$(this).unbind('click');
				var divWrapper = $(this);
				$(this).find('.icon.cart,.amount').click(function (e) {
					e.preventDefault();
					divWrapper.find('.cart-popup').slideToggle();
				});
			} else{
				var tm;
				function show(el) {
					clearTimeout(tm);
					tm = setTimeout(function() {
						el.slideDown();
					}, 200);
				}
				function hide(el) {
					clearTimeout(tm);
					tm = setTimeout(function() {
						el.slideUp();
					}, 200);
				}
				$(this)
					.bind('mouseenter', show.curry($('.cart-popup', this)))
					.bind('mouseleave', hide.curry($('.cart-popup', this)))
					.find('.cart-popup').slideUp();
			}
		});
		
	});
}

$(document).ready(function() {
	registrationSuccessTracker();
	domLoaded = true;  
	isMobile && fixIPhoneAutoZoomWhenFocus();
	alternativeProductImage();
	setupReviewLink();
	// safari hack: remove bold in h5, .h5
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		$('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').css('font-weight', 'normal');
	}
	addClassMobile();
	toogleStore();
	hoverTopCart();
	if($('.wrapper').hasClass('em-box-custom')){
		if($('body').hasClass('adapt-0')){
			$('.wrapper').removeClass('em-box-custom');
		}
		$(window).bind('emadaptchange',function(){
			if($('body').hasClass('adapt-0')){
				$('.wrapper').removeClass('em-box-custom');
			} else {
				$('.wrapper').addClass('em-box-custom');
			}
		});	
	}

	if (EM_Theme.FREEZED_TOP_MENU) persistentMenu();	
    backToTop();
    widthSizeDashReplace();
    

    // $('.cms-index-index').fancybox
    // var urlParam = window.location.pathname;
    // var popupUrlRegex = "/(/+\w+/)+(popup-registration)/g";
    // urlParam.match(/(/+\w+/)+popup-registration/g);
    // console.log(popupUrlRegex == urlParam);
    // if(popupUrlRegex != urlParam){
	    
	// }
    
    
    //sort_list('.super-attribute-select');
});

$(window).bind('load', function() {
	windowLoaded = true;
	responsive();
	whenAdapt(last_adapt_i, last_adapt_width);
	em0075();
    fixAD ();
	//initIsotope();
	if(jQuery('body').viewPC()){
        toolbarSearch();
		toolbar();
	}
    if((!isPhone)&&!($("body").hasClass("adapt-0")==true)){
        if(jQuery('.cart_search_wrapper').length > 0){
            jQuery('.cart_search_wrapper').stickUp();
        }
    };
//    if((isMobile)&&($("body").hasClass("adapt-0")==true)){
//    if(($("body").hasClass("adapt-0")==true)){
        $(".menuleft li.level0 a.level-top.visible-phone").click(function(){
            $(this).toggleClass("open");
        });
        $(".menuleft li.level1 > a.visible-phone").click(function(){
            $(this).toggleClass("open");
        });
//    };

//    jQuery(window).resize(function(){
//        alert(last_adapt_i+','+last_adapt_width);
//        whenAdapt(last_adapt_i, last_adapt_width);
//    });

    var sliderShow = $('#full-width-slider');
    var sliderW = sliderShow.width();
    var sliderh = sliderW/(746/348);
    sliderShow.css('height',sliderh);
    sliderShow.find('.rsOverflow').css('height',sliderh);
    sliderShow.find('.rsImg').css('width',sliderW);
    sliderShow.find('.rsImg').css('height',sliderh);
    sliderShow.find('.rsImg').css('margin-left',0);
});


})(jQuery);

/**
 * Change the alternative product image when hover
 */
function alternativeProductImage() {
    var tm;
    function swap() {
        clearTimeout(tm);
        setTimeout(function() {
            el = $(this).find('img[data-alt-src]');
            var newImg = jQuery(el).data('alt-src');
            var oldImg = jQuery(el).attr('src');
            jQuery(el).attr('src', newImg).data('alt-src', oldImg);
        }.bind(this), 200);
    }

    jQuery('.item .product-image img[data-alt-src]').parents('.item').bind('mouseenter', swap).bind('mouseleave', swap);
}

function showAgreementPopup(e) {
	
	//jQuery('#checkout-agreements .agreement-content').show();
	//$('agreement-content-popup').show();
		
	jQuery('#checkout-agreements label.a-click').parent().parent().children('.agreement-content').show()
		.css({
			'left': (parseInt(document.viewport.getWidth()) - jQuery('#checkout-agreements label.a-click').parent().parent().children('.agreement-content').width())/2 +'px',
			'top': (parseInt(document.viewport.getHeight()) - jQuery('#checkout-agreements label.a-click').parent().parent().children('.agreement-content').height())/2 + 'px'
		});
	
};

/**
 *   After Layer Update
 **/
window.afterLayerUpdate = function () {
    if(jQuery('body').viewPC()){
        toolbar();
    }
    alternativeProductImage();
    initIsotope();
    qs({
        itemClass: '.products-grid li.item, .products-list li.item, li.item .cate_product, .product-upsell-slideshow li.item, .mini-products-list li.item, #crosssell-products-list li.item', //selector for each items in catalog product list,use to insert quickshop image
        aClass: 'a.product-image', //selector for each a tag in product items,give us href for one product
        imgClass: '.product-image img' //class for quickshop href
    });
}


function hideAgreementPopup(e) {
	//$('opc-agreement-popup-overlay').hide();
	jQuery('#checkout-agreements .agreement-content').hide();
	
};

function initSlider(e,verticals) {
    var wraps;
	if (verticals == null){
		verticals=false;
    }
	
	var widthcss = jQuery( e + ' li.item').width();
	var rightcss = jQuery( e + ' li.item').outerWidth(true)- jQuery( e + ' li.item').outerWidth();
	jQuery(e).addClass('jcarousel-skin-tango');
	jQuery(e).parent().append('<div class="slide_css">');
	jQuery(e).parent().find('.slide_css').html('<style type="text/css">'+e+' .jcarousel-item {width:' + widthcss + 'px;margin-right:'+ rightcss +'px;}</style>');
	//jQuery('#<?php echo $idJs;?>_css').html('<style type="text/css">#<?php echo $idJs;?> .jcarousel-skin-tango .jcarousel-item {width:' + width_<?php echo $idJs;?> + 'px;}</style>');
	//$('.jcarousel-skin-tango .jcarousel-item').css('width',  width>');
	jQuery(e).jcarousel({
		buttonNextHTML:'<a class="next" href="javascript:void(0);" title="Next"></a>',
		buttonPrevHTML:'<a class="previous" href="javascript:void(0);" title="Previous"></a>',
		scroll: 1,
		animation:'slow',
		vertical:verticals,
		initCallback: function (carousel) {
			var context = carousel.container.context;
            jQuery(context).touchwipe({
				wipeLeft: function() { 
					carousel.next();
				},
				wipeRight: function() { 
					carousel.prev();
				},
				preventDefaultEvents: false
			});
			jQuery(window).bind('emadaptchange orientationchange', function() {
				setTimeout(function(){
					carousel.reload();
					carousel.scroll(1,true);
					carousel.funcResize();
				},300); 
				}); 
			jQuery(window).resize(function(){
				setTimeout(function(){
					carousel.reload();
				},300); 
				}); 
		}
	});
	

}

/**
*   showReviewTab
**/
function showReviewTab() {
	
	var reviewTab = jQuery('.tabs_control li:contains('+ review +')');
	if (reviewTab.size()) {
		// scroll to review tab
		jQuery('html, body').animate({
			 scrollTop: reviewTab.offset().top
		}, 500);
		 
		 // show review tab
		reviewTab.click();
	} else if (jQuery('#customer-reviews').size()) {
		// scroll to customer review
		jQuery('html, body').animate({ scrollTop: jQuery('#customer-reviews').offset().top }, 500);
	} else {
		return false;
	}
	return true;
};

/**
*   setupReviewLink
**/
function setupReviewLink() {
	jQuery('.r-lnk').click(function (e) {
		if (showReviewTab())
			e.preventDefault();
	});
}

function toolbar(){

    jQuery('.show').each(function(){
    	jQuery(this).insertUl();
    	jQuery(this).selectUl();
    });
    jQuery('.sortby').each(function(){
        //$(this).insertTitle();
    	jQuery(this).insertUl();
    	jQuery(this).selectUl();
    });
}

/* js for theme */
function em0075(){
	var tagul = jQuery(".widget-home ul.products-grid");
	tagul.each(function(){
		var tagli = jQuery(this).find("li.item");
		var heightli = 0;
		tagli.each(function(){
			if (heightli < jQuery(this).height())
				heightli = jQuery(this).height();
		})
		tagli.css("min-height",heightli+"px");
	})
}

function toogleStore(){
    	//initSlider('#slider_storeview ul', null);
  
    	jQuery('.storediv').hide(); 
    	jQuery(".btn_storeview").click(function() {
		store_show();        
	});
	
    	jQuery(".btn_storeclose").click(function() {
		store_hide();
	});
	
	function store_show(){            
		var bg	=	jQuery("#bg_fade_color");
		bg.css("opacity",0.5);
		bg.css("display","block");    		
        var top =( jQuery(window).height() - jQuery(".storediv").height() ) / 2;
        var left = ( jQuery(window).width() - jQuery(".storediv").width() ) / 2;
        jQuery(".storediv").show();
        jQuery(".storediv").css('top', top+'px');
        jQuery(".storediv").css('left', left+'px');
	}
	
	function store_hide(){
		var bg	=	jQuery("#bg_fade_color");
		jQuery(".storediv").hide();
		bg.css("opacity",0);
		bg.css("display","none");
	}
};
/* Isotope */
function initIsotope(){
	if(!checkPhone){	
	var itemwidth = jQuery('.category-products ul.products-grid li').first().width();
	
	jQuery.Isotope.prototype._getMasonryGutterColumns = function() {
	    var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
	        containerWidth = this.element.width();
	  
	    this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
	                  // or use the size of the first item
	                  this.$filteredAtoms.outerWidth(true) ||
	                  // if there's no items, use size of container
	                  containerWidth;

	    this.masonry.columnWidth += gutter;

	    this.masonry.cols = Math.floor( ( containerWidth + gutter ) / this.masonry.columnWidth );
	    this.masonry.cols = Math.max( this.masonry.cols, 1 );
	  };

	  jQuery.Isotope.prototype._masonryReset = function() {
	    // layout-specific props
	    this.masonry = {};
	    // FIXME shouldn't have to call this again
	    this._getMasonryGutterColumns();
	    var i = this.masonry.cols;
	    this.masonry.colYs = [];
	    while (i--) {
	      this.masonry.colYs.push( 0 );
	    }
	  };

	  jQuery.Isotope.prototype._masonryResizeChanged = function() {
	    var prevSegments = this.masonry.cols;
	    // update cols/rows
	    this._getMasonryGutterColumns();
	    // return if updated cols/rows is not equal to previous
	    return ( this.masonry.cols !== prevSegments );
	  };
	jQuery('.category-products ul.products-grid').isotope({
		itemSelector : '.item',
		masonry : {
	      },
		    layoutMode : EM_Theme.PRODUCTSGRID_POSITION_ABSOLUTE
	});

	}
	
}
// jquery to fix product weight and size to dash if equal  than 1 g and 0cmx0cmx0cm

function widthSizeDashReplace() {
	jQuery('#product-attribute-specs-table tr.odd > td.last').each(function() {
        	var content = jQuery.trim(jQuery(this).html());
        	content.trim();
        	if(content == '1 g' || content == '0cm x 0cm x 0cm' || content == '0 g' || content == 'cm x cm x cm' ) {
            		jQuery(this).html('-')
        	}
    	});
}
// jquery to fix size options ordering 

function sort_list(elem) {
	var selectOptions = jQuery(elem + ' option');
	var selectedOption = jQuery(elem).val();

	selectOptions.sort(function(a, b) {
	if (parseInt(a.text) > parseInt(b.text)) {
		return 1;
		}
		else if (parseInt(a.text) < parseInt(b.text)) {
			return -1;
		}
		else {
			return 0
		}
	});
	jQuery(elem).empty().append(selectOptions)
	jQuery(elem).val(selectedOption);
}
// registration success tracker
function registrationSuccessTracker() {
	if(jQuery('.messages > .success-msg').text() == 'Thank you for registering with toko2sekawan.com.') {
		_gaq.push(['_trackEvent', 'Notification', 'Registration', "Registration Successfull"]);
	}
		return false
}
(function($){

	// Defining our jQuery plugin

	$.fn.toko2sekawanModal = function(prop){

		// Default parameters

		var options = $.extend({
			height : "250",
			width : "500",
			title:"JQuery Modal Box Demo",
			description: "Example of how to create a modal box.",
			top: "20%",
			left: "30%",
			right: "30%"
		},prop);
				
		return this.click(function(e){
			add_block_page();
			add_popup_box();
			add_styles();
			
			$('.toko2sekawan_modal_box').fadeIn();
		});
		
		 function add_styles(){			
			$('.toko2sekawan_modal_box').css({ 
				'position':'absolute', 
				'left':options.left,
				'right':options.right,
				'top':options.top,
				'display':'none',
				'height': options.height + 'px',
				'width': options.width + 'px',
				'border':'1px solid #fff',
				'box-shadow': '0px 2px 7px #292929',
				'-moz-box-shadow': '0px 2px 7px #292929',
				'-webkit-box-shadow': '0px 2px 7px #292929',
				'border-radius':'10px',
				'-moz-border-radius':'10px',
				'-webkit-border-radius':'10px',
				'background': '#f2f2f2', 
				'z-index':'50',
			});
			$('.toko2sekawan_modal_close').css({
				'position':'relative',
				'top':'-25px',
				'left':'20px',
				'float':'right',
				'display':'block',
				'height':'50px',
				'width':'50px',
			});
                        /*Block page overlay*/
			var pageHeight = $(document).height();
			var pageWidth = $(window).width();

			$('.toko2sekawan_block_page').css({
				'position':'absolute',
				'top':'0',
				'left':'0',
				'background-color':'rgba(0,0,0,0.6)',
				'height':pageHeight,
				'width':pageWidth,
				'z-index':'10'
			});
			$('.toko2sekawan_inner_modal_box').css({
				'background-color':'#fff',
				'height':(options.height - 50) + 'px',
				'width':(options.width - 50) + 'px',
				'padding':'10px',
				'margin':'15px',
				'border-radius':'10px',
				'-moz-border-radius':'10px',
				'-webkit-border-radius':'10px'
			});
		}
		
		 function add_block_page(){
			var block_page = $('<div class="toko2sekawan_block_page"></div>');
						
			$(block_page).appendTo('body');
		}
		 		
		 function add_popup_box(){
			 var pop_up = $('<div class="toko2sekawan_modal_box"><a href="#" class="toko2sekawan_modal_close"></a><div class="toko2sekawan_inner_modal_box"><h2>' + options.title + '</h2><p>' + options.description + '</p></div></div>');
			 $(pop_up).appendTo('.toko2sekawan_block_page');
			 			 
			 $('.toko2sekawan_modal_close').click(function(){
				$(this).parent().fadeOut().remove();
				$('.toko2sekawan_block_page').fadeOut().remove();				 
			 });
		}
		

		return this;
	};
	
})(jQuery);


