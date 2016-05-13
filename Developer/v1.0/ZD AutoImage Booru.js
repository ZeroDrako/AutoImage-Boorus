// ==UserScript==
// @name          ZD AutoImage Booru
// @namespace     https://github.com/ZeroDrako/ZD-AutoImage-Boorus
// @version       1.0
// @description   Add function OneClick-To-Downnload Images from Danbooru, Gelbooru, Safebooru, Sankakucomplex, Yande.re, Rule34.xxx, Furry.booru
// @author        ZeroDrako
// @updateURL     NoUpdate-https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/ZD%20AutoImage%20Booru.last_release.js
// @downloadURL   NoUpdate-https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/ZD%20AutoImage%20Booru.last_release.js
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
// @grant         GM_getResourceText
// @grant         GM_xmlhttpRequest
// @resource      PanelSettingsHTML              file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings.html
// @resource      ProgressBarCSS_Boostrap        file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\ProgressBar_Boostrap.css
// @resource      PanelSettingsCSS_Comon         file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Comon.css
// @resource      PanelSettingsCSS_Furry         file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Furry.css
// @resource      PanelSettingsCSS_Danbooru      file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Danbooru.css
// @resource      PanelSettingsCSS_Gelbooru      file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Gelbooru.css
// @resource      PanelSettingsCSS_Rule34        file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Rule34.css
// @resource      PanelSettingsCSS_Safebooru     file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Safebooru.css
// @resource      PanelSettingsCSS_Sankaku       file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Sankaku.css
// @resource      PanelSettingsCSS_Yandere       file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\PanelSettings_Yandere.css
// @require       https://raw.githubusercontent.com/ZeroDrako/Libs/master/jQuery/v1/jquery-1.12.2.min.js
// @require       https://raw.githubusercontent.com/ZeroDrako/Libs/master/FileSaver/v1.1.20160328/FileSaver.min.js
// @require       file://D:\JavaScript\ZD AutoImage Booru\Developer\v1.0\ZD AutoImage Booru.js
// @icon          http://i1236.photobucket.com/albums/ff444/ZeroDrako/128_zpstpkixbgq.png
// ==/UserScript==
/*-------------------------------------------------Global Variables---------------------------------------------------*/
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

/*
downFiles.forEach( function(element) {
    console.log(element);
});
*/

/*-------------------------------------------------Preferences Functions----------------------------------------------*/
function loadVarPerSite() {
    /*
        >Add Css for ProgressBar from Boostrap and diferent css for PanelOption for each site
        >Set TRUE the flag of the site
        >Add n MutationEvent to sanaku for autopage
     */
    GM_addStyle(GM_getResourceText("ProgressBarCSS_Boostrap"));
    GM_addStyle(GM_getResourceText("PanelSettingsCSS_Comon"));
    if (/yande\.re/.test(url)) {
        yandere = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Yandere"));
    } else if (/chan\.sankaku/.test(url)) {
        sankaku = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Sankaku"));
        try {
            mutationEvent();
        } catch (e) {
            console.log(e);
        }
    } else if (/danbooru\.donmai\.us/.test(url)) {
        danbooru = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Danbooru"));
    } else if (/gelbooru/.test(url)) {
        gelbooru = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Gelbooru"));
    } else if (/safebooru/.test(url)) {
        safebooru = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Safebooru"));
    } else if (/rule34\.xxx/.test(url)) {
        rule34 = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Rule34"));
    } else if (/furry\.booru/.test(url)) {
        furry = true;
        GM_addStyle(GM_getResourceText("PanelSettingsCSS_Furry"));
    } else {
        return;
    }
}

function loadPreferences() {
    /*
        >Load all preferences an asing to HTML objets id
        >Load list of files into array oobject
    */
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
    /*
        >Add HTML to the page to show the Option Pane
        >Add EventListener to save new settings
    */
    var settingPanel = document.createElement('div');
    settingPanel.id = 'ZDpopup';
    settingPanel.innerHTML = GM_getResourceText("PanelSettingsHTML");
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
    //Show a flashing message 3 times in 1.5s
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
    //Add a listener to know what option is changed to save them.
    settingPanel.addEventListener('change', function(event) {
        switch (event.target.id) {
            //Convert the string "true" into object boolean
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
                /*
                >Get the list of files from the selected folder , save (GM_setValue) and update number of elements loaded.
                >Note: because chrome/chromium security, the list of files need from user permision to update, in other words, you
                    need re-load files manually in order to verific new files afther download.
                >Note2(Firefox): because mozilla has not implemented 'select folder', you need to select all pictures,
                    if you have much subfolders you can enter "*.*" in the search bar of the window explorer,
                    this will load all the files and you can select all, remember wait until all files are loaded.
                */
                var files = event.target.files;
                if (files.length !== 0) {
                    for (var i = 0, f, downFiles = []; f = files[i]; i++) {
                        if (f.type.match('image.*') || f.type.match('video.webm')) {
                            //var namefix = (f.name).substring(0,f.name.lastIndexOf('.'));
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
    /*
        >Because the deprecate of "DOMNodeInserted", now this is the way.
        >A MutationObserver for detect the insert of new DIV, to auto-inser more progressbar :) 
    */
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    // Define a new observer
    var obs = new MutationObserver(function(mutations, observer) {
        // Look through all mutations that just occured
        for (var i = 0; i < mutations.length; ++i) {
            // Look through all added nodes of this mutation
            for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                // Look for a node with clas "content-page"
                if (mutations[i].addedNodes[j].getAttribute('class') === "content-page") {
                    addProgressBar(mutations[i].addedNodes[j].getAttribute('id'));
                }
            }
        }
    });
    // Have the observer observe changes in specific DIV
    obs.observe((document.querySelector('#post-list > div.content')), {
        childList: true
    });
}

function addProgressBar(idNewDiv) {
    /*
        >AddProgressbar per image, each site have diferen acces to elements.
        >Define the site, and select all objects (images)
        >Add progressbar and set value to 100% if is in list on files already downloaded.
        >Add EventListener if DownloadOne is actived.
     */
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

/*-------------------------------------------------Work Functions-----------------------------------------------------*/
function downloadOne() {
    /*
        >This function help the EventListener to download just one image.
        >Get the id of the object, then remplace string to left only the base id
        >Define '#ZdBarI' (the internal progressbar) plus the base id
        >Call getLink()
     */
    var idImg = (this.id).replace('ZdBarE', '');
    var barId = '#ZdBarI' + idImg;
    //console.log('downloadOne ' + idImg);
    getLink(idImg, barId);
}

function getLink(idImg, barId) {
    /*
        >Get the link of the file for download
        >Because the link or each image file have not a common base, we need to get the page of the post and get the link from that.
        >Set Progressbar to 5% and to yellow color until GET of the page is finished
        >Select the link acorde to preferences, if you select the ooriginal file or not.
    */
    var source, parser = new DOMParser(),
        bar = document.querySelector(barId);
    bar.classList.add("active");
    bar.style = 'width: 5%; background-color: #F0AD4E;';
    if (yandere) {
        //console.log('#post-list-posts > li[id="p'+idImg+'"] > div.inner > a.thumb');
        source = document.querySelector('#post-list-posts > li[id="p' + idImg + '"] > div.inner > a.thumb').href;
    } else if (sankaku) {
        source = document.querySelector('.content > div > span[id="p' + idImg + '"] > a').href;
    } else if (danbooru) {
        source = document.querySelector('div#posts > div > article[id="post_' + idImg + '"]').getAttribute('data-file-url');
        source = 'http://danbooru.donmai.us' + source;
        var name = getNameDown(source);
        //Danbooru only save original images, not resize
        downloadCheck(source, name, barId);
        return;
    } else if (gelbooru || safebooru || rule34 || furry) {
        source = document.querySelector('#post-list > div.content > div > span[id="s' + idImg + '"] > a').href;
    } else {
        console.log('Fail at \'getLink\'' + ' >>> ' + idImg);
        return;
    }
    console.log(source);
    //return;
    GM_xmlhttpRequest({
        url: source,
        method: "GET",
        responseType: 'text',
        onreadystatechange: function(res) {
            //console.log(res.headers);
            if (res.readyState === 4 && res.status === 404) {
                console.log('Fail at \'getLink > GM_xmlhttpRequest\'' + ' >>> ' + source);
            }
            if (res.readyState === 4 && res.status === 200) {
                var dom = parser.parseFromString(res.response, "text/html");
                // Siz is an array with all images sizes, can have 1 to 3 or more.
                var siz = null,
                    source = null;
                if (yandere) {
                    siz = dom.querySelectorAll('#post-view > .sidebar > div:nth-of-type(4) a[id]');
                    if (GM_getValue("DownloadOrig")) {
                        //Original File, not resize
                        source = ((siz[siz.length - 1]).getAttribute('href'));
                    } else {
                        //Changed File, not resize
                        source = ((siz[siz.length - 2]).getAttribute('href'));
                        if (source.indexOf('files.yande.re') === -1) {
                            //If fails to get the Changed File then get the Original File
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
                //console.log(source);
                //return;
                var name = getNameDown(source);
                //Call next funciton to start the download
                downloadCheck(source, name, barId);
            }
        },
        onerror: function(res) {
            //If for some reason the process fail, set the progressbar to color red
            bar.style = 'width: 100%; background-color: #D9534F;';
            bar.classList.remove("active");
            console.log(res);
        }
    });
}

function getNameDown(source) {
    /*
        >Decode the url of the file
        >MAke a substring with the last part (the name of file)
        >Return the name
    */
    return decodeURLRecursively(source.substring(source.lastIndexOf("/") + 1));
}

function getNameCheck(idImg) {
    /*
        >Get the fast name for an image.
        >By default each image have diferen name from site and if is a original-size or thumnail
        >Get the common base for the name:
            Sankaku : Link to the image, but delete the last part after '?'
            Yandere : Tags of the image in the Title attribute
    */
    var source;
    if (yandere) {
        source = (document.querySelector('#post-list-posts > li[id="' + idImg + '"] img')).getAttribute('title');
        source = source.substring(source.indexOf('Tags:') + 5, source.indexOf('User:')).trim();
        //console.log(source);
        return source;
    } else if (sankaku) {
        source = document.querySelector('.content > div > span[id="' + idImg + '"] > a > img').src;
        source = source.substring((source.lastIndexOf('/') + 1), source.lastIndexOf('.'));
        //console.log(source);
        return source;
    } else if (danbooru) {
        source = document.querySelector('div#posts > div > article[id="' + idImg + '"]').getAttribute('data-file-url');
        source = source.substring((source.lastIndexOf('/') + 1), source.lastIndexOf('.'));
        //console.log(source);
        return source;
    } else if (gelbooru || safebooru || rule34 || furry) {
        source = document.querySelector('#post-list > div.content > div > span[id="' + idImg + '"] > a > img').src;
        source = source.substring((source.lastIndexOf('/') + 1), source.lastIndexOf('.')).replace('thumbnail_', '');
        //console.log(source);
        return source;
    } else {
        console.log('Fail at \'getLink\'' + ' >>> ' + idImg);
        return 'unknow';
    }
}

function downloadCheck(source, name, barId) {
    /*
        Function to help the check proses, if a image is already downloaded
        Check if yousset the option for "Files", if yes and the image is already downloaded then show you a dialog
            to aks you if the you wish re-download, or if "Files" is not set just download
        >Set the progressbar to 100% and green
     */
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
    /*
        >Function for download the image
        >Recibe:
            source = direct link to the image
            name = name for the file, whit the extension.
            barId = id for set the progress of the download to the progressbar
        >Donwload  image using GM_XMLHttpRequest and if the progres can be Computable then add the progress to progressbar
    */
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

/*-------------------------------------------------Utility Functions--------------------------------------------------*/
/*
function getJsonBBooru() {
    //Unfortunately it does not work well due to limitations and problems on the servers of the sites.
    //    Sankaku:    Blocks access to the API
    //    Yande.re:   The API contains post even unauthorized and invisible to the user,
    //                    making it difficult to create a function for the post only visible to the user
    var urlJson = '';
    if(url.indexOf('yande.re')) {
        console.log('Funk Yande.re and shit-type json');
        urljson = url.substring(0,(url.indexOf('/post')+5)) + '.json'+ url.substring((url.indexOf('/post')+5));// + '&limit=50';
        console.log(urljson);
        GM_xmlhttpRequest({
            url: urljson,
            method: "GET",
            responseType: 'text',
            onreadystatechange: function(res) {
                if (res.readyState === 4 && res.status === 200) {
                    jsonObj = JSON.parse(res.response);
                    //console.log(jsonObj);
                }
            },
            onerror: function(res) {
                console.log(res.message);
            }
        });
    }
}
*/
function decodeURLRecursively(url) {
    /*
        >Check if exist any "%" (encode url) and remove it.
        >Chck in exist a "+" (decodeURIComponent change the space character for + character) and reemplace for a space
    */
    if (url.indexOf('%') !== -1) {
        return decodeURLRecursively(decodeURIComponent(url));
    }
    if (url.indexOf('+') !== -1) {
        return decodeURLRecursively(url.replace("+", " "));
    }
    return url;
}

function filesToString(downFiles) {
    /*
        >Conver an Array to String for save in GM_setValue
        >Delimited by "\" charcater
    */
    for (var i = 0, temp = ""; i < downFiles.length; i++) {
        temp += downFiles[i] + ((i === downFiles.length - 1) ? "" : "\\");
    }
    return temp;
}

function stringToFiles(str) {
    /*
        >Conver an String to Array for use in the script
        >Delimited by "\" charcater
    */
    downFiles = [];
    downFiles = str.split("\\");
    return downFiles;
}

function firstLaunch() {
    /*
        >If is the 1 time runing the script then generathe the necesaries values
        >Only to make sure the script work fine the 1 time.
     */
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
/*
function showSavedValues() {
    //Show all Values saved by GM    
    var keys = GM_listValues();
    for (var i=0,key=null; key=keys[i]; i++) {
        console.log(key + " >>> " + GM_getValue(key));
    }
}
*/
/*-------------------------------------------------MAIN Function------------------------------------------------------*/
function master() {
    /*
        >Function master, the start point.
        >Check if is the 1 time using the script
        >Load general Variables
        >Load Preferences
    */
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
