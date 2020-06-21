# get-youtube-feeds a firefox/chrome webextension add-on

## Details:
https://addons.mozilla.org/en-US/firefox/addon/get-youtube-feeds/

## Usage:  
wget https://github.com/igorlogius/tbl2csv/archive/master.zip
unzip master.zip
zip -j "get-youtube-feeds-$(grep '"version"' get-youtube-feeds-master/src/manifest.json  | cut -d'"' -f4).xpi" ./get-youtube-feeds-master/src/*
```
Import get-youtube-feeds-x.y.z.zip into your browser (e.g. via `about:debugging`)
