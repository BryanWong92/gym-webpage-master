(function($){
	$.fn.extend({
		blueberry: function(options) {

			var defaults = {
				interval: 5000,
				duration: 500,
				lineheight: 1,
				height: 'auto', 
				hoverpause: false,
				pager: true,
				nav: true, 
				keynav: true
			}
			var options =  $.extend(defaults, options);
 
			return this.each(function() {
				var o = options;
				var obj = $(this);

				var slides = $('.slides li', obj);
				var pager = $('.pager li', obj);

				var current = 0;
				var next = current+1;

				var imgHeight = slides.eq(current).find('img').height();
				var imgWidth = slides.eq(current).find('img').width();
				var imgRatio = imgWidth/imgHeight;

				var sliderWidth = 0;
				var cropHeight = 0;

				slides.hide().eq(current).fadeIn(o.duration).addClass('active');
				
				if(pager.length) {
					pager.eq(current).addClass('active');
				} else if(o.pager){
					obj.append('<ul class="pager"></ul>');
					slides.each(function(index) {
						$('.pager', obj).append('<li><a href="#"><span>'+index+'</span></a></li>')
					});
					pager = $('.pager li', obj);
					pager.eq(current).addClass('active');
				}

				if(pager){
					$('a', pager).click(function() {
						clearTimeout(obj.play);
						next = $(this).parent().index();
						rotate();
						return false;
					});
				}

				var rotate = function(){

					slides.eq(current).fadeOut(o.duration).removeClass('active')
						.end().eq(next).fadeIn(o.duration).addClass('active').queue(function(){
						
							rotateTimer();
							$(this).dequeue()
					});

					if(pager){
						pager.eq(current).removeClass('active')
							.end().eq(next).addClass('active');
					}

					current = next;
					next = current >= slides.length-1 ? 0 : current+1;
				};
				var rotateTimer = function(){
					obj.play = setTimeout(function(){
						rotate();
					}, o.interval);
				};
				rotateTimer();

				if(o.hoverpause){
					slides.hover(function(){
						clearTimeout(obj.play);
					}, function(){
						rotateTimer();
					});
				}

				var setsize = function(){
					sliderWidth = $('.slides', obj).width();
					cropHeight = Math.floor(((sliderWidth/imgRatio)/o.lineheight))*o.lineheight;

					$('.slides', obj).css({height: cropHeight});
				};
				setsize();

				$(window).resize(function(){
					setsize();
				});
				

				if(o.keynav){
					$(document).keyup(function(e){

						switch (e.which) {

							case 39: case 32: 

								clearTimeout(obj.play);

								rotate();

								break;


							case 37: 
								clearTimeout(obj.play);
								next = current - 1;
								rotate();

								break;
						}

					});
				}


			});
		}
	});
})(jQuery);