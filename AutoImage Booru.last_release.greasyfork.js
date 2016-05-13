// ==UserScript==
// @name          ZD AutoImage Boorus
// @namespace     https://github.com/ZeroDrako/ZD-AutoImage-Boorus
// @version       1.0
// @description   Add function OneClick-To-Downnload Images from Danbooru, Gelbooru, Safebooru, Sankakucomplex, Yande.re, Rule34.xxx, Furry.booru
// @author        ZeroDrako
// @updateURL     https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/AutoImage%20Booru.last_release.greasyfork.js
// @downloadURL   https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/AutoImage%20Booru.last_release.greasyfork.js
// @license       GPLv3; https://raw.githubusercontent.com/ZeroDrako/ZD-AutoImage-Boorus/master/LICENSE
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
// @require       https://code.jquery.com/jquery-1.12.2.min.js
// @icon          http://i1236.photobucket.com/albums/ff444/ZeroDrako/128_zpstpkixbgq.png
// ==/UserScript==

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20160328
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},a=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),c=e.webkitRequestFileSystem,f=e.requestFileSystem||c||e.mozRequestFileSystem,u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},d="application/octet-stream",s=0,l=4e4,v=function(e){var t=function(){"string"==typeof e?n().revokeObjectURL(e):e.remove()};setTimeout(t,l)},p=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){u(i)}}},w=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e},y=function(t,u,l){l||(t=w(t));var y,m,S,h=this,R=t.type,O=!1,g=function(){p(h,"writestart progress write writeend".split(" "))},b=function(){if(m&&a&&"undefined"!=typeof FileReader){var o=new FileReader;return o.onloadend=function(){var e=o.result;m.location.href="data:attachment/file"+e.slice(e.search(/[,;]/)),h.readyState=h.DONE,g()},o.readAsDataURL(t),void(h.readyState=h.INIT)}if((O||!y)&&(y=n().createObjectURL(t)),m)m.location.href=y;else{var r=e.open(y,"_blank");void 0===r&&a&&(e.location.href=y)}h.readyState=h.DONE,g(),v(y)},E=function(e){return function(){return h.readyState!==h.DONE?e.apply(this,arguments):void 0}},N={create:!0,exclusive:!1};return h.readyState=h.INIT,u||(u="download"),r?(y=n().createObjectURL(t),void setTimeout(function(){o.href=y,o.download=u,i(o),g(),v(y),h.readyState=h.DONE})):(e.chrome&&R&&R!==d&&(S=t.slice||t.webkitSlice,t=S.call(t,0,t.size,d),O=!0),c&&"download"!==u&&(u+=".download"),(R===d||c)&&(m=e),f?(s+=t.size,void f(e.TEMPORARY,s,E(function(e){e.root.getDirectory("saved",N,E(function(e){var n=function(){e.getFile(u,N,E(function(e){e.createWriter(E(function(n){n.onwriteend=function(t){m.location.href=e.toURL(),h.readyState=h.DONE,p(h,"writeend",t),v(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&b()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=h["on"+e]}),n.write(t),h.abort=function(){n.abort(),h.readyState=h.DONE},h.readyState=h.WRITING}),b)}),b)};e.getFile(u,{create:!1},E(function(e){e.remove(),n()}),E(function(e){e.code===e.NOT_FOUND_ERR?n():b()}))}),b)}),b)):void b())},m=y.prototype,S=function(e,t,n){return new y(e,t,n)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,n){return n||(e=w(e)),navigator.msSaveOrOpenBlob(e,t||"download")}:(m.abort=function(){var e=this;e.readyState=e.DONE,p(e,"abort")},m.readyState=m.INIT=0,m.WRITING=1,m.DONE=2,m.error=m.onwritestart=m.onprogress=m.onwrite=m.onabort=m.onerror=m.onwriteend=null,S)}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!==define.amd&&define([],function(){return saveAs});

var downFiles = [],
    yandere = false,
    sankaku = false,
    danbooru = false,
    gelbooru = false,
    safebooru = false,
    rule34 = false,
    furry = false,
    url = window.location.href,
    downFiles = stringToFiles(GM_getValue("Files", ""));

function loadVarPerSite() {
    GM_addStyle('@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{overflow:hidden;height:12px;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.progress-bar{float:left;width:0%;height:100%;font-size:12px;line-height:20px;color:#ffffff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-transition:width 0.6s ease;-o-transition:width 0.6s ease;transition:width 0.6s ease}.progress-striped .progress-bar,.progress-bar-striped{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress.active .progress-bar,.progress-bar.active{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)}.progress-bar-info{background-color:#5bc0de}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)}');
    GM_addStyle('.ZDOptionTitle{font-size:12px;font-weight:bold;padding-bottom:1%}#ZDdirselect{display:none}#ZDtitle{padding-top:20px}.ZDOptionDown{font-weight:400;float:right!important;margin-right:12%;font-size:11px;border:1px solid #EAEAEA}#ZDdirectory{color:#666;border:1px solid #202529;background:#000}');
    if (/yande\.re/.test(url)) {
        yandere = true;
        GM_addStyle('.ZDOptionTitle{color:#ee8887!important}#ZDtitle{font-size:14px}.ZDOptionDown{color:#ffbbbb;background:#222}.ZDOptionDown:hover{background:#ee8887;color:white}a.directlink{margin-top:5px!important}');
    } else if (/chan\.sankaku/.test(url)) {
        sankaku = true;
        GM_addStyle('.ZDOptionTitle{color:#FF761C!important;font-size:12px;font-weight:bold;padding-bottom:1%}#ZDdirselect{display:none}#ZDdirhelp{margin-right:10%!important;padding:1%!important}#ZDtitle{padding-top:20px;font-size:13px}.ZDOptionDown{float:right!important;margin-right:12%;font-size:11px;font-weight:400!important;color:black;border:1px solid #DDDDDD!important;background:#FAFAFA}.ZDOptionDown:hover{background:#FF761C!important;color:white!important}#ZDdirectory{color:#666;border:1px solid #202529;background:#000}div.content{padding-left:250px!important}');
        try {
            mutationEvent();
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

function loadPreferences() {
    try {
        document.getElementById('ZDalertdialog').value = GM_getValue("ArtDialog", false);
        document.getElementById('ZDdownone').value = GM_getValue("DownloadOne", false);
        document.getElementById('ZDdownorig').value = GM_getValue("DownloadOrig", false);
        document.getElementById('ZDaddnews').value = GM_getValue("AddNewsFiles", false);
        document.getElementById('ZDnumfiles').innerHTML = stringToFiles(GM_getValue("Files", "")).length;
    } catch (event) {
        console.log(event.id + ' >>> ' + event.message);
    }
}

function addSettingPanel() {
    var settingPanel = document.createElement('div');
    settingPanel.id = 'ZDpopup';
    settingPanel.innerHTML = '<divid="ZDtitle"><h5>ZDAutoImageBooruv1</h5></div><divclass="wrap"><formid="translateForm"><div><liclass="ZDOptionTitle">DownOne?<selectid="ZDdownone"class="ZDOptionDown"><optionvalue=false>No</option><optionvalue=true>Yes</option></select></li><liclass="ZDOptionTitle">DownOrig?<selectid="ZDdownorig"class="ZDOptionDown"><optionvalue=false>No</option><optionvalue=true>Yes</option></select></li><liclass="ZDOptionTitle">AddNews?<selectid="ZDaddnews"class="ZDOptionDown"><optionvalue=false>No</option><optionvalue=true>Yes</option></select></li><liclass="ZDOptionTitle">AlertDial?<selectid="ZDalertdialog"class="ZDOptionDown"><optionvalue=false>No</option><optionvalue=true>Yes</option></select></li><liclass="ZDOptionTitle">Files:<h7id="ZDnumfiles"></h7><inputid="ZDdirselect"type=filemultiplewebkitdirectorydirectory><inputtype="button"id="ZDdirhelp"class="ZDOptionDown"value="Browse..."onclick="document.getElementById(\'ZDdirselect\').click()"></li></h5></div><pid="ZDsaved"class="ZDoption">&nbsp;</p></form></div>';
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

    function hideshow(opres) {
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
                hideshow("Saved!!!");
                break;
            case 'ZDdownone':
                GM_setValue("DownloadOne", document.getElementById('ZDdownone').value === "true" ? true : false);
                hideshow("Saved!!!");
                break;
            case 'ZDdownorig':
                GM_setValue("DownloadOrig", document.getElementById('ZDdownorig').value === "true" ? true : false);
                hideshow("Saved!!!");
                break;
            case 'ZDaddnews':
                GM_setValue("AddNewsFiles", document.getElementById('ZDaddnews').value === "true" ? true : false);
                hideshow("Saved!!!");
                break;
            case 'ZDdirselect':
                var files = event.target.files;
                if (files.length !== 0) {
                    for (var i = 0, f, downFiles = []; f = files[i]; i++) {
                        if (f.type.match('image.*') || f.type.match('video.webm')) {
                            downFiles.push(f.name);
                        }
                    }
                    GM_setValue("Files", filesToString(downFiles));
                    document.getElementById('ZDnumfiles').innerHTML = stringToFiles(GM_getValue("Files", "")).length;
                    hideshow("Saved!!!");
                }
                break;
            default:
                hideshow("Canceled!!!");
                break;
        }
    });
}

function mutationEvent() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var obs = new MutationObserver(function(mutations, observer) {
        for (var i = 0; i < mutations.length; ++i) {
            for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                if (mutations[i].addedNodes[j].getAttribute('class') === "content-page") {
                    addProgressBar(mutations[i].addedNodes[j].getAttribute('id'));
                }
            }
        }
    });
    obs.observe((document.querySelector('#post-list > div.content')), {
        childList: true
    });
}

function addProgressBar(idNewDiv) {
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
            name = getNameCheck((toop[i].id));
        div1.setAttribute('class', 'progress');
        div1.setAttribute('id', ((toop[i].id).replace(pre, 'ZdBarE')));
        div2.setAttribute('class', 'progress-bar progress-bar-striped');
        div2.setAttribute('id', ((toop[i].id).replace(pre, 'ZdBarI')));
        div2.setAttribute('style', 'width:0%');
        downFiles.forEach(function(element) {
            if (element.match(name)) {
                div2.setAttribute('style', 'width:100%; background-color: #5CB85C;');
            }
        });
        div2.setAttribute('role', 'progressbar');
        if (GM_getValue("DownloadOne")) {
            div1.addEventListener('click', downloadOne);
        }
        div1.appendChild(div2);
        toop[i].appendChild(div1);
    }
}

function downloadOne() {
    var idImg = (this.id).replace('ZdBarE', '');
    var barId = '#ZdBarI' + idImg;
    getLink(idImg, barId);
}

function getLink(idImg, barId) {
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
        var name = getNameDown(source);
        downloadCheck(source, name, barId);
        return;
    } else if (gelbooru || safebooru || rule34 || furry) {
        source = document.querySelector('#post-list > div.content > div > span[id="s' + idImg + '"] > a').href;
    } else {
        console.log('Fail at \'getLink\'' + ' >>> ' + idImg);
        return;
    }
    GM_xmlhttpRequest({
        url: source,
        method: "GET",
        responseType: 'text',
        onreadystatechange: function(res) {
            if (res.readyState === 4 && res.status === 404) {
                console.log('Fail at \'getLink > GM_xmlhttpRequest\'' + ' >>> ' + source);
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
                var name = getNameDown(source);
                downloadCheck(source, name, barId);
            }
        },
        onerror: function(res) {
            bar.style = 'width: 100%; background-color: #D9534F;';
            bar.classList.remove("active");
            console.log(res);
        }
    });
}

function getNameDown(source) {
    return decodeURLRecursively(source.substring(source.lastIndexOf("/") + 1));
}

function getNameCheck(idImg) {
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
        console.log('Fail at \'getLink\'' + ' >>> ' + idImg);
        return 'unknow';
    }
}

function downloadCheck(source, name, barId) {
    var bar = document.querySelector(barId);
    if (downFiles.indexOf(name) !== -1) {
        if (GM_getValue("ArtDialog")) {
            var r = confirm("File already Downloaded, Download Again???");
            if (r === true) {
                downloadImage(source, name, barId);
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
        downloadImage(source, name, barId);
    }
}

function downloadImage(source, name, barId) {
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
                console.log('Fail at \'downloadImage > GM_xmlhttpRequest\'' + ' >>> ' + source);
            }
            if (res.readyState === 4 && res.status === 200) {
                if (GM_getValue("AddNewsFiles")) {
                    downFiles.push(name);
                    GM_setValue("Files", filesToString(downFiles));
                    document.getElementById('ZDnumfiles').innerHTML = stringToFiles(GM_getValue("Files", "")).length;
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

function decodeURLRecursively(url) {
    if (url.indexOf('%') !== -1) {
        return decodeURLRecursively(decodeURIComponent(url));
    }
    if (url.indexOf('+') !== -1) {
        return decodeURLRecursively(url.replace("+", " "));
    }
    return url;
}

function filesToString(downFiles) {
    for (var i = 0, temp = ""; i < downFiles.length; i++) {
        temp += downFiles[i] + ((i === downFiles.length - 1) ? "" : "\\");
    }
    return temp;
}

function stringToFiles(str) {
    downFiles = [];
    downFiles = str.split("\\");
    return downFiles;
}

function firstLaunch() {
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

function master() {
    if (GM_getValue("FirstLaunch") !== false) {
        firstLaunch();
    }
    loadVarPerSite();
    addSettingPanel();
    loadPreferences();
    if (GM_getValue("DownloadOne")) {
        addProgressBar(null);
    }
}

master();
