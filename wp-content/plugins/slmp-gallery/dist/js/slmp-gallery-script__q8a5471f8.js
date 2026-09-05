/**
*	SLMP JS
*/

jQuery(document).ready(function ($) {

    /*
    * SLMP Video Popup
    */
    function run_video_popup() {
        $('.slmp-popup-video-section button').click(function() {
            $('.slmp-video-item-popup').remove();
            $('.slmp-popup-video-section').hide();
        });

        $('.slmp-play-icon').each(function() {
            $(this).click(function() {
                var vid_type    = $(this).attr('data-type');
                var vid_url     = $(this).attr('data-video');

                jQuery('.slmp-popup-video-section').show();

                if ( vid_type == 'youtube' ) {
                    $('.slmp-popup-video-section .slmp-popup-video-wrap').append('<div class="slmp-video-item-popup"><iframe width="600" height="400" src="'+ vid_url +'" frameborder="0" allow="autoplay" allowfullscreen></iframe></div>');
                }
                if ( vid_type == 'local' ) {
                    $('.slmp-popup-video-section .slmp-popup-video-wrap').append('<div class="slmp-video-item-popup"><video autoplay="" controls="" preload="auto" src="'+ vid_url +'"></video></div>');
                }
            });
        });

    }
    run_video_popup();

    /*
    *   AJAX SLMP Gallery Popup Request
    */
    function activate_popup_images(container, ajax_call_request) {
        $(container).each(function() {
            var parent          = $(this),
                gallery_id      = $(parent).attr('gallery-id'),
                gallery_type    = $(parent).attr('gallery-type'),
                items           = $(parent).find('.slmp-image-item'),
                category        = $(parent).find('.slmp-cat-title.active'),
                dp_item         = $(parent).find('.slmp-cat-drop-down');

            $(items).each(function() {

                var item_list = $(this),
                    click_img = $(this).find('.slmp-image');

                $(click_img).click(function() {

                    var id          = $(parent).attr('gallery-id'),
                        type        = $(parent).attr('gallery-type'),
                        data_id     = $(item_list).attr('data-id'),
                        cat         = $(category).attr('data-cat'),
                        dp_cat      = $(parent).find('.slmp-cat-drop-down').val(),
                        d_key       = $(this).attr('data-key');

                    $('.slmp-popup-image').show();
                    $('.slmp-popup-image-item').removeClass('active');

                    $.ajax({
                        url: ajax_object.ajax_url,
                        type: 'POST',
                        dataType: 'json',
                        data: ({
                            action: ajax_call_request,
                            id : id,
                            type : type,
                            cat : cat,
                            dp_cat : dp_cat,
                            d_key : d_key,
                        }),
                        beforeSend: function() {
                            $('.slmp-popup-slide-left, .slmp-popup-slide-right, .slmp-popup-image-count, .slmp-popup-close').addClass('hide');
                            $('.slmp-popup-image-items').append('<img src="/wp-content/plugins/slmp-gallery/dist/images/ajax_loader.gif">');
                            $('.slmp-popup-image-items img:not(:first-child').remove();
                        },
                        success: function(result){

                            $('.slmp-popup-image-items').empty();

                            var result_count    = result.length;

                            $.each(result, function() {
                                var html = '<div class="slmp-popup-image-item slmp-relative" id="slmp-'+ type +'-item-'+ this.img_id +'-'+ id +'">';
                                    html += '<img src="'+ this.url +'" alt="'+ this.alt +'" title="'+ this.title +'" width="'+ this.width +'" height="'+ this.height +'">';
                                    html += '<div class="popup-image-title">'+ this.title +'</div>';
                                    html += '</div>';

                                $('.slmp-popup-image-items').append(html);
                            });

                            if ( type == 'album' || type == 'album_slide' || type == 'album_category' ) {
                                $('.slmp-popup-image-item:first-child').addClass('active');
                            } else {
                                $('#'+data_id).addClass('active');
                            }

                            $('.slmp-popup-image-count, .slmp-popup-close').removeClass('hide');


                            var current_count   = $('.slmp-popup-image-count span#item-count'),
                                total_count     = $('.slmp-popup-image-count span#total-count'),
                                current_active  = $('.slmp-popup-image-item.active').index();

                            if ( result_count > 1 ) {
                                $('.slmp-popup-slide-left, .slmp-popup-slide-right').removeClass('hide');
                            }

                            var count_item_html = '<div class="item-popup-count"><span id="item-count">'+ (current_active+1) +'</span>/<span id="total-count">'+ result_count +'</span></div>';

                            $('.slmp-popup-image-count').append(count_item_html);
                            $('.slmp-popup-image-count .item-popup-count:not(:first-child)').remove();
                        }
                    });
                });
            });

        });
    };
    activate_popup_images('.slmp-gallery', 'slmp_popup_image_request');


    /*
    *   Category Click AJax
    */
    function ajax_category_click_request(container) {
        $(container).each(function() {
            var parent              = $(this),
                gallery_type        = $(parent).attr('gallery-type'),
                gallery_id          = $(parent).attr('gallery-id'),
                items               = $(parent).find('.slmp-cat-title');

            $(items).each(function() {
                var item = $(this);

                $(item).click(function() {
                    var cat     = $(this).attr('data-cat'),
                        id      = gallery_id,
                        type    = gallery_type;

                    $(items).removeClass('active');
                    $(this).addClass('active');

                    $.ajax({
                        url: ajax_object.ajax_url,
                        type: 'POST',
                        dataType: 'json',
                        data: ({
                            action: 'slmp_category_request',
                            id : id,
                            cat : cat,
                            type : type,
                        }),
                        beforeSend: function() {
                            $(parent).find('.slmp-gallery-load-more').hide();
                            $(parent).find('.slmp-display-image').empty();
                            $(parent).find('.slmp-category-loader').append('<img src="/wp-content/plugins/slmp-gallery/dist/images/ajax_loader.gif">');
                        },
                        success: function(result){

                            $(parent).find('.slmp-category-loader').empty();

                            $.each(result, function() {

                                var html = '<div class="slmp-col-'+ this.column +' slmp-image-item '+ this.zoom +' slmp-site-flex slmp-justify-content-center-center slmp-relative" data-id="slmp-'+ gallery_type +'-item-'+ this.img_id +'-'+ gallery_id +'">';
                                    html += '<div class="slmp-image slmp-site-flex slmp-justify-content-center-center slmp-relative" data-key="'+ this.key +'">';
                                    html += '<div class="slmp-'+ gallery_type +'-image slmp-text-center slmp-relative">';
                                    html += '<img src="'+ this.url +'" alt="'+ this.alt +'" title="'+ this.title +'">';
                                    html += '</div>';
                                    if ( this.dp_title == true ) {
                                        html += '<div class="slmp-image-label slmp-text-center">'+ this.title +'</div>';
                                    }
                                    if ( this.dp_icon == true ) {
                                        html += '<div class="slmp-image-hover-icon"></div>';
                                    }
                                    html += '</div>';
                                    if ( this.al_title ) {
                                        html += '<div class="slmp-album-title slmp-text-center slmp-relative">'+ this.al_title +'</div>';
                                    }
                                    if ( this.al_desc ) {
                                        html += '<div class="slmp-album-description slmp-text-center slmp-relative">'+ this.al_desc +'</div>';
                                    }
                                    html += '</div>';

                                $(parent).find('.slmp-display-image').append(html);
                                

                            });
                            activate_popup_images('.slmp-gallery', 'slmp_popup_image_request');
                            
                            // Load More Image
                            $('.slmp-gallery').each(function() {
                                var new_ths         = $(this),
                                    new_img_item    = $(new_ths).find('.slmp-image-item'),
                                    new_clk         = $(new_ths).find('.slmp-gallery-load-more'),
                                    new_data_show   = $(new_clk).attr('data-show'),
                                    new_data_load   = $(new_clk).attr('data-load');
                                    new_r_more      = new_img_item.length;

                                if ( new_r_more <= new_data_show  ) {
                                    jQuery(new_clk).hide();
                                } else {
                                    jQuery(new_clk).show();
                                }

                                jQuery(new_img_item).slice(0, new_data_show).show().css('display', 'block');
                                
                            });
                        }
                    });

                });
            });
        });
    };
    ajax_category_click_request('.slmp-category-gallery');
    ajax_category_click_request('.slmp-album-category-gallery');


    /*
    *   Category Select AJax
    */
    function ajax_category_select_request(container) {
        $(container).each(function() {
            var parent              = $(this),
                gallery_type        = $(parent).attr('gallery-type'),
                gallery_id          = $(parent).attr('gallery-id'),
                items               = $(parent).find('.slmp-cat-drop-down');

            $(items).change(function() {
                var cat     = $(this).val(),
                    id      = gallery_id,
                    type    = gallery_type;

                $.ajax({
                    url: ajax_object.ajax_url,
                    type: 'POST',
                    dataType: 'json',
                    data: ({
                        action: 'slmp_category_request',
                        id : id,
                        cat : cat,
                        type : type,
                    }),
                    beforeSend: function() {
                        $(parent).find('.slmp-gallery-load-more').hide();
                        $(parent).find('.slmp-display-image').empty();
                        $(parent).find('.slmp-category-loader').append('<img src="/wp-content/plugins/slmp-gallery/dist/images/ajax_loader.gif">');
                    },
                    success: function(result){

                        $(parent).find('.slmp-category-loader').empty();

                        $.each(result, function() {

                            var html = '<div class="slmp-col-'+ this.column +' slmp-image-item '+ this.zoom +' slmp-site-flex slmp-justify-content-center-center slmp-relative" data-id="slmp-'+ gallery_type +'-item-'+ this.img_id +'-'+ gallery_id +'">';
                                html += '<div class="slmp-image slmp-site-flex slmp-justify-content-center-center slmp-relative" data-key="'+ this.key +'">';
                                html += '<div class="slmp-'+ gallery_type +'-image slmp-text-center slmp-relative">';
                                html += '<img src="'+ this.url +'" alt="'+ this.alt +'" title="'+ this.title +'">';
                                html += '</div>';
                                if ( this.dp_title == true ) {
                                    html += '<div class="slmp-image-label slmp-text-center">'+ this.title +'</div>';
                                }
                                if ( this.dp_icon == true ) {
                                    html += '<div class="slmp-image-hover-icon"></div>';
                                }
                                html += '</div>';
                                if ( this.al_title ) {
                                    html += '<div class="slmp-album-title slmp-text-center slmp-relative">'+ this.al_title +'</div>';
                                }
                                if ( this.al_desc ) {
                                    html += '<div class="slmp-album-description slmp-text-center slmp-relative">'+ this.al_desc +'</div>';
                                }
                                html += '</div>';

                            $(parent).find('.slmp-display-image').append(html);

                        });
                        activate_popup_images('.slmp-gallery', 'slmp_popup_image_request');
                        
                        // Load More Image
                        $('.slmp-gallery').each(function() {
                            var new_ths         = $(this),
                                new_img_item    = $(new_ths).find('.slmp-image-item'),
                                new_clk         = $(new_ths).find('.slmp-gallery-load-more'),
                                new_data_show   = $(new_clk).attr('data-show'),
                                new_data_load   = $(new_clk).attr('data-load');
                                new_r_more      = new_img_item.length;

                            if ( new_r_more <= new_data_show  ) {
                                jQuery(new_clk).hide();
                            } else {
                                jQuery(new_clk).show();
                            }

                            jQuery(new_img_item).slice(0, new_data_show).show().css('display', 'block');
                            
                        });
                    }
                });

            });
        });
    };
    ajax_category_select_request('.slmp-category-gallery');
    ajax_category_select_request('.slmp-album-category-gallery');


    /*
    *   Gallery Before After
    */
    function bf_slide(container) {
        $(container).each(function() {
            var parent      = $(this),
                img_list    = $(parent).find('.slmp-bf-image');

            $(img_list).each(function(e) {
                var item_parent     = $(this),
                    img_bf_h        = $(this).find('img.before-bf-img').height(),
                    img_bf_w        = $(this).find('img.before-bf-img').width(),
                    slider          = $(this).find('.slmp-bf-slider'),
                    slider_btn      = $(this).find('.slmp-bf-slider-button'),
                    slide_value     = slider.val(),
                    slidePos        = ( slide_value / 100 ) * img_bf_w;

                $(this).css({
                    'height' : img_bf_h+'px',
                });

                $(slider_btn).css('left', `calc(${slide_value}% - 18px)`);
                $(this).find('img.before-bf-img').css('clip', 'rect(0px, '+ slidePos +'px, '+ img_bf_h +'px, 0px)');
                $(this).find('img.after-bf-img').css('clip', 'rect(0px, '+ img_bf_w +'px, '+ img_bf_h +'px, '+ slidePos +'px)');

                $(slider).on('input change', function(e) {
                    var sliderPos = e.target.value,
                        arrow_pos = ( sliderPos / 100 ) * img_bf_w;

                    $(slider_btn).css('left', `calc(${sliderPos}% - 18px)`);
                    $(item_parent).find('img.before-bf-img').css('clip', 'rect(0px, '+ arrow_pos +'px, '+ img_bf_h +'px, 0px)');
                    $(item_parent).find('img.after-bf-img').css('clip', 'rect(0px, '+ img_bf_w +'px, '+ img_bf_h +'px, '+ arrow_pos +'px)');

                    $(slider).css('background', 'transparent');

                    if ( sliderPos < 20 ) {
                        $(item_parent).find('.slmp-bf-before-label').css('opacity', '0');
                    } else if ( sliderPos > 80 ) {
                        $(item_parent).find('.slmp-bf-after-label').css('opacity', '0');
                    } else {
                        $(item_parent).find('.slmp-bf-label').css('opacity', '1');
                    }

                });

                $(this).mouseenter(function() {
                    $(item_parent).find('.slmp-bf-label').css('opacity', '1');
                    $(slider).css('background', 'rgba(0, 0, 0, 0.50)');
                }).mouseleave(function() {
                    $(item_parent).find('.slmp-bf-label').css('opacity', '0');
                    $(slider).css('background', 'transparent');
                });


            }); 

        });
    }
    bf_slide('.slmp-bf-gallery');
    bf_slide('.slmp-bf-slide-gallery');

    $(window).on('load, resize', function() {
        bf_slide('.slmp-bf-gallery');
        bf_slide('.slmp-bf-slide-gallery');
    });


	/*
	*	Popup Close
	*/
	$('.slmp-popup-close').click(function(){
        $('.slmp-popup-image-items').empty();
        $('.slmp-popup-image-count').empty();
        $('.slmp-popup-image-item').removeClass('active');
        $('.slmp-popup-image').hide();
        $('.slmp-category-loader').empty();
    });


    /*
	*	Right Arrow Click
	*/
    function right_arrow_click() {
        $('.slmp-popup-slide-right').click(function () {
            var parent      = $('.slmp-popup-image-items'),
                active      = $('.slmp-popup-image-item.active'),
                last_item   = $(active).is(":last-child"),
                first_item  = $(".slmp-popup-image-item").first(),
                next        = $(active).next(),
                item_index  = next.index() + 1;

                $('.slmp-popup-image-count span#item-count').empty();

            if (last_item) {
                $(active).removeClass("active");
                $(parent).children(":first").addClass("active");
                $('.slmp-popup-image-count span#item-count').append(first_item.index() + 1);
            } else {
                $(active).removeClass("active").next().addClass("active");
                $('.slmp-popup-image-count span#item-count').append(item_index);
            }
        });
    }
    right_arrow_click();


    /*
	*	Left Arrow Click
	*/
    function left_arrow_click() {
    	$('.slmp-popup-slide-left').click(function () {
            var parent 		= $('.slmp-popup-image-items'),
                active 		= $('.slmp-popup-image-item.active'),
                first_item 	= $(active).is(":first-child"),
                last_item 	= $(".slmp-popup-image-item").last(),
                preview 	= $(active).prev(),
                item_index 	= preview.index() + 1;

                $('.slmp-popup-image-count span#item-count').empty();

            if (first_item) {
    	        $(active).removeClass("active");
            	$(parent).children(":last").addClass("active");
            	$('.slmp-popup-image-count span#item-count').append(last_item.index() + 1);
            } else {
            	$(active).removeClass("active").prev().addClass("active");
            	$('.slmp-popup-image-count span#item-count').append(item_index);
            }
        });
    }
    left_arrow_click();


    /*
    *   Load More Images
    */
    function slmp_load_more_image(container) {
        $(container).each(function() {
            var list_items     = $(this).find('.slmp-image-item'),
                more_btn       = $(this).find('.slmp-gallery-load-more'),
                item_display   = $(more_btn).attr('data-show'),
                item_count     = $(list_items).length;

            if ( item_count <= item_display  ) {
                $(more_btn).hide();
            } else {
                $(more_btn).show();
            }

            $(list_items).slice(0, item_display).show().css('display', 'block');

            $(more_btn).on('click', function (e) {
                var btn_parent  = $(this).parent(),
                    new_load    = $(this).attr('data-load'),
                    hidden      = $(btn_parent).find('.slmp-image-item:hidden'),
                    last        = $(btn_parent).find('.slmp-image-item:last');

                e.preventDefault();

                $(hidden).slice(0, new_load).slideDown().css('display', 'block').addClass('to-show');

                if ( $(hidden).length == 0 ) {
                    $(this).fadeOut('slow');
                }

                if ( $(last).hasClass('to-show') ) {
                    $(this).hide();
                }
            });

        });
    }
    slmp_load_more_image('.slmp-grid-gallery');
    slmp_load_more_image('.slmp-category-gallery');
    slmp_load_more_image('.slmp-album-gallery');
    slmp_load_more_image('.slmp-album-category-gallery');


    /*
    *   Gallery Slick Slide Slider
    */
    function gallery_slide_slider(container) {
        $(container).each(function() {
            var attrs               = $(this).find('.slmp-row'),
                item_toSlick        = $(this).find('.slmp-display-image'),
                arrow_left          = $(this).find('.slmp-slide-left-arrow'),
                arrow_right         = $(this).find('.slmp-slide-right-arrow');
            let d_dots              = ( $(attrs).attr('data-dots') === 'true' ? true : false ),
                d_infinite          = ( $(attrs).attr('data-infinite') === 'true' ? true : false ),
                d_fade              = ( $(attrs).attr('data-fade') === 'true' ? true : false ),
                d_focus             = ( $(attrs).attr('data-focus') === 'true' ? true : false ),
                d_pause             = ( $(attrs).attr('data-pause') === 'true' ? true : false ),
                d_autoplay          = ( $(attrs).attr('data-autoplay') === 'true' ? true : false ),
                d_adaptive          = ( $(attrs).attr('data-adaptive') === 'true' ? true : false ),
                d_center            = ( $(attrs).attr('data-center') === 'true' ? true : false ),
                d_slides_show       = parseInt($(attrs).attr('data-slides-show')),
                d_slides_scroll     = parseInt($(attrs).attr('data-slides-scroll')),
                d_speed             = parseInt($(attrs).attr('data-speed')),
                d_autoplay_speed    = parseInt($(attrs).attr('data-autoplay-speed')),
                d_first_breakpoint  = parseInt($(attrs).attr('data-first-breakpoint')),
                d_first_show        = parseInt($(attrs).attr('data-first-show')),
                d_first_scroll      = parseInt($(attrs).attr('data-first-scroll')),
                d_second_breakpoint = parseInt($(attrs).attr('data-second-breakpoint')),
                d_second_show       = parseInt($(attrs).attr('data-second-show')),
                d_second_scroll     = parseInt($(attrs).attr('data-second-scroll')),
                d_third_breakpoint  = parseInt($(attrs).attr('data-third-breakpoint')),
                d_third_show        = parseInt($(attrs).attr('data-third-show')),
                d_third_scroll      = parseInt($(attrs).attr('data-third-scroll'));


            $(item_toSlick).slick({
                dots: d_dots,
                infinite: d_infinite,
                fade: d_fade,
                adaptiveHeight: d_adaptive,
                autoplay: d_autoplay,
                pauseOnHover: d_pause,
                centerMode: d_center,
                slidesToShow: d_slides_show,
                slidesToScroll: d_slides_scroll,
                autoplaySpeed: d_autoplay_speed,
                speed: d_speed,
                prevArrow: arrow_left,
                nextArrow: arrow_right,
                responsive: [
                    { breakpoint: d_first_breakpoint, settings: { slidesToShow: d_first_show, slidesToScroll: d_first_scroll } },
                    { breakpoint: d_second_breakpoint, settings: { slidesToShow: d_second_show, slidesToScroll: d_second_scroll } },
                    { breakpoint: d_third_breakpoint, settings: { slidesToShow: d_third_show, slidesToScroll: d_third_scroll } },
                ],
            });
        });
    };
    gallery_slide_slider('.slmp-slide-gallery');
    gallery_slide_slider('.slmp-album-slide-gallery');
    gallery_slide_slider('.slmp-video_slide-gallery');
        

    /*
    *   Gallery Slick Navigation Slider
    */
    $('.slmp-navigation-gallery').each(function() {
        var attrs               = $(this).find('.slmp-navigation-image-items'),
            item_nav            = $(this).find('.slmp-navigation-display-image'),
            item_nav_for        = $(this).find('.slmp-display-nav-item-image'),
            arrow_left          = $(this).find('.slmp-slide-left-arrow'),
            arrow_right         = $(this).find('.slmp-slide-right-arrow');
        let d_dots              = ( $(attrs).attr('data-dots') === 'true' ? true : false ),
            d_infinite          = ( $(attrs).attr('data-infinite') === 'true' ? true : false ),
            d_fade              = ( $(attrs).attr('data-fade') === 'true' ? true : false ),
            d_focus             = ( $(attrs).attr('data-focus') === 'true' ? true : false ),
            d_pause             = ( $(attrs).attr('data-pause') === 'true' ? true : false ),
            d_autoplay          = ( $(attrs).attr('data-autoplay') === 'true' ? true : false ),
            d_adaptive          = ( $(attrs).attr('data-adaptive') === 'true' ? true : false ),
            d_center            = ( $(attrs).attr('data-center') === 'true' ? true : false ),
            d_slides_show       = parseInt($(attrs).attr('data-slides-show')),
            d_slides_scroll     = parseInt($(attrs).attr('data-slides-scroll')),
            d_speed             = parseInt($(attrs).attr('data-speed')),
            d_autoplay_speed    = parseInt($(attrs).attr('data-autoplay-speed')),
            d_first_breakpoint  = parseInt($(attrs).attr('data-first-breakpoint')),
            d_first_show        = parseInt($(attrs).attr('data-first-show')),
            d_first_scroll      = parseInt($(attrs).attr('data-first-scroll')),
            d_second_breakpoint = parseInt($(attrs).attr('data-second-breakpoint')),
            d_second_show       = parseInt($(attrs).attr('data-second-show')),
            d_second_scroll     = parseInt($(attrs).attr('data-second-scroll')),
            d_third_breakpoint  = parseInt($(attrs).attr('data-third-breakpoint')),
            d_third_show        = parseInt($(attrs).attr('data-third-show')),
            d_third_scroll      = parseInt($(attrs).attr('data-third-scroll'));


        $(item_nav_for).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: d_fade,
            asNavFor: item_nav,
            adaptiveHeight: d_adaptive,
        });
        $(item_nav).slick({
            dots: d_dots,
            infinite: d_infinite,
            autoplay: d_autoplay,
            pauseOnHover: d_pause,
            centerMode: d_center,
            focusOnSelect: d_focus,
            slidesToShow: d_slides_show,
            slidesToScroll: d_slides_scroll,
            autoplaySpeed: d_autoplay_speed,
            speed: d_speed,
            prevArrow: arrow_left,
            nextArrow: arrow_right,
            asNavFor: item_nav_for,
            responsive: [
                { breakpoint: d_first_breakpoint, settings: { slidesToShow: d_first_show, slidesToScroll: d_first_scroll } },
                { breakpoint: d_second_breakpoint, settings: { slidesToShow: d_second_show, slidesToScroll: d_second_scroll } },
                { breakpoint: d_third_breakpoint, settings: { slidesToShow: d_third_show, slidesToScroll: d_third_scroll } },
            ],
        });
    });


    /*
    *   Gallery Slick Before & After Slide Slider
    */
    $('.slmp-bf-slide-gallery').each(function() {
        var attrs               = $(this).find('.slmp-bf-slide-gallery-images');
        let d_dots              = ( $(attrs).attr('data-dots') === 'true' ? true : false ),
            d_infinite          = ( $(attrs).attr('data-infinite') === 'true' ? true : false ),
            d_fade              = ( $(attrs).attr('data-fade') === 'true' ? true : false ),
            d_pause             = ( $(attrs).attr('data-pause') === 'true' ? true : false ),
            d_autoplay          = ( $(attrs).attr('data-autoplay') === 'true' ? true : false ),
            d_adaptive          = ( $(attrs).attr('data-adaptive') === 'true' ? true : false ),
            d_speed             = parseInt($(attrs).attr('data-speed')),
            d_autoplay_speed    = parseInt($(attrs).attr('data-autoplay-speed')),
            arrow_left          = $(this).find('.slmp-slide-left-arrow'),
            arrow_right         = $(this).find('.slmp-slide-right-arrow');


        $(attrs).slick({
            dots: d_dots,
            infinite: d_infinite,
            fade: d_fade,
            adaptiveHeight: d_adaptive,
            autoplay: d_autoplay,
            pauseOnHover: d_pause,
            centerMode: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: d_autoplay_speed,
            speed: d_speed,
            prevArrow: arrow_left,
            nextArrow: arrow_right,
            swipe: false,
        });
    });

});