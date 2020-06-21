
const extId = 'get-youtube-feeds';

function onError(e){ console.error(`${extId}::onError: ${e}`); }

function getUrl(str) {
	if(str) {
		const url = new URL(str);
		if ( url.host === 'www.youtube.com' &&  ( 
			url.pathname.startsWith('/channel/') || 
			url.pathname.startsWith('/user/')    || 
			url.searchParams.has('list') )){
			return url;
		}
	}
	return false;
}

async function onClicked (tab, onClickData) {
	try {
		const url = getUrl(tab.url);
		if (url) {
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
				throw new Error('invalid url');
			}
			browser.tabs.executeScript({code:
				`
				let link = document.createElement('a');
				link.style.display = 'none';
				link.setAttribute('target', '_blank');
				document.body.append(link);
				link.setAttribute('href','${feedUrl.toString()}');
				const evt = new MouseEvent('click', {bubbles: false, cancelable: false,	view: window});
				link.dispatchEvent(evt);
				`
			});
			return;
		}
	}catch(err){onError(err);}
	browser.tabs.executeScript({code: `alert('no feed info for ${tab.url}');`});
}

browser.pageAction.onClicked.addListener(onClicked); 

