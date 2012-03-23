jQuery(document).ready(function ($) {
    var users
        , showText = "<p class='showLink' style='cursor:pointer; color:#3F6895; text-decoration:underline;'>Show this post</p>"
        ,showSomeonePosted
		,quoteVerb;

    function stringToBool(value) {
        return value === 'true';
    }
        
    function hidePosts() {
        $('.threadauthor strong').each(function () {
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.post');
            
            if (users.indexOf($(this).text()) !== -1) {
                if (showSomeonePosted) {
                    $parent.hide();
                    $parent.after(showText);
                } else {
                    $parent.hide();
                }
            }
        });
            
        $('.showLink').live('click', function () {
            $(this).parent().children().fadeIn();
            $(this).remove();
        });

        $('.threadauthor small').append(" - <span class='hideUser' style='display:inline; cursor:pointer; color:#3F6895; text-decoration:underline;'>Block User</span>");
     
        $('.hideUser').live('click', function () {
            var user = $(this).parent().siblings('strong').text();
            if (users.indexOf(user) === -1) {
                chrome.extension.sendRequest({msg: 'hide_user', username: user}, function (response) {
                    users = response.result.users;              
                });
			}
            var $parent = $(this).parent().parent().parent()
                , $post = $parent.children('.post');
            if (showSomeonePosted) {
                $parent.fadeOut();
                $parent.after(showText);
            } else {
                $post.fadeOut();
            }
        });  
    }
   
    function hideThreads() {
        $('td.num').each(function () {
            if (users.indexOf($(this).text()) !== -1) {
                $(this).parent().hide();
            }
        });
    }

    function addEasyQuotes() {
        $('.threadauthor small').append(" - <span class='easyQuote' style='display:inline; cursor:pointer; color:#3F6895; text-decoration:underline;'>Quote</span>");
            
        $('.easyQuote').live('click', function () {
            var $parent = $(this).parent().parent().parent()
                , $post = $parent.children('.post')
				, $tmp = $(this).parent().parent().children("strong")
				, poster
                , quote;
				
			poster = $tmp.text();
            quote = '[quote=' + poster + ' ' + quoteVerb + ']' + $post.text() + '[/quote]';
            $('#post_content').val(quote);
            
            document.getElementById('postform').scrollIntoView();
        });  
    }

	function backToForumTops() {
		$('p.rss-link').after ( "Return to <a href=\"http://singletrackworld.com/forum/\">Overview</a> <a href=\"http://singletrackworld.com/forum/forum/bike-chat\">Bike Forum</a> <a href=\"http://singletrackworld.com/forum/forum/off-topic\">Chat Forum</a>" );
	}
    
    chrome.extension.sendRequest({msg: 'get_options'}, function (response) {
        users = response.result.users;
        if (!users)
        {
            users = [];
        }
        showSomeonePosted = stringToBool(response.result.showSomeonePosted);
		quoteVerb = response.result.quoteVerb;
        var isFrontPage = document.URL.indexOf('forum/topic/') === -1 ? true : false;
        if (stringToBool(response.result.enableHideUsers) && !isFrontPage) {
            hidePosts();
        }
        if (stringToBool(response.result.enableHideThreads) && users && isFrontPage) {
            hideThreads();
        }
        if (stringToBool(response.result.enableEasyQuoting)) {
            addEasyQuotes();
        }
		backToForumTops();
    });
});