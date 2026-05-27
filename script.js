// ============================================
// PROXY-KONFIGURATION (Base64-verschleiert)
// ============================================
const _x = 'cHJveHkuaHVsaWFuLWlsaW4ud29ya2Vycy5kZXY=';
const PROXY = 'https://' + atob(_x) + '/?url=';

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

// === POPUPS ===
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

// === TABS ===
window.addTab = function(url, title) {
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
    framesContainer.appendChild(frame);
    tabEl.querySelector('.tab-close').addEventListener('click', function(e) { e.stopPropagation(); closeTab(tabId); });
    switchTab(tabId);
    updateTabCount();
};

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-frame').forEach(f => f.classList.remove('active'));
    const tabEl = document.getElementById('tab-el-' + tabId);
    const frame = document.getElementById('frame-' + tabId);
    if (tabEl) tabEl.classList.add('active');
    if (frame) { frame.classList.add('active'); urlInput.value = frame.src.replace(PROXY, '').replace('about:blank', ''); }
    activeTabId = tabId;
    if (startPage) startPage.classList.add('hidden');
}

function closeTab(tabId) {
    document.getElementById('tab-el-' + tabId)?.remove();
    document.getElementById('frame-' + tabId)?.remove();
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

// === KEYWORDS ===
const seiten = {
    'desert': 'https://desertorder.com/',
    'desert order': 'https://desertorder.com/',
    'bloxd': 'https://bloxd.io/',
    'bloxd io': 'https://bloxd.io/',
    'bloxdi': 'https://bloxdi.netlify.app/',
    'cookie': 'https://orteil.dashnet.org/cookieclicker/',
    'cookie clicker': 'https://orteil.dashnet.org/cookieclicker/',
    '1v1': 'https://1v1.lol/',
    '1v1 lol': 'https://1v1.lol/',
    'subway': 'https://subwaysurfers.com/',
    'subway surfers': 'https://subwaysurfers.com/',
    'geometry': 'https://geometrydash.io/',
    'geometry dash': 'https://geometrydash.io/',
    'krunker': 'https://krunker.io/',
    'shell': 'https://shellshockers.io/',
    'slope': 'https://slope.game/',
    'chatgpt': 'https://chat.openai.com/',
    'chat gpt': 'https://chat.openai.com/',
    'deepseek': 'https://chat.deepseek.com/',
    'claude': 'https://claude.ai/',
    'grok': 'https://grok.x.ai/',
    'perplexity': 'https://perplexity.ai/',
    'gemini': 'https://gemini.google.com/',
    'copilot': 'https://copilot.microsoft.com/',
    'github': 'https://github.com/',
    'discord': 'https://discord.com/app/',
    'twitch': 'https://www.twitch.tv/',
    'youtube': 'https://www.youtube.com/',
    'yt': 'https://www.youtube.com/',
    'wiki': 'https://www.wikipedia.org/',
    'wikipedia': 'https://www.wikipedia.org/',
    'spotify': 'https://open.spotify.com/',
    'google': 'https://www.google.com/',
    'docs': 'https://docs.google.com/',
    'slides': 'https://slides.google.com/',
    'sheets': 'https://sheets.google.com/',
    'canva': 'https://www.canva.com/',
    'photopea': 'https://www.photopea.com/',
    'netflix': 'https://www.netflix.com/',
    'disney': 'https://www.disneyplus.com/',
    'crunchyroll': 'https://www.crunchyroll.com/',
    'tiktok': 'https://www.tiktok.com/',
    'instagram': 'https://www.instagram.com/',
    'reddit': 'https://www.reddit.com/',
    'twitter': 'https://www.twitter.com/',
    'snapchat': 'https://www.snapchat.com/',
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
    
    // Seiten die in neuem Tab öffnen müssen (starke iframe-Blocker)
    const openInNewTab = ['youtube.com','youtu.be','netflix.com','twitch.tv','discord.com',
        'tiktok.com','instagram.com','snapchat.com','reddit.com',
        'chat.openai.com','claude.ai','grok.x.ai','gemini.google.com'].some(d => url.includes(d));
    
    if (openInNewTab) {
        window.open(url, '_blank');
        return;
    }
    
    // Seiten die Proxy brauchen
    const needsProxy = ['desertorder.com','1v1.lol','subwaysurfers.com',
        'geometrydash.io','krunker.io','shellshockers.io','slope.game',
        'orteil.dashnet.org'].some(d => url.includes(d));
    
    if (needsProxy) {
        addTab(PROXY + url, lower.length > 20 ? lower.substring(0, 20) + '...' : lower);
    } else {
        addTab(url, lower.length > 20 ? lower.substring(0, 20) + '...' : lower);
    }
}

feuerBtn.addEventListener('click', feuern);
urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') feuern(); });
