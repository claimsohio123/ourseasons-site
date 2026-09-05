jQuery(document).ready(function () {
    
    /*
    * lazyloads elements with default selector as '.lazyload'
    */
    lazyload();
    
    /*
    * Same Height
    */
    setTimeout(function() {
        jQuery('.ft-page-item .ft-title').matchHeight();
        jQuery('.ft-page-item .ft-desc').matchHeight();
        jQuery('.service-pages .service-item .service-title').matchHeight();
        jQuery('.service-pages .service-item .service-excerpt').matchHeight();
        jQuery('.review-posts .review-content').matchHeight();
        jQuery('.blog-post .blog-post-title').matchHeight();
        jQuery('.blog-post .blog-post-content').matchHeight();
    }, 1000);
    
    /*
    * Hero Image Slider
    */
    jQuery('.hero-slide-items').slick({
        dots: true,
        infinite: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        autoplay: true,
        pauseOnHover: false,
        lazyLoad: 'ondemand',
        autoplaySpeed: 10000,
        cssEase: 'linear',
        adaptiveHeight: true,
    });
    
    // Animate Home Slider
    var title_delay     = jQuery('.hero-slider .caption-title').attr('data-delay'),
        title_effect    = jQuery('.hero-slider .caption-title').attr('data-effect'),
        desc_delay      = jQuery('.hero-slider .caption-desc').attr('data-delay'),
        desc_effect     = jQuery('.hero-slider .caption-desc').attr('data-effect'),
        btn_delay       = jQuery('.hero-slider .caption-btn').attr('data-delay'),
        btn_effect      = jQuery('.hero-slider .caption-btn').attr('data-effect');
    
    jQuery('.caption-title.animate__animated').addClass('activate ' + title_effect).css('animation-delay', title_delay);
    jQuery('.caption-desc.animate__animated').addClass('activate ' + desc_effect).css('animation-delay', desc_delay);
    jQuery('.caption-btn.animate__animated').addClass('activate ' + btn_effect).css('animation-delay', btn_delay);
    
    jQuery('.hero-slide-items').on('afterChange', function(event, slick, currentSlide) {
        jQuery('.caption-title.animate__animated').removeClass('off');
        jQuery('.caption-desc.animate__animated').removeClass('off');
        jQuery('.caption-btn.animate__animated').removeClass('off');
        jQuery('.caption-title.animate__animated').addClass('activate ' + title_effect).css('animation-delay', title_delay);
        jQuery('.caption-desc.animate__animated').addClass('activate ' + desc_effect).css('animation-delay', desc_delay);
        jQuery('.caption-btn.animate__animated').addClass('activate ' + btn_effect).css('animation-delay', btn_delay);
    });   
    jQuery('.hero-slide-items').on('beforeChange', function(event, slick, currentSlide) {
        jQuery('.caption-title.animate__animated').removeClass('activate ' + title_effect);
        jQuery('.caption-desc.animate__animated').removeClass('activate ' + desc_effect);
        jQuery('.caption-btn.animate__animated').removeClass('activate ' + btn_effect);
        jQuery('.caption-title.animate__animated').addClass('off');
        jQuery('.caption-desc.animate__animated').addClass('off');
        jQuery('.caption-btn.animate__animated').addClass('off');
    });
    
    /*
    * Review Slider
    */
    jQuery('.review-posts.single-item').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: false,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    });
    
    jQuery('.review-posts.double-item').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: false,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
              }
            }
        ]
    });
    jQuery('.review-posts').on('afterChange', function(event, slick, currentSlide){
        if(jQuery(".review-posts .review-item").hasClass("slick-active")){
           jQuery('.review-posts .review-content').matchHeight();
        }else{
           jQuery('.review-posts .review-content').matchHeight();
        }
    });
    
    /*
    * Badges Slider
    */
    jQuery('.badge-list').slick({
        dots: false,
        infinite: true,
        speed: 500,
        fade: false,
        autoplay: false,
        autoplaySpeed: 3000,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 4,
              }
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 3,
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
              }
            }
        ]
    });
    jQuery('.badge-list').on('afterChange', function(event, slick, currentSlide){
        if(jQuery(".badge-list .badges-item").hasClass("slick-active")){
           lazyload();
        }else{
           lazyload();
        }
    });
    
    /*
    * Window Scroll
    */
    function header_scrolled() {
        var header_height = jQuery('header.site-header').outerHeight();
        if ( jQuery(this).scrollTop() > 50 )  {
            jQuery('body').addClass('window_scrolled');
            jQuery('header.site-header .top-ads').slideUp();
            jQuery('header.site-header .bottom-ads').slideUp();
        } else {
            jQuery('body').removeClass('window_scrolled');
            jQuery('header.site-header .top-ads').slideDown();
            jQuery('header.site-header .bottom-ads').slideDown();
        }
    }
    header_scrolled();
    
    /*
     * 
    */
    function site_load() {
        var header_height = jQuery('header.site-header').outerHeight();
        
        jQuery('.site-section.hero-slider').css('margin-top', header_height+'px');
        jQuery('.site-section.inner-page-banner').css('margin-top', header_height+'px');
    }
    site_load();
    
    /*
    * Back To Top
    */
    function back_to_top() {
        if ( jQuery(this).scrollTop() > 150 ) {
            jQuery('.backToTop').fadeIn();
        } else {
            jQuery('.backToTop').fadeOut();
        }
    }
    back_to_top();
    
    /*
    * Run in Window Scroll
    */
    jQuery(window).scroll(function() {
        header_scrolled();
        back_to_top();
        setTimeout(function() {
            site_load();
        }, 500);
    });

    /*
    * Run in Window resize
    */
    jQuery(window).resize(function() {
        header_scrolled();
        setTimeout(function() {
            site_load();
        }, 500);
    });

    /*
    * Run in Window Load
    */
    jQuery(window).load(function() {
        header_scrolled();
        back_to_top();
        setTimeout(function() {
            site_load();
        }, 500);
    });
    
    /*
    * Click event Back to Top
    */
    jQuery('.backToTop').click(function(){
        jQuery('html, body').animate({scrollTop : 0},800);
        return false;
    });
    
    /*
     * Hide Header Top Ads
    */
    jQuery('header.site-header .section-closed').each(function() {
        jQuery(this).click(function() {
            jQuery(this).parent().remove();
            site_load();
        });
    });
    
    /*
    * Click Show Mobile Menu
    */
    setTimeout(function() {
         jQuery('button.menu-toggle').click(function() {
            jQuery('.nav-primary').toggleClass('show');
        });
    }, 100);
    
    /*
     * More Homepage Content
    */
    jQuery('.hp-load-more').click(function() {
        jQuery(this).toggleClass('more');
        jQuery('.home-more-content').slideToggle();
        if (jQuery(this).hasClass('more')) {
            jQuery(this).html('Read Less');
        } else {
            jQuery(this).html('Read More');
        }
    });
    
    /*
    *   Widget Blog Slide Toggle
    */
    jQuery('.form-field-select select option:first-child').removeAttr('value');
    
    jQuery('.blog-sidebar-widget .blog-widget').each(function() {
    var title = jQuery(this).find('.blog-widget-title');
        jQuery(title).click(function() {
            jQuery(this).toggleClass('click');
            jQuery(this).parent().find('.list-items').slideToggle();
        });
    });
    
    /*
    * Click Show Mobile Dots Content
    */
    jQuery('.mob-dot-toggle').click(function() {
        jQuery('.mobile-dots-items').slideToggle();
    });
    
    /*
    * Close Popup Form
    */
    jQuery('.form-fields a.close').click(function(){
        jQuery('.popup-form').css('visibility', 'hidden');
        jQuery('.form-fields').removeClass('slide-form');
    });

    /*
    * Open Popup Form
    */
    jQuery('.form-popup').click(function(){
        jQuery('.popup-form').css('visibility', 'visible');
        jQuery('.form-fields').addClass('slide-form');
    });
    
    /*
    *   Form Select
    */
    jQuery('.form-field-select select option:first-child').removeAttr('value');
    
});