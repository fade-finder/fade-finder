// ═══════════════════════════════════════════════════════════════════
//   FADEFINDER — app.js
//   Firebase Firestore backend (or demo mode if not configured)
// ═══════════════════════════════════════════════════════════════════

import { firebaseConfig } from './firebase-config.js';

// ── Firebase CDN imports ─────────────────────────────────────────────
import { initializeApp }       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, where, updateDoc, doc, deleteDoc,
  arrayUnion, arrayRemove, serverTimestamp, Timestamp,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ════════════════════════════════════════════════════════════════════
//   DEMO MODE CHECK
// ════════════════════════════════════════════════════════════════════
const DEMO_MODE = firebaseConfig.apiKey === 'YOUR_API_KEY';

let db, auth;

if (!DEMO_MODE) {
  const firebaseApp = initializeApp(firebaseConfig);
  db   = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
}

// ════════════════════════════════════════════════════════════════════
//   GLOBAL STATE
// ════════════════════════════════════════════════════════════════════
const state = {
  userId:          null,      // Firebase anonymous UID (or random in demo)
  userLocation:    null,      // { lat, lng }
  locationReady:   false,
  fades:           new Map(), // fadeId → fade data
  markers:         new Map(), // fadeId → L.marker
  selectedFadeId:  null,
  activeFilter:    'all',

  // Post form state
  postMode:    'solo',
  squadSize:   3,
  expireMins:  30,
};

// ════════════════════════════════════════════════════════════════════
//   DOM REFS
// ════════════════════════════════════════════════════════════════════
const $ = id => document.getElementById(id);

const dom = {
  map:             $('map'),
  activeCount:     $('activeCount'),
  locateBtn:       $('locateBtn'),
  filterBar:       $('filterBar'),
  throwFadeBtn:    $('throwFadeBtn'),

  // Post modal
  postModal:       $('postModal'),
  closePostModal:  $('closePostModal'),
  calloutText:     $('calloutText'),
  charCount:       $('charCount'),
  squadSizeGroup:  $('squadSizeGroup'),
  locationStatus:  $('locationStatus'),
  locText:         $('locText'),
  submitFade:      $('submitFade'),

  // Detail panel
  detailPanel:     $('detailPanel'),
  closeDetailBtn:  $('closeDetailBtn'),
  panelBadge:      $('panelBadge'),
  detailCallout:   $('detailCallout'),
  detailDistance:  $('detailDistance'),
  detailExpires:   $('detailExpires'),
  detailQueueCount:$('detailQueueCount'),
  detailNeeded:    $('detailNeeded'),
  backupBanner:    $('backupBanner'),
  creatorSlots:    $('creatorSlots'),
  opponentSlots:   $('opponentSlots'),
  creatorFill:     $('creatorFill'),
  opponentFill:    $('opponentFill'),
  inviteSection:   $('inviteSection'),
  inviteCode:      $('inviteCode'),
  copyInviteBtn:   $('copyInviteBtn'),
  queueBtn:        $('queueBtn'),
  leaveBtn:        $('leaveBtn'),
  alreadyCreator:  $('alreadyCreator'),
  cancelFadeBtn:   $('cancelFadeBtn'),

  toast:           $('toast'),
  demoBadge:       $('demoBadge'),
};

// ════════════════════════════════════════════════════════════════════
//   MAP SETUP
// ════════════════════════════════════════════════════════════════════
let map;
let userMarker;

function initMap() {
  map = L.map('map', {
    zoomControl: false,
    center: [39.8283, -98.5795], // US center fallback
    zoom: 13,
    minZoom: 3,
    maxZoom: 19,
  });

  // CartoDB Dark Matter — free, no API key needed
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }
  ).addTo(map);

  L.control.zoom({ position: 'topright' }).addTo(map);

  // Close detail panel when clicking the map
  map.on('click', () => closeDetailPanel());
}

// ── Custom marker HTML ───────────────────────────────────────────────
function modeEmoji(mode) {
  if (mode === 'solo')           return '✊';
  if (mode === 'squads_fill')    return '👥';
  if (mode === 'squads_no_fill') return '📡';
  return '✊';
}

function createMarkerIcon(mode, locked = false) {
  const pulse = mode === 'squads_no_fill'
    ? `<div class="marker-ring"></div>` : '';

  return L.divIcon({
    className: '',
    html: `
      <div class="fade-marker ${mode} ${locked ? 'locked' : ''}">
        ${pulse}
        <span>${modeEmoji(mode)}</span>
      </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -28],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="user-marker"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// ════════════════════════════════════════════════════════════════════
//   GEOLOCATION
// ════════════════════════════════════════════════════════════════════
function getUserLocation() {
  if (!navigator.geolocation) {
    dom.locText.textContent = 'Geolocation not supported';
    return;
  }

  dom.locText.textContent = 'Getting your location…';

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      state.userLocation  = { lat, lng };
      state.locationReady = true;

      dom.locText.textContent = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      dom.submitFade.disabled = false;

      // Place user marker
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker([lat, lng], { icon: createUserIcon(), zIndexOffset: -100 }).addTo(map);

      // Fly to user
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    },
    err => {
      dom.locText.textContent = 'Location denied — enable in browser settings';
      toast('Location required to use FadeFinder', 'error');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// ════════════════════════════════════════════════════════════════════
//   FIREBASE AUTH (anonymous)
// ════════════════════════════════════════════════════════════════════
async function initAuth() {
  if (DEMO_MODE) {
    state.userId = 'demo-' + Math.random().toString(36).slice(2, 10);
    return;
  }

  await signInAnonymously(auth);
  onAuthStateChanged(auth, user => {
    if (user) state.userId = user.uid;
  });
}

// ════════════════════════════════════════════════════════════════════
//   FADES — REAL-TIME LISTENER
// ════════════════════════════════════════════════════════════════════
function listenFades() {
  if (DEMO_MODE) {
    loadDemoFades();
    return;
  }

  const now = Timestamp.now();
  const q = query(
    collection(db, 'fades'),
    where('expiresAt', '>', now),
    where('status', 'in', ['active', 'locked'])
  );

  onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
      const fade = { id: change.doc.id, ...change.doc.data() };

      if (change.type === 'removed') {
        removeFadeFromMap(fade.id);
        state.fades.delete(fade.id);
      } else {
        state.fades.set(fade.id, fade);
        upsertMarker(fade);
      }
    });

    pruneExpiredFades();
    updateActiveCount();

    // Refresh detail panel if open
    if (state.selectedFadeId && state.fades.has(state.selectedFadeId)) {
      renderDetailPanel(state.fades.get(state.selectedFadeId));
    }
  });
}

function pruneExpiredFades() {
  const now = Date.now();
  for (const [id, fade] of state.fades) {
    const exp = fade.expiresAt?.toMillis?.() || fade.expiresAt || 0;
    if (exp < now) {
      removeFadeFromMap(id);
      state.fades.delete(id);
    }
  }
}

function updateActiveCount() {
  const count = state.fades.size;
  dom.activeCount.textContent = `${count} FADE${count !== 1 ? 'S' : ''} LIVE`;
}

// ── Marker management ────────────────────────────────────────────────
function upsertMarker(fade) {
  if (state.activeFilter !== 'all' && fade.mode !== state.activeFilter) {
    removeFadeFromMap(fade.id);
    return;
  }

  const locked = fade.status === 'locked';
  const icon   = createMarkerIcon(fade.mode, locked);
  const latlng = L.latLng(fade.lat, fade.lng);

  if (state.markers.has(fade.id)) {
    const m = state.markers.get(fade.id);
    m.setLatLng(latlng);
    m.setIcon(icon);
  } else {
    const marker = L.marker(latlng, { icon })
      .addTo(map)
      .on('click', () => openFadeDetail(fade.id));
    state.markers.set(fade.id, marker);
  }
}

function removeFadeFromMap(fadeId) {
  if (state.markers.has(fadeId)) {
    map.removeLayer(state.markers.get(fadeId));
    state.markers.delete(fadeId);
  }
}

// ════════════════════════════════════════════════════════════════════
//   POST A FADE
// ════════════════════════════════════════════════════════════════════
async function postFade() {
  if (!state.locationReady) {
    toast('Location not ready yet', 'error');
    return;
  }
  if (!state.userId) {
    toast('Not authenticated yet', 'error');
    return;
  }

  const callout   = dom.calloutText.value.trim();
  const mode      = state.postMode;
  const squadSize = state.squadSize;
  const expireMins = state.expireMins;
  const maxSize   = mode === 'solo' ? 1 : squadSize;

  const now       = Date.now();
  const expiresAt = now + expireMins * 60 * 1000;

  // Check user doesn't already have an active fade
  for (const [, fade] of state.fades) {
    if (fade.creatorId === state.userId && fade.status === 'active') {
      toast('You already have an active fade', 'error');
      return;
    }
  }

  const fadeData = {
    creatorId:    state.userId,
    lat:          state.userLocation.lat,
    lng:          state.userLocation.lng,
    mode,
    callout:      callout || '…',
    maxSize,                  // slots per side
    creatorTeam:  [state.userId],  // creator's side
    opponentQueue: [],             // opponent side
    status:       'active',
    createdAt:    DEMO_MODE ? now : serverTimestamp(),
    expiresAt:    DEMO_MODE ? expiresAt : Timestamp.fromMillis(expiresAt),
  };

  dom.submitFade.disabled = true;
  dom.submitFade.textContent = 'POSTING…';

  try {
    if (DEMO_MODE) {
      const id = 'fade-' + Math.random().toString(36).slice(2, 10);
      const fade = { id, ...fadeData };
      state.fades.set(id, fade);
      upsertMarker(fade);
      updateActiveCount();
      saveDemoFades();
    } else {
      await addDoc(collection(db, 'fades'), fadeData);
    }

    closePostModal();
    toast('Fade posted! 🔥', 'success');
    dom.calloutText.value = '';
    dom.charCount.textContent = '0';
  } catch (err) {
    console.error(err);
    toast('Failed to post — try again', 'error');
  } finally {
    dom.submitFade.disabled = false;
    dom.submitFade.textContent = 'POST THE FADE';
  }
}

// ════════════════════════════════════════════════════════════════════
//   DETAIL PANEL
// ════════════════════════════════════════════════════════════════════
function openFadeDetail(fadeId) {
  const fade = state.fades.get(fadeId);
  if (!fade) return;
  state.selectedFadeId = fadeId;
  renderDetailPanel(fade);
  dom.detailPanel.classList.add('open');
}

function closeDetailPanel() {
  dom.detailPanel.classList.remove('open');
  state.selectedFadeId = null;
}

function renderDetailPanel(fade) {
  // Badge
  const modeLabels = { solo: 'SOLO', squads_fill: 'SQUADS FILL', squads_no_fill: 'NEEDS BACKUP' };
  const modeClasses = { solo: 'solo-badge', squads_fill: 'squad-badge', squads_no_fill: 'backup-badge' };
  dom.panelBadge.textContent  = modeLabels[fade.mode] || fade.mode;
  dom.panelBadge.className    = `panel-badge ${modeClasses[fade.mode] || ''}`;

  // Callout
  dom.detailCallout.textContent = fade.callout || '…';

  // Distance
  dom.detailDistance.textContent = state.userLocation
    ? formatDistance(haversine(state.userLocation, { lat: fade.lat, lng: fade.lng }))
    : '—';

  // Expires
  const expMs = fade.expiresAt?.toMillis?.() || fade.expiresAt || 0;
  dom.detailExpires.textContent = formatTimeLeft(expMs - Date.now());

  // Queue counts
  const creatorLen   = (fade.creatorTeam  || []).length;
  const opponentLen  = (fade.opponentQueue || []).length;
  const maxSize      = fade.maxSize || 1;

  dom.detailQueueCount.textContent = `${creatorLen + opponentLen}`;
  dom.detailNeeded.textContent     = `${maxSize * 2} total`;

  // Backup banner
  dom.backupBanner.style.display = fade.mode === 'squads_no_fill' ? 'flex' : 'none';

  // Queue slots
  renderSlots(dom.creatorSlots,   fade.creatorTeam  || [], maxSize, true);
  renderSlots(dom.opponentSlots, fade.opponentQueue || [], maxSize, false);
  dom.creatorFill.textContent  = `${creatorLen}/${maxSize}`;
  dom.opponentFill.textContent = `${opponentLen}/${maxSize}`;

  // Invite section (only creator sees it, for fill modes)
  const isCreator = fade.creatorId === state.userId;
  const showInvite = isCreator && (fade.mode === 'squads_fill' || fade.mode === 'squads_no_fill');
  dom.inviteSection.style.display = showInvite ? 'flex' : 'none';
  if (showInvite) {
    const code = fade.id.slice(-6).toUpperCase();
    dom.inviteCode.textContent = code;
  }

  // Action buttons
  const inCreatorTeam  = (fade.creatorTeam  || []).includes(state.userId);
  const inOpponentQueue= (fade.opponentQueue|| []).includes(state.userId);
  const isQueued       = inCreatorTeam || inOpponentQueue;

  dom.alreadyCreator.style.display = isCreator  ? 'flex' : 'none';
  dom.queueBtn.style.display       = (!isCreator && !isQueued && fade.status === 'active') ? 'block' : 'none';
  dom.leaveBtn.style.display       = (isQueued && !isCreator) ? 'block' : 'none';

  // Style queue button by mode
  if (fade.mode === 'squads_no_fill') {
    dom.queueBtn.textContent = 'JOIN AS BACKUP';
    dom.queueBtn.className   = 'queue-btn backup-btn';
    dom.queueBtn.style.background = 'var(--red-dim)';
    dom.queueBtn.style.color      = 'var(--red)';
    dom.queueBtn.style.border     = '1px solid var(--red)';
  } else if (fade.mode === 'squads_fill') {
    dom.queueBtn.textContent = 'QUEUE AS OPPONENT';
    dom.queueBtn.className   = 'queue-btn';
    dom.queueBtn.style.background = 'var(--blue-dim)';
    dom.queueBtn.style.color      = 'var(--blue)';
    dom.queueBtn.style.border     = '1px solid var(--blue)';
  } else {
    dom.queueBtn.textContent = 'QUEUE UP';
    dom.queueBtn.className   = 'queue-btn solo-queue';
    dom.queueBtn.style.background = '';
    dom.queueBtn.style.color      = '';
    dom.queueBtn.style.border     = '';
  }
}

function renderSlots(container, members, maxSize, isCreatorSide) {
  container.innerHTML = '';
  for (let i = 0; i < maxSize; i++) {
    const slot = document.createElement('div');
    const uid  = members[i];
    if (uid) {
      slot.className = 'slot filled' + (uid === state.userId ? ' you' : ' creator');
      const isYou = uid === state.userId;
      slot.textContent = isYou ? 'YOU' : '•••';
      slot.title = isYou ? 'You' : 'Anonymous';
    } else {
      slot.className = 'slot';
      slot.textContent = i + 1;
    }
    container.appendChild(slot);
  }
}

// ════════════════════════════════════════════════════════════════════
//   QUEUE UP / LEAVE
// ════════════════════════════════════════════════════════════════════
async function queueUp() {
  const fadeId = state.selectedFadeId;
  if (!fadeId) return;
  const fade = state.fades.get(fadeId);
  if (!fade) return;

  const maxSize      = fade.maxSize || 1;
  const opponentLen  = (fade.opponentQueue || []).length;
  const creatorLen   = (fade.creatorTeam   || []).length;

  // For no_fill: join the creator's side
  if (fade.mode === 'squads_no_fill') {
    if (creatorLen >= maxSize) { toast('Creator side is full', 'error'); return; }
    await updateFadeField(fadeId, { creatorTeam: [...(fade.creatorTeam || []), state.userId] });
    toast('Joined as backup! ✊', 'success');
  } else {
    // Solo or fill: join opponent side
    if (opponentLen >= maxSize) { toast('Opponent queue is full', 'error'); return; }
    await updateFadeField(fadeId, { opponentQueue: [...(fade.opponentQueue || []), state.userId] });
    toast('Queued up! 🔥', 'success');
  }

  checkLockStatus(fadeId);
}

async function leaveQueue() {
  const fadeId = state.selectedFadeId;
  if (!fadeId) return;
  const fade = state.fades.get(fadeId);
  if (!fade) return;

  const newCreator  = (fade.creatorTeam  || []).filter(u => u !== state.userId);
  const newOpponent = (fade.opponentQueue|| []).filter(u => u !== state.userId);

  await updateFadeField(fadeId, {
    creatorTeam:   newCreator,
    opponentQueue: newOpponent,
    status: 'active',
  });
  toast('Left the queue', 'info');
}

async function cancelFade() {
  const fadeId = state.selectedFadeId;
  if (!fadeId) return;

  if (!confirm('Cancel this fade?')) return;

  try {
    if (DEMO_MODE) {
      state.fades.delete(fadeId);
      removeFadeFromMap(fadeId);
      updateActiveCount();
      saveDemoFades();
    } else {
      await deleteDoc(doc(db, 'fades', fadeId));
    }
    closeDetailPanel();
    toast('Fade cancelled', 'info');
  } catch (err) {
    console.error(err);
    toast('Failed to cancel', 'error');
  }
}

async function checkLockStatus(fadeId) {
  const fade = state.fades.get(fadeId);
  if (!fade) return;
  const maxSize     = fade.maxSize || 1;
  const creatorLen  = (fade.creatorTeam  || []).length;
  const opponentLen = (fade.opponentQueue|| []).length;

  if (creatorLen >= maxSize && opponentLen >= maxSize) {
    await updateFadeField(fadeId, { status: 'locked' });
    toast('🔒 LOCKED IN — Fade is set!', 'success');
  }
}

async function joinViaInviteCode(code) {
  // Find fade with matching ID tail
  for (const [id, fade] of state.fades) {
    if (id.slice(-6).toUpperCase() === code.toUpperCase()) {
      if (fade.creatorId === state.userId) {
        toast('That\'s your own fade!', 'error');
        return;
      }
      const maxSize    = fade.maxSize || 1;
      const creatorLen = (fade.creatorTeam || []).length;
      if (creatorLen >= maxSize) { toast('Creator side is full', 'error'); return; }
      if ((fade.creatorTeam || []).includes(state.userId)) {
        toast('Already on that side', 'info'); return;
      }
      await updateFadeField(id, { creatorTeam: [...(fade.creatorTeam || []), state.userId] });
      toast('Joined the crew! 👥', 'success');
      openFadeDetail(id);
      map.flyTo([fade.lat, fade.lng], 16);
      return;
    }
  }
  toast('Invite code not found', 'error');
}

// ── Generic field updater ────────────────────────────────────────────
async function updateFadeField(fadeId, fields) {
  if (DEMO_MODE) {
    const fade = state.fades.get(fadeId);
    if (fade) {
      const updated = { ...fade, ...fields };
      state.fades.set(fadeId, updated);
      upsertMarker(updated);
      saveDemoFades();
      if (state.selectedFadeId === fadeId) renderDetailPanel(updated);
    }
    return;
  }

  try {
    await updateDoc(doc(db, 'fades', fadeId), fields);
  } catch (err) {
    console.error('Update failed:', err);
    toast('Update failed', 'error');
  }
}

// ════════════════════════════════════════════════════════════════════
//   DEMO MODE — local-storage fades + seed data
// ════════════════════════════════════════════════════════════════════
function loadDemoFades() {
  // Load saved demo fades
  try {
    const saved = JSON.parse(localStorage.getItem('ff_demo_fades') || '[]');
    const now = Date.now();
    for (const fade of saved) {
      if (fade.expiresAt > now && fade.status !== 'expired') {
        state.fades.set(fade.id, fade);
        upsertMarker(fade);
      }
    }
  } catch (_) {}

  // Seed nearby demo fades if user has location
  setTimeout(() => {
    if (!state.userLocation || state.fades.size > 0) {
      updateActiveCount();
      return;
    }
    seedDemoFades(state.userLocation);
    updateActiveCount();
  }, 2500);

  // Poll every 5s in demo mode to pick up localStorage changes
  setInterval(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ff_demo_fades') || '[]');
      const now   = Date.now();
      const seen  = new Set();
      for (const fade of saved) {
        if (fade.expiresAt > now) {
          seen.add(fade.id);
          state.fades.set(fade.id, fade);
          upsertMarker(fade);
        }
      }
      // Remove expired
      for (const [id] of state.fades) {
        if (!seen.has(id) && id.startsWith('demo-seed')) continue; // keep seeds
        const fade = state.fades.get(id);
        if (!fade) continue;
        if (fade.expiresAt < now) {
          removeFadeFromMap(id);
          state.fades.delete(id);
        }
      }
      updateActiveCount();
    } catch (_) {}
  }, 5000);
}

function seedDemoFades(center) {
  const seeds = [
    { mode: 'solo',           callout: 'Anyone tryna catch these hands on Court St?',  offset: [0.0018, -0.0022], size: 1, mins: 30 },
    { mode: 'squads_fill',    callout: '3v3 at the park, we got 2. Who wants problems?', offset: [-0.0012, 0.0030], size: 3, mins: 45 },
    { mode: 'squads_no_fill', callout: 'We 2 deep, need backup. Hitting the block.',    offset: [0.0025, 0.0015],  size: 3, mins: 25 },
    { mode: 'solo',           callout: 'No cap, no talking. Box or walk.',              offset: [-0.0030, -0.0010], size: 1, mins: 60 },
  ];

  const now = Date.now();
  for (const s of seeds) {
    const id = `demo-seed-${Math.random().toString(36).slice(2, 8)}`;
    const fade = {
      id,
      creatorId:    'demo-npc',
      lat:          center.lat + s.offset[0],
      lng:          center.lng + s.offset[1],
      mode:         s.mode,
      callout:      s.callout,
      maxSize:      s.size,
      creatorTeam:  ['demo-npc'],
      opponentQueue: [],
      status:       'active',
      createdAt:    now,
      expiresAt:    now + s.mins * 60 * 1000,
    };
    state.fades.set(id, fade);
    upsertMarker(fade);
  }
  updateActiveCount();
}

function saveDemoFades() {
  const arr = [];
  for (const [, fade] of state.fades) arr.push(fade);
  localStorage.setItem('ff_demo_fades', JSON.stringify(arr));
}

// ════════════════════════════════════════════════════════════════════
//   FILTERS
// ════════════════════════════════════════════════════════════════════
function applyFilter(mode) {
  state.activeFilter = mode;

  // Remove all markers then re-add matching
  for (const [, marker] of state.markers) map.removeLayer(marker);
  state.markers.clear();

  for (const [, fade] of state.fades) upsertMarker(fade);
}

// ════════════════════════════════════════════════════════════════════
//   UTIL
// ════════════════════════════════════════════════════════════════════
function haversine(a, b) {
  const R = 6371000;
  const φ1 = a.lat * Math.PI / 180;
  const φ2 = b.lat * Math.PI / 180;
  const Δφ = (b.lat - a.lat) * Math.PI / 180;
  const Δλ = (b.lng - a.lng) * Math.PI / 180;
  const x  = Math.sin(Δφ/2) * Math.sin(Δφ/2)
            + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

function formatDistance(m) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

function formatTimeLeft(ms) {
  if (ms <= 0) return 'EXPIRED';
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

let toastTimeout;
function toast(msg, type = 'info') {
  clearTimeout(toastTimeout);
  dom.toast.textContent = msg;
  dom.toast.className   = `toast ${type} visible`;
  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove('visible');
  }, 3200);
}

// ════════════════════════════════════════════════════════════════════
//   MODAL HELPERS
// ════════════════════════════════════════════════════════════════════
function openPostModal() {
  dom.postModal.classList.add('open');
  getUserLocation();
}
function closePostModal() {
  dom.postModal.classList.remove('open');
}

// ════════════════════════════════════════════════════════════════════
//   EVENT LISTENERS
// ════════════════════════════════════════════════════════════════════
function setupEventListeners() {

  // Throw Fade button
  dom.throwFadeBtn.addEventListener('click', openPostModal);
  dom.closePostModal.addEventListener('click', closePostModal);
  dom.postModal.addEventListener('click', e => {
    if (e.target === dom.postModal) closePostModal();
  });

  // Callout char count
  dom.calloutText.addEventListener('input', () => {
    dom.charCount.textContent = dom.calloutText.value.length;
  });

  // Mode selector
  document.querySelectorAll('.mode-card').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(b => {
        b.classList.remove('active', 'solo-active', 'squad-active', 'backup-active');
      });
      btn.classList.add('active');
      const m = btn.dataset.mode;
      state.postMode = m;
      if (m === 'solo')           btn.classList.add('solo-active');
      if (m === 'squads_fill')    btn.classList.add('squad-active');
      if (m === 'squads_no_fill') btn.classList.add('backup-active');
      dom.squadSizeGroup.style.display = (m !== 'solo') ? 'flex' : 'none';
    });
  });

  // Squad size chips
  document.querySelectorAll('[data-size]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.squadSize = parseInt(btn.dataset.size);
    });
  });

  // Expire chips
  document.querySelectorAll('[data-mins]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mins]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.expireMins = parseInt(btn.dataset.mins);
    });
  });

  // Submit
  dom.submitFade.addEventListener('click', postFade);

  // Locate button
  dom.locateBtn.addEventListener('click', () => {
    if (state.userLocation) {
      map.flyTo([state.userLocation.lat, state.userLocation.lng], 15, { duration: 1 });
    } else {
      getUserLocation();
    }
  });

  // Filters
  dom.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dom.filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.mode);
    });
  });

  // Detail panel
  dom.closeDetailBtn.addEventListener('click', closeDetailPanel);
  dom.queueBtn.addEventListener('click', queueUp);
  dom.leaveBtn.addEventListener('click', leaveQueue);
  dom.cancelFadeBtn.addEventListener('click', cancelFade);

  // Copy invite link
  dom.copyInviteBtn.addEventListener('click', () => {
    const code = dom.inviteCode.textContent;
    const url  = `${location.origin}${location.pathname}?squad=${code}`;
    navigator.clipboard.writeText(url).then(() => toast('Invite link copied!', 'success'));
  });

  // Squad invite via URL param
  const urlParams = new URLSearchParams(location.search);
  const squadCode = urlParams.get('squad');
  if (squadCode) {
    setTimeout(() => {
      toast(`Joining squad ${squadCode}…`, 'info');
      joinViaInviteCode(squadCode);
      // Clean URL
      history.replaceState({}, '', location.pathname);
    }, 2000);
  }

  // Expire countdown refresh
  setInterval(() => {
    if (state.selectedFadeId && state.fades.has(state.selectedFadeId)) {
      const fade = state.fades.get(state.selectedFadeId);
      const expMs = fade.expiresAt?.toMillis?.() || fade.expiresAt || 0;
      dom.detailExpires.textContent = formatTimeLeft(expMs - Date.now());
    }
  }, 30000);
}

// ════════════════════════════════════════════════════════════════════
//   BOOT
// ════════════════════════════════════════════════════════════════════
async function init() {
  // Show demo badge if not configured
  if (DEMO_MODE) {
    dom.demoBadge.style.display = 'block';
    console.info('%c FADEFINDER DEMO MODE ', 'background:#E8FF00;color:#000;font-weight:bold;font-size:14px;padding:4px 8px;');
    console.info('Configure firebase-config.js to go live.');
  }

  initMap();
  await initAuth();
  listenFades();
  getUserLocation();
  setupEventListeners();
}

init().catch(console.error);
