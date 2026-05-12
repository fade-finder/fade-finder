// ═══════════════════════════════════════════════════
//   FADEFINDER V2 — app.js
//   Accounts · ELO · Leaderboard · Hyper UI
// ═══════════════════════════════════════════════════

import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, limit, updateDoc, doc, deleteDoc,
  setDoc, getDoc, serverTimestamp, Timestamp, where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  getAuth, signInAnonymously, onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ── Init ────────────────────────────────────────────
const DEMO_MODE = firebaseConfig.apiKey === 'YOUR_API_KEY';
let db, auth;
if (!DEMO_MODE) {
  const app = initializeApp(firebaseConfig);
  db   = getFirestore(app);
  auth = getAuth(app);
}

// ── ELO Tiers ───────────────────────────────────────
const TIERS = [
  { name: 'UNKNOWN',   min: 0,    max: 800,      icon: '👤', color: '#666666' },
  { name: 'BRAWLER',   min: 800,  max: 1000,     icon: '👊', color: '#CD7F32' },
  { name: 'HITTER',    min: 1000, max: 1200,     icon: '⚡', color: '#E8FF00' },
  { name: 'ENFORCER',  min: 1200, max: 1400,     icon: '🔥', color: '#FF6B00' },
  { name: 'MENACE',    min: 1400, max: 1600,     icon: '💀', color: '#FF2233' },
  { name: 'LEGEND',    min: 1600, max: Infinity, icon: '👑', color: '#FFD700' },
];

const AVATARS = ['👊','🤜','💀','🔥','⚡','🥷','🦁','🐺','🦊','🐯','🦅','💎','👑','⚔️','🎯','🏆','🌪️','☄️','🔱','💣','🧨','🪖','🛡️','🔮'];

function getTier(elo) {
  return TIERS.find(t => elo >= t.min && elo < t.max) || TIERS[0];
}
function getAvatarBg(uid) {
  const cols = ['#1a1a2e','#16213e','#1a2010','#200a0a','#0a1a20','#1a0a20','#201a0a','#0a200a'];
  let h = 0;
  for (const c of (uid || 'x')) h = c.charCodeAt(0) + ((h << 5) - h);
  return cols[Math.abs(h) % cols.length];
}

// ── State ────────────────────────────────────────────
const S = {
  userId:       null,
  userProfile:  null,
  userLocation: null,
  locReady:     false,
  fades:        new Map(),
  markers:      new Map(),
  profiles:     new Map(),   // uid → profile
  selectedId:   null,
  filter:       'all',
  chatUnsub:    null,   // active chat listener unsubscribe fn
  chatFadeId:   null,
  postMode:     'solo',
  squadSize:    3,
  expireMins:   30,
  selectedAv:   null,
};

// ── DOM ──────────────────────────────────────────────
const $ = id => document.getElementById(id);
const D = {
  grain:        $('grain'),
  pwaBanner:    $('pwaBanner'),
  pwaBannerClose:$('pwaBannerClose'),
  onboarding:   $('onboarding'),
  avatarGrid:   $('avatarGrid'),
  obUsername:   $('obUsername'),
  obHint:       $('obHint'),
  obBtn:        $('obBtn'),
  lockinOverlay:$('lockinOverlay'),
  topbar:       $('topbar'),
  leaderboardBtn:$('leaderboardBtn'),
  profileBtn:   $('profileBtn'),
  topbarAv:     $('topbarAv'),
  activeCount:  $('activeCount'),
  filterBar:    $('filterBar'),
  fPill:        $('fPill'),
  throwFadeBtn: $('throwFadeBtn'),
  // Post
  postOverlay:  $('postOverlay'),
  postSheet:    $('postSheet'),
  closePost:    $('closePost'),
  calloutText:  $('calloutText'),
  charCount:    $('charCount'),
  squadField:   $('squadField'),
  locRow:       $('locRow'),
  locText:      $('locText'),
  submitFade:   $('submitFade'),
  // Detail
  detailOverlay:$('detailOverlay'),
  detailPanel:  $('detailPanel'),
  closeDetail:  $('closeDetail'),
  dBadge:       $('dBadge'),
  dCreator:     $('dCreator'),
  dCreatorAv:   $('dCreatorAv'),
  dCreatorName: $('dCreatorName'),
  dCreatorElo:  $('dCreatorElo'),
  dCallout:     $('dCallout'),
  dDist:        $('dDist'),
  dExp:         $('dExp'),
  dQueueCount:  $('dQueueCount'),
  dFormat:      $('dFormat'),
  backupBanner: $('backupBanner'),
  cFill:        $('cFill'),
  oFill:        $('oFill'),
  cSlots:       $('cSlots'),
  oSlots:       $('oSlots'),
  inviteBox:    $('inviteBox'),
  invCode:      $('invCode'),
  copyInv:      $('copyInv'),
  resultBox:    $('resultBox'),
  reportWin:    $('reportWin'),
  reportLoss:   $('reportLoss'),
  queueBtn:     $('queueBtn'),
  leaveBtn:     $('leaveBtn'),
  creatorOwn:   $('creatorOwn'),
  cancelFadeBtn:$('cancelFadeBtn'),
  // Leaderboard
  lbOverlay:    $('lbOverlay'),
  closeLb:      $('closeLb'),
  lbBody:       $('lbBody'),
  // Profile
  profileOverlay:$('profileOverlay'),
  closeProfile: $('closeProfile'),
  profAv:       $('profAv'),
  profName:     $('profName'),
  profTier:     $('profTier'),
  profElo:      $('profElo'),
  profEloBar:   $('profEloBar'),
  profEloRange: $('profEloRange'),
  profWins:     $('profWins'),
  profLosses:   $('profLosses'),
  profFades:    $('profFades'),
  profWR:       $('profWR'),
  signOutBtn:   $('signOutBtn'),
  // Toast / delta
  toast:        $('toast'),
  eloDelta:     $('eloDelta'),
  // Chat
  chatSection:  $('chatSection'),
  chatMessages: $('chatMessages'),
  chatEmpty:    $('chatEmpty'),
  chatCount:    $('chatCount'),
  chatInput:    $('chatInput'),
  chatSend:     $('chatSend'),
  chatAv:       $('chatAv'),
};

// ═══════════════════════════════════════════════════
//   GRAIN CANVAS
// ═══════════════════════════════════════════════════
function initGrain() {
  const c = D.grain, ctx = c.getContext('2d');
  let t = 0;
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  (function tick() {
    const id = ctx.createImageData(c.width, c.height);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = d[i+1] = d[i+2] = v;
      d[i+3] = 18;
    }
    ctx.putImageData(id, 0, 0);
    t++;
    requestAnimationFrame(tick);
  })();
}

// ═══════════════════════════════════════════════════
//   SAFARI PWA BANNER
// ═══════════════════════════════════════════════════
function initPWABanner() {
  const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari  = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent);
  const standalone= window.navigator.standalone;
  const dismissed = localStorage.getItem('ff_pwa_dismissed');

  if (isIOS && isSafari && !standalone && !dismissed) {
    D.pwaBanner.classList.remove('hidden');
  } else {
    D.pwaBanner.classList.add('hidden');
  }
  D.pwaBannerClose.addEventListener('click', () => {
    D.pwaBanner.classList.add('hidden');
    localStorage.setItem('ff_pwa_dismissed', '1');
  });
}

// ═══════════════════════════════════════════════════
//   MAP
// ═══════════════════════════════════════════════════
let map, userMarker;

function initMap() {
  map = L.map('map', {
    zoomControl: false,
    center: [39.8283, -98.5795],
    zoom: 13,
    minZoom: 3, maxZoom: 19,
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd', maxZoom: 20,
  }).addTo(map);
  L.control.zoom({ position: 'topright' }).addTo(map);
  map.on('click', () => { closeDetail(); });
}

function markerIcon(mode, locked, avatar, bgColor) {
  const emoji = avatar || '✊';
  const ring  = mode === 'squads_no_fill' ? `<div class="ff-ring"></div>` : '';
  const av    = `<div class="ff-av" style="background:${bgColor||'#1c1c1c'}">${emoji}</div>`;
  return L.divIcon({
    className: '',
    html: `<div class="ff-marker ${mode} ${locked ? 'locked' : ''}">${ring}✊${av}</div>`,
    iconSize: [50, 50], iconAnchor: [25, 25], popupAnchor: [0, -30],
  });
}

function userIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="user-dot"></div>`,
    iconSize: [18, 18], iconAnchor: [9, 9],
  });
}

// ═══════════════════════════════════════════════════
//   GEOLOCATION
// ═══════════════════════════════════════════════════
function getLocation() {
  if (!navigator.geolocation) { D.locText.textContent = 'Location not supported'; return; }
  D.locText.textContent = 'Getting location…';
  navigator.geolocation.getCurrentPosition(pos => {
    S.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    S.locReady = true;
    D.locText.textContent = `${S.userLocation.lat.toFixed(4)}, ${S.userLocation.lng.toFixed(4)}`;
    D.submitFade.disabled = false;
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([S.userLocation.lat, S.userLocation.lng], { icon: userIcon(), zIndexOffset: -100 }).addTo(map);
    map.flyTo([S.userLocation.lat, S.userLocation.lng], 15, { duration: 1.5 });
  }, () => {
    D.locText.textContent = 'Location denied';
    toast('Enable location to use FadeFinder', 'error');
  }, { enableHighAccuracy: true, timeout: 10000 });
}

// ═══════════════════════════════════════════════════
//   AUTH & PROFILES
// ═══════════════════════════════════════════════════
async function initAuth() {
  if (DEMO_MODE) {
    S.userId = localStorage.getItem('ff_demo_uid') || ('demo-' + Math.random().toString(36).slice(2, 10));
    localStorage.setItem('ff_demo_uid', S.userId);
    return;
  }
  const cred = await signInAnonymously(auth);
  S.userId = cred.user.uid;
}

async function loadOrCreateProfile() {
  if (DEMO_MODE) {
    const saved = JSON.parse(localStorage.getItem('ff_profile') || 'null');
    if (saved) {
      S.userProfile = saved;
      S.profiles.set(S.userId, saved);
      updateTopbarAvatar();
      checkOnboarding();
    } else {
      showOnboarding();
    }
    return;
  }
  try {
    const snap = await getDoc(doc(db, 'users', S.userId));
    if (snap.exists()) {
      S.userProfile = snap.data();
      S.profiles.set(S.userId, S.userProfile);
      updateTopbarAvatar();
      checkOnboarding();
    } else {
      showOnboarding();
    }
  } catch (e) {
    console.error('Profile load error:', e);
    showOnboarding();
  }
}

async function saveProfile(profile) {
  S.userProfile = profile;
  S.profiles.set(S.userId, profile);
  if (DEMO_MODE) {
    localStorage.setItem('ff_profile', JSON.stringify(profile));
    return;
  }
  await setDoc(doc(db, 'users', S.userId), profile);
}

async function fetchProfile(uid) {
  if (S.profiles.has(uid)) return S.profiles.get(uid);
  if (DEMO_MODE) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const p = snap.data();
      S.profiles.set(uid, p);
      return p;
    }
  } catch (_) {}
  return null;
}

function updateTopbarAvatar() {
  if (!S.userProfile) return;
  const bg = getAvatarBg(S.userId);
  D.topbarAv.textContent = S.userProfile.avatar;
  D.topbarAv.style.background = bg;
  D.topbarAv.style.fontSize = '18px';
}

// ── ELO helpers ──────────────────────────────────────
function calcElo(myElo, oppElo, won, K = 32) {
  const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  return Math.round(myElo + K * ((won ? 1 : 0) - expected));
}

async function applyResult(fadeId, won) {
  const fade = S.fades.get(fadeId);
  if (!fade || !S.userProfile) return;

  const myElo  = S.userProfile.elo || 1000;
  // Estimate opponent ELO (average of opponent side, or 1000 if unknown)
  let oppElo = 1000;
  const oppIds = fade.opponentQueue || [];
  if (oppIds.length > 0) {
    const elos = await Promise.all(oppIds.map(async uid => {
      const p = await fetchProfile(uid);
      return p?.elo || 1000;
    }));
    oppElo = Math.round(elos.reduce((a, b) => a + b, 0) / elos.length);
  }

  const newElo   = calcElo(myElo, oppElo, won);
  const delta    = newElo - myElo;
  const newWins  = (S.userProfile.wins   || 0) + (won ? 1 : 0);
  const newLosses= (S.userProfile.losses || 0) + (won ? 0 : 1);

  const updated = {
    ...S.userProfile,
    elo:    newElo,
    wins:   newWins,
    losses: newLosses,
    fades:  (S.userProfile.fades || 0) + 1,
  };
  await saveProfile(updated);

  // Mark fade result to prevent double-reporting
  await updateFade(fadeId, { [`result_${S.userId}`]: won ? 'win' : 'loss' });

  showEloDelta(delta);
  toast(`ELO ${delta >= 0 ? '+' : ''}${delta} — ${getTier(newElo).icon} ${getTier(newElo).name}`, delta >= 0 ? 'success' : 'error');
}

// ═══════════════════════════════════════════════════
//   ONBOARDING
// ═══════════════════════════════════════════════════
function showOnboarding() {
  // Populate avatar grid
  D.avatarGrid.innerHTML = '';
  for (const av of AVATARS) {
    const btn = document.createElement('button');
    btn.className = 'av-item';
    btn.textContent = av;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.av-item').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      S.selectedAv = av;
      validateOnboarding();
    });
    D.avatarGrid.appendChild(btn);
  }
  D.onboarding.classList.remove('hidden');
}

function checkOnboarding() {
  D.onboarding.classList.add('hidden');
}

function validateOnboarding() {
  const name = D.obUsername.value.trim();
  const ok = name.length >= 2 && name.length <= 18 && /^[^\s]+$/.test(name) && S.selectedAv;
  D.obBtn.disabled = !ok;
  if (name.length > 0 && name.length < 2) D.obHint.textContent = 'At least 2 characters';
  else if (/\s/.test(name))               D.obHint.textContent = 'No spaces allowed';
  else                                    D.obHint.textContent = '\u00a0';
}

async function submitOnboarding() {
  const username = D.obUsername.value.trim();
  if (!username || !S.selectedAv) return;
  D.obBtn.disabled = true;
  D.obBtn.textContent = 'ENTERING…';
  const profile = {
    username,
    avatar:  S.selectedAv,
    elo:     1000,
    wins:    0,
    losses:  0,
    fades:   0,
    createdAt: Date.now(),
  };
  await saveProfile(profile);
  updateTopbarAvatar();
  D.onboarding.classList.add('hidden');
  toast(`Welcome, ${username}. Handle your business. ✊`, 'success');
}

// ═══════════════════════════════════════════════════
//   FADES — REAL-TIME
// ═══════════════════════════════════════════════════
function listenFades() {
  if (DEMO_MODE) { loadDemoFades(); return; }

  const q = collection(db, 'fades');
  onSnapshot(q, snapshot => {
    const now = Date.now();
    snapshot.docChanges().forEach(change => {
      const fade = { id: change.doc.id, ...change.doc.data() };
      const expMs = fade.expiresAt?.toMillis?.() || fade.expiresAt || 0;
      if (change.type === 'removed' || expMs < now) {
        removeFadeMarker(fade.id);
        S.fades.delete(fade.id);
      } else {
        const wasLocked = S.fades.get(fade.id)?.status;
        S.fades.set(fade.id, fade);
        upsertMarker(fade);
        if (fade.status === 'locked' && wasLocked !== 'locked') {
          // Check if we're involved
          const allIds = [...(fade.creatorTeam || []), ...(fade.opponentQueue || [])];
          if (allIds.includes(S.userId)) showLockin();
        }
      }
    });
    updateCount();
    if (S.selectedId && S.fades.has(S.selectedId)) renderDetail(S.fades.get(S.selectedId));
  }, err => console.error('🔴 Snapshot error:', err.code, err.message));
}

async function upsertMarker(fade) {
  if (S.filter !== 'all' && fade.mode !== S.filter) {
    removeFadeMarker(fade.id);
    return;
  }
  const profile = await fetchProfile(fade.creatorId);
  const av      = profile?.avatar || '✊';
  const bg      = getAvatarBg(fade.creatorId);
  const icon    = markerIcon(fade.mode, fade.status === 'locked', av, bg);
  const latlng  = L.latLng(fade.lat, fade.lng);

  if (S.markers.has(fade.id)) {
    S.markers.get(fade.id).setIcon(icon);
  } else {
    const m = L.marker(latlng, { icon })
      .addTo(map)
      .on('click', e => { L.DomEvent.stopPropagation(e); openDetail(fade.id); });
    S.markers.set(fade.id, m);
  }
}

function removeFadeMarker(id) {
  if (S.markers.has(id)) { map.removeLayer(S.markers.get(id)); S.markers.delete(id); }
}

function updateCount() {
  const n = S.fades.size;
  D.activeCount.textContent = `${n} LIVE`;
}

// ═══════════════════════════════════════════════════
//   POST FADE
// ═══════════════════════════════════════════════════
async function postFade() {
  if (!S.locReady) { toast('Location not ready', 'error'); return; }
  if (!S.userId)   { toast('Not signed in', 'error'); return; }
  for (const [, f] of S.fades) {
    if (f.creatorId === S.userId && f.status === 'active') {
      toast('You already have a live fade', 'error'); return;
    }
  }
  const callout   = D.calloutText.value.trim() || '…';
  const expireMins = S.expireMins;
  const now        = Date.now();
  const expiresAt  = now + expireMins * 60_000;
  const maxSize    = S.postMode === 'solo' ? 1 : S.squadSize;

  const data = {
    creatorId:     S.userId,
    lat:           S.userLocation.lat,
    lng:           S.userLocation.lng,
    mode:          S.postMode,
    callout,
    maxSize,
    creatorTeam:   [S.userId],
    opponentQueue: [],
    status:        'active',
    createdAt:     DEMO_MODE ? now : serverTimestamp(),
    expiresAt:     DEMO_MODE ? expiresAt : Timestamp.fromMillis(expiresAt),
  };

  D.submitFade.disabled = true;
  D.submitFade.textContent = 'POSTING…';
  try {
    if (DEMO_MODE) {
      const id = 'fade-' + Math.random().toString(36).slice(2, 10);
      const fade = { id, ...data };
      S.fades.set(id, fade);
      upsertMarker(fade);
      saveDemoFades();
      updateCount();
    } else {
      await addDoc(collection(db, 'fades'), data);
    }
    // Increment user's fades count
    if (S.userProfile) {
      await saveProfile({ ...S.userProfile, fades: (S.userProfile.fades || 0) + 1 });
    }
    closePost();
    toast('Fade posted! 🔥', 'success');
    D.calloutText.value = '';
    D.charCount.textContent = '0';
  } catch (e) {
    console.error(e);
    toast('Failed to post', 'error');
  } finally {
    D.submitFade.disabled = false;
    D.submitFade.textContent = 'POST THE FADE';
  }
}

// ═══════════════════════════════════════════════════
//   DETAIL PANEL
// ═══════════════════════════════════════════════════
async function openDetail(id) {
  S.selectedId = id;
  const fade = S.fades.get(id);
  if (!fade) return;
  await renderDetail(fade);
  initChat(id);
  D.detailOverlay.classList.add('open');
}

function closeDetail() {
  D.detailOverlay.classList.remove('open');
  S.selectedId = null;
  if (S.chatUnsub) { S.chatUnsub(); S.chatUnsub = null; }
  S.chatFadeId = null;
}

async function renderDetail(fade) {
  const modeLabels = { solo:'SOLO', squads_fill:'SQUADS FILL', squads_no_fill:'NEEDS BACKUP' };
  const badgeCls   = { solo:'solo-b', squads_fill:'squad-b', squads_no_fill:'backup-b' };
  D.dBadge.textContent  = modeLabels[fade.mode] || fade.mode;
  D.dBadge.className    = `pbadge ${badgeCls[fade.mode] || ''}`;

  // Creator profile
  const cp = await fetchProfile(fade.creatorId);
  if (cp) {
    const bg = getAvatarBg(fade.creatorId);
    D.dCreatorAv.textContent = cp.avatar;
    D.dCreatorAv.style.background = bg;
    D.dCreatorName.textContent = cp.username;
    const tier = getTier(cp.elo || 1000);
    D.dCreatorElo.textContent = `${tier.icon} ${tier.name} · ${cp.elo || 1000} ELO`;
    D.dCreatorElo.style.color = tier.color;
  } else {
    D.dCreatorAv.textContent = '✊';
    D.dCreatorName.textContent = 'Anonymous';
    D.dCreatorElo.textContent = '— ELO';
  }

  D.dCallout.textContent = fade.callout || '…';

  // Meta
  D.dDist.textContent  = S.userLocation
    ? formatDist(haversine(S.userLocation, { lat: fade.lat, lng: fade.lng })) : '—';
  const expMs = fade.expiresAt?.toMillis?.() || fade.expiresAt || 0;
  D.dExp.textContent   = formatTimeLeft(expMs - Date.now());
  const maxSize = fade.maxSize || 1;
  const total   = (fade.creatorTeam?.length || 0) + (fade.opponentQueue?.length || 0);
  D.dQueueCount.textContent = `${total}/${maxSize * 2}`;
  D.dFormat.textContent = fade.mode === 'solo' ? '1v1' : `${maxSize}v${maxSize}`;

  D.backupBanner.style.display = fade.mode === 'squads_no_fill' ? 'flex' : 'none';

  // Slots
  renderSlots(D.cSlots, fade.creatorTeam || [], maxSize);
  renderSlots(D.oSlots, fade.opponentQueue || [], maxSize);
  D.cFill.textContent = `${(fade.creatorTeam || []).length}/${maxSize}`;
  D.oFill.textContent = `${(fade.opponentQueue || []).length}/${maxSize}`;

  const isCreator  = fade.creatorId === S.userId;
  const inCreator  = (fade.creatorTeam || []).includes(S.userId);
  const inOpponent = (fade.opponentQueue || []).includes(S.userId);
  const isQueued   = inCreator || inOpponent;
  const locked     = fade.status === 'locked';
  const reported   = fade[`result_${S.userId}`];

  // Invite (creator only, squads)
  const showInvite = isCreator && fade.mode !== 'solo';
  D.inviteBox.style.display = showInvite ? 'flex' : 'none';
  if (showInvite) D.invCode.textContent = fade.id.slice(-6).toUpperCase();

  // Result reporting (locked, involved, not yet reported)
  const showResult = locked && isQueued && !reported;
  D.resultBox.style.display = showResult ? 'flex' : 'none';

  // Buttons
  D.creatorOwn.style.display = (isCreator && !locked) ? 'flex' : 'none';
  D.queueBtn.style.display   = (!isCreator && !isQueued && !locked) ? 'block' : 'none';
  D.leaveBtn.style.display   = (!isCreator && isQueued && !locked) ? 'block' : 'none';

  // Style queue button
  if (fade.mode === 'squads_no_fill') {
    D.queueBtn.textContent = '📡 JOIN AS BACKUP';
    D.queueBtn.style.cssText = 'background:var(--red-a);color:var(--red);border:1px solid var(--red)';
  } else if (fade.mode === 'squads_fill') {
    D.queueBtn.textContent = '👥 QUEUE AS OPPONENT';
    D.queueBtn.style.cssText = 'background:var(--blue-a);color:var(--blue);border:1px solid var(--blue)';
  } else {
    D.queueBtn.textContent = '✊ QUEUE UP';
    D.queueBtn.style.cssText = '';
  }
}

function renderSlots(container, members, max) {
  container.innerHTML = '';
  for (let i = 0; i < max; i++) {
    const uid  = members[i];
    const slot = document.createElement('div');
    if (uid) {
      slot.className = `slot filled${uid === S.userId ? ' is-you' : ''}`;
      const p = S.profiles.get(uid);
      slot.textContent = uid === S.userId ? 'YOU' : (p?.avatar || '•');
      if (p?.avatar && uid !== S.userId) slot.style.fontSize = '16px';
    } else {
      slot.className = 'slot';
      slot.textContent = i + 1;
    }
    container.appendChild(slot);
  }
}

// ═══════════════════════════════════════════════════
//   QUEUE UP / LEAVE
// ═══════════════════════════════════════════════════
async function queueUp() {
  const fade = S.fades.get(S.selectedId);
  if (!fade) return;
  const maxSize     = fade.maxSize || 1;
  const creatorLen  = (fade.creatorTeam  || []).length;
  const opponentLen = (fade.opponentQueue|| []).length;

  let updates;
  if (fade.mode === 'squads_no_fill') {
    if (creatorLen >= maxSize) { toast('Creator side full', 'error'); return; }
    updates = { creatorTeam: [...(fade.creatorTeam || []), S.userId] };
  } else {
    if (opponentLen >= maxSize) { toast('Opponent side full', 'error'); return; }
    updates = { opponentQueue: [...(fade.opponentQueue || []), S.userId] };
  }
  await updateFade(S.selectedId, updates);

  // Check lock
  const updated = S.fades.get(S.selectedId);
  if (updated) {
    const cLen = (updated.creatorTeam  || []).length;
    const oLen = (updated.opponentQueue|| []).length;
    if (cLen >= maxSize && oLen >= maxSize) {
      await updateFade(S.selectedId, { status: 'locked' });
    }
  }
  toast('Queued up! ✊', 'success');
}

async function leaveQueue() {
  const fade = S.fades.get(S.selectedId);
  if (!fade) return;
  const newCreator  = (fade.creatorTeam  || []).filter(u => u !== S.userId);
  const newOpponent = (fade.opponentQueue|| []).filter(u => u !== S.userId);
  await updateFade(S.selectedId, { creatorTeam: newCreator, opponentQueue: newOpponent, status: 'active' });
  toast('Left the queue', 'info');
}

async function cancelFade() {
  if (!confirm('Cancel this fade?')) return;
  try {
    if (DEMO_MODE) {
      S.fades.delete(S.selectedId);
      removeFadeMarker(S.selectedId);
      saveDemoFades(); updateCount();
    } else {
      await deleteDoc(doc(db, 'fades', S.selectedId));
    }
    closeDetail();
    toast('Fade cancelled', 'info');
  } catch (e) { toast('Failed to cancel', 'error'); }
}

async function updateFade(id, fields) {
  if (DEMO_MODE) {
    const fade = S.fades.get(id);
    if (fade) {
      const updated = { ...fade, ...fields };
      S.fades.set(id, updated);
      upsertMarker(updated);
      saveDemoFades();
      if (S.selectedId === id) renderDetail(updated);
    }
    return;
  }
  try { await updateDoc(doc(db, 'fades', id), fields); }
  catch (e) { console.error(e); toast('Update failed', 'error'); }
}

async function joinViaCode(code) {
  for (const [id, fade] of S.fades) {
    if (id.slice(-6).toUpperCase() === code.toUpperCase()) {
      if (fade.creatorId === S.userId) { toast('That\'s your fade!', 'error'); return; }
      const maxSize   = fade.maxSize || 1;
      const creatorLen= (fade.creatorTeam || []).length;
      if ((fade.creatorTeam || []).includes(S.userId)) { toast('Already in squad', 'info'); return; }
      if (creatorLen >= maxSize) { toast('Creator side full', 'error'); return; }
      await updateFade(id, { creatorTeam: [...(fade.creatorTeam || []), S.userId] });
      toast('Joined the crew! 👥', 'success');
      openDetail(id);
      map.flyTo([fade.lat, fade.lng], 16);
      return;
    }
  }
  toast('Invite code not found', 'error');
}

// ═══════════════════════════════════════════════════
//   LOCK-IN CELEBRATION
// ═══════════════════════════════════════════════════
function showLockin() {
  D.lockinOverlay.classList.add('show');
  setTimeout(() => D.lockinOverlay.classList.remove('show'), 3000);
}

// ═══════════════════════════════════════════════════
//   LEADERBOARD
// ═══════════════════════════════════════════════════
async function openLeaderboard() {
  D.lbOverlay.classList.add('open');
  D.lbBody.innerHTML = '';
  // Skeletons
  for (let i = 0; i < 8; i++) {
    const sk = document.createElement('div');
    sk.className = 'lb-skeleton';
    D.lbBody.appendChild(sk);
  }
  const rows = await fetchLeaderboard();
  D.lbBody.innerHTML = '';
  if (!rows.length) { D.lbBody.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:14px">No rankings yet. Post a fade!</div>'; return; }

  let myRank = -1;
  rows.forEach((user, i) => {
    if (user.uid === S.userId) myRank = i + 1;
    const row = document.createElement('div');
    row.className = `lb-row${user.uid === S.userId ? ' lb-you' : ''}`;
    row.style.animationDelay = `${i * 40}ms`;
    const rankN  = i + 1;
    const rankCls= rankN === 1 ? 'r1' : rankN === 2 ? 'r2' : rankN === 3 ? 'r3' : '';
    const tier   = getTier(user.elo || 1000);
    const bg     = getAvatarBg(user.uid);
    row.innerHTML = `
      <div class="lb-rank ${rankCls}">${rankN <= 3 ? ['🥇','🥈','🥉'][rankN-1] : rankN}</div>
      <div class="lb-av" style="background:${bg}">${user.avatar || '✊'}</div>
      <div class="lb-info">
        <div class="lb-name">${user.username || 'Anonymous'}</div>
        <div class="lb-tier" style="color:${tier.color}">${tier.icon} ${tier.name}</div>
      </div>
      <div class="lb-elo">${user.elo || 1000}</div>`;
    D.lbBody.appendChild(row);
  });

  if (myRank > 0) {
    const footer = document.createElement('div');
    footer.className = 'lb-your-rank';
    footer.textContent = `YOUR RANK: #${myRank}`;
    D.lbBody.appendChild(footer);
  }
}

async function fetchLeaderboard() {
  if (DEMO_MODE) {
    // Build from known profiles + self
    const list = [];
    if (S.userProfile) list.push({ uid: S.userId, ...S.userProfile });
    return list.sort((a, b) => (b.elo || 0) - (a.elo || 0)).slice(0, 50);
  }
  try {
    const q    = query(collection(db, 'users'), orderBy('elo', 'desc'), limit(50));
    const snap = await new Promise((res, rej) => {
      const unsub = onSnapshot(q, s => { unsub(); res(s); }, rej);
    });
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (e) { console.error(e); return []; }
}

// ═══════════════════════════════════════════════════
//   PROFILE PANEL
// ═══════════════════════════════════════════════════
function openProfile() {
  if (!S.userProfile) { showOnboarding(); return; }
  const p = S.userProfile;
  const bg = getAvatarBg(S.userId);
  D.profAv.textContent = p.avatar || '✊';
  D.profAv.style.background = bg;
  D.profName.textContent = p.username || 'Anonymous';

  const tier = getTier(p.elo || 1000);
  D.profTier.textContent  = `${tier.icon} ${tier.name}`;
  D.profTier.style.color  = tier.color;
  D.profTier.style.borderColor = tier.color;
  D.profTier.style.background  = tier.color + '18';

  // Animated ELO counter
  animateCounter(D.profElo, 0, p.elo || 1000, 900);

  // ELO bar
  const nextTier = TIERS.find(t => t.min > (p.elo || 1000)) || tier;
  const pct = ((p.elo - tier.min) / ((nextTier.min || tier.min + 400) - tier.min)) * 100;
  D.profEloBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  D.profEloRange.textContent = nextTier.min === Infinity ? 'MAX TIER' : `${tier.min} – ${nextTier.min || tier.max}`;

  D.profWins.textContent   = p.wins   || 0;
  D.profLosses.textContent = p.losses || 0;
  D.profFades.textContent  = p.fades  || 0;
  const wr = (p.wins || 0) + (p.losses || 0) > 0
    ? Math.round((p.wins / ((p.wins || 0) + (p.losses || 0))) * 100) + '%' : '—';
  D.profWR.textContent = wr;

  D.profileOverlay.classList.add('open');
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ═══════════════════════════════════════════════════
//   FILTERS
// ═══════════════════════════════════════════════════
function applyFilter(mode, activeBtn) {
  S.filter = mode;
  // Move pill indicator
  const pill = D.fPill;
  pill.style.left  = `${activeBtn.offsetLeft}px`;
  pill.style.width = `${activeBtn.offsetWidth}px`;
  // Rebuild markers
  for (const [, m] of S.markers) map.removeLayer(m);
  S.markers.clear();
  for (const [, f] of S.fades) upsertMarker(f);
}

function initFilterPill() {
  const first = D.filterBar.querySelector('.f-btn.active');
  if (first) {
    D.fPill.style.left  = `${first.offsetLeft}px`;
    D.fPill.style.width = `${first.offsetWidth}px`;
  }
}

// ═══════════════════════════════════════════════════
//   DEMO FADES
// ═══════════════════════════════════════════════════
function loadDemoFades() {
  try {
    const saved = JSON.parse(localStorage.getItem('ff_fades') || '[]');
    const now = Date.now();
    for (const f of saved) if (f.expiresAt > now) { S.fades.set(f.id, f); upsertMarker(f); }
  } catch (_) {}
  setTimeout(() => {
    if (S.userLocation && S.fades.size === 0) seedDemoFades();
    updateCount();
  }, 2000);
  setInterval(() => {
    const now = Date.now();
    for (const [id, f] of S.fades) {
      if ((f.expiresAt || 0) < now) { removeFadeMarker(id); S.fades.delete(id); }
    }
    updateCount();
  }, 10000);
}

function seedDemoFades() {
  const seeds = [
    { mode: 'solo',           callout: 'Anyone tryna catch these hands on Court St?', offset:[.0018,-.0022], size:1, mins:30 },
    { mode: 'squads_fill',    callout: '3v3 at the park, we got 2. Who wants smoke?', offset:[-.0012,.0030], size:3, mins:45 },
    { mode: 'squads_no_fill', callout: 'We 2 deep and need backup. Block is hot.',    offset:[.0025,.0015],  size:3, mins:25 },
    { mode: 'solo',           callout: 'No cap, no talking. Box or walk.',            offset:[-.003,-.001],  size:1, mins:60 },
  ];
  const now = Date.now();
  for (const s of seeds) {
    const id = `seed-${Math.random().toString(36).slice(2, 8)}`;
    const fake = {
      id, creatorId:'npc-'+id.slice(0,6),
      lat: S.userLocation.lat + s.offset[0],
      lng: S.userLocation.lng + s.offset[1],
      mode: s.mode, callout: s.callout, maxSize: s.size,
      creatorTeam: ['npc-'+id.slice(0,6)], opponentQueue: [],
      status: 'active', createdAt: now,
      expiresAt: now + s.mins * 60_000,
    };
    S.fades.set(id, fake);
    upsertMarker(fake);
    // Seed NPC profile
    S.profiles.set(fake.creatorId, { username: 'Player'+id.slice(5,8), avatar: AVATARS[Math.floor(Math.random()*AVATARS.length)], elo: 900 + Math.floor(Math.random()*400) });
  }
  saveDemoFades();
  updateCount();
}

function saveDemoFades() {
  const arr = [];
  for (const [, f] of S.fades) arr.push(f);
  localStorage.setItem('ff_fades', JSON.stringify(arr));
}

// ═══════════════════════════════════════════════════
//   ELO DELTA ANIMATION
// ═══════════════════════════════════════════════════
function showEloDelta(delta) {
  D.eloDelta.textContent = (delta >= 0 ? '+' : '') + delta;
  D.eloDelta.className   = `elo-delta show ${delta >= 0 ? 'plus' : 'minus'}`;
  setTimeout(() => { D.eloDelta.className = 'elo-delta'; }, 2400);
}

// ═══════════════════════════════════════════════════
//   TOAST
// ═══════════════════════════════════════════════════
let toastTimer;
function toast(msg, type = 'info') {
  clearTimeout(toastTimer);
  D.toast.textContent = msg;
  D.toast.className   = `toast ${type} show`;
  toastTimer = setTimeout(() => D.toast.classList.remove('show'), 3200);
}

// ═══════════════════════════════════════════════════
//   SHEET HELPERS
// ═══════════════════════════════════════════════════
function openPost()  { getLocation(); D.postOverlay.classList.add('open'); }
function closePost() { D.postOverlay.classList.remove('open'); }

// ═══════════════════════════════════════════════════
//   UTIL
// ═══════════════════════════════════════════════════
function haversine(a, b) {
  const R = 6371000, toR = d => d * Math.PI / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
  const x = Math.sin(dLat/2)**2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}
function formatDist(m)  { return m < 1000 ? `${Math.round(m)}m` : `${(m/1000).toFixed(1)}km`; }
function formatTimeLeft(ms) {
  if (ms <= 0) return 'EXPIRED';
  const m = Math.floor(ms / 60000);
  return m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
}

// ═══════════════════════════════════════════════════
//   EVENT LISTENERS
// ═══════════════════════════════════════════════════
function setupEvents() {
  // Onboarding
  D.obUsername.addEventListener('input', validateOnboarding);
  D.obBtn.addEventListener('click', submitOnboarding);

  // Top bar
  D.throwFadeBtn.addEventListener('click', openPost);
  D.profileBtn.addEventListener('click', openProfile);
  D.leaderboardBtn.addEventListener('click', openLeaderboard);

  // Close overlays on backdrop click
  D.postOverlay.addEventListener('click', e => { if (e.target === D.postOverlay) closePost(); });
  D.lbOverlay.addEventListener('click', e => { if (e.target === D.lbOverlay) D.lbOverlay.classList.remove('open'); });
  D.profileOverlay.addEventListener('click', e => { if (e.target === D.profileOverlay) D.profileOverlay.classList.remove('open'); });

  D.closePost.addEventListener('click', closePost);
  D.closeLb.addEventListener('click', () => D.lbOverlay.classList.remove('open'));
  D.closeProfile.addEventListener('click', () => D.profileOverlay.classList.remove('open'));
  D.closeDetail.addEventListener('click', closeDetail);

  // Callout char count
  D.calloutText.addEventListener('input', () => D.charCount.textContent = D.calloutText.value.length);

  // Mode tiles
  document.querySelectorAll('.mode-tile').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-tile').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.postMode = btn.dataset.mode;
      D.squadField.style.display = S.postMode !== 'solo' ? 'flex' : 'none';
    });
  });

  // Squad size chips
  document.querySelectorAll('[data-size]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.squadSize = parseInt(btn.dataset.size);
    });
  });

  // Expire chips
  document.querySelectorAll('[data-mins]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mins]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.expireMins = parseInt(btn.dataset.mins);
    });
  });

  D.submitFade.addEventListener('click', postFade);

  // Detail actions
  D.queueBtn.addEventListener('click', queueUp);
  D.leaveBtn.addEventListener('click', leaveQueue);
  D.cancelFadeBtn.addEventListener('click', cancelFade);

  // Chat
  D.chatSend.addEventListener('click', sendChatMessage);
  D.chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  });
  D.reportWin.addEventListener('click', () => applyResult(S.selectedId, true));
  D.reportLoss.addEventListener('click', () => applyResult(S.selectedId, false));

  // Copy invite
  D.copyInv.addEventListener('click', () => {
    const url = `${location.origin}${location.pathname}?squad=${D.invCode.textContent}`;
    navigator.clipboard?.writeText(url).then(() => toast('Invite link copied!', 'success'));
  });

  // Squad invite from URL
  const code = new URLSearchParams(location.search).get('squad');
  if (code) {
    setTimeout(() => { toast(`Joining squad ${code}…`, 'info'); joinViaCode(code); history.replaceState({}, '', location.pathname); }, 2000);
  }

  // Filters
  document.querySelectorAll('.f-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.mode, btn);
    });
  });

  // Sign out
  D.signOutBtn.addEventListener('click', async () => {
    if (!confirm('Walk away? Your stats are saved.')) return;
    if (!DEMO_MODE) await signOut(auth);
    localStorage.removeItem('ff_profile');
    localStorage.removeItem('ff_demo_uid');
    D.profileOverlay.classList.remove('open');
    S.userProfile = null;
    showOnboarding();
  });

  // Refresh expiry display every 30s
  setInterval(() => {
    if (S.selectedId && S.fades.has(S.selectedId)) {
      const f = S.fades.get(S.selectedId);
      const expMs = f.expiresAt?.toMillis?.() || f.expiresAt || 0;
      D.dExp.textContent = formatTimeLeft(expMs - Date.now());
    }
  }, 30000);
}


// ═══════════════════════════════════════════════════
//   CHAT
// ═══════════════════════════════════════════════════
function initChat(fadeId) {
  // Tear down previous listener
  if (S.chatUnsub) { S.chatUnsub(); S.chatUnsub = null; }
  S.chatFadeId = fadeId;
  D.chatMessages.innerHTML = '';
  D.chatEmpty.style.display = 'block';
  D.chatMessages.appendChild(D.chatEmpty);
  D.chatCount.textContent = '0';

  // Seed avatar in input row
  if (S.userProfile) {
    D.chatAv.textContent = S.userProfile.avatar || '✊';
    D.chatAv.style.background = getAvatarBg(S.userId);
  }

  if (DEMO_MODE) {
    // Demo: load from localStorage
    const key = `ff_chat_${fadeId}`;
    const msgs = JSON.parse(localStorage.getItem(key) || '[]');
    msgs.forEach(m => appendChatMessage(m, fadeId));
    updateChatCount(msgs.length);
    return;
  }

  const q = query(
    collection(db, 'fades', fadeId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(100)
  );

  S.chatUnsub = onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const msg = { id: change.doc.id, ...change.doc.data() };
        appendChatMessage(msg, fadeId);
      }
    });
    updateChatCount(D.chatMessages.querySelectorAll('.chat-msg').length);
  }, err => console.error('Chat error:', err));
}

function appendChatMessage(msg, fadeId) {
  // Remove empty state
  D.chatEmpty.style.display = 'none';

  const isMe = msg.uid === S.userId;
  const bg   = getAvatarBg(msg.uid);
  const time = formatChatTime(msg.createdAt?.toMillis?.() || msg.createdAt || Date.now());

  const div = document.createElement('div');
  div.className = `chat-msg${isMe ? ' is-me' : ''}`;
  div.dataset.msgId = msg.id || '';
  div.innerHTML = `
    <div class="chat-msg-av" style="background:${bg}">${msg.avatar || '✊'}</div>
    <div class="chat-bubble-wrap">
      <div class="chat-name">${isMe ? 'YOU' : (msg.username || 'Anonymous')}</div>
      <div class="chat-bubble">${escapeHtml(msg.text)}</div>
      <div class="chat-time">${time}</div>
    </div>`;

  D.chatMessages.appendChild(div);
  // Scroll to latest
  requestAnimationFrame(() => {
    D.chatMessages.scrollTop = D.chatMessages.scrollHeight;
  });
}

function updateChatCount(n) {
  D.chatCount.textContent = n;
}

async function sendChatMessage() {
  const text = D.chatInput.value.trim();
  if (!text || !S.chatFadeId) return;
  if (!S.userProfile) { toast('Set up your profile first', 'error'); return; }

  D.chatSend.disabled = true;
  D.chatInput.value = '';

  const msg = {
    uid:      S.userId,
    username: S.userProfile.username || 'Anonymous',
    avatar:   S.userProfile.avatar   || '✊',
    text,
    createdAt: DEMO_MODE ? Date.now() : serverTimestamp(),
  };

  try {
    if (DEMO_MODE) {
      const key  = `ff_chat_${S.chatFadeId}`;
      const msgs = JSON.parse(localStorage.getItem(key) || '[]');
      const full = { ...msg, id: 'msg-' + Math.random().toString(36).slice(2, 8) };
      msgs.push(full);
      localStorage.setItem(key, JSON.stringify(msgs));
      appendChatMessage(full, S.chatFadeId);
      updateChatCount(D.chatMessages.querySelectorAll('.chat-msg').length);
    } else {
      await addDoc(collection(db, 'fades', S.chatFadeId, 'messages'), msg);
      // onSnapshot handles appending
    }
  } catch (e) {
    console.error('Send failed:', e);
    toast('Message failed to send', 'error');
    D.chatInput.value = text; // restore
  } finally {
    D.chatSend.disabled = false;
    D.chatInput.focus();
  }
}

function formatChatTime(ms) {
  if (!ms) return '';
  const d    = new Date(ms);
  const now  = new Date();
  const diff = now - d;
  if (diff < 60000)  return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString([], {month:'short', day:'numeric'});
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ═══════════════════════════════════════════════════
//   BOOT
// ═══════════════════════════════════════════════════
async function init() {
  initGrain();
  initPWABanner();
  initMap();

  await initAuth();
  await loadOrCreateProfile();

  listenFades();
  getLocation();
  setupEvents();

  // Filter pill init (after DOM settles)
  requestAnimationFrame(() => requestAnimationFrame(initFilterPill));
}

init().catch(console.error);
