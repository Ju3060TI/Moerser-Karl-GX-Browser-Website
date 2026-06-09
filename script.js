// ============================================
// PROXY-KONFIGURATION
// ============================================
// ACHTUNG: Du brauchst einen funktionierenden Proxy-Server!
// Ersetze die URL mit deinem eigenen Proxy (z.B. Cloudflare Worker)
const PROXY = 'https://cors-anywhere.herokuapp.com/';

// ============================================
// BROWSER-LOGIK
// ============================================
let tabs = [];
let activeTabId = null;
let tabCounter = 0;

const tabsContainer = document.getElementById('tabs');
const framesContainer = document.getElementById('framesContainer');
const urlInput = document.getElementById('urlInput');
const feuerBtn = document.getElementById('feuerBtn');
const tabCountEl = document.getElementById('tabCount');
const startPage = document.getElementById('startPage');

// ============================================
// POPUPS
// ============================================
function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;
    if (popup.classList.contains('show')) {
        popup.classList.remove('show');
    } else {
        document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
        popup.classList.add('show');
    }
}

['gamesBtn','socialBtn','streamingBtn','kiBtn','toolsBtn'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        const popupId = btnId.replace('Btn','Popup');
        btn.addEventListener('click', e => { e.stopPropagation(); togglePopup(popupId); });
    }
});

document.addEventListener('click', e => {
    document.querySelectorAll('.popup').forEach(p => {
        const btnId = p.id.replace('Popup','Btn');
        const btn = document.getElementById(btnId);
        if (!p.contains(e.target) && e.target !== btn) p.classList.remove('show');
    });
});

// ============================================
// TABS
// ============================================
function addTab(url, title) {
    tabCounter++;
    const tabId = 'tab-' + tabCounter;
    tabs.push({ id: tabId, url, title });
    if (startPage) startPage.classList.add('hidden');
    
    const tabEl = document.createElement('div');
    tabEl.className = 'tab';
    tabEl.id = 'tab-el-' + tabId;
    tabEl.innerHTML = '<span>' + title + '</span><span class="tab-close" data-tabid="' + tabId + '">✕</span>';
    tabEl.addEventListener('click', function(e) { if (!e.target.classList.contains('tab-close')) switchTab(tabId); });
    tabsContainer.appendChild(tabEl);
    
    const frame = document.createElement('iframe');
    frame.className = 'tab-frame';
    frame.id = 'frame-' + tabId;
    frame.src = url;
    frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads');
    framesContainer.appendChild(frame);
    
    tabEl.querySelector('.tab-close').addEventListener('click', function(e) { e.stopPropagation(); closeTab(tabId); });
    switchTab(tabId);
    updateTabCount();
}

function addTabWithProxy(url, title) {
    addTab(PROXY + url, title);
}

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-frame').forEach(f => f.classList.remove('active'));
    const tabEl = document.getElementById('tab-el-' + tabId);
    const frame = document.getElementById('frame-' + tabId);
    if (tabEl) tabEl.classList.add('active');
    if (frame) { 
        frame.classList.add('active'); 
        let currentUrl = frame.src;
        if (currentUrl.startsWith(PROXY)) {
            currentUrl = currentUrl.replace(PROXY, '');
        }
        urlInput.value = currentUrl.replace('about:blank', '');
    }
    activeTabId = tabId;
    if (startPage) startPage.classList.add('hidden');
}

function closeTab(tabId) {
    const frame = document.getElementById('frame-' + tabId);
    if (frame) {
        frame.src = 'about:blank';
        frame.remove();
    }
    document.getElementById('tab-el-' + tabId)?.remove();
    tabs = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
        if (tabs.length > 0) switchTab(tabs[tabs.length - 1].id);
        else { activeTabId = null; urlInput.value = ''; if (startPage) startPage.classList.remove('hidden'); }
    }
    updateTabCount();
}

function updateTabCount() {
    tabCountEl.textContent = tabs.length + ' Tab' + (tabs.length !== 1 ? 's' : '');
}

// ============================================
// KEYWORDS / SEITEN
// ============================================
const seiten = {
    'desert': 'https://desertorder.com/',
    'desert order': 'https://desertorder.com/',
    'bloxd': 'https://bloxd.io/',
    'bloxd io': 'https://bloxd.io/',
    'cookie': 'https://orteil.dashnet.org/cookieclicker/',
    'cookie clicker': 'https://orteil.dashnet.org/cookieclicker/',
    '1v1': 'https://1v1.lol/',
    '1v1 lol': 'https://1v1.lol/',
    'subway': 'https://subwaysurfers.com/',
    'subway surfers': 'https://subwaysurfers.com/',
    'geometry': 'https://geometrydash.io/',
    'geometry dash': 'https://geometrydash.io/',
    'krunker': 'https://krunker.io/',
    'slope': 'https://slope.game/',
    'roblox': 'https://www.roblox.com/',
    'chatgpt': 'https://chat.openai.com/',
    'chat gpt': 'https://chat.openai.com/',
    'deepseek': 'https://chat.deepseek.com/',
    'claude': 'https://claude.ai/',
    'github': 'https://github.com/',
    'youtube': 'https://www.youtube-nocookie.com/',
    'yt': 'https://www.youtube-nocookie.com/',
    'wiki': 'https://www.wikipedia.org/',
    'spotify': 'https://open.spotify.com/',
    'google': 'https://www.google.com/',
    'docs': 'https://docs.google.com/',
    'canva': 'https://www.canva.com/',
    'netflix': 'https://www.netflix.com/',
    'twitch': 'https://www.twitch.tv/',
    'tiktok': 'https://www.tiktok.com/',
    'instagram': 'https://www.instagram.com/',
    'reddit': 'https://www.reddit.com/',
    'twitter': 'https://www.twitter.com/',
};

function feuern() {
    let eingabe = urlInput.value.trim();
    if (!eingabe) return;
    const lower = eingabe.toLowerCase();
    let url;
    if (seiten[lower]) url = seiten[lower];
    else if (eingabe.includes('.') && !eingabe.includes(' ')) {
        if (!eingabe.startsWith('http')) eingabe = 'https://' + eingabe;
        url = eingabe;
    } else url = 'https://www.google.com/search?q=' + encodeURIComponent(eingabe);
    
    const openInNewTab = ['netflix.com','twitch.tv','discord.com',
        'tiktok.com','instagram.com','snapchat.com','reddit.com',
        'chat.openai.com','claude.ai'].some(d => url.includes(d));
    
    if (openInNewTab) {
        window.open(url, '_blank');
        return;
    }
    
    const needsProxy = ['youtube-nocookie.com','youtube.com','roblox.com',
        'desertorder.com','1v1.lol','krunker.io','slope.game'].some(d => url.includes(d));
    
    if (needsProxy) {
        addTab(PROXY + url, lower.length > 20 ? lower.substring(0, 20) + '...' : lower);
    } else {
        addTab(url, lower.length > 20 ? lower.substring(0, 20) + '...' : lower);
    }
}

feuerBtn.addEventListener('click', feuern);
urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') feuern(); });

// Globale Funktionen für HTML-Aufrufe
window.addTab = addTab;
window.addTabWithProxy = addTabWithProxy;
window.togglePopup = togglePopup;
