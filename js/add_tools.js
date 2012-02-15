jQuery(document).ready(function ($) {
    var users
        , showText = "<p class='showLink' style='cursor:pointer; color:#3F6895; text-decoration:underline;'>Show this post</p>"; 
    
    function hidePosts(showSomeonePosted) {
        $('.threadauthor strong').each(function () {
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.post');
            
            if (users.indexOf($(this).text()) !== -1) {
                if (showSomeonePosted) {
                    $parent.hide();
                    $parent.after(showText);
                } else {
                    $post.hide();
                }
            }
        });
    }
        
    function hideThreads() {
        var users = localStorage.blockedUsers.split(',');
        
        $('td.num').each(function () {
            if (users.indexOf($(this).text()) !== -1) {
                $(this).parent().hide();
            }
        });
    }

	$('.threadauthor small').append(" - <p  class='hideUser' style='display:inline; cursor:pointer; color:#3F6895; text-decoration:underline;'>Block User</p>");    
    
    $('.showLink').live('click', function () {
		$(this).parent().children().show();
		$(this).hide();
	});
    
    $('.hideUser').click(function () {
		var user = $(this).parent().siblings('strong').text();
		if (users.indexOf(user) === -1) {
			chrome.extension.sendRequest({msg: 'hide_user', username: user}, function (response) {
			});
			var parent = $(this).parent().parent().parent();
			var post = parent.children('.post');
			post.hide();
			post.after(content);
		} 
	});
    
    chrome.extension.sendRequest({msg: 'get_options'}, function (response) {
        users = response.result.users;
        if (response.result.enableHideUsers) {
            hidePosts(response.result.showSomeonePosted);
        }
        if (response.result.enableHideThreads) {
            //hideThreads();
        }
    });
});