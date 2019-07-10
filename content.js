$(function () {
    console.log("Smart Util is on!!!");
    var urlSets = [];

    function GetQueryStrings(url) {
        var qs = [], hash;
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            qs.push(hash[0]);
            qs[hash[0]] = hash[1];
        }
        return qs;
    };

    function SetDownloadButtonContent(index, item, array) {

        if ($(item).parent().find(".downloadoptions").length || $(item).parent().find(".downloadvideo").length) {
            return;
        }

        var searchtext = item.search;
        searchtext = GetQueryStrings(searchtext)["v"];
        var downloadbutton = $("<button id='btn-downloadoptions' class='buttondwn downloadoptions' data-url='" + searchtext + "'>Download</button>");

        if ($(item).attr('id') == "wc-endpoint") {
            downloadbutton.addClass("btndown-ply-list");
        }
        $(item).parent().append(downloadbutton);

        BindDownloadoptionsButton();
    };

    function BindDownloadoptionsButton() {
        $("#btn-downloadoptions, .downloadoptions").click(function () {
            $(this).css("display", "none");
            DownloadVideo(this);
        });

    };

    function BindDynamicButton() {
        $("#btn-downloadvideo, .downloadvideo").click(function () {
            var video_id = $(this).attr("data-url");
            window.open(video_id, 'download');
        });
    };

    function DownloadVideo(element) {

        var video_id = $(element).attr("data-url");
        if (urlSets.indexOf(video_id) > -1) {
            return;
        }
        else {
            urlSets.push(video_id);
        }

        var ajax_url = 'https://www.youtube.com/get_video_info?html5=1&video_id=' + video_id;

        $.get(ajax_url, function (d1) {

            var data = YoutubeDataParser(d1)

            var video_data = data.video_info
            if (video_data == null || video_data.title == null) {                
                return;
            }

            var video_arr = video_data.url_encoded_fmt_stream_map;
            
            $.each(video_arr, function (i1, v1) {

                var downloadbutton = $("<button id='btn-downloadvideo' class='btndw-res buttondwn downloadvideo' data-url='" + v1.url + "'>" + v1.quality + "</button>");

                if ($(element).hasClass("btndown-ply-list")) {
                    downloadbutton.addClass("btndown-ply-list");
                }

                $(element).parent().append(downloadbutton);
               
            });

            BindDynamicButton();

            $(element).remove();

        });
    };

    function SetDownloadButton() {

        $(".style-scope .ytd-grid-video-renderer > a#video-title").each(SetDownloadButtonContent);

        $(".style-scope .ytd-video-renderer > a#video-title").each(SetDownloadButtonContent);

        $(".style-scope .ytd-playlist-panel-renderer > a#wc-endpoint").each(SetDownloadButtonContent);

        $("#dismissable > div.ytd-compact-video-renderer > a.ytd-compact-video-renderer").each(SetDownloadButtonContent);

        BindDownloadoptionsButton();

        BindDynamicButton();
    };

    function YoutubeDataParser(data) {
        //---> parse video data - start
        var qsToJson = function (qs) {
            var res = {};
            var pars = qs.split('&');
            var kv, k, v;
            for (i in pars) {
                kv = pars[i].split('=');
                k = kv[0];
                v = kv[1];
                res[k] = decodeURIComponent(v);
            }
            return res;
        }
        //---> parse video data - end

        var get_video_info = qsToJson(data);

        if (get_video_info.status == 'fail') {
            return { status: "error", code: "invalid_url", msg: "check your url or video id" };

        }
        else {
            // remapping urls into an array of objects

            //--->parse > url_encoded_fmt_stream_map > start

            //will get the video urls
            var tmp = get_video_info["url_encoded_fmt_stream_map"];
            if (tmp) {
                tmp = tmp.split(',');
                for (i in tmp) {
                    tmp[i] = qsToJson(tmp[i]);
                }
                get_video_info["url_encoded_fmt_stream_map"] = tmp;
            }
            //--->parse > url_encoded_fmt_stream_map > end


            //--->parse > player_response > start
            var tmp1 = get_video_info["player_response"];
            if (tmp1) {
                get_video_info["player_response"] = JSON.parse(tmp1);
            }
            //--->parse > player_response > end

            //--->parse > keywords > start
            var keywords = get_video_info["keywords"];
            if (keywords) {
                key_words = keywords.replace(/\+/g, ' ').split(',');
                for (i in key_words) {
                    keywords[i] = qsToJson(key_words[i]);
                }
                get_video_info["keywords"] = { all: keywords.replace(/\+/g, ' '), arr: key_words };
            }
            //--->parse > keywords > end

            //return data
            return { status: 'success', raw_data: qsToJson(data), video_info: get_video_info };
        }
    };

    if (window.location.href.indexOf("https://www.youtube.com") > -1) {
        //This is for the download video
        SetDownloadButton();
    }

    setInterval(function () {

        //Remove the google add from web page.
        $(".adsbygoogle").remove();

        if (window.location.href.indexOf("https://www.youtube.com") > -1) {

            //Remove the top container
            $("#top-container").remove();

            $(".adDisplay .scalable,.adDisplay, .ytp-ad-overlay-slot").remove();

            if ($(".ytp-ad-skip-button-text").length > 0) {
                var str = $(".ytp-ad-skip-button-text")[0].innerHTML;

                if (str.endsWith("Skip Ad") || str.endsWith("Skip Ads")) {
                    $(".ytp-ad-skip-button-text")[0].click();
                }

            }

            if ($("#google_companion_ad_div").length > 0) {
                $("#google_companion_ad_div").remove();
            }

            if ($("#player-ads").length > 0) {
                $("#player-ads").remove();
            }

            SetDownloadButton();

        }
        else if (window.location.href.indexOf("https://www.zee5.com/") > -1) {
            if ($("video[title='Advertisement']").length > 0) {
                $("video[title='Advertisement']").remove();
            }

            if ($(".videoAdUiPreSkipButton").length > 0) {
                var str = $(".videoAdUiPreSkipTextOnly")[0].innerHTML;

                if (str.endsWith("skip add")) {
                    $(".videoAdUiPreSkipButton")[0].click();
                }
            }

            if ($("span[role='status']").length > 0) {
                document.getElementsByClassName("jw-icon-volume")[0].click();

            }
        }
        else if (window.location.href.indexOf("https://www.techiedelight.com/") > -1) {
            $("body").css("user-select", "auto");
        }

    }, 100);

});