/**
 * We do not want the CSRF protection enabled for the AJAX post requests, it causes only trouble.
 * Get the csrftoken cookie and pass it to the X-CSRFToken HTTP request property.
 */

$('html').ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    try {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    } catch (e) {}
});

var response_commands = {
    refresh_page: function() {
        window.location.reload(true)
    },
    
    update_post_score: function(id, inc) {
        var $score_board = $('#post-' + id + '-score');
        var current = parseInt($score_board.html())
        if (isNaN(current)){
            current = 0;
        }
        $score_board.html(current + inc)
    },

    update_user_post_vote: function(id, vote_type) {
        var $upvote_button = $('#post-' + id + '-upvote');
        var $downvote_button = $('#post-' + id + '-downvote');

        $upvote_button.removeClass('on');
        $downvote_button.removeClass('on');

        if (vote_type == 'up') {
            $upvote_button.addClass('on');
        } else if (vote_type == 'down') {
            $downvote_button.addClass('on');
        }
    },

    update_favorite_count: function(inc) {
        var $favorite_count = $('#favorite-count');
        var count = parseInt($favorite_count.html());

        if (isNaN(count))
            count = 0;

        count += inc;

        if (count == 0)
            count = '';

        $favorite_count.html(count);
    },

    update_favorite_mark: function(type) {
        if (type == 'on') {
            $('#favorite-mark').addClass('on');
        } else {
            $('#favorite-mark').removeClass('on');
        }
    },

    mark_accepted: function(id) {        
        var $answer = $('#answer-container-' + id);
        $answer.addClass('accepted-answer');
        $answer.find('.accept-answer').addClass('on');
        $answer.find('.accept-answer').attr('title', $answer.find('.accept-answer').attr('bn:on'));
    },

    unmark_accepted: function(id) {
        var $answer = $('#answer-container-' + id);
        $answer.removeClass('accepted-answer');
        $answer.find('.accept-answer').removeClass('on');
        $answer.find('.accept-answer').attr('title', $answer.find('.accept-answer').attr('bn:off'));
    },

    remove_comment: function(id) {
        var $comment = $('#comment-' + id);
        $comment.css('background', 'red')
        $comment.fadeOut('slow', function() {
            $comment.remove();    
        });
    },

    award_points: function(id) {
        alert('ok');
    },

    insert_comment: function(post_id, comment_id, comment, username, profile_url, delete_url, edit_url, convert_url, can_convert, show_latest_comments_first) {
        var $container = $('#comments-container-' + post_id);
        var skeleton = $('#new-comment-skeleton-' + post_id).html().toString();

        skeleton = skeleton.replace(new RegExp('%ID%', 'g'), comment_id)
                .replace(new RegExp('%COMMENT%', 'g'), comment)
                .replace(new RegExp('%USERNAME%', 'g'), username)
                .replace(new RegExp('%PROFILE_URL%', 'g'), profile_url)
                .replace(new RegExp('%DELETE_URL%', 'g'), delete_url)
                .replace(new RegExp('%EDIT_URL%', 'g'), edit_url)
                .replace(new RegExp('%CONVERT_URL%', 'g'), convert_url);
        if (show_latest_comments_first) {
            $container.prepend(skeleton);
        } else {
            $container.append(skeleton);
        }

        // Show the convert comment to answer tool only if the current comment can be converted
        if (can_convert == true) {
            $('#comment-' + comment_id + '-convert').show();
        }

        $('#comment-' + comment_id).slideDown('slow');
    },

    update_comment: function(comment_id, comment_text) {
        var $comment = $('#comment-' + comment_id);
        $comment.find('.comment-text').html(comment_text);

        $comment.slideDown('slow');
    },

    mark_deleted: function(post_type, post_id) {
        if (post_type == 'question') {
            var $container = $('#question-table');
            $container.addClass('deleted');
        } else {
            var $el = $('#' + post_type + '-container-' + post_id);
            $el.addClass('deleted');
        }
    },

    unmark_deleted: function(post_type, post_id) {
        if (post_type == 'answer') {
            var $answer = $('#answer-container-' + post_id);
            $answer.removeClass('deleted');
        } else {
            var $container = $('#question-table');
            $container.removeClass('deleted');
        }
    },

    set_subscription_button: function(text) {
        $('.subscription_switch').html(text);
    },

    set_subscription_status: function(text) {
        $('.subscription-status').html(text);
    },

    copy_url: function(url) {
    }
}

function show_dialog (extern) {
    var default_close_function = function($diag) {
        $diag.fadeOut('fast', function() {
            $diag.remove();
        });
    };

    var options = {
        extra_class: '',
        pos: {
            x: ($(window).width() / 2) + $(window).scrollLeft(),
            y: ($(window).height() / 2) + $(window).scrollTop()
        },
        dim: false, 
        yes_text: messages.ok,
        yes_callback: default_close_function,
        no_text: messages.cancel,
        show_no: false,
        close_on_clickoutside: false,
        copy: false
    }

    $.extend(options, extern);

    var copy_id = '';
    if (options.copy) {
        copy_id = ' id="copy_clip_button"'
    }

    if (options.event != undefined && options.event.pageX != undefined && options.event.pageY != undefined) {
        options.pos = {x: options.event.pageX, y: options.event.pageY};
    } else if (options.event.currentTarget != undefined) {
        var el = jQuery("#" + options.event.currentTarget.id);
        var position = el.offset();
        options.pos = {
            x: position.left,
            y: position.top
        }
    }

    var html = '<div class="dialog ' + options.extra_class + '" style="display: none; z-index: 999;">'
             + '<div class="dialog-content">' + options.html + '</div><div class="dialog-buttons">';

    if (options.show_no) {
        html += '<button class="dialog-no">' + options.no_text + '</button>';
    }

    html += '<button class="dialog-yes"' + copy_id + '>' + options.yes_text + '</button>' + '</div></div>';

    var $dialog = $(html);

    $('body').append($dialog);
    var message = $('.dialog-content')[0];
    message.style.visibility = "hidden";

    if (options.dim === false) {
        $dialog.css({
            visibility: 'hidden',
            display: 'block'
        });

        options.dim = {w: $dialog.width(), h: $dialog.height()};

        $dialog.css({
            width: 1,
            height: 1,
            visibility: 'visible'
        });
    }

    $dialog.css({
        top: options.pos.y,
        left: options.pos.x
    });
    
    top_position_change = (options.dim.h / 2)
    left_position_change = (options.dim.w / 2)
    
    new_top_position = options.pos.y - top_position_change
    new_left_position = options.pos.x - left_position_change
    
    if (new_left_position < 0) {
        left_position_change = 0
    }
    if (($(window).scrollTop() - new_top_position) > 0) {
        top_position_change = 0
    }
    if ((options.event.pageY + options.dim.h) > ($(window).height() + $(window).scrollTop())) {
        top_position_change = options.dim.h
    }
    if ((options.event.pageX + options.dim.w) > ($(window).width() + $(window).scrollLeft())) {
        left_position_change = options.dim.w
    }
    
    $dialog.animate({
        top: "-=" + top_position_change,
        left: "-=" + left_position_change,
        width: options.dim.w,
        height: options.dim.h
    }, 200, function() {
        message.style.visibility = "visible";
    });

    $dialog.find('.dialog-yes').click(function() {
        options.yes_callback($dialog);
    });

    if (options.hasOwnProperty("no_callback")) {
        $dialog.find('.dialog-no:first-child').click(function() {
            options.no_callback($dialog);
        });
    } else {
        $dialog.find('.dialog-no:first-child').click(function() {
            default_close_function($dialog);
        });
    }

    if (options.close_on_clickoutside) {
        $dialog.one('clickoutside', function() {
            default_close_function($dialog);
        });
    }

    return $dialog;
}

function show_message(evt, msg, callback) {
    var $dialog = show_dialog({
        html: msg,
        extra_class: 'warning',
        event: evt,
        yes_callback: function() {
            $dialog.fadeOut('fast', function() {
                $dialog.remove();
            });
            if (callback) {
                callback();
            }
        },
        close_on_clickoutside: true
    });
}

function load_prompt(evt, el, url) {
    $.get(url, function(data) {
        var doptions = {
         html: data,
            extra_class: 'prompt',
            yes_callback: function() {
                var postvars = {};
                $dialog.find('input, textarea, select').each(function() {
                    postvars[$(this).attr('name')] = $(this).val();
                });
                $.post(url, postvars, function(data) {
                    $dialog.fadeOut('fast', function() {
                        $dialog.remove();
                    });
                    process_ajax_response(data, evt);
                }, 'json');
            },
            show_no: true,
            copy: false
        }

        if (el.hasClass('copy')) {
            $.extend(doptions, { yes_text : 'Copy', copy: true});
        }

        if (!el.is('.centered')) {
            doptions.event = evt;
        }

        var $dialog = show_dialog(doptions);
    });
}

function process_ajax_response(data, evt, callback) {
    if (!data.success && data['error_message'] != undefined) {
        show_message(evt, data.error_message, function() {if (callback) callback(true);});
        end_command(false);
    }
    if (typeof data['commands'] != undefined){
        for (var command in data.commands) {
            response_commands[command].apply(null, data.commands[command])


        }

        if (data['message'] != undefined) {
            show_message(evt, data.message, function() {if (callback) callback(false);})
        } else {
            if (callback) callback(false);
        }
        end_command(true);
    }
}

var running = false;

function start_command() {
    $('body').append($('<div id="command-loader"></div>'));
    running = true;
}

function end_command(success) {
    if (success) {
        $('#command-loader').addClass('success');
        $('#command-loader').fadeOut("slow", function() {
            $('#command-loader').remove();
            running = false;
        });
    } else {
        $('#command-loader').remove();
        running = false;
    }
}

var comment_box_cursor_position = 0;
function canned_comment(post_id, comment) {
    textarea = $('#comment-' + post_id + '-form textarea')

    // Get the text from the beginning to the caret
    textarea_start = textarea.val().substr(0, comment_box_cursor_position)

    // Get the text from the caret to the end
    textarea_end = textarea.val().substr(comment_box_cursor_position, textarea.val().length)

    textarea.val(textarea_start + comment + textarea_end);
}

$(function() {
    $('textarea.commentBox').bind('keydown keyup mousedown mouseup mousemove', function(evt) {
        comment_box_cursor_position = $(this).caret().start;
    });

    $('textarea.commentBox').blur(function() {
        //alert(comment_box_cursor_position);
    });

    $('a.ajax-command').live('click', function(evt) {
        if (running) return false;

        var el = $(this);

        var ajax_url = el.attr('href')
        ajax_url = ajax_url + "?nocache=" + new Date().getTime()

        $('.context-menu-dropdown').slideUp('fast');

        if (el.is('.withprompt')) {
            load_prompt(evt, el, ajax_url);
        } else if(el.is('.confirm')) {
            var doptions = {
                html: messages.confirm,
                extra_class: 'confirm',
                yes_callback: function() {
                    start_command();
                    $.getJSON(ajax_url, function(data) {
                        process_ajax_response(data, evt);
                        $dialog.fadeOut('fast', function() {
                            $dialog.remove();
                        });
                    });
                },
                yes_text: messages.yes,
                show_no: true,
                no_text: messages.no
            }

            if (!el.is('.centered')) {
                doptions.event = evt;
            }
            var $dialog = show_dialog(doptions);
        } else {
            start_command();
            $.ajax({
                url: ajax_url,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    process_ajax_response(data, evt);
                }
            });
        }

        return false
    });

    $('.context-menu').each(function() {
        var $menu = $(this);
        var $trigger = $menu.find('.context-menu-trigger');
        var $dropdown = $menu.find('.context-menu-dropdown');

        $trigger.click(function() {
            $dropdown.slideToggle('fast', function() {
                if ($dropdown.is(':visible')) {
                   $dropdown.one('clickoutside', function() {
                       if ($dropdown.is(':visible'))
                            $dropdown.slideUp('fast');
                    });
                }
            });    
        });
    });

    $('div.comment-form-container').each(function() {
        var $container = $(this);
        var $comment_tools = $container.parent().find('.comment-tools');
        var $comments_container = $container.parent().find('.comments-container');
        
        var $form = $container.find('form');

        if ($form.length) {
            var $textarea = $container.find('textarea');
            var textarea = $textarea.get(0);
            var $button = $container.find('.comment-submit');
            var $cancel = $container.find('.comment-cancel');
            var $chars_left_message = $container.find('.comments-chars-left-msg');
            var $chars_togo_message = $container.find('.comments-chars-togo-msg');
            var $chars_counter = $container.find('.comments-char-left-count');

            var $add_comment_link = $comment_tools.find('.add-comment-link');

            var chars_limits = $chars_counter.html().split('|');

            var min_length = parseInt(chars_limits[0]);
            var max_length = parseInt(chars_limits[1]);

            var warn_length = max_length - 30;
            var current_length = 0;
            var comment_in_form = false;
            var interval = null;

            var hcheck = !($.browser.msie || $.browser.opera);

            $textarea.css("padding-top", 0).css("padding-bottom", 0).css("resize", "none");
            textarea.style.overflow = 'hidden';


            function cleanup_form() {
                $textarea.val('');
                $textarea.css('height', 80);
                $chars_counter.html(max_length);
                $chars_left_message.removeClass('warn');
                comment_in_form = false;
                current_length = 0;

                $chars_left_message.hide();
                $chars_togo_message.show();

                $chars_counter.removeClass('warn');
                $chars_counter.html(min_length);
                $button.attr("disabled","disabled");

                interval = null;
            }

            cleanup_form();

            function process_form_changes() {
                var length = $textarea.val().replace(/[ ]{2,}/g," ").length;

                if (current_length == length)
                    return;

                if (length < warn_length && current_length >= warn_length) {
                    $chars_counter.removeClass('warn');
                } else if (current_length < warn_length && length >= warn_length){
                    $chars_counter.addClass('warn');
                }

                if (length < min_length) {
                    $chars_left_message.hide();
                    $chars_togo_message.show();
                    $chars_counter.html(min_length - length);
                } else {
                    length = $textarea.val().length;
                    $chars_togo_message.hide();
                    $chars_left_message.show();
                    $chars_counter.html(max_length - length);
                }

                if (length > max_length || length < min_length) {
                    $button.attr("disabled","disabled");
                } else {
                    $button.removeAttr("disabled");
                }

                var current_height = textarea.style.height;
                if (hcheck)
                    textarea.style.height = "0px";

                var h = Math.max(80, textarea.scrollHeight);
                textarea.style.height = current_height;
                $textarea.animate({height: h + 'px'}, 50);

                current_length = length;
            }

            function show_comment_form() {
                $container.slideDown('slow');
                $add_comment_link.fadeOut('slow');
                $textarea.focus();
                interval = window.setInterval(function() {
                    process_form_changes();
                }, 200);
            }

            function hide_comment_form() {
                if (interval != null) {
                    window.clearInterval(interval);
                    interval = null;
                }
                $container.slideUp('slow');
                $add_comment_link.fadeIn('slow');
            }

            $add_comment_link.click(function(){
                cleanup_form();
                show_comment_form();
                return false;
            });

            $('#' + $comments_container.attr('id') + ' .comment-edit').live('click', function() {
                var $link = $(this);
                var comment_id = /comment-(\d+)-edit/.exec($link.attr('id'))[1];
                var $comment = $('#comment-' + comment_id);

                comment_in_form = comment_id;

                $.get($link.attr('href'), function(data) {
                    $textarea.val(data);
                });

                $comment.slideUp('slow');
                show_comment_form();
                return false;
            });

            $button.click(function(evt) {
                if (running) return false;

                var post_data = {
                    comment: $textarea.val()
                }

                if (comment_in_form) {
                    post_data['id'] = comment_in_form;
                }

                start_command();
                $.post($form.attr('action'), post_data, function(data) {
                    process_ajax_response(data, evt, function(error) {
                        if (!error) {
                            cleanup_form();
                            hide_comment_form();
                        }
                    });

                }, "json");

                return false;
            });

            // Submit comment with CTRL + Enter
            $textarea.keydown(function(e) {
                if (e.ctrlKey && e.keyCode == 13 && !$button.attr('disabled')) {
                    // console.log('submit');
                    $(this).parent().find('input.comment-submit').click();
                }
            });

            $cancel.click(function(event) {
                if (confirm("You will lose all of your changes in this comment.  Do you still wish to proceed?")){
                    if (comment_in_form) {
                        $comment = $('#comment-' + comment_in_form).slideDown('slow');
                    }
                    hide_comment_form();
                    cleanup_form();
                }
                return false;
            });
        }

        $comment_tools.find('.show-all-comments-link').click(function() {
            $comments_container.find('.not_top_scorer').slideDown('slow');
            $(this).fadeOut('slow');
            $comment_tools.find('.comments-showing').fadeOut('slow');
            return false;
        });
    });

    if ($('#editor').length) {
        var $editor = $('#editor');
        var $previewer = $('#previewer');
        var $container = $('#editor-metrics');

        var initial_whitespace_rExp = /^[^A-Za-zА-Яа-я0-9]+/gi;
        var non_alphanumerics_rExp = rExp = /[^A-Za-zА-Яа-я0-9]+/gi;
        var editor_interval = null;

        $editor.focus(function() {
            if (editor_interval == null) {
                editor_interval = window.setInterval(function() {
                    recalc_metrics();
                }, 200);
            }
        });

        function recalc_metrics() {
            var text = $previewer.text();

            var char_count = text.length;
            var fullStr = text + " ";
            var left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "");
            var cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");
            var splitString = cleanedStr.split(" ");
            var word_count = splitString.length - 1;

            var metrics = char_count + " " + (char_count == 1 ? messages.character : messages.characters);
            metrics += " / " + word_count + " " + (word_count == 1 ? messages.word : messages.words);
            $container.html(metrics);
        }
    }
});

//var scriptUrl, interestingTags, ignoredTags, tags, $;
function pickedTags(){

    var sendAjax = function(tagname, reason, action, callback){
        var url = scriptUrl;
        if (action == 'add'){
            url += $.i18n._('mark-tag/');
            if (reason == 'good'){
                url += $.i18n._('interesting/');
            }
            else {
                url += $.i18n._('ignored/');
            }
        }
        else {
            url += $.i18n._('unmark-tag/');
        }
        url = url + tagname + '/';

        var call_settings = {
            type:'POST',
            url:url,
            data: ''
        };
        if (callback !== false){
            call_settings.success = callback;
        }
        $.ajax(call_settings);
    };


    var unpickTag = function(from_target ,tagname, reason, send_ajax){
        //send ajax request to delete tag
        var deleteTagLocally = function(){
            from_target[tagname].remove();
            delete from_target[tagname];
            $(".tags.interesting").trigger('contentchanged');
        };

        if (send_ajax){
            sendAjax(tagname,reason,'remove',deleteTagLocally);
        }
        else {
            deleteTagLocally();
        }
    };

    var setupTagDeleteEvents = function(obj,tag_store,tagname,reason,send_ajax){
        obj.unbind('mouseover').bind('mouseover', function(){
            $(this).attr('src', mediaUrl('media/images/close-small-hover.png'));
        });
        obj.unbind('mouseout').bind('mouseout', function(){
            $(this).attr('src', mediaUrl('media/images/close-small-dark.png'));
        });
        obj.click( function(){
            unpickTag(tag_store,tagname,reason,send_ajax);
        });
    };

    var handlePickedTag = function(obj,reason){
        var tagname = $.trim($(obj).prev().attr('value'));
        var to_target = interestingTags;
        var from_target = ignoredTags;
        var to_tag_container;
        if (reason == 'bad'){
            to_target = ignoredTags;
            from_target = interestingTags;
            to_tag_container = $('div .tags.ignored');
        }
        else if (reason != 'good'){
            return;
        }
        else {
            to_tag_container = $('div .tags.interesting');
        }

        if (tagname in from_target){
            unpickTag(from_target,tagname,reason,false);
        }

        if (!(tagname in to_target)){
            //send ajax request to pick this tag

            sendAjax(tagname,reason,'add',function(){
                var new_tag = $('<span></span>');
                new_tag.addClass('deletable-tag');
                var tag_link = $('<a></a>');
                tag_link.attr('rel','tag');
                tag_link.attr('href', scriptUrl + $.i18n._('tags/') + tagname + '/');
                tag_link.html(tagname);
                var del_link = $('<img />');
                del_link.addClass('delete-icon');
                del_link.attr('src', mediaUrl('media/images/close-small-dark.png'));

                setupTagDeleteEvents(del_link, to_target, tagname, reason, true);

                new_tag.append(tag_link);
                new_tag.append(del_link);
                to_tag_container.append(new_tag);

                to_target[tagname] = new_tag;

                to_tag_container.trigger('contentchanged');
            });
        }
    };

    var collectPickedTags = function(){
        var good_prefix = 'interesting-tag-';
        var bad_prefix = 'ignored-tag-';
        var good_re = RegExp('^' + good_prefix);
        var bad_re = RegExp('^' + bad_prefix);
        interestingTags = {};
        ignoredTags = {};
        $('.deletable-tag').each(
            function(i,item){
                var item_id = $(item).attr('id');
                var tag_name, tag_store;
                if (good_re.test(item_id)){
                    tag_name = item_id.replace(good_prefix,'');
                    tag_store = interestingTags;
                    reason = 'good';
                }
                else if (bad_re.test(item_id)){
                    tag_name = item_id.replace(bad_prefix,'');
                    tag_store = ignoredTags;
                    reason = 'bad';
                }
                else {
                    return;
                }
                tag_store[tag_name] = $(item);
                setupTagDeleteEvents($(item).find('img'),tag_store,tag_name,reason,true);
            }
        );
    };

    var setupHideIgnoredQuestionsControl = function(){
        $('#hideIgnoredTagsCb').unbind('click').click(function(){
            $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        cache: false,
                        url: scriptUrl + $.i18n._('command/'),
                        data: {command:'toggle-ignored-questions'}
                    });
        });
    };
    return {
        init: function(){
            collectPickedTags();
            setupHideIgnoredQuestionsControl();
            $("#interestingTagInput, #ignoredTagInput").autocomplete(messages.matching_tags_url, {
                minChars: 1,
                matchContains: true,
                max: 20,
                /*multiple: false, - the favorite tags and ignore tags don't let you do multiple tags
                multipleSeparator: " "*/

                formatItem: function(row, i, max, value) {
                    return row[1] + " (" + row[2] + ")";
                },

                formatResult: function(row, i, max, value){
                    return row[1];
                }

            });
            $("#interestingTagAdd").click(function(){handlePickedTag(this,'good');});
            $("#ignoredTagAdd").click(function(){handlePickedTag(this,'bad');});
        }
    };
}

Hilite={elementid:"content",exact:true,max_nodes:1000,onload:true,style_name:"hilite",style_name_suffix:true,debug_referrer:""};Hilite.search_engines=[["local","q"],["cnprog\\.","q"],["google\\.","q"],["search\\.yahoo\\.","p"],["search\\.msn\\.","q"],["search\\.live\\.","query"],["search\\.aol\\.","userQuery"],["ask\\.com","q"],["altavista\\.","q"],["feedster\\.","q"],["search\\.lycos\\.","q"],["alltheweb\\.","q"],["technorati\\.com/search/([^\\?/]+)",1],["dogpile\\.com/info\\.dogpl/search/web/([^\\?/]+)",1,true]];Hilite.decodeReferrer=function(d){var g=null;var e=new RegExp("");for(var c=0;c<Hilite.search_engines.length;c++){var f=Hilite.search_engines[c];e.compile("^http://(www\\.)?"+f[0],"i");var b=d.match(e);if(b){var a;if(isNaN(f[1])){a=Hilite.decodeReferrerQS(d,f[1])}else{a=b[f[1]+1]}if(a){a=decodeURIComponent(a);if(f.length>2&&f[2]){a=decodeURIComponent(a)}a=a.replace(/\'|"/g,"");a=a.split(/[\s,\+\.]+/);return a}break}}return null};Hilite.decodeReferrerQS=function(f,d){var b=f.indexOf("?");var c;if(b>=0){var a=new String(f.substring(b+1));b=0;c=0;while((b>=0)&&((c=a.indexOf("=",b))>=0)){var e,g;e=a.substring(b,c);b=a.indexOf("&",c)+1;if(e==d){if(b<=0){return a.substring(c+1)}else{return a.substring(c+1,b-1)}}else{if(b<=0){return null}}}}return null};Hilite.hiliteElement=function(f,e){if(!e||f.childNodes.length==0){return}var c=new Array();for(var b=0;b<e.length;b++){e[b]=e[b].toLowerCase();if(Hilite.exact){c.push("\\b"+e[b]+"\\b")}else{c.push(e[b])}}c=new RegExp(c.join("|"),"i");var a={};for(var b=0;b<e.length;b++){if(Hilite.style_name_suffix){a[e[b]]=Hilite.style_name+(b+1)}else{a[e[b]]=Hilite.style_name}}var d=function(m){var j=c.exec(m.data);if(j){var n=j[0];var i="";var h=m.splitText(j.index);var g=h.splitText(n.length);var l=m.ownerDocument.createElement("SPAN");m.parentNode.replaceChild(l,h);l.className=a[n.toLowerCase()];l.appendChild(h);return l}else{return m}};Hilite.walkElements(f.childNodes[0],1,d)};Hilite.hilite=function(){var a=Hilite.debug_referrer?Hilite.debug_referrer:document.referrer;var b=null;a=Hilite.decodeReferrer(a);if(a&&((Hilite.elementid&&(b=document.getElementById(Hilite.elementid)))||(b=document.body))){Hilite.hiliteElement(b,a)}};Hilite.walkElements=function(d,f,e){var a=/^(script|style|textarea)/i;var c=0;while(d&&f>0){c++;if(c>=Hilite.max_nodes){var b=function(){Hilite.walkElements(d,f,e)};setTimeout(b,50);return}if(d.nodeType==1){if(!a.test(d.tagName)&&d.childNodes.length>0){d=d.childNodes[0];f++;continue}}else{if(d.nodeType==3){d=e(d)}}if(d.nextSibling){d=d.nextSibling}else{while(f>0){d=d.parentNode;f--;if(d.nextSibling){d=d.nextSibling;break}}}}};if(Hilite.onload){if(window.attachEvent){window.attachEvent("onload",Hilite.hilite)}else{if(window.addEventListener){window.addEventListener("load",Hilite.hilite,false)}else{var __onload=window.onload;window.onload=function(){Hilite.hilite();__onload()}}}};

var mediaUrl = function(resource){
    return scriptUrl + 'm/' + osqaSkin + '/' + resource;
};

/*
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * Examples at: http://recurser.com/articles/2008/02/21/jquery-i18n-translation-plugin/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Based on 'javascript i18n that almost doesn't suck' by markos
 * http://markos.gaivo.net/blog/?p=100
 *
 * Revision: $Id$
 * Version: 1.0.0  Feb-10-2008
 */
 (function($) {
/**
 * i18n provides a mechanism for translating strings using a jscript dictionary.
 *
 */


/*
 * i18n property list
 */
$.i18n = {

/**
 * setDictionary()
 * Initialise the dictionary and translate nodes
 *
 * @param property_list i18n_dict : The dictionary to use for translation
 */
	setDictionary: function(i18n_dict) {
		i18n_dict = i18n_dict;
	},

/**
 * _()
 * The actual translation function. Looks the given string up in the
 * dictionary and returns the translation if one exists. If a translation
 * is not found, returns the original word
 *
 * @param string str : The string to translate
 * @param property_list params : params for using printf() on the string
 * @return string : Translated word
 *
 */
	_: function (str, params) {
		var transl = str;
		if (i18n_dict&& i18n_dict[str]) {
			transl = i18n_dict[str];
		}
		return this.printf(transl, params);
	},

/**
 * toEntity()
 * Change non-ASCII characters to entity representation
 *
 * @param string str : The string to transform
 * @return string result : Original string with non-ASCII content converted to entities
 *
 */
	toEntity: function (str) {
		var result = '';
		for (var i=0;i<str.length; i++) {
			if (str.charCodeAt(i) > 128)
				result += "&#"+str.charCodeAt(i)+";";
			else
				result += str.charAt(i);
		}
		return result;
	},

/**
 * stripStr()
 *
 * @param string str : The string to strip
 * @return string result : Stripped string
 *
 */
 	stripStr: function(str) {
		return str.replace(/^\s*/, "").replace(/\s*$/, "");
	},

/**
 * stripStrML()
 *
 * @param string str : The multi-line string to strip
 * @return string result : Stripped string
 *
 */
	stripStrML: function(str) {
		// Split because m flag doesn't exist before JS1.5 and we need to
		// strip newlines anyway
		var parts = str.split('\n');
		for (var i=0; i<parts.length; i++)
			parts[i] = stripStr(parts[i]);

		// Don't join with empty strings, because it "concats" words
		// And strip again
		return stripStr(parts.join(" "));
	},

/*
 * printf()
 * C-printf like function, which substitutes %s with parameters
 * given in list. %%s is used to escape %s.
 *
 * Doesn't work in IE5.0 (splice)
 *
 * @param string S : string to perform printf on.
 * @param string L : Array of arguments for printf()
 */
	printf: function(S, L) {
		if (!L) return S;

		var nS = "";
		var tS = S.split("%s");

		for(var i=0; i<L.length; i++) {
			if (tS[i].lastIndexOf('%') == tS[i].length-1 && i != L.length-1)
				tS[i] += "s"+tS.splice(i+1,1)[0];
			nS += tS[i] + L[i];
		}
		return nS + tS[tS.length-1];
	}

};


})(jQuery);


//var i18nLang;
var i18nZh = {
	'insufficient privilege':'??????????',
	'cannot pick own answer as best':'??????????????',
	'anonymous users cannot select favorite questions':'?????????????',
	'please login':'??????',
	'anonymous users cannot vote':'????????',
	'>15 points requried to upvote':'??+15?????????',
	'>100 points required to downvote':'??+100?????????',
	'please see': '??',
	'cannot vote for own posts':'??????????',
	'daily vote cap exhausted':'????????????????',
	'cannot revoke old vote':'??????????????',
	'please confirm offensive':"??????????????????????",
	'anonymous users cannot flag offensive posts':'???????????',
	'cannot flag message as offensive twice':'???????',
	'flag offensive cap exhausted':'?????????????5??????',
	'need >15 points to report spam':"??+15??????????",
	'confirm delete':"?????/????????",
	'anonymous users cannot delete/undelete':"???????????????",
	'post recovered':"?????????????",
	'post deleted':"????????????",
	'add comment':'????',
	'community karma points':'????',
	'to comment, need':'????',
	'delete this comment':'?????',
	'hide comments':"????",
	'add a comment':"????",
	'comments':"??",
	'confirm delete comment':"?????????",
	'characters':'??',
	'can write':'???',
	'click to close':'???????',
	'loading...':'???...',
	'tags cannot be empty':'???????',
	'tablimits info':"??5????????????20????",
	'content cannot be empty':'???????',
	'content minchars': '????? {0} ???',
	'please enter title':'??????',
	'title minchars':"????? {0} ???",
	'delete':'??',
	'undelete':	'??',
	'bold':'??',
	'italic':'??',
	'link':'???',
	'quote':'??',
	'preformatted text':'??',
	'image':'??',
	'numbered list':'??????',
	'bulleted list':'??????',
	'heading':'??',
	'horizontal bar':'???',
	'undo':'??',
	'redo':'??',
	'enter image url':'<b>??????</b></p><p>???<br />http://www.example.com/image.jpg   \"????\"',
	'enter url':'<b>??Web??</b></p><p>???<br />http://www.cnprog.com/   \"????\"</p>"',
	'upload image':'?????????'
};

var i18nEn = {
	'need >15 points to report spam':'need >15 points to report spam ',
    '>15 points requried to upvote':'>15 points required to upvote ',
	'tags cannot be empty':'please enter at least one tag',
	'anonymous users cannot vote':'sorry, anonymous users cannot vote ',
	'anonymous users cannot select favorite questions':'sorry, anonymous users cannot select favorite questions ',
	'to comment, need': '(to comment other people\'s posts, karma ',
	'please see':'please see ',
	'community karma points':' or more is necessary) - ',
	'upload image':'Upload image:',
	'enter image url':'enter URL of the image, e.g. http://www.example.com/image.jpg \"image title\"',
	'enter url':'enter Web address, e.g. http://www.example.com \"page title\"',
	'daily vote cap exhausted':'sorry, you\'ve used up todays vote cap',
	'cannot pick own answer as best':'sorry, you cannot accept your own answer',
	'cannot revoke old vote':'sorry, older votes cannot be revoked',
	'please confirm offensive':'are you sure this post is offensive, contains spam, advertising, malicious remarks, etc.?',
	'flag offensive cap exhausted':'sorry, you\'ve used up todays cap of flagging offensive messages ',
	'confirm delete':'are you sure you want to delete this?',
	'anonymous users cannot delete/undelete':'sorry, anonymous users cannot delete or undelete posts',
	'post recovered':'your post is now restored!',
	'post deleted':'your post has been deleted',
	'confirm delete comment':'do you really want to delete this comment?',
	'can write':'have ',
	'tablimits info':'up to 5 tags, no more than 20 characters each',
	'content minchars': 'please enter more than {0} characters',
	'title minchars':"please enter at least {0} characters",
	'characters':'characters left',
    'cannot vote for own posts':'sorry, you cannot vote for your own posts',
    'cannot flag message as offensive twice':'cannot flag message as offensive twice ',
	'>100 points required to downvote':'>100 points required to downvote '
};

var i18nEs = {
	'insufficient privilege':'privilegio insuficiente',
	'cannot pick own answer as best':'no puede escoger su propia respuesta como la mejor',
	'anonymous users cannot select favorite questions':'usuarios anonimos no pueden seleccionar',
	'please login':'por favor inicie sesión',
	'anonymous users cannot vote':'usuarios anónimos no pueden votar',
	'>15 points requried to upvote': '>15 puntos requeridos para votar positivamente',
	'>100 points required to downvote':'>100 puntos requeridos para votar negativamente',
	'please see': 'por favor vea',
	'cannot vote for own posts':'no se puede votar por sus propias publicaciones',
	'daily vote cap exhausted':'cuota de votos diarios excedida',
	'cannot revoke old vote':'no puede revocar un voto viejo',
	'please confirm offensive':"por favor confirme ofensiva",
	'anonymous users cannot flag offensive posts':'usuarios anónimos no pueden marcar publicaciones como ofensivas',
	'cannot flag message as offensive twice':'no puede marcar mensaje como ofensivo dos veces',
	'flag offensive cap exhausted':'cuota para marcar ofensivas ha sido excedida',
	'need >15 points to report spam':"necesita >15 puntos para reportar spam",
	'confirm delete':"¿Está seguro que desea borrar esto?",
	'anonymous users cannot delete/undelete':"usuarios anónimos no pueden borrar o recuperar publicaciones",
	'post recovered':"publicación recuperada",
	'post deleted':"publicación borrada?",
	'add comment':'agregar comentario',
	'community karma points':'reputación comunitaria',
	'to comment, need':'para comentar, necesita reputación',
	'delete this comment':'borrar este comentario',
	'hide comments':"ocultar comentarios",
	'add a comment':"agregar comentarios",
	'comments':"comentarios",
	'confirm delete comment':"¿Realmente desea borrar este comentario?",
	'characters':'caracteres faltantes',
	'can write':'tiene ',
	'click to close':'haga click para cerrar',
	'loading...':'cargando...',
	'tags cannot be empty':'las etiquetas no pueden estar vacías',
	'tablimits info':"hasta 5 etiquetas de no mas de 20 caracteres cada una",
	'content cannot be empty':'el contenido no puede estar vacío',
	'content minchars': 'por favor introduzca mas de {0} caracteres',
	'please enter title':'por favor ingrese un título',
	'title minchars':"por favor introduzca al menos {0} caracteres",
	'delete':'borrar',
	'undelete':	'recuperar',
	'bold': 'negrita',
	'italic':'cursiva',
	'link':'enlace',
	'quote':'citar',
	'preformatted text':'texto preformateado',
	'image':'imagen',
	'numbered list':'lista numerada',
	'bulleted list':'lista no numerada',
	'heading':'??',
	'horizontal bar':'barra horizontal',
	'undo':'deshacer',
	'redo':'rehacer',
	'enter image url':'introduzca la URL de la imagen, por ejemplo?<br />http://www.example.com/image.jpg   \"titulo de imagen\"',
	'enter url':'introduzca direcciones web, ejemplo?<br />http://www.cnprog.com/   \"titulo del enlace\"</p>"',
	'upload image':'cargar imagen?',
	'questions/' : 'preguntas/',
	'vote/' : 'votar/'
};

var i18n = {
	'en':i18nEn,
	'zh_CN':i18nZh,
	'es':i18nEs
};

var i18n_dict = i18n[i18nLang];

/*
	jQuery TextAreaResizer plugin
	Created on 17th January 2008 by Ryan O'Dell
	Version 1.0.4
*/(function($){var textarea,staticOffset;var iLastMousePos=0;var iMin=32;var grip;$.fn.TextAreaResizer=function(){return this.each(function(){textarea=$(this).addClass('processed'),staticOffset=null;$(this).wrap('<div class="resizable-textarea"><span></span></div>').parent().append($('<div class="grippie"></div>').bind("mousedown",{el:this},startDrag));var grippie=$('div.grippie',$(this).parent())[0];grippie.style.marginRight=(grippie.offsetWidth-$(this)[0].offsetWidth)+'px'})};function startDrag(e){textarea=$(e.data.el);textarea.blur();iLastMousePos=mousePosition(e).y;staticOffset=textarea.height()-iLastMousePos;textarea.css('opacity',0.25);$(document).mousemove(performDrag).mouseup(endDrag);return false}function performDrag(e){var iThisMousePos=mousePosition(e).y;var iMousePos=staticOffset+iThisMousePos;if(iLastMousePos>=(iThisMousePos)){iMousePos-=5}iLastMousePos=iThisMousePos;iMousePos=Math.max(iMin,iMousePos);textarea.height(iMousePos+'px');if(iMousePos<iMin){endDrag(e)}return false}function endDrag(e){$(document).unbind('mousemove',performDrag).unbind('mouseup',endDrag);textarea.css('opacity',1);textarea.focus();textarea=null;staticOffset=null;iLastMousePos=0}function mousePosition(e){return{x:e.clientX+document.documentElement.scrollLeft,y:e.clientY+document.documentElement.scrollTop}}})(jQuery);
/*
 * Autocomplete - jQuery plugin 1.0.3
 *
 * Copyright (c) 2007 Dylan Verheul, Dan G. Switzer, Anjesh Tuladhar, Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function(a){a.fn.extend({autocomplete:function(b,c){var d=typeof b=="string";c=a.extend({},a.Autocompleter.defaults,{url:d?b:null,data:d?null:b,delay:d?a.Autocompleter.defaults.delay:10,max:c&&!c.scroll?10:150},c);c.highlight=c.highlight||function(e){return e};c.formatMatch=c.formatMatch||c.formatItem;return this.each(function(){new a.Autocompleter(this,c)})},result:function(b){return this.bind("result",b)},search:function(b){return this.trigger("search",[b])},flushCache:function(){return this.trigger("flushCache")},setOptions:function(b){return this.trigger("setOptions",[b])},unautocomplete:function(){return this.trigger("unautocomplete")}});a.Autocompleter=function(l,g){var c={UP:38,DOWN:40,DEL:46,TAB:9,RETURN:13,ESC:27,COMMA:188,PAGEUP:33,PAGEDOWN:34,BACKSPACE:8};var b=a(l).attr("autocomplete","off").addClass(g.inputClass);var j;var p="";var m=a.Autocompleter.Cache(g);var e=0;var u;var x={mouseDownOnSelect:false};var r=a.Autocompleter.Select(g,l,d,x);var w;a.browser.opera&&a(l.form).bind("submit.autocomplete",function(){if(w){w=false;return false}});b.bind((a.browser.opera?"keypress":"keydown")+".autocomplete",function(y){u=y.keyCode;switch(y.keyCode){case c.UP:y.preventDefault();if(r.visible()){r.prev()}else{t(0,true)}break;case c.DOWN:y.preventDefault();if(r.visible()){r.next()}else{t(0,true)}break;case c.PAGEUP:y.preventDefault();if(r.visible()){r.pageUp()}else{t(0,true)}break;case c.PAGEDOWN:y.preventDefault();if(r.visible()){r.pageDown()}else{t(0,true)}break;case g.multiple&&a.trim(g.multipleSeparator)==","&&c.COMMA:case c.TAB:case c.RETURN:if(d()){y.preventDefault();w=true;return false}break;case c.ESC:r.hide();break;default:clearTimeout(j);j=setTimeout(t,g.delay);break}}).focus(function(){e++}).blur(function(){e=0;if(!x.mouseDownOnSelect){s()}}).click(function(){if(e++>1&&!r.visible()){t(0,true)}}).bind("search",function(){var y=(arguments.length>1)?arguments[1]:null;function z(D,C){var A;if(C&&C.length){for(var B=0;B<C.length;B++){if(C[B].result.toLowerCase()==D.toLowerCase()){A=C[B];break}}}if(typeof y=="function"){y(A)}else{b.trigger("result",A&&[A.data,A.value])}}a.each(h(b.val()),function(A,B){f(B,z,z)})}).bind("flushCache",function(){m.flush()}).bind("setOptions",function(){a.extend(g,arguments[1]);if("data" in arguments[1]){m.populate()}}).bind("unautocomplete",function(){r.unbind();b.unbind();a(l.form).unbind(".autocomplete")});function d(){var z=r.selected();if(!z){return false}var y=z.result;p=y;if(g.multiple){var A=h(b.val());if(A.length>1){y=A.slice(0,A.length-1).join(g.multipleSeparator)+g.multipleSeparator+y}y+=g.multipleSeparator}b.val(y);v();b.trigger("result",[z.data,z.value]);return true}function t(A,z){if(u==c.DEL){r.hide();return}var y=b.val();if(!z&&y==p){return}p=y;y=i(y);if(y.length>=g.minChars){b.addClass(g.loadingClass);if(!g.matchCase){y=y.toLowerCase()}f(y,k,v)}else{n();r.hide()}}function h(z){if(!z){return[""]}var A=z.split(g.multipleSeparator);var y=[];a.each(A,function(B,C){if(a.trim(C)){y[B]=a.trim(C)}});return y}function i(y){if(!g.multiple){return y}var z=h(y);return z[z.length-1]}function q(y,z){if(g.autoFill&&(i(b.val()).toLowerCase()==y.toLowerCase())&&u!=c.BACKSPACE){b.val(b.val()+z.substring(i(p).length));a.Autocompleter.Selection(l,p.length,p.length+z.length)}}function s(){clearTimeout(j);j=setTimeout(v,200)}function v(){var y=r.visible();r.hide();clearTimeout(j);n();if(g.mustMatch){b.search(function(z){if(!z){if(g.multiple){var A=h(b.val()).slice(0,-1);b.val(A.join(g.multipleSeparator)+(A.length?g.multipleSeparator:""))}else{b.val("")}}})}if(y){a.Autocompleter.Selection(l,l.value.length,l.value.length)}}function k(z,y){if(y&&y.length&&e){n();r.display(y,z);q(z,y[0].value);r.show()}else{v()}}function f(z,B,y){if(!g.matchCase){z=z.toLowerCase()}var A=m.load(z);if(A&&A.length){B(z,A)}else{if((typeof g.url=="string")&&(g.url.length>0)){var C={timestamp:+new Date()};a.each(g.extraParams,function(D,E){C[D]=typeof E=="function"?E():E});a.ajax({mode:"abort",port:"autocomplete"+l.name,dataType:g.dataType,url:g.url,data:a.extend({q:i(z),limit:g.max},C),success:function(E){var D=g.parse&&g.parse(E)||o(E);m.add(z,D);B(z,D)}})}else{r.emptyList();y(z)}}}function o(B){var y=[];var A=B.split("\n");for(var z=0;z<A.length;z++){var C=a.trim(A[z]);if(C){C=C.split("|");y[y.length]={data:C,value:C[0],result:g.formatResult&&g.formatResult(C,C[0])||C[0]}}}return y}function n(){b.removeClass(g.loadingClass)}};a.Autocompleter.defaults={inputClass:"ac_input",resultsClass:"ac_results",loadingClass:"ac_loading",minChars:1,delay:400,matchCase:false,matchSubset:true,matchContains:false,cacheLength:10,max:100,mustMatch:false,extraParams:{},selectFirst:true,formatItem:function(b){return b[0]},formatMatch:null,autoFill:false,width:0,multiple:false,multipleSeparator:", ",highlight:function(c,b){return c.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+b.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>")},scroll:true,scrollHeight:180};a.Autocompleter.Cache=function(c){var f={};var d=0;function h(l,k){if(!c.matchCase){l=l.toLowerCase()}var j=l.indexOf(k);if(j==-1){return false}return j==0||c.matchContains}function g(j,i){if(d>c.cacheLength){b()}if(!f[j]){d++}f[j]=i}function e(){if(!c.data){return false}var k={},j=0;if(!c.url){c.cacheLength=1}k[""]=[];for(var m=0,l=c.data.length;m<l;m++){var p=c.data[m];p=(typeof p=="string")?[p]:p;var o=c.formatMatch(p,m+1,c.data.length);if(o===false){continue}var n=o.charAt(0).toLowerCase();if(!k[n]){k[n]=[]}var q={value:o,data:p,result:c.formatResult&&c.formatResult(p)||o};k[n].push(q);if(j++<c.max){k[""].push(q)}}a.each(k,function(r,s){c.cacheLength++;g(r,s)})}setTimeout(e,25);function b(){f={};d=0}return{flush:b,add:g,populate:e,load:function(n){if(!c.cacheLength||!d){return null}if(!c.url&&c.matchContains){var m=[];for(var j in f){if(j.length>0){var o=f[j];a.each(o,function(p,k){if(h(k.value,n)){m.push(k)}})}}return m}else{if(f[n]){return f[n]}else{if(c.matchSubset){for(var l=n.length-1;l>=c.minChars;l--){var o=f[n.substr(0,l)];if(o){var m=[];a.each(o,function(p,k){if(h(k.value,n)){m[m.length]=k}});return m}}}}}return null}}};a.Autocompleter.Select=function(e,j,l,p){var i={ACTIVE:"ac_over"};var k,f=-1,r,m="",s=true,c,o;function n(){if(!s){return}c=a("<div/>").hide().addClass(e.resultsClass).css("position","absolute").appendTo(document.body);o=a("<ul/>").appendTo(c).mouseover(function(t){if(q(t).nodeName&&q(t).nodeName.toUpperCase()=="LI"){f=a("li",o).removeClass(i.ACTIVE).index(q(t));a(q(t)).addClass(i.ACTIVE)}}).click(function(t){a(q(t)).addClass(i.ACTIVE);l();j.focus();return false}).mousedown(function(){p.mouseDownOnSelect=true}).mouseup(function(){p.mouseDownOnSelect=false});if(e.width>0){c.css("width",e.width)}s=false}function q(u){var t=u.target;while(t&&t.tagName!="LI"){t=t.parentNode}if(!t){return[]}return t}function h(t){k.slice(f,f+1).removeClass(i.ACTIVE);g(t);var v=k.slice(f,f+1).addClass(i.ACTIVE);if(e.scroll){var u=0;k.slice(0,f).each(function(){u+=this.offsetHeight});if((u+v[0].offsetHeight-o.scrollTop())>o[0].clientHeight){o.scrollTop(u+v[0].offsetHeight-o.innerHeight())}else{if(u<o.scrollTop()){o.scrollTop(u)}}}}function g(t){f+=t;if(f<0){f=k.size()-1}else{if(f>=k.size()){f=0}}}function b(t){return e.max&&e.max<t?e.max:t}function d(){o.empty();var u=b(r.length);for(var v=0;v<u;v++){if(!r[v]){continue}var w=e.formatItem(r[v].data,v+1,u,r[v].value,m);if(w===false){continue}var t=a("<li/>").html(e.highlight(w,m)).addClass(v%2==0?"ac_even":"ac_odd").appendTo(o)[0];a.data(t,"ac_data",r[v])}k=o.find("li");if(e.selectFirst){k.slice(0,1).addClass(i.ACTIVE);f=0}if(a.fn.bgiframe){o.bgiframe()}}return{display:function(u,t){n();r=u;m=t;d()},next:function(){h(1)},prev:function(){h(-1)},pageUp:function(){if(f!=0&&f-8<0){h(-f)}else{h(-8)}},pageDown:function(){if(f!=k.size()-1&&f+8>k.size()){h(k.size()-1-f)}else{h(8)}},hide:function(){c&&c.hide();k&&k.removeClass(i.ACTIVE);f=-1},visible:function(){return c&&c.is(":visible")},current:function(){return this.visible()&&(k.filter("."+i.ACTIVE)[0]||e.selectFirst&&k[0])},show:function(){var v=a(j).offset();c.css({width:typeof e.width=="string"||e.width>0?e.width:a(j).width(),top:v.top+j.offsetHeight,left:v.left}).show();if(e.scroll){o.scrollTop(0);o.css({maxHeight:e.scrollHeight,overflow:"auto"});if(a.browser.msie&&typeof document.body.style.maxHeight==="undefined"){var t=0;k.each(function(){t+=this.offsetHeight});var u=t>e.scrollHeight;o.css("height",u?e.scrollHeight:t);if(!u){k.width(o.width()-parseInt(k.css("padding-left"))-parseInt(k.css("padding-right")))}}}},selected:function(){var t=k&&k.filter("."+i.ACTIVE).removeClass(i.ACTIVE);return t&&t.length&&a.data(t[0],"ac_data")},emptyList:function(){o&&o.empty()},unbind:function(){c&&c.remove()}}};a.Autocompleter.Selection=function(d,e,c){if(d.setSelectionRange){d.setSelectionRange(e,c)}else{if(d.createTextRange){var b=d.createTextRange();b.collapse(true);b.moveStart("character",e);b.moveEnd("character",c);b.select()}else{if(d.selectionStart){d.selectionStart=e;d.selectionEnd=c}}}d.focus()}})(jQuery);

var notify = function() {
    var visible = false;
    return {
        show: function(html) {
            if (html) {
                $("body").css("margin-top", "2.2em");
                $(".notify span").html(html);
            }
            $(".notify").fadeIn("slow");
            visible = true;
        },
        close: function(doPostback) {
            $(".notify").fadeOut("fast");
            $("body").css("margin-top", "0");
            visible = false;
        },
        isVisible: function() { return visible; }
    };
} ();

/*
 * jQuery outside events - v1.1 - 3/16/2010
 * http://benalman.com/projects/jquery-outside-events-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,c,b){$.map("click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup".split(" "),function(d){a(d)});a("focusin","focus"+b);a("focusout","blur"+b);$.addOutsideEvent=a;function a(g,e){e=e||g+b;var d=$(),h=g+"."+e+"-special-event";$.event.special[e]={setup:function(){d=d.add(this);if(d.length===1){$(c).bind(h,f)}},teardown:function(){d=d.not(this);if(d.length===0){$(c).unbind(h)}},add:function(i){var j=i.handler;i.handler=function(l,k){l.target=k;j.apply(this,arguments)}}};function f(i){$(d).each(function(){var j=$(this);if(this!==i.target&&!j.has(i.target).length){j.triggerHandler(e,[i.target])}})}}})(jQuery,document,"outside");

$(document).ready( function(){
    pickedTags().init();

    $('input#bnewaccount').click(function() {
        $('#bnewaccount').disabled=true;
    });
});

function yourWorkWillBeLost(e) {
    if(browserTester('chrome')) {
        return "Are you sure you want to leave?  Your work will be lost.";
    } else if(browserTester('safari')) {
        return "Are you sure you want to leave?  Your work will be lost.";
    } else {
        if(!e) e = window.event;
        e.cancelBubble = true;
        e.returnValue = 'If you leave, your work will be lost.';

        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
        return e;
    }
}

function browserTester(browserString) {
    return navigator.userAgent.toLowerCase().indexOf(browserString) > -1;
}

// Add missing IE functionality
if (!window.addEventListener) {
    if (window.attachEvent) {
        window.addEventListener = function (type, listener, useCapture) {
            window.attachEvent('on' + type, listener);
        };
        window.removeEventListener = function (type, listener, useCapture) {
            window.detachEvent('on' + type, listener);
        };
    } else {
        window.addEventListener = function (type, listener, useCapture) {
            window['on' + type] = listener;
        };
        window.removeEventListener = function (type, listener, useCapture) {
            window['on' + type] = null;
        };
    }
}



/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.1.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd otransitionend',
            'transition'       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false, $el = this
        $(this).one($.support.transition.end, function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.prototype.close = function (e) {
        var $this    = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.hasClass('alert') ? $this : $this.parent()
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            $parent.trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one($.support.transition.end, removeElement)
                .emulateTransitionEnd(150) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    var old = $.fn.alert

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.1.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
        this.$element  = $(element)
        this.options   = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
    }

    Button.DEFAULTS = {
        loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
        var d    = 'disabled'
        var $el  = this.$element
        var val  = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state = state + 'Text'

        if (!data.resetText) $el.data('resetText', $el[val]())

        $el[val](data[state] || this.options[state])

        // push to event loop to allow forms to submit
        setTimeout($.proxy(function () {
            if (state == 'loadingText') {
                this.isLoading = true
                $el.addClass(d).attr(d, d)
            } else if (this.isLoading) {
                this.isLoading = false
                $el.removeClass(d).removeAttr(d)
            }
        }, this), 0)
    }

    Button.prototype.toggle = function () {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
            var $input = this.$element.find('input')
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
                else $parent.find('.active').removeClass('active')
            }
            if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
        }

        if (changed) this.$element.toggleClass('active')
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    var old = $.fn.button

    $.fn.button = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.button')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.button', (data = new Button(this, options)))

            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
    }


    // BUTTON DATA-API
    // ===============

    $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        $btn.button('toggle')
        e.preventDefault()
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.1.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element    = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options     = options
        this.paused      =
            this.sliding     =
                this.interval    =
                    this.$active     =
                        this.$items      = null

        this.options.pause == 'hover' && this.$element
            .on('mouseenter', $.proxy(this.pause, this))
            .on('mouseleave', $.proxy(this.cycle, this))
    }

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true
    }

    Carousel.prototype.cycle =  function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
            && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getActiveIndex = function () {
        this.$active = this.$element.find('.item.active')
        this.$items  = this.$active.parent().children()

        return this.$items.index(this.$active)
    }

    Carousel.prototype.to = function (pos) {
        var that        = this
        var activeIndex = this.getActiveIndex()

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.item.active')
        var $next     = next || $active[type]()
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback  = type == 'next' ? 'first' : 'last'
        var that      = this

        if (!$next.length) {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }

        if ($next.hasClass('active')) return this.sliding = false

        var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            this.$element.one('slid.bs.carousel', function () {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
                $nextIndicator && $nextIndicator.addClass('active')
            })
        }

        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one($.support.transition.end, function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
                })
                .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid.bs.carousel')
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    var old = $.fn.carousel

    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action  = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
        var $this   = $(this), href
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        $target.carousel(options)

        if (slideIndex = $this.attr('data-slide-to')) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    })

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            $carousel.carousel($carousel.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.1.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element      = $(element)
        this.options       = $.extend({}, Collapse.DEFAULTS, options)
        this.transitioning = null

        if (this.options.parent) this.$parent = $(this.options.parent)
        if (this.options.toggle) this.toggle()
    }

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var actives = this.$parent && this.$parent.find('> .panel > .in')

        if (actives && actives.length) {
            var hasData = actives.data('bs.collapse')
            if (hasData && hasData.transitioning) return
            actives.collapse('hide')
            hasData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')
            [dimension](0)

        this.transitioning = 1

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')
                [dimension]('auto')
            this.transitioning = 0
            this.$element.trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one($.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(350)
            [dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element
            [dimension](this.$element[dimension]())
            [0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse')
            .removeClass('in')

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0
            this.$element
                .trigger('hidden.bs.collapse')
                .removeClass('collapsing')
                .addClass('collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
            [dimension](0)
            .one($.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(350)
    }

    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    var old = $.fn.collapse

    $.fn.collapse = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && option == 'show') option = !option
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
        var $this   = $(this), href
        var target  = $this.attr('data-target')
            || e.preventDefault()
            || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        var $target = $(target)
        var data    = $target.data('bs.collapse')
        var option  = data ? 'toggle' : $this.data()
        var parent  = $this.attr('data-parent')
        var $parent = parent && $(parent)

        if (!data || !data.transitioning) {
            if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
            $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
        }

        $target.collapse(option)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle   = '[data-toggle=dropdown]'
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown', relatedTarget)

            $this.focus()
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27)/.test(e.keyCode)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive || (isActive && e.keyCode == 27)) {
            if (e.which == 27) $parent.find(toggle).focus()
            return $this.click()
        }

        var desc = ' li:not(.divider):visible a'
        var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

        if (!$items.length) return

        var index = $items.index($items.filter(':focus'))

        if (e.keyCode == 38 && index > 0)                 index--                        // up
        if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
        if (!~index)                                      index = 0

        $items.eq(index).focus()
    }

    function clearMenus(e) {
        $(backdrop).remove()
        $(toggle).each(function () {
            var $parent = getParent($(this))
            var relatedTarget = { relatedTarget: this }
            if (!$parent.hasClass('open')) return
            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
            if (e.isDefaultPrevented()) return
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.1.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options   = options
        this.$element  = $(element)
        this.$backdrop =
            this.isShown   = null

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
                that.$element.find('.modal-dialog') // wait for modal to slide in
                    .one($.support.transition.end, function () {
                        that.$element.focus().trigger(e)
                    })
                    .emulateTransitionEnd(300) :
                that.$element.focus().trigger(e)
        })
    }

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one($.support.transition.end, $.proxy(this.hideModal, this))
                .emulateTransitionEnd(300) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.focus()
                }
            }, this))
    }

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(document.body)

            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                    ? this.$element[0].focus.call(this.$element[0])
                    : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                    .one($.support.transition.end, callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one($.support.transition.end, callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (callback) {
            callback()
        }
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    var old = $.fn.modal

    $.fn.modal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this   = $(this)
        var href    = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target
            .modal(option, this)
            .one('hide', function () {
                $this.is(':visible') && $this.focus()
            })
    })

    $(document)
        .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
        .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type       =
            this.options    =
                this.enabled    =
                    this.timeout    =
                        this.hoverState =
                            this.$element   = null

        this.init('tooltip', element, options)
    }

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled  = true
        this.type     = type
        this.$element = $(element)
        this.options  = this.getOptions(options)

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return
            var that = this;

            var $tip = this.tip()

            this.setContent()

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

            var pos          = this.getPosition()
            var actualWidth  = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var $parent = this.$element.parent()

                var orgPlacement = placement
                var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
                var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
                var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
                var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

                placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                        placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                            placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                                placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)
            this.hoverState = null

            var complete = function() {
                that.$element.trigger('shown.bs.' + that.type)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one($.support.transition.end, complete)
                    .emulateTransitionEnd(150) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var replace
        var $tip   = this.tip()
        var width  = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop  = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top  = offset.top  + marginTop
        offset.left = offset.left + marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth  = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            replace = true
            offset.top = offset.top + height - actualHeight
        }

        if (/bottom|top/.test(placement)) {
            var delta = 0

            if (offset.left < 0) {
                delta       = offset.left * -2
                offset.left = 0

                $tip.offset(offset)

                actualWidth  = $tip[0].offsetWidth
                actualHeight = $tip[0].offsetHeight
            }

            this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
        } else {
            this.replaceArrow(actualHeight - height, actualHeight, 'top')
        }

        if (replace) $tip.offset(offset)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
        this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function () {
        var that = this
        var $tip = this.tip()
        var e    = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            that.$element.trigger('hidden.bs.' + that.type)
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && this.$tip.hasClass('fade') ?
            $tip
                .one($.support.transition.end, complete)
                .emulateTransitionEnd(150) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function () {
        var el = this.$element[0]
        return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
            width: el.offsetWidth,
            height: el.offsetHeight
        }, this.$element.offset())
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
            placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
                placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o  = this.options

        title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

        return title
    }

    Tooltip.prototype.tip = function () {
        return this.$tip = this.$tip || $(this.options.template)
    }

    Tooltip.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
    }

    Tooltip.prototype.validate = function () {
        if (!this.$element[0].parentNode) {
            this.hide()
            this.$element = null
            this.options  = null
        }
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function () {
        clearTimeout(this.timeout)
        this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    var old = $.fn.tooltip

    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && option == 'destroy') return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.1.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip    = this.tip()
        var title   = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content')[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o  = this.options

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
    }

    Popover.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find('.arrow')
    }

    Popover.prototype.tip = function () {
        if (!this.$tip) this.$tip = $(this.options.template)
        return this.$tip
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    var old = $.fn.popover

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data && option == 'destroy') return
            if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.1.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
        var href
        var process  = $.proxy(this.process, this)

        this.$element       = $(element).is('body') ? $(window) : $(element)
        this.$body          = $('body')
        this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
        this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector       = (this.options.target
            || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            || '') + ' .nav li > a'
        this.offsets        = $([])
        this.targets        = $([])
        this.activeTarget   = null

        this.refresh()
        this.process()
    }

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.refresh = function () {
        var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

        this.offsets = $([])
        this.targets = $([])

        var self     = this
        var $targets = this.$body
            .find(this.selector)
            .map(function () {
                var $el   = $(this)
                var href  = $el.data('target') || $el.attr('href')
                var $href = /^#./.test(href) && $(href)

                return ($href
                    && $href.length
                    && $href.is(':visible')
                    && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
            })
            .sort(function (a, b) { return a[0] - b[0] })
            .each(function () {
                self.offsets.push(this[0])
                self.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function () {
        var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
        var maxScroll    = scrollHeight - this.$scrollElement.height()
        var offsets      = this.offsets
        var targets      = this.targets
        var activeTarget = this.activeTarget
        var i

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets.last()[0]) && this.activate(i)
        }

        if (activeTarget && scrollTop <= offsets[0]) {
            return activeTarget != (i = targets[0]) && this.activate(i)
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
                && scrollTop >= offsets[i]
                && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
    }

    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target

        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active')

        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    var old = $.fn.scrollspy

    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            $spy.scrollspy($spy.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        this.element = $(element)
    }

    Tab.prototype.show = function () {
        var $this    = this.element
        var $ul      = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var previous = $ul.find('.active:last a')[0]
        var e        = $.Event('show.bs.tab', {
            relatedTarget: previous
        })

        $this.trigger(e)

        if (e.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.parent('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: previous
            })
        })
    }

    Tab.prototype.activate = function (element, container, callback) {
        var $active    = container.find('> .active')
        var transition = callback
            && $.support.transition
            && $active.hasClass('fade')

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')

            element.addClass('active')

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu')) {
                element.closest('li.dropdown').addClass('active')
            }

            callback && callback()
        }

        transition ?
            $active
                .one($.support.transition.end, next)
                .emulateTransitionEnd(150) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    var old = $.fn.tab

    $.fn.tab = function ( option ) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.1.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)
        this.$window = $(window)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

        this.$element     = $(element)
        this.affixed      =
            this.unpin        =
                this.pinnedOffset = null

        this.checkPosition()
    }

    Affix.RESET = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0
    }

    Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$window.scrollTop()
        var position  = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var scrollHeight = $(document).height()
        var scrollTop    = this.$window.scrollTop()
        var position     = this.$element.offset()
        var offset       = this.options.offset
        var offsetTop    = offset.top
        var offsetBottom = offset.bottom

        if (this.affixed == 'top') position.top += scrollTop

        if (typeof offset != 'object')         offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
            offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

        if (this.affixed === affix) return
        if (this.unpin) this.$element.css('top', '')

        var affixType = 'affix' + (affix ? '-' + affix : '')
        var e         = $.Event(affixType + '.bs.affix')

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        this.affixed = affix
        this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

        this.$element
            .removeClass(Affix.RESET)
            .addClass(affixType)
            .trigger($.Event(affixType.replace('affix', 'affixed')))

        if (affix == 'bottom') {
            this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    var old = $.fn.affix

    $.fn.affix = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom) data.offset.bottom = data.offsetBottom
            if (data.offsetTop)    data.offset.top    = data.offsetTop

            $spy.affix(data)
        })
    })

}(jQuery);
