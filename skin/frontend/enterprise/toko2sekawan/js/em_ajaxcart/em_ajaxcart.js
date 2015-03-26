/**
 * EM AjaxCart
 *
 * @license commercial software
 * @copyright (c) 2012 Codespot Software JSC - EMThemes.com. (http://www.emthemes.com)
 */

/*
 * ajaxcart javascript;
 * update date : 1/26/2013.
 */
	var em_box;
	var timeoutID;
	function ajax_add(url,param)
	{
		if(typeof param == 'undefined'){
			param ='ajax_package_name=' + $('ajax_package_name').value
				+ '&ajax_layout=' + $('ajax_layout').value
				+ '&ajax_template=' + $('ajax_template').value
				+ '&ajax_skin=' + $('ajax_skin').value;
		}
		var link = url.replace('checkout','ajaxcart').replace('wishlist/index','ajaxcart/wishlist');
		var tmp		=	url.search("in_cart");
        var isMobile = /iPhone|iPod|iPad|Phone|Mobile|Android|webOS|iPod|BlackBerry|hpwos/i.test(navigator.userAgent);
		em_box.open();
		new Ajax.Request(link, {
			parameters:param,
			onSuccess: function(data) {
				if(tmp > 0 ) {
					var host	=	find_host(url);
					window.location.href = host+'checkout/cart/';
				}
				else{
					html = data.responseText.evalJSON();
					changeHTML(html);
				}
                //add for mobile popup windows
                if (isMobile == true) {
                    jQuery('#containerDiv2').remove();
                    jQuery('.header-top > .container_24 >.inner_top > .grid_24').append('<div id=\"containerDiv2\" >' + jQuery('#containerDiv').html() + '</div>');
                    jQuery('#containerDiv2').show();
                } else {
                    em_box.close();
                    jQuery('.dropdown-cart').trigger('mouseenter');
                }

				// auto close ajaxcart
				if (EM_Theme.AJAXCART_AUTOCLOSE > 0) {
					timeoutID = setTimeout(function() {
						em_box.close();
                        if (isMobile == true) {
                            jQuery('#containerDiv2').hide();
                        }
						$('ajax_image').update('');
						$('closeLink').hide();
						$('close').hide();
						$('viewcart_button').hide();
					}, EM_Theme.AJAXCART_AUTOCLOSE*1000);
				}
			}
		});
	}

	function hoverTopCart(){

		var isMobile = /iPhone|iPod|iPad|Phone|Mobile|Android|webOS|iPod|BlackBerry|hpwos/i.test(navigator.userAgent);
		jQuery('.dropdown-cart').each(function(){
			if(isMobile==true){
				jQuery('.dropdown-cart').find('.amount').attr('href','javascript:void(0);');
				jQuery(this).unbind('click');
				var divWrapper = jQuery(this);
				jQuery(this).find('.icon.cart, .amount').click(function (e) {
					e.preventDefault();
					divWrapper.find('.cart-popup').slideToggle();
				});
				jQuery('#rightMenuIcon').removeClass('none');
				jQuery('#rightMenuIcon .cartQty').html(jQuery('#ajaxQty').text());
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
				jQuery(this)
					.bind('mouseenter', show.curry(jQuery('.cart-popup', this)))
					.bind('mouseleave', hide.curry(jQuery('.cart-popup', this)))
					.find('.cart-popup').slideUp();
			}
		});

	}
	function changeHTML(html){
		//$('ajax_loading').hide();
		$('closeLink').hide();
		//$('close').show();
		$('ajax_content').hide();
		//$$('#ajax_image').each(function (el){
		//	el.innerHTML = html.msg;
		//});

		if(html.check == 'success'){
			//$('viewcart_button').show();
            if(html.toplink){
                $$('.top-link-cart').each(function (el){
                    el.innerHTML = html.toplink;
                    el.title = html.toplink;
                });
            }

            if(html.sidebar){
                $$('.dropdown-cart').each(function (el){
                    var newElement = new Element('div');
                    newElement.update(html.sidebar);
                    var div = newElement.select('div')[0];
                    el.update(div.innerHTML);
                });
            }

			hoverTopCart();

			if(html.w_check == 1){
				var sub	=	html.w_sub;

				$$('.add-to-cart .btn-cart')[0].remove();
				if ($$('.add-to-cart .paypal-logo').length)
					$$('.add-to-cart .paypal-logo')[0].remove();
				var tmp_whish	=	$$('.add-to-cart')[0].innerHTML;
				$$('.add-to-cart')[0].update(sub.text+tmp_whish);
                if(sub.sidebar){
                    if(sub.sidebar == ""){
                        $$('.block-wishlist')[0].remove();
                    }else{
                        $$('.block-wishlist').each(function (el){
                            var newElement = new Element('div');
                            newElement.update(sub.sidebar);
                            var div = newElement.select('div')[0];
                            el.update(div.innerHTML);
                        });
                    }
                }

				var $$li = $$('.header .links li');
				if ($$li.length > 0) {
					$$li.each(function(li) {
						 var a = li.down('a');
						 var title	=	a.readAttribute('title');
						if(title.search("wishlist") > 0){
							a.setAttribute("title", sub.link);
							a.update(sub.link);
						}
					});
				}
			}
		}
		else
			$('viewcart_button').hide();
		deleteItem();
	}

	// pre-submit callback
	function showRequest(formData, jqForm, options) {
		em_box.open();
		return true;
	}

	// post-submit callback
	function showResponse(responseText, statusText, xhr, $form)  {
		changeHTML(responseText);
		// auto close ajaxcart
		if (EM_Theme.AJAXCART_AUTOCLOSE > 0) {
			timeoutID = setTimeout(function() {
				em_box.close();
				$('ajax_image').update('');
				$('closeLink').hide();
				$('close').hide();
				$('viewcart_button').hide();
			}, EM_Theme.AJAXCART_AUTOCLOSE*1000);
		}
	}

	function setLocation(url){
		if(jQuery("#enable_module").val() == 1)	window.location.href = url;
		else{
			var tam		=	url.search("checkout/cart/");
			var tam_2	=	url.search("in_cart");
			if(tam > 0){
				if(tam_2 < 0)	ajax_add(url);
				else	window.location.href = url;
			}
			else	window.location.href = url;
		}
	}

function setLocationParam(url, param){
    if(jQuery("#enable_module").val() == 1)	window.location.href = url;
    else{
        var tam		=	url.search("checkout/cart/");
        var tam_2	=	url.search("in_cart");
        if(tam > 0){
            if(tam_2 < 0)	ajax_add(url, param);
            else	window.location.href = url;
        }
        else	window.location.href = url;
    }
}

	document.observe("dom:loaded", function() {
		if(jQuery("#enable_module").val() == 1) return false;
		var containerDiv = $('containerDiv');
		if(containerDiv)
			em_box = new LightboxAJC(containerDiv);
        var options = {
			beforeSubmit:  showRequest,
			success:       showResponse,
			dataType: 'json'
		};
		jQuery('#product_addtocart_form').ajaxForm(options);
		if(em_box){
			$$('button.btn-cart').each(function(el){
				if(el.up('form#product_addtocart_form')){
					var url	=	$('product_addtocart_form').readAttribute('action');
					var link = url.replace('checkout','ajaxcart').replace('wishlist/index','ajaxcart/wishlist');
					$('product_addtocart_form').setAttribute("action", link);
					el.onclick = function(){
						jQuery('#product_addtocart_form').submit();return false;
					}
				}
				if(el.up('form#wishlist-view-form')){
					el.onclick = function(){
						var form = $('wishlist-view-form');
						var dir_up	=	el.up('#wishlist-table tr');
						var str	=	dir_up.readAttribute('id');
						var itemId	=	str.replace("item_","");
						addWItemToCart(itemId);
					}
				}
				if(el.up('form#reorder-validate-detail')){
					el.onclick = function(){
						var url	=	$('reorder-validate-detail').readAttribute('action');
						var param	=	$('reorder-validate-detail').serialize()
									+ '&ajax_package_name=' + $('ajax_package_name').value
									+ '&ajax_layout=' + $('ajax_layout').value
									+ '&ajax_template=' + $('ajax_template').value
									+ '&ajax_skin=' + $('ajax_skin').value;

						if(param.search("ajaxcart") < 0){
							if(reorderFormDetail.submit){
								if(reorderFormDetail.validator && reorderFormDetail.validator.validate()){
									ajax_add(url,param);
								}
								return false;
							}
						}
					}
				}
			});
		}
		deleteItem();
		if($('closeLink')){
			Event.observe('closeLink', 'click', function () {
				if(timeoutID!=null)
					clearTimeout(timeoutID);
				em_box.close();
				$('ajax_image').update('');
				$('ajax_loading').show();
				$('closeLink').hide();
				$('close').hide();
				$('viewcart_button').hide();

			});
		}

		if($('close')){
			Event.observe('close', 'click', function () {
				if(timeoutID!=null)
					clearTimeout(timeoutID);
				em_box.close();
				$('ajax_image').update('');
				$('ajax_loading').show();
				$('close').hide();
				$('closeLink').hide();
				$('viewcart_button').hide();
			});
		}

	});

	function deleteItem(){
		$$('a').each(function(el){
			if(el.href.search('checkout/cart/delete') != -1 && el.href.search('javascript:ajax_del') == -1){
				el.href = 'javascript:ajax_del(\'' + el.href +'\')';
			}
			if(el.up('.truncated')){
				var a	=	el.up('.truncated');
				a.observe('mouseover', function() {
					a.down('.truncated_full_value').addClassName('show');
				});
				a.observe('mouseout', function() {
					a.down('.truncated_full_value').removeClassName('show');
				});
			}
		});
	}

	function ajax_del(url){
		var check	=	$('shopping-cart-table');
		if(check){
			window.location.href =	url;
		}else{
			var tmp	=	url.search("checkout/cart/");
			var baseurl		=	url.substr(0,tmp);
			var tmp_2	=	url.search("/delete/id/")+11;
			var id		=	url.substr(tmp_2, url.length-tmp_2-1);
			var link	=	baseurl+'ajaxcart/index/delete/id/'+id;
			em_box.open();
			new Ajax.Request(link, {
				onSuccess: function(data) {
					var html = data.responseText.evalJSON();
                    if(html.toplink){
                        $$('.top-link-cart').each(function (el){
                            el.innerHTML = html.toplink;
                            el.title = html.toplink;
                        });
                    }
                    if(html.sidebar){
                        $$('.dropdown-cart').each(function (el){
                            var newElement = new Element('div');
                            newElement.update(html.sidebar);
                            var div = newElement.select('div')[0];
                            el.update(div.innerHTML);
                        });
                    }

					hoverTopCart();
					em_box.close();
					deleteItem();
				}
			});
		}

	}

	function find_host(url)
	{
		var tmp		=	url.search("checkout/cart/");
		var str		=	url.substr(0,tmp)
		return str;
	}