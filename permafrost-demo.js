(() => {
  'use strict';
  const root = document.getElementById('permafrost-demo');
  if (!root) return;
  const stages = ['Source', 'Parse calls', 'Build DAG', 'Trace helpers', 'Strip JSDoc', 'Trim namespace'];
  const descriptions = [
    ['A whole library, one small workflow', 'The script uses five entry points, but carries nine definitions. The unused methods and JSDoc travel with every copy.'],
    ['Find the entry points', 'The parser identifies read_csv, filter, groupBy, to_worksheet, and to_json in the script. Yellow marks these direct calls.'],
    ['Connect callers to their helpers', 'Each arrow points from a method to a dependency. This simplified DAG includes a shared constructor and an internal column check.'],
    ['Keep the reachable code', 'Following the edges keeps constructor and checkColumn too. They are required even though the script never calls them directly. describe and sortBy have no path from an entry point.'],
    ['Remove documentation from the shipped copy', 'JSDoc is useful while writing the script. The compiler removes it from the condensed output while keeping the selected implementation.'],
    ['A smaller namespace, the same workflow', 'Seven definitions survive: five direct calls and two dependencies. Two unused methods and all JSDoc are gone. These toy counts are separate from the estimated 70% reduction in real scripts.']
  ];
  const methods = [
    ['read_csv', 'export function read_csv(csv) {', '  return new DataFrame(parseRows(csv));', '}', 78, 28],
    ['filter', 'filter(column, predicate) {', '  return new DataFrame(selectRows(column, predicate));', '}', 78, 82],
    ['groupBy', 'groupBy(keys, aggregations) {', '  this.checkColumn(keys);', '  return new DataFrame(aggregate(keys, aggregations));', '}', 78, 136],
    ['to_worksheet', 'to_worksheet(sheet) {', '  sheet.getRange("A1").setValues(this.rows);', '}', 78, 190],
    ['to_json', 'to_json() {', '  return JSON.stringify(this.rows);', '}', 78, 244],
    ['constructor', 'constructor(rows) { this.rows = rows; }', 262, 48],
    ['checkColumn', 'checkColumn(name) { /* check headers */ }', 262, 136],
    ['describe', 'describe() { return summarize(this.rows); }', 262, 244],
    ['sortBy', 'sortBy(key) { return sortRows(this.rows, key); }', 262, 298]
  ];
  const direct = new Set(methods.slice(0, 5).map(m => m[0]));
  const helpers = new Set(['constructor', 'checkColumn']);
  const edges = [['read_csv','constructor'], ['filter','constructor'], ['groupBy','constructor'], ['groupBy','checkColumn']];
  const lines = [];
  const add = (text, id, comment = false) => lines.push({text, id, comment});
  add('// Application code stays intact');
  add('const summary = fr.read_csv(csv)', 'read_csv');
  add('  .filter("Amount", value => Number(value) > 0)', 'filter');
  add('  .groupBy("Category", { Amount: "sum" });', 'groupBy');
  add('summary.to_worksheet(sheet);', 'to_worksheet');
  add('return summary.to_json();', 'to_json');
  add('');
  add('// Simplified namespace; utility bodies omitted');
  add('namespace fr {');
  methods.forEach(m => {
    add('  /** ' + m[0] + ': documented library operation. */', m[0], true);
    m.slice(1, -2).forEach(line => add('  ' + line, m[0]));
    add('');
  });
  add('}');
  const source = root.querySelector('.pf-source');
  const sourceLines = lines.map(line => {
    const el = document.createElement('span'); el.className = 'pf-line';
    el.textContent = line.text || ' '; source.append(el); return el;
  });
  const graph = root.querySelector('.pf-graph');
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 350 335'); svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Direct calls connect to constructor and checkColumn helpers. describe and sortBy are unused.');
  const make = (tag, attrs, parent = svg) => {const el = document.createElementNS(ns, tag); Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v)); parent.append(el); return el;};
  const defs = make('defs', {});
  const marker = make('marker', {id:'pf-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'}, defs);
  make('path', {d:'M 0 0 L 10 5 L 0 10 z',fill:'#131A16'}, marker);
  const positions = Object.fromEntries(methods.map(m => [m[0], m.slice(-2)]));
  const edgeEls = edges.map(([from,to]) => {
    const [x,y] = positions[from], [tx,ty] = positions[to];
    return make('path', {d:`M ${x+65} ${y} C ${x+105} ${y}, ${tx-105} ${ty}, ${tx-65} ${ty}`, class:'pf-edge','marker-end':'url(#pf-arrow)'});
  });
  const nodes = methods.map(m => {
    const [x,y] = positions[m[0]];
    const g = make('g', {class:'pf-node'});
    make('rect', {x:x-65,y:y-16,width:130,height:32,rx:4},g);
    const text = make('text', {x,y:y+4,'text-anchor':'middle'},g); text.textContent = m[0];
    return g;
  });
  graph.append(svg);
  let step = 0, timer = null;
  const play = root.querySelector('#pf-play'), next = root.querySelector('#pf-next');
  const tabs = stages.map((name, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = `${i+1}. ${name}`;
    b.addEventListener('click', () => {stop(); step=i; render();}); root.querySelector('.pf-steps').append(b); return b;
  });
  function stop() {clearInterval(timer); timer=null; play.textContent='Play walkthrough →';}
  function render() {
    tabs.forEach((b,i) => {if(i===step) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current');});
    sourceLines.forEach((el,i) => {
      const line=lines[i], used=direct.has(line.id), helper=helpers.has(line.id);
      el.className='pf-line';
      if(line.comment) el.classList.add('comment');
      if(step>=1 && used && !line.comment) el.classList.add('direct');
      if(step>=3 && helper && !line.comment) el.classList.add('helper');
      if(step>=3 && line.id && !used && !helper) el.classList.add('discard');
      if((step>=4 && line.comment) || (step===5 && line.id && !used && !helper)) el.classList.add('removed');
    });
    nodes.forEach((el,i) => {const id=methods[i][0]; el.setAttribute('class','pf-node'+(step>=1 && direct.has(id)?' direct':step>=3 && helpers.has(id)?' helper':step>=3?' unused':''));});
    edgeEls.forEach(el => {el.style.opacity=step>=2?'1':'0'; el.classList.toggle('active',step>=3);});
    const panel=root.querySelector('.pf-explanation'); panel.replaceChildren();
    const heading=document.createElement('strong'); heading.textContent=descriptions[step][0]; panel.append(heading,document.createTextNode(descriptions[step][1]));
    root.querySelector('#pf-count').textContent=step===5?'9 → 7 definitions':'9 definitions';
    next.disabled=step===5;
  }
  next.addEventListener('click', () => {stop(); step=Math.min(5,step+1); render();});
  root.querySelector('#pf-reset').addEventListener('click', () => {stop(); step=0; render();});
  play.addEventListener('click', () => {
    if(timer){stop(); return;}
    if(step===5) step=0;
    // Reduced motion uses explicit steps instead of timed playback.
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){step=Math.min(5,step+1); render(); return;}
    render(); play.textContent='Pause';
    timer=setInterval(() => {step++; render(); if(step===5) stop();},2400);
  });
  document.addEventListener('visibilitychange', () => {if(document.hidden) stop();});
  render();
})();
