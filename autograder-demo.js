(() => {
  'use strict';
  const root = document.getElementById('grading-demo');
  if (!root) return;
  const run = root.querySelector('#ag-run');
  const fix = root.querySelector('#ag-fix');
  const reset = root.querySelector('#ag-reset');
  const status = root.querySelector('#ag-status');
  const score = root.querySelector('#ag-earned');
  const bug = root.querySelector('#ag-bug');
  const rows = [...root.querySelectorAll('[data-ag-test]')];
  const points = [3, 2, 2, 3];
  let fixed = false, generation = 0;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const mark = (row, state, symbol) => {row.className=state; const indicator=row.querySelector('.ag-state'); indicator.textContent=symbol; indicator.setAttribute('aria-label',state==='passed'?'Passed':state==='failed'?'Failed':state==='running'?'Running':'Not run');};
  async function grade() {
    const token = ++generation;
    run.disabled=true; fix.disabled=true;
    rows.forEach(row => mark(row,'','○')); score.textContent='0';
    status.textContent='Checking each test independently…';
    const results=[true,true,fixed,false];
    const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:420;
    let earned=0;
    for(let i=0;i<rows.length;i++) {
      if(token!==generation) return;
      mark(rows[i],'running','…');
      if(delay) await wait(delay);
      if(token!==generation) return;
      mark(rows[i],results[i]?'passed':'failed',results[i]?'✓':'✕');
      if(results[i]) earned+=points[i];
      score.textContent=String(earned);
    }
    run.disabled=false; fix.disabled=fixed;
    run.textContent='Run again →';
    status.textContent=fixed
      ? '7 / 10: the zero case now passes. Addition still earns its points; square remains unfinished.'
      : '5 / 10: addition earns credit. Zero fails the even-number check, and square panics at todo!().';
  }
  run.addEventListener('click',grade);
  fix.addEventListener('click',() => {
    fixed=true; bug.textContent='    n % 2 == 0'; bug.classList.add('fixed'); grade();
  });
  reset.addEventListener('click',() => {
    generation++; fixed=false;
    bug.textContent='    n > 0 && n % 2 == 0'; bug.classList.remove('fixed');
    rows.forEach(row => mark(row,'','○'));
    score.textContent='?'; run.disabled=false; fix.disabled=true;
    run.textContent='Run the autograder →';
    status.textContent='Ready when you are. Each passing check earns its own points.';
  });
})();
