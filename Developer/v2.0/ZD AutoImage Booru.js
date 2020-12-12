// ==UserScript==
// @name          ZD AutoImage Boorus
// @namespace     https://github.com/ZeroDrako/ZD-AutoImage-Boorus
// @version       v2.1
// @description   Add function OneClick-To-Downnload Images from Danbooru, Gelbooru, Safebooru, Sankakucomplex, Yande.re, Rule34.xxx, Furry.booru
// @author        ZeroDrako
// @updateURL     https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/ZD%20AutoImage%20Booru.last_release.js--
// @downloadURL   https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/ZD%20AutoImage%20Booru.last_release.js--
// @license       GPLv3; https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/LICENSE
// @include       http://danbooru.donmai.us/*
// @include       http://gelbooru.com/index.php*
// @include       http://safebooru.org/index.php*
// @include       https://chan.sankakucomplex.com/*
// @include       https://yande.re/*
// @include       http://rule34.xxx/index.php*
// @include       http://furry.booru.org/index.php*
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @require       https://raw.githubusercontent.com/ZeroDrako/Libs/master/jQuery/v1/jquery-1.12.2.min.js
// @require       https://raw.githubusercontent.com/ZeroDrako/Libs/master/FileSaver/v1.1.20160328/FileSaver.min.js
// @icon          http://i1236.photobucket.com/albums/ff444/ZeroDrako/128_zpstpkixbgq.png
// ==/UserScript==
/* globals $, saveAs, toastr */

var ehDownloadStyle = '\
	@-webkit-keyframes progress { \
		from { -webkit-transform: translateX(-50%) scaleX(0); transform: translateX(-50%) scaleX(0); } \
		60% { -webkit-transform: translateX(15%) scaleX(0.7); transform: translateX(15%) scaleX(0.7); } \
		to { -webkit-transform: translateX(50%) scaleX(0); transform: translateX(50%) scaleX(0); } \
	} \
	@-moz-keyframes progress { \
		from { -moz-transform: translateX(-50%) scaleX(0); transform: translateX(-50%) scaleX(0); } \
		60% { -moz-transform: translateX(15%) scaleX(0.7); transform: translateX(15%) scaleX(0.7); } \
		to { -moz-transform: translateX(50%) scaleX(0); transform: translateX(50%) scaleX(0); } \
	} \
	@-ms-keyframes progress { \
		from { -ms-transform: translateX(-50%) scaleX(0); transform: translateX(-50%) scaleX(0); } \
		60% { -ms-transform: translateX(15%) scaleX(0.7); transform: translateX(15%) scaleX(0.7); } \
		to { -ms-transform: translateX(50%) scaleX(0); transform: translateX(50%) scaleX(0); } \
	} \
	@keyframes progress { \
		from { -webkit-transform: translateX(-50%) scaleX(0); transform: translateX(-50%) scaleX(0); } \
		60% { -webkit-transform: translateX(15%) scaleX(0.7); transform: translateX(15%) scaleX(0.7); } \
		to { -webkit-transform: translateX(50%) scaleX(0); transform: translateX(50%) scaleX(0); } \
	} \
	.ehD-box { margin: 20px auto; width: 732px; box-sizing: border-box; font-size: 12px; border: 1px groove #000000; }\
	.ehD-box a { cursor: pointer; }\
	.ehD-box .g2 { display: inline-block; margin: 10px; padding: 0; line-height: 14px; }\
	.ehD-box legend { font-weight: 700; padding: 0 10px; } \
	.ehD-box legend a { color: inherit; text-decoration: none; }\
	.ehD-box input[type="text"] { width: 250px; }\
	.ehD-box-extend input[type="text"] { width: 255px; }\
	.ehD-box input::placeholder { color: #999999; -webkit-text-fill-color: #999999; }\
	.ehD-setting { position: fixed; left: 0; right: 0; top: 0; bottom: 0; padding: 5px; border: 1px solid #000000; background: #34353b; color: #dddddd; width: 600px; height: 380px; max-width: 100%; max-height: 100%; overflow-x: hidden; overflow-y: auto; box-sizing: border-box; margin: auto; z-index: 999; text-align: left; font-size: 12px; outline: 5px rgba(0, 0, 0, 0.25) solid; }\
	.ehD-setting-tab { list-style: none; margin: 5px 0; padding: 0 10px; border-bottom: 1px solid #cccccc; overflow: auto; }\
	.ehD-setting-tab li { float: left; padding: 5px 10px; border-bottom: 0; cursor: pointer; }\
	.ehD-setting[data-active-setting="basic"] li[data-target-setting="basic"], .ehD-setting[data-active-setting="advanced"] li[data-target-setting="advanced"] { font-weight: bold; background: #cccccc; color: #000000; }\
	.ehD-setting-main { overflow: hidden }\
	.ehD-setting-wrapper { width: 200%; overflow: hidden; -webkit-transform: translateX(0%); -moz-transform: translateX(0%); -o-transform: translateX(0%); -ms-transform: translateX(0%); transform: translateX(0%); -webkit-transition: all 0.5s cubic-bezier(0.86, 0, 0.07, 1); -moz-transition: all 0.5s cubic-bezier(0.86, 0, 0.07, 1); -o-transition: all 0.5s cubic-bezier(0.86, 0, 0.07, 1); -ms-transition: all 0.5s cubic-bezier(0.86, 0, 0.07, 1); transition: all 0.5s cubic-bezier(0.86, 0, 0.07, 1); }\
	.ehD-setting[data-active-setting="advanced"] .ehD-setting-wrapper { -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -o-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(-50%); }\
	.ehD-setting-content { width: 50%; float: left; box-sizing: border-box; padding: 5px 10px; height: 295px; max-height: calc(100vh - 85px); overflow: auto; }\
	.ehD-setting .g2 { padding-bottom: 10px; }\
	.ehD-setting input, .ehD-box input, .ehD-setting select, .ehD-box select { vertical-align: middle; top: 0; margin: 0; }\
	.ehD-setting input[type="text"], .ehD-box input[type="text"], .ehD-setting input[type="number"] { height: 18px; padding: 0 0 0 3px; line-height: 18px; border-radius: 3px; }\
	.ehD-setting input[type="text"], .ehD-setting input[type="number"] { border: 1px solid #8d8d8d; } \
	.ehD-setting input[type="checkbox"] { margin: 3px 3px 4px 0 } \
	.ehD-setting select { padding: 0 3px 1px; } \
	.ehD-setting-note { border: 1px dashed #999999; padding: 10px 10px 0 10px; }\
	.ehD-setting-footer { text-align: center; margin-top: 5px; border-top: 1px solid #cccccc; padding-top: 5px; }\
	.ehD-setting sup { vertical-align: top; }\
	.ehD-setting a { color: #ffffff; }\
	.ehD-box input[type="number"] { height: 17px; }\
	.ehD-dialog progress { height: 12px; -webkit-appearance: none; border: 1px solid #4f535b; color: #4f535b; background: #34353b; position: relative; } \
	.ehD-dialog progress::-webkit-progress-bar { background: #34353b; } \
	.ehD-dialog progress::-webkit-progress-value { background: #4f535b; -webkit-transition: all 0.2s ease; transition: all 0.2s ease; } \
	.ehD-dialog progress::-moz-progress-bar { background: #4f535b; -moz-transition: all 0.2s ease; transition: all 0.2s ease; } \
	.ehD-dialog progress::-ms-fill { background: #4f535b; -ms-transition: all 0.2s ease; transition: all 0.2s ease; } \
	.ehD-dialog progress:not([value])::after { content: ""; will-change: transform; width: 100%; height: 100%; left: 0; top: 0; display: block; background: #4f535b; position: absolute; -webkit-animation: progress 1s linear infinite; -moz-animation: progress 1s linear infinite; -ms-animation: progress 1s linear infinite; animation: progress 1s linear infinite; } \
	.ehD-dialog progress:not([value])::-moz-progress-bar { width: 0px !important; } \
	.ehD-pt { table-layout: fixed; width: 100%; }\
	.ehD-pt-name { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }\
	.ehD-pt-progress-outer { width: 160px; position: relative; }\
	.ehD-pt-progress { width: 150px; }\
	.ehD-pt-progress-text { position: absolute; width: 100%; text-align: center; color: #b8b8b8; left: 0; right: 0; }\
	.ehD-pt-status { width: 130px; }\
	.ehD-pt-succeed .ehD-pt-status { color: #00ff00; }\
	.ehD-pt-warning .ehD-pt-status { color: #ffff00; }\
	.ehD-pt-failed .ehD-pt-status { color: #ff0000; }\
	.ehD-pt-abort { color: #ffff00; display: none; cursor: pointer; }\
	.ehD-pt-status[data-inited-abort]:hover .ehD-pt-abort, .ehD-pt-failed .ehD-pt-status[data-inited-abort]:hover .ehD-pt-status-text, .ehD-pt-succeed .ehD-pt-status[data-inited-abort]:hover .ehD-pt-status-text { display: inline; }\
	.ehD-pt-status[data-inited-abort]:hover .ehD-pt-status-text, .ehD-pt-failed .ehD-pt-status[data-inited-abort]:hover .ehD-pt-abort, .ehD-pt-succeed .ehD-pt-status[data-inited-abort]:hover .ehD-pt-abort { display: none; }\
	.ehD-pt-gen-progress { width: 50%; }\
	.ehD-pt-gen-filename { margin-bottom: 1em; }\
	.ehD-dialog { position: fixed; right: 0; bottom: 0; display: none; padding: 5px; border: 1px solid #000000; background: #34353b; color: #dddddd; width: 550px; height: 300px; overflow: auto; z-index: 999; word-break: break-all; }\
	.ehD-status { position: fixed; right: 0; bottom: 311px; width: 550px; padding: 5px; border: 1px solid #000000; background: #34353b; color: #dddddd; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -o-user-select: none; -ms-user-select: none; user-select: none; }\
	.ehD-dialog, .ehD-status { -webkit-transition: margin 0.5s ease; -moz-transition: margin 0.5s ease; -o-transition: margin 0.5s ease; -ms-transition: margin 0.5s ease; transition: margin 0.5s ease; }\
	.ehD-dialog.hidden, .ehD-dialog.hidden .ehD-status { margin-bottom: -311px; }\
	.ehD-dialog .ehD-force-download-tips { position: fixed; right: 0; bottom: 288px; border: 1px solid #000000; width: 550px; padding: 5px; background: rgba(0, 0, 0, 0.75); color: #ffffff; cursor: pointer; opacity: 0; pointer-events: none; -webkit-transition: opacity 0.5s ease, bottom 0.5s ease; -moz-transition: opacity 0.5s ease, bottom 0.5s ease; -o-transition: opacity 0.5s ease, bottom 0.5s ease; -ms-transition: opacity 0.5s ease, bottom 0.5s ease; transition: opacity 0.5s ease, bottom 0.5s ease; }\
	.ehD-dialog:hover .ehD-force-download-tips { opacity: 1; }\
	.ehD-dialog.hidden .ehD-force-download-tips { bottom: -24px; }\
	.ehD-close-tips { position: fixed; left: 0; right: 0; bottom: 0; padding: 10px; border: 1px solid #000000; background: #34353b; color: #dddddd; width: 732px; max-width: 100%; max-height: 100%; overflow-x: hidden; overflow-y: auto; box-sizing: border-box; margin: auto; z-index: 1000; text-align: left; font-size: 14px; outline: 5px rgba(0, 0, 0, 0.25) solid; }\
	.ehD-feedback { position: absolute; right: 5px; top: 14px; }\
';


var ehDownloadBox = document.createElement('fieldset');
ehDownloadBox.className = 'ehD-box';
var ehDownloadBoxTitle = document.createElement('legend');
ehDownloadBoxTitle.innerHTML = 'E-Hentai Downloader <span class="ehD-box-limit"></span> <span class="ehD-box-cost"></span>';
if (origin.indexOf('exhentai.org') >= 0) ehDownloadBoxTitle.style.color = '#ffff66';
ehDownloadBox.appendChild(ehDownloadBoxTitle);
var ehDownloadStylesheet = document.createElement('style');
ehDownloadStylesheet.textContent = ehDownloadStyle;
ehDownloadBox.appendChild(ehDownloadStylesheet);

var ehDownloadArrow = '<img src="data:image/gif;base64,R0lGODlhBQAHALMAAK6vr7OztK+urra2tkJCQsDAwEZGRrKyskdHR0FBQUhISP///wAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAFAAcAAAQUUI1FlREVpbOUSkTgbZ0CUEhBLREAOw==">';

var ehDownloadAction = document.createElement('div');
ehDownloadAction.className = 'g2';
ehDownloadAction.innerHTML = ehDownloadArrow + ' <a>Download Archive</a>';
ehDownloadAction.addEventListener('click', function(event) {
    event.preventDefault();

    var torrentsNode = document.querySelector('#gd5 a[onclick*="gallerytorrents.php"]');
    var torrentsCount = torrentsNode ? torrentsNode.textContent.match(/\d+/)[0] - 0 : 0;
    if (isDownloading && !confirm('E-Hentai Downloader is working now, are you sure to stop downloading and start a new download?')) return;
    else if (!setting['ignore-torrent'] && torrentsCount > 0 && !confirm('There are ' + torrentsCount + ' torrent(s) available for this gallery. You can download the torrent(s) to get a stable and controllable download experience without spending your image limits, or even get bonus content.\n\nContinue downloading with E-Hentai Downloader (Yes) or use torrent(s) directly (No)?\n(You can disable this notification in the Settings)')) {
        return torrentsNode.dispatchEvent(new MouseEvent('click'));
    }
    if (unsafeWindow.apiuid === -1 && !confirm('You are not logged in to E-Hentai Forums, so you can\'t download original image. Continue?')) return;
    ehDownloadDialog.innerHTML = '';

    initEHDownload();
});
ehDownloadBox.appendChild(ehDownloadAction);

var ehDownloadNumberInput = document.createElement('div');
ehDownloadNumberInput.className = 'g2';
ehDownloadNumberInput.innerHTML = ehDownloadArrow + ' <a><label><input type="checkbox" style="vertical-align: middle; margin: 0;"> Number Images</label></a>';
ehDownloadBox.appendChild(ehDownloadNumberInput);

var ehDownloadRange = document.createElement('div');
ehDownloadRange.className = 'g2';
ehDownloadRange.innerHTML = ehDownloadArrow + ' <a><label>Pages Range <input type="text" placeholder="eg. -10,12,14-20,27,30-40/2,50-60/3,70-"></label></a>';
ehDownloadBox.appendChild(ehDownloadRange);

var ehDownloadSetting = document.createElement('div');
ehDownloadSetting.className = 'g2';
ehDownloadSetting.innerHTML = ehDownloadArrow + ' <a>Settings</a>';
ehDownloadSetting.addEventListener('click', function(event) {
    event.preventDefault();
    showSettings();
});
ehDownloadBox.appendChild(ehDownloadSetting);

document.body.insertBefore(ehDownloadBox, document.getElementById('asm') || document.querySelector('.gm').nextElementSibling);

var ehDownloadDialog = document.createElement('div');
ehDownloadDialog.className = 'ehD-dialog';
document.body.appendChild(ehDownloadDialog);

var ehDownloadStatus = document.createElement('div');
ehDownloadStatus.className = 'ehD-status';
ehDownloadStatus.addEventListener('click', function(event) {
    event.preventDefault();
    ehDownloadDialog.classList.toggle('hidden');
});

var ehDownloadPauseBtn = document.createElement('button');
ehDownloadPauseBtn.className = 'ehD-pause';
ehDownloadPauseBtn.textContent = 'Pause';
ehDownloadPauseBtn.addEventListener('click', function(event) {
    if (!isPausing) {
        isPausing = true;
        ehDownloadPauseBtn.textContent = 'Resume';

        if (setting['force-pause']) {
            // waiting Tampermonkey for transfering string to ArrayBuffer, it may stuck for a second 
            setTimeout(function() {
                for (var i = 0; i < fetchThread.length; i++) {
                    if (typeof fetchThread[i] !== 'undefined' && 'abort' in fetchThread[i]) fetchThread[i].abort();

                    if (imageData[i] === 'Fetching' && retryCount[i] < (setting['retry-count'] !== undefined ? setting['retry-count'] : 3)) {
                        var elem = progressTable.querySelector('tr[data-index="' + i + '"] .ehD-pt-status-text');
                        if (elem) elem.textContent = 'Force Paused';

                        elem = progressTable.querySelector('tr[data-index="' + i + '"] .ehD-pt-progress-text');
                        if (elem) elem.textContent = '';

                        imageData[i] = null;
                        //fetchCount = 0; // fixed for async
                        fetchCount--;

                        updateTotalStatus();
                    }
                }
            }, 0);
        }

        if (emptyAudio) {
            emptyAudio.pause();
        }
    } else {
        isPausing = false;
        ehDownloadPauseBtn.textContent = setting['force-pause'] ? 'Pause (Downloading images will be aborted)' : 'Pause (Downloading images will keep downloading)';

        checkFailed();
    }
});

window.addEventListener('focus', function() {
    if (setting['status-in-title'] === 'blur') {
        if (!needTitleStatus) return;
        document.title = pretitle;
        needTitleStatus = false;
    }
});

window.addEventListener('blur', function() {
    if (isDownloading && setting['status-in-title'] === 'blur') {
        needTitleStatus = true;
        document.title = '[' + (isPausing ? '❙❙' : downloadedCount < totalCount ? '↓ ' + downloadedCount + '/' + totalCount : totalCount === 0 ? '↓' : '√') + '] ' + pretitle;
    }
});

var forceDownloadTips = document.createElement('div');
forceDownloadTips.className = 'ehD-force-download-tips';
forceDownloadTips.innerHTML = 'If an error occured and script doesn\'t work, click <a href="javascript: getzip();" style="font-weight: bold; pointer-events: auto;" title="Force download won\'t stop current downloading task.">here</a> to force get your downloaded images.';
forceDownloadTips.getElementsByTagName('a')[0].addEventListener('click', function(event) {
    // fixed permission denied on GreaseMonkey
    event.preventDefault();
    saveDownloaded(true);
});

var closeTips = document.createElement('div');
closeTips.className = 'ehD-close-tips';
closeTips.innerHTML = 'E-Hentai Downloader is still running, please don\'t close this tab until it finished downloading.<br><br>If any bug occured and the script doesn\'t work correctly, you can move your mouse pointer onto the progress box, and force to save downloaded images before you leave.';

var downFiles = [],
    yandere = false,
    sankaku = false,
    danbooru = false,
    gelbooru = false,
    safebooru = false,
    rule34 = false,
    furry = false,
    url = window.location.href;

downFiles = StringToFiles(GM_getValue("Files", ""));

function LoadVarPerSite() {
    //Add CSS for Panel Options
    GM_addStyle('.ZDOptionTitle{font-size:12px;font-weight:bold;padding-bottom:1%}#ZDdirselect{display:none}#ZDtitle{padding-top:20px}.ZDOptionDown{font-weight:400;float:right!important;margin-right:12%;font-size:11px;border:1px solid #EAEAEA}#ZDdirectory{color:#666;border:1px solid #202529;background:#000}');
    //Add CSS for Progress Bars, style from bootstrap: https://getbootstrap.com/docs/5.0/components/progress/
    GM_addStyle('@-webkit-keyframes progress-bar-stripes{0%{background-position-x:1rem}}@keyframes progress-bar-stripes{0%{background-position-x:1rem}}.progress{display:flex;height:1rem;overflow:hidden;font-size:.75rem;background-color:#e9ecef;border-radius:.25rem}.progress-bar{display:flex;flex-direction:column;justify-content:center;overflow:hidden;color:#fff;text-align:center;white-space:nowrap;background-color:#0d6efd;transition:width .6s ease}@media(prefers-reduced-motion:reduce){.progress-bar{transition:none}}.progress-bar-striped{background-image:linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.progress-bar-animated{-webkit-animation:1s linear infinite progress-bar-stripes;animation:1s linear infinite progress-bar-stripes}@media(prefers-reduced-motion:reduce){.progress-bar-animated{-webkit-animation:none;animation:none}');
    if (/yande\.re/.test(url)) {
        yandere = true;
        GM_addStyle('.ZDOptionTitle{color:#ee8887!important}#ZDtitle{font-size:14px}.ZDOptionDown{color:#ffbbbb;background:#222}.ZDOptionDown:hover{background:#ee8887;color:white}a.directlink{margin-top:5px!important}');
    } else if (/chan\.sankaku/.test(url)) {
        sankaku = true;
        GM_addStyle('.ZDOptionTitle{color:#FF761C!important;font-size:12px;font-weight:bold;padding-bottom:1%}#ZDdirselect{display:none}#ZDdirhelp{margin-right:10%!important;padding:1%!important}#ZDtitle{padding-top:20px;font-size:13px}.ZDOptionDown{float:right!important;margin-right:12%;font-size:11px;font-weight:400!important;color:black;border:1px solid #DDDDDD!important;background:#FAFAFA}.ZDOptionDown:hover{background:#FF761C!important;color:white!important}#ZDdirectory{color:#666;border:1px solid #202529;background:#000}div.content{padding-left:250px!important}');
        try {
            MutationEvent();
        } catch (e) {
            console.log(e);
        }
    } else if (/danbooru\.donmai\.us/.test(url)) {
        danbooru = true;
        GM_addStyle('.ZDOptionTitle{color:#0073ff!important;list-style-type:none}#ZDtitle{color:#0073ff;font-size:14px}.ZDOptionDown{color:black;border:1px solid #EAEAEA;background:white}.ZDOptionDown:hover{background:#F7F7FF;color:black}article.post-preview{height:170px!important}');
    } else if (/gelbooru/.test(url)) {
        gelbooru = true;
        GM_addStyle('.ZDOptionTitle{color:#1A7FFC!important;list-style-type:none}#ZDtitle{color:black;font-size:18px!important;padding-bottom:10px}.ZDOptionDown{color:black;border:1px solid #EAEAEA;background:white}.ZDOptionDown:hover{background:#E29900;color:white}article.post-preview{height:170px!important}');
    } else if (/safebooru/.test(url)) {
        safebooru = true;
        GM_addStyle('.ZDOptionTitle{color:#006FFA!important;font-size:12px;font-weight:bold;padding-bottom:1%;list-style-type:none}#ZDdirselect{display:none}#ZDtitle{color:black;padding-top:20px;font-size:13px!important;padding-bottom:10px}.ZDOptionDown{float:right!important;margin-right:12%;font-size:11px;font-weight:400;color:black;border:1px solid #EAEAEA;background:white}.ZDOptionDown:hover{background:#D9E6F7}#ZDdirectory{color:#666;border:1px solid #202529;background:#000}article.post-preview{height:170px!important}');
    } else if (/rule34\.xxx/.test(url)) {
        rule34 = true;
        GM_addStyle('.ZDOptionTitle{color:#009!important;list-style-type:none}#ZDtitle{color:black;font-size:15px!important;padding-bottom:10px}.ZDOptionDown{color:black;border:1px solid #EAEAEA;background:#8ABC8B}.ZDOptionDown:hover{background:#8ABC8B;color:white}article.post-preview{height:170px!important}');
    } else if (/furry\.booru/.test(url)) {
        furry = true;
        GM_addStyle('.ZDOptionTitle{color:#1A7FFC!important;list-style-type:none}#ZDtitle{color:black;font-size:14px!important;padding-bottom:10px}.ZDOptionDown{color:black;border:1px solid #EAEAEA;background:white}.ZDOptionDown:hover{background:#E29900;color:white}article.post-preview{height:170px!important}');
    } else {
        return;
    }
}

function LoadPreferences() {
    try {
        document.getElementById('ZDalertdialog').value = GM_getValue("ArtDialog", false);
        document.getElementById('ZDdownone').value = GM_getValue("DownloadOne", false);
        document.getElementById('ZDdownorig').value = GM_getValue("DownloadOrig", false);
        document.getElementById('ZDaddnews').value = GM_getValue("AddNewsFiles", false);
        document.getElementById('ZDnumfiles').innerHTML = StringToFiles(GM_getValue("Files", "")).length;
    } catch (event) {
        console.log(event.id + ' >>> ' + event.message);
    }
}

function AddSettingPanel() {
    var settingPanel = document.createElement('div');
    settingPanel.id = 'ZDpopup';
    settingPanel.innerHTML = '<div id=ZDtitle><h5>ZD AutoImage Booru v1</h5></div><div class=wrap><form id=translateForm><div><li class=ZDOptionTitle>Down One?<select class=ZDOptionDown id=ZDdownone><option value=false>No<option value=true>Yes</select><li class=ZDOptionTitle>Down Orig?<select class=ZDOptionDown id=ZDdownorig><option value=false>No<option value=true>Yes</select><li class=ZDOptionTitle>Add News?<select class=ZDOptionDown id=ZDaddnews><option value=false>No<option value=true>Yes</select><li class=ZDOptionTitle>Alert Dial?<select class=ZDOptionDown id=ZDalertdialog><option value=false>No<option value=true>Yes</select><li class=ZDOptionTitle>Files:<h7 id=ZDnumfiles></h7><input id=ZDdirselect type=file directory multiple webkitdirectory> <input id=ZDdirhelp type=button class=ZDOptionDown onclick=\'document.getElementById("ZDdirselect").click()\'value=Browse...></div><p class=ZDoption id=ZDsaved></form></div>';
    var query = '';
    if (yandere || sankaku) {
        query = 'div.sidebar > div';
    } else if (danbooru) {
        query = '#sidebar > section#search-box';
    } else if (gelbooru || safebooru || rule34 || furry) {
        query = '#post-list > div.sidebar > div';
    } else {
        return;
    }
    document.querySelector(query).appendChild(settingPanel);

    function HideShow(opres) {
        var saved;

        function show() {
            saved = document.getElementById("ZDsaved").innerHTML = opres;
        }

        function hide() {
            saved = document.getElementById("ZDsaved").innerHTML = "&nbsp;";
        }
        setTimeout(show, 100);
        setTimeout(hide, 200);
        setTimeout(show, 300);
        setTimeout(hide, 400);
        setTimeout(show, 500);
        setTimeout(hide, 1500);
    }
    settingPanel.addEventListener('change', function(event) {
        switch (event.target.id) {
            case 'ZDalertdialog':
                GM_setValue("ArtDialog", document.getElementById('ZDalertdialog').value === "true" ? true : false);
                HideShow("Saved!!!");
                break;
            case 'ZDdownone':
                GM_setValue("DownloadOne", document.getElementById('ZDdownone').value === "true" ? true : false);
                HideShow("Saved!!!");
                break;
            case 'ZDdownorig':
                GM_setValue("DownloadOrig", document.getElementById('ZDdownorig').value === "true" ? true : false);
                HideShow("Saved!!!");
                break;
            case 'ZDaddnews':
                GM_setValue("AddNewsFiles", document.getElementById('ZDaddnews').value === "true" ? true : false);
                HideShow("Saved!!!");
                break;
            case 'ZDdirselect':
                var files = event.target.files;
                if (files.length !== 0) {
                    for (var i = 0, f, downFiles = []; f = files[i]; i++) {
                        if (f.type.match('image.*') || f.type.match('video.webm')) {
                            downFiles.push(f.name);
                        }
                    }
                    GM_setValue("Files", FilesToString(downFiles));
                    document.getElementById('ZDnumfiles').innerHTML = StringToFiles(GM_getValue("Files", "")).length;
                    HideShow("Saved!!!");
                }
                break;
            default:
                HideShow("Canceled!!!");
                break;
        }
    });
}

function MutationEvent() {
    //MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var obs = new MutationObserver(function(mutations, observer) {
        for (var i = 0; i < mutations.length; ++i) {
            for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                if (mutations[i].addedNodes[j].getAttribute('class') === "content-page") {
                    AddProgressBar(mutations[i].addedNodes[j].getAttribute('id'));
                }
            }
        }
    });
    obs.observe((document.querySelector('#post-list > div.content')), {
        childList: true
    });
}

function AddProgressBar(idNewDiv) {
    var toop, pre;
    if (yandere) {
        pre = 'p';
        toop = document.querySelectorAll('#post-list-posts > li');
    } else if (sankaku) {
        pre = 'p';
        if (idNewDiv !== null) {
            toop = document.querySelectorAll('.content > div[id="' + idNewDiv + '"] > span');
        } else {
            toop = document.querySelectorAll('.content > div > span');
        }
    } else if (danbooru) {
        pre = 'post_';
        toop = document.querySelectorAll('div#posts > div > article');
    } else if (gelbooru || safebooru || rule34 || furry) {
        pre = 's';
        toop = document.querySelectorAll('#post-list > div.content > div > span.thumb');
    } else {
        return;
    }
    for (var i = 0; i < toop.length; i++) {
        var div1 = document.createElement('div'),
            div2 = document.createElement('div'),
            name = GetNameCheck((toop[i].id));
        div1.setAttribute('class', 'progress');
        div1.setAttribute('style', 'height: 12px;')
        div1.setAttribute('id', ((toop[i].id).replace(pre, 'ZdBarE')));
        div2.setAttribute('class', 'progress-bar');
        div2.setAttribute('id', ((toop[i].id).replace(pre, 'ZdBarI')));
        div2.setAttribute('style', 'width:0%');
        downFiles.forEach(function(element) {
            if (element.match(name)) {
                div2.setAttribute('style', 'width:100%; background-color: #5CB85C;');
            }
        });
        div2.setAttribute('role', 'progressbar');
        if (GM_getValue("DownloadOne")) {
            div1.addEventListener('click', GownloadOne);
        }
        div1.appendChild(div2);
        toop[i].appendChild(div1);
    }
}

function GownloadOne() {
    var idImg = (this.id).replace('ZdBarE', '');
    var barId = '#ZdBarI' + idImg;
    GetLink(idImg, barId);
}

function GetLink(idImg, barId) {
    var source, parser = new DOMParser(),
        bar = document.querySelector(barId);
    bar.classList.add("active");
    bar.style = 'width: 5%; background-color: #F0AD4E;';
    if (yandere) {
        source = document.querySelector('#post-list-posts > li[id="p' + idImg + '"] > div.inner > a.thumb').href;
    } else if (sankaku) {
        source = document.querySelector('.content > div > span[id="p' + idImg + '"] > a').href;
    } else if (danbooru) {
        source = document.querySelector('div#posts > div > article[id="post_' + idImg + '"]').getAttribute('data-file-url');
        source = 'http://danbooru.donmai.us' + source;
        var name = GetNameDown(source);
        DownloadCheck(source, name, barId);
        return;
    } else if (gelbooru || safebooru || rule34 || furry) {
        source = document.querySelector('#post-list > div.content > div > span[id="s' + idImg + '"] > a').href;
    } else {
        console.log('Fail at \'getLink\' >>> ' + idImg);
        return;
    }
    GM_xmlhttpRequest({
        url: source,
        method: "GET",
        responseType: 'text',
        onreadystatechange: function(res) {
            if (res.readyState === 4 && res.status === 404) {
                console.log('Fail at \'getLink > GM_xmlhttpRequest\' >>> ' + source);
            }
            if (res.readyState === 4 && res.status === 200) {
                var dom = parser.parseFromString(res.response, "text/html");
                var siz = null,
                    source = null;
                if (yandere) {
                    siz = dom.querySelectorAll('#post-view > .sidebar > div:nth-of-type(4) a[id]');
                    if (GM_getValue("DownloadOrig")) {
                        source = ((siz[siz.length - 1]).getAttribute('href'));
                    } else {
                        source = ((siz[siz.length - 2]).getAttribute('href'));
                        if (source.indexOf('files.yande.re') === -1) {
                            source = ((siz[siz.length - 1]).getAttribute('href'));
                        }
                    }
                } else if (sankaku) {
                    siz = dom.querySelectorAll('.sidebar  #stats > ul > li > a[id]');
                    if (GM_getValue("DownloadOrig")) {
                        source = ('https:' + (siz[siz.length - 1]).getAttribute('href')).replace(/(\?(\d+))$/g, '');
                    } else {
                        source = ('https:' + (siz[siz.length - 2]).getAttribute('href')).replace(/(\?(\d+))$/g, '');
                        if (source.indexOf('cs.sankakucomplex.com/data/') === -1) {
                            source = ('https:' + (siz[siz.length - 1]).getAttribute('href')).replace(/(\?(\d+))$/g, '');
                        }
                    }
                } else if (gelbooru) {
                    source = dom.querySelector('div.sidebar3 > div > ul > li > a[href][style]').getAttribute('href');
                } else if (safebooru || rule34 || furry) {
                    if (GM_getValue("DownloadOrig")) {
                        source = dom.querySelector('#post-view > .sidebar > div > ul > li > a[href][style]').getAttribute('href');
                    } else {
                        try {
                            source = dom.querySelector('#right-col > div > img').getAttribute('src').replace(/(\?(\d+))$/g, '');
                        } catch (e) {
                            source = dom.querySelector('#right-col > div > video > source').getAttribute('src').replace(/(\?(\d+))$/g, '');
                        }
                    }
                    if (rule34) {
                        source = 'http:' + source;
                    }
                }
                var name = GetNameDown(source);
                DownloadCheck(source, name, barId);
            }
        },
        onerror: function(res) {
            bar.style = 'width: 100%; background-color: #D9534F;';
            bar.classList.remove("active");
            console.log(res);
        }
    });
}

function GetNameDown(source) {
    var strIdx = source.lastIndexOf("/") + 1;
    var toDelete = ["\\?e=.+"];
    toDelete.forEach(function(regx) {
        console.log(regx);
        source = source.replace(new RegExp(regx, "gm"), "");
    });
    var endIdx = source.length;
    return DecodeURLRecursively(source.substring(strIdx, endIdx));
    /*
    if(sankaku)
    {
        return decodeURLRecursively(source.substring(source.lastIndexOf("/") + 1, source.lastIndexOf('?e=')));
    }
    else
    {
        return decodeURLRecursively(source.substring(source.lastIndexOf("/") + 1));
    }
    */
}

function GetNameCheck(idImg) {
    var source;
    if (yandere) {
        source = (document.querySelector('#post-list-posts > li[id="' + idImg + '"] img')).getAttribute('title');
        source = source.substring(source.indexOf('Tags:') + 5, source.indexOf('User:')).trim();
        return source;
    } else if (sankaku) {
        source = document.querySelector('.content > div > span[id="' + idImg + '"] > a > img').src;
        source = source.substring((source.lastIndexOf('/') + 1), source.lastIndexOf('.'));
        return source;
    } else if (danbooru) {
        source = document.querySelector('div#posts > div > article[id="' + idImg + '"]').getAttribute('data-file-url');
        source = source.substring((source.lastIndexOf('/') + 1), source.lastIndexOf('.'));
        return source;
    } else if (gelbooru || safebooru || rule34 || furry) {
        source = document.querySelector('#post-list > div.content > div > span[id="' + idImg + '"] > a > img').src;
        source = source.substring((source.lastIndexOf('/') + 1), source.lastIndexOf('.')).replace('thumbnail_', '');
        return source;
    } else {
        console.log('Fail at \'getLink\' >>> ' + idImg);
        return 'unknow';
    }
}

function DownloadCheck(source, name, barId) {
    var bar = document.querySelector(barId);
    if (downFiles.indexOf(name) !== -1) {
        if (GM_getValue("ArtDialog")) {
            var r = confirm("File already Downloaded, Download Again???");
            if (r === true) {
                DownloadImage(source, name, barId);
            } else {
                bar.classList.remove("active");
                bar.style = 'width: 100%; background-color: #5CB85C;';
            }
        } else {
            bar.classList.remove("active");
            bar.style = 'width: 100%; background-color: #5CB85C;';
            console.log('File already Downloaded!!!');
        }
    } else {
        DownloadImage(source, name, barId);
    }
}

function DownloadImage(source, name, barId) {
    console.log(source);
    console.log(name);
    var bar = document.querySelector(barId);
    bar.style = 'width: 0%;';
    GM_xmlhttpRequest({
        url: source,
        method: "GET",
        responseType: 'blob',
        onreadystatechange: function(res) {
            if (res.readyState === 4 && res.status === 404) {
                console.log('Fail at \'downloadImage > GM_xmlhttpRequest\' >>> ' + source);
            }
            if (res.readyState === 4 && res.status === 200) {
                if (GM_getValue("AddNewsFiles")) {
                    downFiles.push(name);
                    GM_setValue("Files", FilesToString(downFiles));
                    document.getElementById('ZDnumfiles').innerHTML = StringToFiles(GM_getValue("Files", "")).length;
                }
                saveAs(this.response, name);
                bar.style = 'width: 100%; background-color: #5CB85C;';
                bar.classList.remove("active");
            }
        },
        onprogress: function(res) {
            if (GM_getValue("DownloadOne")) {
                if (res.lengthComputable) {
                    bar.style = 'width: ' + ((res.loaded / res.total) * 100) + '%; background-color: #337ab7;';
                }
            }
        },
        onerror: function(res) {
            bar.style = 'width: 100%; background-color: #D9534F;';
            bar.classList.remove("active");
            console.log(res);
        }
    });
}

function DecodeURLRecursively(url) {
    if (url.indexOf('%') !== -1) {
        return DecodeURLRecursively(decodeURIComponent(url));
    }
    if (url.indexOf('+') !== -1) {
        return DecodeURLRecursively(url.replace("+", " "));
    }
    return url;
}

function FilesToString(downFiles) {
    for (var i = 0, temp = ""; i < downFiles.length; i++) {
        temp += downFiles[i] + ((i === downFiles.length - 1) ? "" : "\\");
    }
    return temp;
}

function StringToFiles(str) {
    downFiles = [];
    downFiles = str.split("\\");
    return downFiles;
}

function FirstLaunch() {
    var defaultValues = [
        ["FirstLaunch", false],
        ["ArtDialog", false],
        ["DownloadOne", true],
        ["DownloadOrig", true],
        ["AddNewsFiles", true],
        ["Files", ""]
    ];
    for (var i = 0; i < defaultValues.length; i++) {
        if (GM_getValue(defaultValues[i][0]) === undefined) {
            GM_setValue(defaultValues[i][0], defaultValues[i][1]);
        }
    }
}

function Master() {
    if (GM_getValue("FirstLaunch") !== false) {
        FirstLaunch();
    }
    LoadVarPerSite();
    AddSettingPanel();
    LoadPreferences();
    if (GM_getValue("DownloadOne")) {
        AddProgressBar(null);
    }
}
console.log("Github test");
Master();