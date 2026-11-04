(() => {
const $ = (s) => document.querySelector(s);
const todayKey = () => new Date().toLocaleDateString('en-CA');
const dateLabel = new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
$('#today-date').textContent = dateLabel;
const defaults = {tasks:[], sessions:[], streak:0, lastActive:null};
let data;
try { data = {...defaults,...JSON.parse(localStorage.getItem('focuslog-data')||'{}')}; } catch { data={...defaults}; }
const save = () => { try { localStorage.setItem('focuslog-data',JSON.stringify(data)); } catch {} render(); };
const dayKey = (date) => { const d=new Date(date); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const today = dayKey(new Date());
let mode='focus', duration=25*60, remaining=duration, running=false, interval=null, endAt=0;
const modes={focus:{seconds:1500,label:'TIME TO FOCUS',caption:'One thing at a time.'},short:{seconds:300,label:'A MOMENT TO RESET',caption:'Take a breath. You earned it.'},long:{seconds:900,label:'STEP AWAY FOR A WHILE',caption:'Rest is part of the work.'}};
const fmt = n => String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
function paintTimer(){ $('#timer-display').textContent=fmt(remaining);$('#timer-label').textContent=modes[mode].label;$('#timer-caption').textContent=modes[mode].caption;const progress=1-remaining/duration;$('#timer-progress').style.background='conic-gradient(var(--purple) '+(progress*360)+'deg,#343044 0deg)';$('#start-btn').innerHTML=running?'<span>Ⅱ</span> Pause session':'<span>▶</span> '+(remaining===duration?'Start '+(mode==='focus'?'focus':'break'):'Resume'); }
function stop(){running=false;clearInterval(interval);interval=null;paintTimer();}
function tick(){remaining=Math.max(0,Math.ceil((endAt-Date.now())/1000));paintTimer();if(remaining<=0){stop();if(mode==='focus'){data.sessions.push({date:today,minutes:25});save();toast('Focus session complete. Nice work!');}else toast('Break complete. Ready when you are.');} }
$('#start-btn').addEventListener('click',()=>{if(running){stop();return;}if(remaining===0)remaining=duration;running=true;endAt=Date.now()+remaining*1000;interval=setInterval(tick,250);paintTimer();});
$('#reset-btn').addEventListener('click',()=>{stop();remaining=duration;paintTimer();});
document.querySelectorAll('.timer-tab').forEach(btn=>btn.addEventListener('click',()=>{stop();mode=btn.dataset.mode;duration=modes[mode].seconds;remaining=duration;document.querySelectorAll('.timer-tab').forEach(b=>b.classList.toggle('selected',b===btn));paintTimer();}));
let toastTimer;function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
$('#task-form').addEventListener('submit',e=>{e.preventDefault();const input=$('#task-input'),text=input.value.trim();if(!text)return;data.tasks.push({id:Date.now()+Math.random(),text,done:false});input.value='';save();input.focus();});
$('#task-list').addEventListener('change',e=>{if(!e.target.matches('.task-check'))return;const task=data.tasks.find(t=>String(t.id)===e.target.dataset.id);if(task){task.done=e.target.checked;save();}});
$('#task-list').addEventListener('click',e=>{const btn=e.target.closest('.delete-task');if(!btn)return;data.tasks=data.tasks.filter(t=>String(t.id)!==btn.dataset.id);save();});
$('#clear-completed').addEventListener('click',()=>{data.tasks=data.tasks.filter(t=>!t.done);save();});
function renderTasks(){const list=$('#task-list'),pending=data.tasks.filter(t=>!t.done).length;$('#task-count').textContent=data.tasks.length+' task'+(data.tasks.length===1?'':'s');$('#task-progress').textContent=data.tasks.length?(pending===0?'Everything is checked off ✓':pending+' left to go'):'A clear mind starts here';if(!data.tasks.length){list.innerHTML='<div class="empty-state"><div class="empty-icon">✳</div><strong>A fresh start.</strong><p>Add a task and make it happen.</p></div>';return;}list.innerHTML=data.tasks.map(t=>'<div class="task-item '+(t.done?'done':'')+'"><input class="task-check" type="checkbox" '+(t.done?'checked':'')+' data-id="'+t.id+'" aria-label="Complete task"><span class="task-text"></span><button class="delete-task" data-id="'+t.id+'" aria-label="Delete task">×</button></div>').join('');list.querySelectorAll('.task-text').forEach((el,i)=>el.textContent=data.tasks[i].text);}
function renderStats(){const todays=data.sessions.filter(s=>s.date===today);const minutes=todays.reduce((n,s)=>n+s.minutes,0);$('#focus-total').innerHTML=minutes+' <small>min</small>';$('#sessions-total').textContent=todays.length;let streak=0;const active=new Set(data.sessions.map(s=>s.date));let cursor=new Date();if(!active.has(dayKey(cursor)))cursor.setDate(cursor.getDate()-1);while(active.has(dayKey(cursor))){streak++;cursor.setDate(cursor.getDate()-1);if(streak>366)break;}$('#streak-total').innerHTML=streak+' <small>days</small>';}
function renderChart(){const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=dayKey(d);days.push({key,label:new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(d),minutes:data.sessions.filter(s=>s.date===key).reduce((n,s)=>n+s.minutes,0)});}const max=Math.max(25,...days.map(d=>d.minutes));$('#week-chart').innerHTML=days.map(d=>'<div class="day-column"><div class="bar-track"><div class="bar-fill" style="height:'+Math.max(d.minutes?5:2,d.minutes/max*100)+'%"></div></div><span class="day-label">'+d.label+'</span></div>').join('');$('#weekly-total').textContent=days.reduce((n,d)=>n+d.minutes,0)+' min this week';}
function render(){renderTasks();renderStats();renderChart();}
$('#sound-toggle').addEventListener('click',()=>toast('A little quiet can be powerful.'));
paintTimer();render();
})();