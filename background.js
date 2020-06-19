
const extId = 'get-youtube-feed';

function onError(e){ console.log(`${extId}::onError: ${e}`); }

function getUrl(str) {
	const url = new URL(str);
	if ( url.host === 'www.youtube.com' &&  ( 
		url.pathname.startsWith('/channel/') || 
		url.pathname.startsWith('/user/')    || 
		url.searchParams.has('list') ) ){
		return url;
	}
	return false;
}

async function onWebNavDone (tab) {
	try { 
		const url = getUrl(tab.url);
		if(url) {
			browser.pageAction.setIcon({ tabId: tab.tabId,	path: 'icon.png'});
			browser.pageAction.show(tab.tabId);
		}else{
			browser.pageAction.hide(tab.tabId);
		}
	}catch(err){onError(err);}
}
async function onPageActionClicked (tab, onClickData) {
	try {
		const url = getUrl(tab.url); 
		if(url) {
			const feedUrl = new URL('/feeds/videos.xml', url.origin);

			if (url.pathname.startsWith('/user/')) {
				const userId = url.pathname.split('/')[2];
				feedUrl.searchParams.set('user', userId);
			} else if (url.pathname.startsWith('/channel/')) {
				const channelId = url.pathname.split('/')[2];
				feedUrl.searchParams.set('channel_id', channelId);
			} else if (url.searchParams.has('list')) {
				feedUrl.searchParams.set('playlist_id', url.searchParams.get('list'));
			} else {
				browser.tabs.executeScript({code: `alert('no feed information for ${tab.url}');`});
				return;
			}
			const feedUrlStr = feedUrl.toString();
			browser.tabs.executeScript({code: `window.open('${feedUrlStr}', '_blank');`}); // activeTab permission 
		}
	}catch(err){onError(err);}
}

browser.webNavigation.onCompleted.addListener(onWebNavDone);
browser.webNavigation.onHistoryStateUpdated.addListener(onWebNavDone);
browser.pageAction.onClicked.addListener(onPageActionClicked);


