$(document).ready( function() {
    $("#fl_inp").change(function(){
         var filename = $(this).val().replace(/.*\\/, "");
         $("#fl_nm").html(filename);
    });
});


$.fn.fancyMorph = function( opts ) {

	var Morphing = function( $btn, opts ) {
	  var self = this;

	  self.opts = $.extend({
		animationEffect : false,
		infobar    : false,
		buttons    : ['close'],
		smallBtn   : false,
		touch      : false,
		baseClass  : 'fancybox-morphing',
		afterClose : function() {
		  self.close();
		}
	  }, opts);

	  self.init( $btn );
	};

	Morphing.prototype.init = function( $btn ) {
	  var self = this;

	  self.$btn = $btn.addClass('morphing-btn');

	  self.$clone = $('<div class="morphing-btn-clone" />')
		.hide()
		.insertAfter( $btn );

	  // Add wrapping element and set initial width used for positioning
	  $btn.wrap( '<span class="morphing-btn-wrap"></span>' ).on('click', function(e) {
		e.preventDefault();

		self.start();
	  });

	};

	Morphing.prototype.start = function() {
	  var self = this;

	  if ( self.$btn.hasClass('morphing-btn_circle') ) {
		return;
	  }

	  // Set initial width, because it is not possible to start CSS transition from "auto"
	  self.$btn.width( self.$btn.width() ).parent().width( self.$btn.outerWidth() );

	  self.$btn.off('.fm').on("transitionend.fm webkitTransitionEnd.fm oTransitionEnd.fm MSTransitionEnd.fm", function(e) {

		if ( e.originalEvent.propertyName === 'width' ) {
		  self.$btn.off('.fm');

		  self.animateBg();
		}

	  }).addClass('morphing-btn_circle');

	};

	Morphing.prototype.animateBg = function() {
	  var self = this;

	  self.scaleBg();

	  self.$clone.show();

	  // Trigger repaint
	  self.$clone[0].offsetHeight;

	  self.$clone.off('.fm').on("transitionend.fm webkitTransitionEnd.fm oTransitionEnd.fm MSTransitionEnd.fm", function(e) {
		self.$clone.off('.fm');

		self.complete();

	  }).addClass('morphing-btn-clone_visible');
	};

	Morphing.prototype.scaleBg = function() {
	  var self = this;

	  var $clone = self.$clone;
	  var scale  = self.getScale();
	  var $btn   = self.$btn;
	  var pos    = $btn.offset();

	  $clone.css({
		top       : pos.top  + $btn.outerHeight() * 0.5 - ( $btn.outerHeight() * scale * 0.5 ) - $(window).scrollTop(),
		left      : pos.left + $btn.outerWidth()  * 0.5 - ( $btn.outerWidth()  * scale * 0.5 ) - $(window).scrollLeft(),
		width     : $btn.outerWidth()  * scale,
		height    : $btn.outerHeight() * scale,
		transform : 'scale(' + ( 1 / scale ) + ')'
	  });
	};

	Morphing.prototype.getScale = function() {
	  var $btn    = this.$btn,
		  radius  = $btn.outerWidth() * 0.5,
		  left    = $btn.offset().left + radius - $(window).scrollLeft(),
		  top     = $btn.offset().top  + radius - $(window).scrollTop(),
		  windowW = $(window).width(),
		  windowH = $(window).height();

	  var maxDistHor  = ( left > windowW / 2 ) ? left : ( windowW - left ),
		  maxDistVert = ( top > windowH / 2 )  ? top  : ( windowH - top );

	  return Math.ceil(Math.sqrt( Math.pow( maxDistHor, 2 ) + Math.pow( maxDistVert, 2 ) ) / radius );
	};

	Morphing.prototype.complete = function() {
	  var self = this;
	  var $btn = self.$btn;

	  $.fancybox.open({ src : $btn.data('src') || $btn.attr('href') }, self.opts);

	  $(window).on('resize.fm', function() {
		//self.scaleBg();
	  });
	};

	Morphing.prototype.close = function() {
	  var self   = this;
	  var $clone = self.$clone;

	  self.scaleBg();

	  $clone.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
		$clone.hide();

		self.$btn.removeClass('morphing-btn_circle');
	  });

	  $clone.removeClass('morphing-btn-clone_visible');

	  $(window).off('resize.fm');
	};

	// Init
	this.each(function() {
	  var $this = $(this);

	  if ( !$this.data("morphing") ) {
		$this.data( "morphing", new Morphing( $this, opts ) );
	  }

	});

	return this;
  };


  // Step 2: Start using it!
  // =======================

  $("[data-morphing]").fancyMorph({
	hash : 'morphing'
  });



new WOW().init();

var swiper1 = new Swiper('.swiper-container1', {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	pagination: {
		el: '.swiper-pagination'
	},
});

var swiper = new Swiper('.swiper-container-s1', {
    slideToClickedSlide: true,
	slidesPerView: 1,
	spaceBetween: 20,
	simulateTouch: true,
	effect: 'coverflow',
	grabCursor: true,
	centeredSlides: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	coverflowEffect: {
		rotate: 0,
		stretch: 0,
		depth: 300,
		modifier: 1,
		slideShadows : true,
	},
	initialSlide: 2,
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 20
		},
		480: {
			slidesPerView: 1,
			spaceBetween: 20
		},
		768: {
			slidesPerView: 1,
			spaceBetween: 20
		},
		991: {
			slidesPerView: 5,
			spaceBetween: 20
		}
	}
});

var swiper2 = new Swiper('.swiper-container-s2', {
	simulateTouch: false,
	initialSlide: 2,
	lazy: true
});

var swiper3 = new Swiper('.swiper-container-s3', {
	slidesPerView: 1,
	slideToClickedSlide: true,
	spaceBetween: 20,
	centeredSlides: true,
	initialSlide: 2,
	breakpoints: {
		320: {
			slidesPerView: 2,
			spaceBetween: 20
		},
		480: {
			slidesPerView: 3,
			spaceBetween: 20
		},
		768: {
			slidesPerView: 4,
			spaceBetween: 20
		},
		991: {
			slidesPerView: 5,
			spaceBetween: 20
		},
		1700:{
			slidesPerView: 7,
			spaceBetween: 20,
			initialSlide: 3
		}
	}
});

var swiper5 = new Swiper('.swiper-container-s5', {
	spaceBetween: 20,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		767: {
		slidesPerView: 1,
		spaceBetween: 20
		},
		991: {
		slidesPerView: 1,
		spaceBetween: 20
		},
		1000: {
			slidesPerView: 3,
			spaceBetween: 20
		}
	}
});

var swiper6 = new Swiper('.swiper-container-s6', {
	spaceBetween: 20,
	slidesPerView: 1,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		767: {
			slidesPerView: 1,
			spaceBetween: 20,
			autoHeight: true,
		},
		991: {
			slidesPerView: 2,
			spaceBetween: 20,
			autoHeight: true,
		},
		1000: {
			slidesPerView: 3,
			spaceBetween: 40
		}
	}
});

var swiper7 = new Swiper('.swiper-container-s7', {
	spaceBetween: 20,
	slidesPerView: 1,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 20
		},
		1000: {
			spaceBetween: 20,
			slidesPerView: 4,
		}
	}
});

$('#searchTopButton').click(function(){
    $('#searchTopInput').toggle('slide');
    $(this).toggleClass('active')
	return false;
});

$('.mainHeaderFlexBottomLinedownDown').on('click', function() {
	$('html,body').animate({scrollTop:$('.premium').offset().top+"px"},{duration:1E3});
});

$('.main-bottom-button2').on('click', function() {
	$('html,body').animate({scrollTop:$('.premium').offset().top+"px"},{duration:1E3});
});

$('.header1-top-burger-button').click(function(){
	$('.header1-top-burger-button-box').toggle('slideDown');
	$(this).toggleClass('active')
	return false;
});
