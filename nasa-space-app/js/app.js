(function () {
  'use strict';

  // ---- Screen definitions -------------------------------------------------
  // Coordinates are in the Figma frame's own pixel space (1440 x 810).
  var W = 1440, H = 810;
  var SHOTS = 'assets/screens/';

  // Reusable hotspot rectangles measured from the exported frames.
  var R = {
    home:     [405, 44, 120, 50],
    messages: [598, 44, 224, 50],
    stats:    [895, 44, 142, 50],
    back:     [22, 744, 122, 40],
    next:     [1296, 744, 122, 40],
    cont:     [1218, 720, 176, 54]
  };

  function nav(extra) {
    return [
      { r: R.home, to: 'landing', label: 'Home' },
      { r: R.messages, to: 'message', label: 'Messages' },
      { r: R.stats, to: 'stats', label: 'Stats' }
    ].concat(extra || []);
  }
  function backNext(back, next) {
    var l = [];
    if (back) l.push({ r: R.back, to: back, label: 'Back' });
    if (next) l.push({ r: R.next, to: next, label: 'Next' });
    return l;
  }

  // Per-region image file for each logical screen.
  var FILES = {
    sg: {
      welcome: 'welcome-singapore', updates: 'updates-singapore', landing: 'landing-page-singapore',
      feelings: 'feelings-singapore', sleep: 'sleep-singapore', energy: 'energy-singapore',
      food: 'food-singapore', social: 'social-singapore', tasks: 'tasks-singapore',
      loading: 'loading-singapore', trend: 'mood-trend-singapore', message: 'message-singapore',
      send: 'message-singapore-1', view: 'message-view-singapore', stats: 'stats-singapore'
    },
    us: {
      welcome: 'welcome-usa', updates: 'updates-usa', landing: 'landing-page-usa',
      feelings: 'feelings-usa', sleep: 'sleep-usa', energy: 'energy-usa',
      food: 'food-usa', social: 'social-usa', tasks: 'tasks-usa',
      loading: 'loading-usa', trend: 'mood-trend-usa', message: 'message-usa',
      send: 'message-send-usa', view: 'message-view-usa', stats: 'stats-usa'
    }
  };

  // Logical flow shared by both regions (matches the Figma prototype links).
  var FLOW = {
    welcome:  { hot: backNext(null, 'updates') },
    updates:  { hot: backNext('welcome', 'landing') },
    landing:  { hot: nav([{ r: [606, 414, 228, 72], to: 'feelings', label: 'Start journal' }]) },
    feelings: { hot: nav(backNext('landing', 'sleep')) },
    sleep:    { hot: nav(backNext('feelings', 'energy')) },
    energy:   { hot: nav(backNext('sleep', 'food')) },
    food:     { hot: nav(backNext('energy', 'social')) },
    social:   { hot: nav(backNext('food', 'tasks')) },
    tasks:    { hot: nav(backNext('social', 'loading')) },
    loading:  { hot: nav(), auto: { to: 'trend', ms: 4000 } },
    trend:    { hot: nav(backNext(null, 'landing')) },
    message:  {
      hot: nav([
        { r: [645, 434, 128, 46], to: 'view', label: 'Play note from Sis' },
        { r: [645, 764, 128, 46], to: 'view', label: 'Play note from Mum' },
        { r: [1188, 712, 220, 64], to: 'send', label: 'Write a note' }
      ])
    },
    send:     { hot: nav(backNext('message', null)) },
    view:     { hot: nav(backNext('message', null)) },
    // The Month/Year tabs are not linked in the Figma prototype, so they are not linked here either.
    stats:    { hot: nav() }
  };

  // Screens outside the regional flow.
  var SPECIAL = {
    start: {
      file: 'start-page',
      hot: [
        { r: [60, 44, 310, 50], to: 'credits', label: 'Members' },
        { r: [152, 568, 226, 70], to: 'us:welcome', label: 'Start as astronaut based in United States' },
        { r: [607, 568, 226, 70], to: 'sg:welcome', label: 'Start as astronaut based in Singapore' },
        { r: [1061, 568, 227, 70], to: 'doodle-haze', label: 'Start Doodle Space Agency' }
      ]
    },
    'doodle-haze':     { file: 'doodle-space-agency-haze-singapore',              hot: nav([{ r: R.cont, to: 'doodle-cny', label: 'Continue' }]) },
    'doodle-cny':      { file: 'doodle-space-agency-festive-cny-singapore',       hot: nav([{ r: R.cont, to: 'doodle-raya', label: 'Continue' }]) },
    'doodle-raya':     { file: 'doodle-space-agency-festive-hari-raya-singapore', hot: nav([{ r: R.cont, to: 'doodle-deepavali', label: 'Continue' }]) },
    'doodle-deepavali':{ file: 'doodle-space-agency-festive-deepavali-singapore', hot: nav([{ r: R.cont, to: 'doodle-xmas', label: 'Continue' }]) },
    'doodle-xmas':     { file: 'doodle-space-agency-festive-christmas-singapore', hot: nav([{ r: R.cont, to: 'doodle-july4', label: 'Continue' }]) },
    'doodle-july4':    { file: 'doodle-space-agency-4-july-usa',                  hot: nav([{ r: R.cont, to: 'start', label: 'Continue' }]) },
    credits: { file: 'credit-page', hot: [{ r: [659, 688, 122, 40], to: 'start', label: 'Start' }] },
    // Present in the Figma file but not reachable from any prototype link.
    'you-died':        { file: 'you-died', hot: [{ r: [0, 0, W, H], to: 'start', label: 'Back to start' }] }
  };

  // ---- State & routing ----------------------------------------------------
  var region = 'sg';
  try { region = localStorage.getItem('tc-region') || 'sg'; } catch (e) {}
  var timer = null;

  var stage = document.getElementById('stage');
  var img = document.getElementById('screen');
  var spots = document.getElementById('hotspots');
  var gallery = document.getElementById('gallery');
  var crumb = document.getElementById('crumb');

  function resolve(id) {
    if (SPECIAL[id]) return { file: SPECIAL[id].file, hot: SPECIAL[id].hot, auto: null };
    var f = FLOW[id];
    if (!f) return null;
    return { file: FILES[region][id], hot: f.hot, auto: f.auto || null };
  }

  function go(target) {
    var parts = target.split(':');
    if (parts.length === 2) {
      region = parts[0];
      try { localStorage.setItem('tc-region', region); } catch (e) {}
      target = parts[1];
    }
    location.hash = '#/' + target;
  }

  function render() {
    clearTimeout(timer);
    var id = (location.hash.replace(/^#\/?/, '') || 'start');

    if (id === 'gallery') {
      stage.hidden = true; gallery.hidden = false; crumb.textContent = 'Asset gallery';
      return;
    }
    stage.hidden = false; gallery.hidden = true;

    var s = resolve(id);
    if (!s) { location.hash = '#/start'; return; }

    img.src = SHOTS + s.file + '.png';
    img.alt = 'Screen: ' + id.replace(/-/g, ' ');
    crumb.textContent = id + (SPECIAL[id] ? '' : '  ·  ' + (region === 'sg' ? 'Singapore' : 'USA'));

    spots.textContent = '';
    s.hot.forEach(function (h) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hotspot';
      b.setAttribute('aria-label', h.label);
      b.style.left = (h.r[0] / W * 100) + '%';
      b.style.top = (h.r[1] / H * 100) + '%';
      b.style.width = (h.r[2] / W * 100) + '%';
      b.style.height = (h.r[3] / H * 100) + '%';
      b.addEventListener('click', function () { go(h.to); });
      spots.appendChild(b);
    });

    if (s.auto) timer = setTimeout(function () { go(s.auto.to); }, s.auto.ms);
  }

  // ---- Asset gallery ------------------------------------------------------
  function buildGallery() {
    var m = window.ASSET_MANIFEST || { screens: [], components: [], sprites: [] };
    function section(title, dir, files) {
      var h = document.createElement('h2'); h.textContent = title + ' (' + files.length + ')';
      var g = document.createElement('div'); g.className = 'grid';
      files.forEach(function (f) {
        var fig = document.createElement('figure');
        var a = document.createElement('a'); a.href = dir + f; a.target = '_blank'; a.rel = 'noopener';
        var i = document.createElement('img'); i.src = dir + f; i.loading = 'lazy'; i.alt = f;
        a.appendChild(i);
        var c = document.createElement('figcaption'); c.textContent = f;
        fig.appendChild(a); fig.appendChild(c); g.appendChild(fig);
      });
      gallery.appendChild(h); gallery.appendChild(g);
    }
    section('Screens', 'assets/screens/', m.screens);
    section('Components', 'assets/components/', m.components);
    section('Character sprites (transparent)', 'assets/sprites/', m.sprites || []);
  }

  document.getElementById('btn-restart').addEventListener('click', function () { go('start'); });
  document.getElementById('btn-gallery').addEventListener('click', function () { go('gallery'); });
  window.addEventListener('hashchange', render);

  buildGallery();
  render();
})();
