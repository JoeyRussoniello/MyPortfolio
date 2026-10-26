(function () {
  'use strict';
  var caps = [30, 45, 60, 80, 120, 150, 200, 260];
  var roomNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  var labs = [false, true, false, false, false, true, false, false];
  var courses = [
    { name: 'BIO', n: 28, color: '#1F36B8', ink: '#FFFFFF', needsLab: true },
    { name: 'MATH', n: 44, color: '#FF6A2B', ink: '#131A16' },
    { name: 'WRI', n: 58, color: '#FFD54A', ink: '#131A16' },
    { name: 'CS', n: 76, color: '#4B2A7B', ink: '#FFFFFF' },
    { name: 'CHEM', n: 112, color: '#7FD1AE', ink: '#131A16', needsLab: true },
    { name: 'ECON', n: 190, color: '#F28CB1', ink: '#131A16' }
  ];
  var bestWasted = 147;
  var pitch = 52;
  var maxCap = 260;
  var hatch = 'repeating-linear-gradient(135deg, rgba(19,26,22,0.25) 0, rgba(19,26,22,0.25) 1.5px, transparent 1.5px, transparent 7px), #F8F9F4';

  var roomOf = [0, 1, 2, 3, 4, 6];
  var picked = -1;
  var dragged = -1;

  // ---- jigsaw pieces in the hero ----
  function buildPieces() {
    var s = 140, m = 24, knob = 12, half = 8;
    var corners = [[m, m], [m + s, m], [m + s, m + s], [m, m + s]];
    // Edges run clockwise from the top. 1 is a knob, -1 a notch, 0 flat.
    var specs = [
      { name: 'Semantic Connect', env: 'Power BI and DAX', href: 'semantic-connect.html', fill: '#4B2A7B', ink: '#FFFFFF', col: 0, row: 0, edges: [0, 1, 1, 0], dx: -120, dy: -80, rot: -20, delay: 0.3 },
      { name: 'frosts', env: 'Office Scripts', href: 'frosts.html', fill: '#7FD1AE', ink: '#131A16', col: 1, row: 0, edges: [0, -1, -1, -1], dx: 40, dy: -120, rot: 14, delay: 0.42 },
      { name: 'autograder', env: 'GitHub Classroom', href: 'autograder.html', fill: '#FF6A2B', ink: '#131A16', col: 2, row: 0, edges: [0, 0, 1, 1], dx: 140, dy: -60, rot: 22, delay: 0.54 },
      { name: 'adpapi', env: "ADP's API", href: 'adpapi.html', fill: '#FFD54A', ink: '#131A16', col: 0, row: 1, edges: [-1, 1, 0, 0], dx: -110, dy: 80, rot: -12, delay: 0.66 },
      { name: 'Capstone', env: "BU's classrooms", href: '#study', fill: '#1F36B8', ink: '#FFFFFF', col: 1, row: 1, edges: [1, -1, 0, -1], dx: 20, dy: 120, rot: 9, delay: 0.78 },
      { name: 'Slay the Spire', env: 'Game logs', href: 'sts-win-prediction.html', fill: '#8EC5FF', ink: '#131A16', col: 2, row: 1, edges: [-1, 0, 0, 1], dx: 130, dy: 90, rot: -18, delay: 0.9 }
    ];
    var html = '';
    specs.forEach(function (spec) {
      var d = 'M ' + corners[0][0] + ' ' + corners[0][1];
      for (var i = 0; i < 4; i += 1) {
        var from = corners[i], to = corners[(i + 1) % 4], type = spec.edges[i];
        if (type === 0) {
          d += ' L ' + to[0] + ' ' + to[1];
        } else {
          var ux = (to[0] - from[0]) / s, uy = (to[1] - from[1]) / s;
          var ax = from[0] + ux * (s / 2 - half), ay = from[1] + uy * (s / 2 - half);
          var bx = from[0] + ux * (s / 2 + half), by = from[1] + uy * (s / 2 + half);
          d += ' L ' + ax + ' ' + ay + ' A ' + knob + ' ' + knob + ' 0 1 ' + (type === 1 ? 0 : 1) + ' ' + bx + ' ' + by + ' L ' + to[0] + ' ' + to[1];
        }
      }
      d += ' Z';
      html += '<a class="pz" href="' + spec.href + '" aria-label="' + spec.name + ', ' + spec.env + '. Open this project." ' +
        'style="position:absolute;left:' + (spec.col * s - m) + 'px;top:' + (spec.row * s - m) + 'px;width:188px;height:188px;' +
        '--dx:' + spec.dx + 'px;--dy:' + spec.dy + 'px;--r:' + spec.rot + 'deg;animation-delay:' + spec.delay + 's">' +
        '<svg width="188" height="188" viewBox="0 0 188 188" aria-hidden="true" style="position:absolute;left:0;top:0;overflow:visible">' +
        '<path d="' + d + '" fill="' + spec.fill + '" stroke="#131A16" stroke-width="3" stroke-linejoin="round"></path></svg>' +
        '<span style="position:absolute;left:24px;top:24px;width:140px;height:140px;padding:14px 12px;display:flex;flex-direction:column;justify-content:' +
        (spec.row === 0 ? 'flex-start' : 'flex-end') + ';gap:4px;color:' + spec.ink + '">' +
        '<span class="disp" style="font-size:21px;line-height:1">' + spec.name + '</span>' +
        '<span class="ui" style="font-size:13px;font-weight:600;line-height:1.2">' + spec.env + '</span></span></a>';
    });
    document.getElementById('pieces').innerHTML = html;
  }

  // ---- capstone toy solver ----
  var tileEls = [];
  var roomEls = [];

  function swapCourses(a, b) {
    var held = roomOf[a]; roomOf[a] = roomOf[b]; roomOf[b] = held;
    picked = -1; render();
  }
  function moveCourse(c, r) {
    var occupant = roomOf.indexOf(r);
    if (occupant >= 0) roomOf[occupant] = roomOf[c];
    roomOf[c] = r;
    picked = -1; render();
  }
  function allowDrop(e) { e.preventDefault(); }

  function buildBoard() {
    var labels = '';
    caps.forEach(function (cap, i) {
      labels += '<div style="position:absolute;left:0;top:' + (i * pitch) + 'px;height:44px;display:flex;flex-direction:column;justify-content:center;font-weight:700;font-size:14px;line-height:1.2">' +
        '<span>Room ' + roomNames[i] + '</span><span style="font-weight:500;color:#3C4A42">' + cap + (labs[i] ? ' seats, lab' : ' seats') + '</span></div>';
    });
    document.getElementById('roomlabels').innerHTML = labels;

    var cells = document.getElementById('roomcells');
    caps.forEach(function (cap, i) {
      var b = document.createElement('button');
      b.className = 'room';
      b.type = 'button';
      b.style.cssText = 'position:absolute;left:0;top:' + (i * pitch) + 'px;width:' + (cap / maxCap * 100) + '%;height:44px;border-radius:4px;padding:0 0 0 12px;text-align:left;font-size:13px;font-weight:500;color:#3C4A42;z-index:1';
      b.innerHTML = '<span class="hint"></span>' + (labs[i] ? '<span style="position:absolute;right:6px;top:50%;margin-top:-10px;width:20px;height:20px;border-radius:50%;background:#1F36B8;color:#FFFFFF;font-weight:800;font-size:12px;line-height:20px;text-align:center">L</span>' : '');
      b.addEventListener('dragover', allowDrop);
      b.addEventListener('drop', function (e) {
        e.preventDefault();
        var from = dragged; dragged = -1;
        if (from >= 0) moveCourse(from, i);
      });
      b.addEventListener('click', function () {
        if (picked === -1) return;
        moveCourse(picked, i);
      });
      cells.appendChild(b);
      roomEls.push(b);
    });

    var tiles = document.getElementById('tiles');
    courses.forEach(function (course, c) {
      var b = document.createElement('button');
      b.className = 'tile';
      b.type = 'button';
      b.draggable = true;
      b.title = course.name + ', ' + course.n + ' students';
      b.style.cssText = 'position:absolute;left:0;height:44px;border:2px solid #131A16;border-radius:4px;min-width:92px;padding:0 10px;text-align:left;font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:' + (course.n / maxCap * 100) + '%;background:' + course.color + ';color:' + course.ink;
      b.innerHTML = '<span class="lbl"></span>' + (course.needsLab ? '<span style="margin-left:7px;display:inline-block;width:18px;height:18px;border-radius:50%;background:#131A16;color:#FFFFFF;font-weight:800;font-size:11px;line-height:18px;text-align:center;vertical-align:1px">L</span>' : '');
      b.addEventListener('dragstart', function (e) {
        dragged = c;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(c));
      });
      b.addEventListener('dragover', allowDrop);
      b.addEventListener('drop', function (e) {
        e.preventDefault();
        var from = dragged; dragged = -1;
        if (from >= 0 && from !== c) swapCourses(from, c);
      });
      b.addEventListener('click', function () {
        if (picked === -1) { picked = c; render(); }
        else if (picked === c) { picked = -1; render(); }
        else swapCourses(picked, c);
      });
      tiles.appendChild(b);
      tileEls.push(b);
    });
  }

  function render() {
    var wasted = 0, conflicts = 0, tooBig = [], needLab = [];
    courses.forEach(function (course, c) {
      var r = roomOf[c];
      var fits = course.n <= caps[r];
      var hasLab = !course.needsLab || labs[r];
      if (fits) wasted += caps[r] - course.n;
      if (!fits) { conflicts += 1; tooBig.push(course.name); }
      if (!hasLab) { conflicts += 1; needLab.push(course.name); }
      var isPicked = picked === c;
      var shadows = [];
      if (isPicked) shadows.push('5px 5px 0 #131A16');
      if (!fits || !hasLab) shadows.push('inset 0 0 0 3px #B3122B');
      var el = tileEls[c];
      el.style.top = (r * pitch) + 'px';
      el.style.boxShadow = shadows.length ? shadows.join(',') : 'none';
      el.style.zIndex = isPicked ? 4 : 2;
      el.setAttribute('aria-pressed', isPicked ? 'true' : 'false');
      el.setAttribute('aria-label', course.name + ', ' + course.n + ' students' + (course.needsLab ? ', needs a lab' : '') + ', in room ' + roomNames[r] + (fits ? '' : ', too big for the room') + (hasLab ? '' : ', not a lab'));
      el.querySelector('.lbl').textContent = course.name + ' ' + course.n + (fits ? '' : ' too big');
    });
    caps.forEach(function (cap, i) {
      var occupied = roomOf.indexOf(i) >= 0;
      var el = roomEls[i];
      el.style.background = occupied ? hatch : '#F8F9F4';
      el.style.border = occupied ? '2px solid #131A16' : '2px dashed #6F7C74';
      el.querySelector('.hint').textContent = occupied ? '' : (picked === -1 ? 'Empty' : 'Move here');
      el.setAttribute('aria-label', 'Room ' + roomNames[i] + ', ' + cap + ' seats' + (labs[i] ? ', lab' : '') + ', ' + (occupied ? 'occupied' : 'empty'));
    });
    document.getElementById('wasted').textContent = wasted;
    var cEl = document.getElementById('conflicts');
    cEl.textContent = conflicts;
    cEl.style.color = conflicts > 0 ? '#B3122B' : '#131A16';

    var status;
    if (conflicts > 0) {
      var parts = [];
      if (tooBig.length) parts.push(tooBig.join(' and ') + (tooBig.length === 1 ? ' does not fit its room.' : ' do not fit their rooms.'));
      if (needLab.length) parts.push(needLab.join(' and ') + (needLab.length === 1 ? ' needs a lab room.' : ' need lab rooms.'));
      status = parts.join(' ');
    } else if (wasted === bestWasted) {
      status = 'Best valid fit. Ignoring labs would waste fewer seats, but two courses need them.';
    } else {
      status = 'Every rule holds, but ' + (wasted - bestWasted) + ' more seats go unused than necessary.';
    }
    document.getElementById('status').textContent = status;
  }

  buildPieces();
  buildBoard();
  render();

  document.getElementById('solve').addEventListener('click', function () {
    roomOf = [1, 2, 3, 4, 5, 6]; picked = -1; render();
  });
  document.getElementById('shuffle').addEventListener('click', function () {
    var order = [0, 1, 2, 3, 4, 5, 6, 7];
    for (var i = order.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var held = order[i]; order[i] = order[j]; order[j] = held;
    }
    roomOf = order.slice(0, 6); picked = -1; render();
  });
})();
