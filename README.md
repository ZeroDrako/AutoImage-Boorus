# [AutoImage Boorus](https://github.com/ZeroDrako/AutoImage-Boorus)
UserScript written in JavaScript for Chrome/Firefox/Opera & Tampermonkey/Greasemonkey, that make more easy download images from Danbooru, Gelbooru, Safebooru, Sankakucomplex, Yande.re, Rule34.xxx, Furry.booru.
![MENU](https://raw.githubusercontent.com/ZeroDrako/AutoImage-Boorus/master/YandeRe%20-%20Sankaku.png)

### Why?
To simplify download images, and keep a track of images downloaded.

Inspired by my another work: [AutoImage MgRender](https://github.com/ZeroDrako/AutoImage-MgRender)

### What this script do?
Add some option in the page, you can see in the panel option named "ZD AutoImage Booru v1"

**OPTIONS**

1. **Down One?**
  - Enable the this option to add a ProgressBar below each image. You can click that Prgressbar and the download start. :)
  - You can know if an image was already donwloaded (The progressbar is green)
  - Color of progressbar:
      - Green   - Downloaded
      - Blue    - Downloading
      - Yellow  - Getting the link
      - Red     - Something wrong (Check console, please inform me)

2. **Down Orig?**
  - This option is for download the original image if is possible. If is set "NO" the the script try to download the resize version locaten in the web page.

3. **Alert Dial?**
  - Option to show an alert option , this only works if *__Files__* option is already set. Inform you if you has already downloaded an image and ask you for re-download or not.

4. **Add News?**
  - Option to add downloaded files to a list in "Files" option automatically. Because security reason none Browser let you re-load the content of a directory. Only if you select it again manually, so this option is for auto-add downloaded files to "Files" value.
  - This option also could be used as a record of downloads, but remenber set this "Yes" and not change "Files" value.

5. **Files**
  - This option show a pop-up where you can choose a directory where you store you images. If the script detects that the image you're to download is already downloaded skipt the image or show you an alert about it. Check "Alert Dial?" option.
  - Because security reasons, you need re-select this option for add fore images to the list. See "Add News" option.
    - **Note 1:** *Your images need to have the original name.*
    - **Note 2 - Chrome:** *By default this option works recursively, detect all images in the directory and sub-directorys.*
    - **Note 3 - Firefox:** *Because mozilla has not implemented 'select folder', you need to select all images, if you have much subfolders you can enter* \*.\* *in the search bar of the window explorer, this will load all the files and you can select all, remember wait until all files are loaded.*

## Notes
1. **GM_xmlhttpRequest** : Because some sites store images in a external server.
3. **ZD AutoImage Boorus.greasyfork.js** : This version contains the __FileSaver.js__ lib  inside the code because __Greasyfork__ don't let import code from original reps on github, and the versions on __cdnjs__ is outdated code

## ToDo
- [ ] Add option ZipGallery. ( To much problems to do it.)
- [ ] Implement API per site (Sankaku is blocked, Yande.re have wrongs codes.)
- [ ] Fix some ProgressBar not set the correct value if file is downloaded.
- [ ] Improve code

## Changelog
**(Last 2 Releses, full changelog in __changelog.txt__ file)**
- v1.0
  - Initial release
