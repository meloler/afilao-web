import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
const login=await fetch(`${base}/signin-with-chatgpt?return_to=/`,{redirect:'manual'});
const cookie=login.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
assert.ok(cookie,'Local development sign-in must return a cookie');
const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Atlantic/Canary',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const current=['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');
const d=new Date(`${current}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+14);const date=d.toISOString().slice(0,10);
const created=[];
async function api(path,method='GET',data,auth=true,origin=base){const r=await fetch(base+path,{method,headers:{...(auth?{Cookie:cookie}:{}),Origin:origin,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});const text=await r.text();return {status:r.status,data:r.headers.get('content-type')?.includes('json')?JSON.parse(text):{error:text}};}
function payload(people=2,time='13:30'){return {date,time,service:'comida',people,name:'Comprobación automática',phone:'',notes:'Datos de prueba',idempotencyKey:crypto.randomUUID()};}
async function add(value){const r=await api('/api/reservations','POST',value);if(r.status===201&&!created.includes(r.data.reservation.id))created.push(r.data.reservation.id);return r;}
async function list(){const r=await api(`/api/reservations?date=${date}`);assert.equal(r.status,200);return r.data.reservations;}
try{
  assert.equal((await api(`/api/reservations?date=${date}`,'GET',undefined,false)).status,401);
  assert.equal((await api('/api/reservations','POST',payload(),true,'https://other.example')).status,403);
  assert.equal((await add({...payload(),people:19})).status,400);
  assert.equal((await add({...payload(),date:'2026-02-30'})).status,400);
  assert.equal((await add({...payload(),time:'03:00'})).status,400);
  const p=payload();const first=await add(p);assert.equal(first.status,201);
  const duplicate=await add(p);assert.equal(duplicate.status,201);assert.equal(duplicate.data.reservation.id,first.data.reservation.id);
  assert.equal((await add({...p,name:'Otro nombre'})).status,409);
  const second=await add(payload());assert.equal(second.status,201);
  const r1=first.data.reservation,r2=second.data.reservation;
  assert.equal((await api(`/api/reservations/${r1.id}`,'PATCH',{action:'table',table:r2.tables[0],version:0})).status,409);
  for(let i=0;i<7;i++)assert.equal((await add(payload())).status,201);
  assert.equal((await add(payload())).status,409);
  assert.equal((await add(payload(2,'14:30'))).status,409,'Overlapping slots must be unavailable');
  const slots=await api(`/api/availability?date=${date}&people=2&service=comida`);assert.equal(slots.status,200);assert.equal(slots.data.slots.find(s=>s.time==='14:30').available,false);assert.equal(slots.data.slots.find(s=>s.time==='15:00').available,true,'The 90-minute boundary must be free');
  assert.equal((await api(`/api/reservations/${r1.id}`,'PATCH',{action:'status',status:'sentada',version:0})).status,200);
  assert.equal((await api(`/api/reservations/${r1.id}`,'PATCH',{action:'status',status:'cancelada',version:0})).status,409,'Stale updates must fail');
  assert.equal((await api(`/api/reservations/${r1.id}`,'PATCH',{action:'status',status:'completada',version:1})).status,200);
  assert.equal((await add(payload())).status,201,'Completed tables must become available');
  const parallel=await Promise.all(Array.from({length:5},()=>add(payload(6,'15:00'))));
  assert.ok(parallel.every(r=>[201,409].includes(r.status)));const successful=parallel.filter(r=>r.status===201);assert.equal(successful.length,3,'Three groups of six fit when joined tables must stay within a row');
  assert.equal(new Set(successful.flatMap(r=>r.data.reservation.tables)).size,6,'Concurrent groups must keep distinct pairs of tables');
  const raceValue={...payload(2,'22:00'),service:'cena'};const race=await add(raceValue);assert.equal(race.status,201);
  const raceId=race.data.reservation.id;
  const moves=await Promise.all([4,7].map(table=>api(`/api/reservations/${raceId}`,'PATCH',{action:'table',table,version:0})));
  assert.deepEqual(moves.map(r=>r.status).sort(),[200,409],'Only one simultaneous table move should be applied');
  for(let i=0;i<8;i++)assert.equal((await add({...payload(2,'22:00'),service:'cena'})).status,201);
  const dinner=(await list()).filter(r=>r.service==='cena'&&r.status==='confirmada');
  assert.equal(new Set(dinner.flatMap(r=>r.tables)).size,9,'Recorded table assignments must remain consistent with occupancy after competing moves');
  const persisted=await list();assert.equal(persisted.filter(r=>created.includes(r.id)).length,created.length,'Reservations must survive independent reads');
  console.log('PASS: authentication, origin, validation, idempotency, capacity, overlaps, reassignment conflicts, stale updates, completion, concurrency and persistence.');
}finally{
  for(const r of await list())if(created.includes(r.id)&&['confirmada','sentada'].includes(r.status))await api(`/api/reservations/${r.id}`,'PATCH',{action:'status',status:'cancelada',version:r.version});
  console.log('Test reservations closed; no active test occupancy remains.');
}

