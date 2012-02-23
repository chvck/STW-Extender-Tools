jQuery(document).ready(function ($) {
    var users
        , showText = "<p class='showLink' style='cursor:pointer; color:#3F6895; text-decoration:underline;'>Show this post</p>"
        ,showSomeonePosted;
        
    function hidePosts() {
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
            
        $('.showLink').live('click', function () {
            $(this).parent().children().show();
            $(this).hide();
        });

        $('.threadauthor small').append(" - <span class='hideUser' style='display:inline; cursor:pointer; color:#3F6895; text-decoration:underline;'>Block User</span>");
     
        $('.hideUser').live('click', function () {
            var user = $(this).parent().siblings('strong').text();
            if (users.indexOf(user) === -1) {
                chrome.extension.sendRequest({msg: 'hide_user', username: user}, function (response) {
                    users = response.result.users;              
                });
                var $parent = $(this).parent().parent().parent()
                    , $post = $parent.children('.post');
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
                , quote;        

            quote = '[quote]' + $post.text() + '[/quote]';
            $('#post_content').val(quote);
            
            document.getElementById('postform').scrollIntoView();
        });  
    }

    
    chrome.extension.sendRequest({msg: 'get_options'}, function (response) {
        users = response.result.users;
        showSomeonePosted = response.result.showSomeonePosted;
        if (response.result.enableHideUsers && users) {
            hidePosts();
        }
        if (response.result.enableHideThreads && users) {
            hideThreads();
        }
        if (response.result.enableEasyQuoting) {
            addEasyQuotes();
        }
    });
});