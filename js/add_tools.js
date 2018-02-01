jQuery(document).ready(function ($) {
    var users
        , showText = "<p class='showLink' style='cursor:pointer; color:#333; text-decoration:underline;'>Show this post</p>"
        ,showSomeonePosted
		,appendQuotes
		,quoteVerb
		,signature;

    function stringToBool(value) {
        return value === 'true';
    }
        
    function hidePosts() {
        $('.bbp-author-name').each(function () {
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.bbp-reply-content')
				, user = $(this).text();
            
            if (users && users.indexOf(user) !== -1) {
				$(this).parent().append("&emsp;<span class='unblockUser' style='display:inline; cursor:pointer; color:#333; text-decoration:underline;'>Unblock User</span>");
				if (showSomeonePosted) {
                    $parent.hide();
                    $parent.after("<p class='showLink' style='cursor:pointer; color:#333; text-decoration:underline;'>Show post from " + user + "</p" );
                } else {
                    $parent.hide();
                }
				
            } else {
				$(this).parent().append("&emsp;<span class='hideUser' style='display:inline; cursor:pointer; color:#333; text-decoration:underline;'>Block User</span>");
			}
        });
            
        $(document).on("click", ".showLink", function () {
            $(this).parent().children().fadeIn();
            $(this).remove();
        });

     
        $(document).on("click", ".hideUser", function () {
			$(this).attr('class', 'unblockUser');
			$(this).text('Unblock User');
            var user = $(this).parent().children('.bbp-author-name').text();
            if (users.indexOf(user) === -1) {
                chrome.runtime.sendMessage({msg: 'hide_user', username: user}, function (response) {
                    users = response.result.users;              
                });
			}
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.bbp-reply-content');
            if (showSomeonePosted) {
                $parent.fadeOut();
                $parent.after("<p class='showLink' style='cursor:pointer; color:#333; text-decoration:underline;'>Show post from " + user + "</p" );
            } else {
                $post.fadeOut();
            }
        });
		
        $(document).on("click", ".unblockUser", function () {
			$(this).attr('class', 'hideUser');
			$(this).text('Block User');
            var user = $(this).parent().children('.bbp-author-name').text();
            if (users.indexOf(user) != -1) {
                chrome.runtime.sendMessage({msg: 'unblock_user', username: user}, function (response) {
                    users = response.result.users;              
                });
			}
        });		
    }
   
    function hideThreads() {
        $('.bbp-author-name').each(function () {
            if (users.indexOf($(this).text()) !== -1) {
                $(this).parent().parent().hide();
            }
        });
    }
    
    function hideShare() {
        $('.addthis_toolbox').hide();
    }

    function addEasyQuotes() {
        $('.bbp-reply-author').append("&emsp;<span class='easyQuote' style='display:inline; cursor:pointer; color:#333; text-decoration:underline;'>Quote</span>");
            
        $(document).on("click", ".easyQuote", function () {
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.bbp-reply-content').children('p, blockquote, .bbcode-quote')
				, user = $(this).parent().children('.bbp-author-name').text()
                , quote;

            quote = '[b]' + user + '[/b] ' + quoteVerb + ':<blockquote>' + $post.map(function(){
					return $(this).text(); 
				}).get().join('\n') + '</blockquote>\n\n';
            
				if (appendQuotes) {
					quote = $('#bbp_reply_content').val() + '\n' + quote;
				}
				$('#bbp_reply_content').val(quote);
				document.getElementById('bbp_reply_content').focus();

        });  
    }

	function backToForumTops() {
		$('ol#thread').after ( "Return to <a href=\"/forum/\">Overview</a> <a href=\"/forum/forum/bike-chat\">Bike Forum</a> <a href=\"/forum/forum/off-topic\">Chat Forum</a>" );
	}
	
	function addSignature() {
		if ( signature != null && signature != '') {
			$('#postformsub').click(function () {
				var  $form = $(this).parent().parent().parent()
					,$text = $form.find('#post_content').val();
				$('#post_content').val($text + '\n' + signature);
			});
		}
	}
    
    chrome.runtime.sendMessage({msg: 'get_options'}, function (response) {
        users = response.result.users;
        showSomeonePosted = stringToBool(response.result.showSomeonePosted);
		quoteVerb = response.result.quoteVerb;
        if (quoteVerb === undefined) {
            quoteVerb = 'said';
        }
		appendQuotes = stringToBool(response.result.enableAppendQuotes);
		signature = response.result.signature;
        var isFrontPage = document.URL.indexOf('forum/topic/') === -1 ? true : false;
        if (stringToBool(response.result.enableHideUsers) && !isFrontPage) {
            hidePosts();
        }
        if (stringToBool(response.result.enableHideThreads) && users && isFrontPage) {
            hideThreads();
        }
        if (stringToBool(response.result.enableHideShare)) {
            hideShare();
        }
        if (stringToBool(response.result.enableEasyQuoting)) {
            addEasyQuotes();
        }
		if (stringToBool(response.result.enableSignature)) {
			addSignature();
        }
		backToForumTops();

    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === 'add_quote') {
		$('#post_content').val(request.quotetext);
	}
});
