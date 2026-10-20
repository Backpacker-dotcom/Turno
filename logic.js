const LS_DB='turno.db.v1',LS_CFG='turno.cfg.v1',LS_PEND='turno.pend.v1',APP_VER='1.0';
const pad=n=>String(n).padStart(2,'0');
const localIso=t=>{t=t||new Date();return t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());};
let TODAY=localIso();
const DN=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const DNL=['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const MON=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const MONL=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const LOC={ortunc:{n:'Ortunç Otel',s:'Ortunç',sh:['Sabah','Akşam','Gece']},elia:{n:'Elia Otel',s:'Elia',sh:['Sabah','Akşam','Gece']},spa:{n:'Spa',s:'Spa',sh:['Gündüz']}};
const SH_H={Sabah:'08–16',Akşam:'16–24',Gece:'24–08',Gündüz:'tek vardiya'};
const DAY=7.5;
const EMPTYC={type:'empty',raw:'',short:'—',desc:'Atanmadı',h:0,ot:0};
const PRE={type:'pre',raw:'',short:'—',desc:'İşe giriş öncesi',h:0,ot:0};
const PRESETS=['08:00-16:00','16:00-24:00','24:00-08:00','09:00-17:00','08:00-20:00','20:00-08:00'];
const SH_PRE={Sabah:['08:00-16:00','09:00-17:00','08:00-20:00'],Akşam:['16:00-24:00','12:00-20:00','16:00-04:00'],Gece:['24:00-08:00','20:00-08:00','22:00-06:00'],Gündüz:['09:00-17:00','08:00-16:00','10:00-18:00']};
const CODES=['OFF','Y-İZİN','B-OFF','A-OFF'];
const REASONS=['İstifa','İşveren feshi','Deneme süresinde fesih','Emeklilik','Diğer'];
const SEED=[
 ['ufuk','Ufuk Gülen','FOM','ortunc','2019-03-11',96,[['2026-05-18',3]]],
 ['irem','İrem Yıldız','Supervisor','ortunc','2022-05-02',44,[]],
 ['ugur','Uğur Karaduman','Görev girilmemiş','ortunc','2023-04-17',28,[]],
 ['ismail','İsmail Can Naz','Vardiya Amiri','ortunc','2021-01-04',60,[['2026-09-02',2]]],
 ['melisa','Melisa Ümit','Receptionist','ortunc','2026-09-01',0,[]],
 ['goktug','Göktuğ Çeliksüngü','Receptionist','ortunc','2026-08-25',0,[]],
 ['salih','Salih Ada Teker','Receptionist','ortunc','2025-10-27',0,[]],
 ['mehmet','Mehmet Yaşar','Receptionist','ortunc','2024-06-03',20,[['2026-09-28',4]]],
 ['sule','Şule Ermiş','Görev girilmemiş','spa','2018-02-19',118,[]],
 ['budiani','Ni Kadek Budiani','Masöz','spa','2025-04-01',6,[]],
 ['beyza','Beyza Erdem','Supervisor','elia','2020-07-15',80,[['2026-08-03',4],['2026-09-21',4]]],
 ['mert','Mert Denizoğlu','Receptionist','elia','2024-11-11',10,[['2026-05-04',12],['2026-06-08',8],['2026-09-14',4]]],
 ['baris','Barış Aygün','Receptionist','elia','2025-12-01',0,[['2026-06-29',4],['2026-09-07',4]]]
];
const iso=x=>x.toISOString().slice(0,10);
const D=s=>new Date(s+'T00:00:00Z');
const addD=(s,n)=>{const x=D(s);x.setUTCDate(x.getUTCDate()+n);return iso(x)};
const dow=s=>(D(s).getUTCDay()+6)%7;
const wkStart=s=>addD(s,-dow(s));
const wkDates=w=>[0,1,2,3,4,5,6].map(i=>addD(w,i));
const addM=(s,m)=>{const x=D(s);x.setUTCMonth(x.getUTCMonth()+m);return iso(x)};
const diff=(a,b)=>Math.round((D(a)-D(b))/864e5);
const fd=s=>{const p=s.split('-');return p[2]+'.'+p[1]+'.'+p[0]};
const fs=s=>{const x=D(s);return x.getUTCDate()+' '+MON[x.getUTCMonth()]};
const isoWeek=s=>{const d=D(addD(s,3-dow(s)));const y=d.getUTCFullYear();return 1+Math.floor(diff(iso(d),y+'-01-01')/7);};
const wkLabel=w=>{const e=addD(w,6),a=D(w),b=D(e);return a.getUTCMonth()===b.getUTCMonth()?a.getUTCDate()+'–'+b.getUTCDate()+' '+MONL[b.getUTCMonth()]+' '+b.getUTCFullYear():a.getUTCDate()+' '+MON[a.getUTCMonth()]+' – '+b.getUTCDate()+' '+MON[b.getUTCMonth()]+' '+b.getUTCFullYear();};
const wkShort=w=>fd(w).slice(0,5)+'–'+fd(addD(w,6)).slice(0,5);
const r2=n=>Math.round(n*100)/100;
const nf=n=>String(Math.round(n*10)/10).replace('.',',');
const sa=n=>nf(n)+' sa';
const neg=n=>n>0?'−'+sa(n):'0 sa';
const norm=s=>String(s||'').toLocaleUpperCase('tr').replace(/İ/g,'I').replace(/\s+/g,' ').trim();
const sum=(a,f)=>a.reduce((t,x)=>t+f(x),0);
const byD=(a,b)=>a.d<b.d?-1:a.d>b.d?1:0;
const ent=n=>n<=5?14:n<15?20:26;
const RED='var(--color-accent-700)',INK='var(--color-text)';
const tcase=s=>s.toLocaleLowerCase('tr').replace(/(^|[\s-])(\S)/g,(m,a,b)=>a+b.toLocaleUpperCase('tr'));
const isUp=s=>s===s.toLocaleUpperCase('tr')&&/[A-ZÇĞİÖŞÜ]/.test(s);
const pretty=s=>{s=String(s||'').replace(/\s+/g,' ').trim();return isUp(s)?tcase(s):s;};
const fdt=ms=>{if(!ms)return '';const t=new Date(ms);return pad(t.getDate())+'.'+pad(t.getMonth()+1)+' '+pad(t.getHours())+':'+pad(t.getMinutes());};
function normRaw(raw){const c=String(raw==null?'':raw).trim();if(!c)return '';
  const m=c.replace(/\s+/g,'').match(/^(\d{1,2})[:.](\d{2})-(\d{1,2})[:.](\d{2})$/);
  if(m)return pad(+m[1])+':'+m[2]+'-'+pad(+m[3])+':'+m[4];
  const u=c.toLocaleUpperCase('tr').replace(/\s+/g,'').replace(/İ/g,'I');
  if(u==='OFF')return 'OFF';if(/^B-?OFF$/.test(u))return 'B-OFF';if(/^A-?OFF$/.test(u))return 'A-OFF';
  if(/^(Y-?IZIN|YI|YILLIKIZIN|YILLIK)$/.test(u))return 'Y-İZİN';
  return c;}
function parseCell(raw){
  const c=normRaw(raw);
  const m=c.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if(m){const s=+m[1]%24,e=+m[3]%24,span=((e-s+24)%24)||24,h=Math.max(0,span-0.5);return {type:'work',raw:c,a:m[1],b:m[3],short:m[1]+'–'+m[3],s,span,h,ot:Math.max(0,r2(h-DAY)),shift:s>=6&&s<12?'Sabah':s>=12&&s<20?'Akşam':'Gece'};}
  const map={'OFF':['off','OFF','Haftalık off'],'B-OFF':['boff','B-OFF','Borçlanılan off · −7,5 sa'],'A-OFF':['aoff','A-OFF','Alacaktan off · −7,5 sa'],'Y-İZİN':['yillik','Yİ','Yıllık izin']};
  const k=map[c]||['empty','—','Boş'];
  return {type:k[0],raw:c,short:k[1],desc:k[2],h:0,ot:0};
}
function mk(raw,loc,sh){const c=Object.assign(parseCell(raw),{loc});if(sh&&c.type==='work'){c.shift=sh;c.shOv=true;}return c;}
const arr=x=>Array.isArray(x)?x.filter(v=>v!=null):x&&typeof x==='object'?Object.keys(x).sort((a,b)=>a-b).map(k=>x[k]).filter(v=>v!=null):[];
const arr7=x=>{const o=Array(7).fill(null);if(Array.isArray(x))x.forEach((v,i)=>{if(i<7)o[i]=v==null?null:v;});else if(x&&typeof x==='object')Object.keys(x).forEach(k=>{if(+k<7)o[+k]=x[k];});return o;};
function normStaff(s){return Object.assign({role:'Görev girilmemiş',home:'ortunc',ap:0,status:'active',exit:null,ord:0},s,{fm:arr(s.fm),use:arr(s.use),debt:arr(s.debt),yl:arr(s.yl),adj:s.adj||{},key:s.key||norm(s.name)});}
function normDb(d){d=d||{};const o={staff:{},weeks:{},reqs:{},dismissed:{}};
  Object.keys(d.staff||{}).forEach(k=>{if(d.staff[k]&&d.staff[k].name)o.staff[k]=normStaff(Object.assign({id:k},d.staff[k]));});
  Object.keys(d.weeks||{}).forEach(k=>{const w=d.weeks[k];if(!w)return;o.weeks[k]=Object.assign({},w,{rows:arr(w.rows).map(r=>Object.assign({},r,{c:arr7(r.c).map(v=>v||''),at:arr7(r.at)})),cells:w.cells||{}});});
  Object.keys(d.reqs||{}).forEach(k=>{if(d.reqs[k])o.reqs[k]=Object.assign({id:k},d.reqs[k]);});
  o.dismissed=d.dismissed||{};return o;}
function seedDb(){const staff={};SEED.forEach((r,i)=>{staff[r[0]]={id:r[0],name:r[1],key:norm(r[1]),role:r[2],home:r[3],start:r[4],ap:r[5],ord:i+1,fm:r[6].map(x=>({d:x[0],h:x[1],src:'Önceki kayıt'})),use:[],debt:[],yl:[],adj:{},status:'active',exit:null};});return {staff,weeks:{},reqs:{},dismissed:{}};}
function calc(s){
  const recs=s.fm.map(r=>Object.assign({},r,{left:r.h,paid:0,exp:addM(r.d,4)})).sort(byD);
  const ev=recs.map(r=>({d:r.d,t:0,r})).concat(s.use.concat(s.debt).map(u=>({d:u.d,t:1,u}))).sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:a.t-b.t);
  let debt=0;
  ev.forEach(e=>{
    if(e.t===0){const pay=Math.min(debt,e.r.left);e.r.left=r2(e.r.left-pay);e.r.paid=pay;debt=r2(debt-pay);return;}
    let need=e.u.h;
    for(const r of recs){if(need<=0.001)break;if(r.d>e.u.d||r.left<=0)continue;const m=r.exp<=e.u.d?1.5:1,t=Math.min(r.left*m,need);r.left=r2(r.left-t/m);need=r2(need-t);}
    debt=r2(debt+need);});
  const act=recs.filter(r=>r.exp>TODAY),expd=recs.filter(r=>r.exp<=TODAY);
  const p11=r2(sum(act,r=>r.left)),expLeft=r2(sum(expd,r=>r.left)),p15=r2(expLeft*1.5);
  const borc=debt,net=r2(p11+p15-borc);
  const ref=s.exit?s.exit.d:TODAY;
  let y=0;while(addM(s.start,12*(y+1))<=ref)y++;
  let earned=0;for(let k=1;k<=y;k++)earned+=ent(k);
  const used=s.ap+sum(s.yl,l=>l.days);
  const next=addM(s.start,12*(y+1));
  const probEnd=addM(s.start,2),probTotal=diff(probEnd,s.start),probLeft=diff(probEnd,TODAY);
  const months=Math.max(0,Math.floor(diff(ref,s.start)/30.44));
  return {recs,act,expd,expLeft,p11,p15,alacak:r2(p11+p15),borc,net,years:y,earned,used,left:earned-used,next,nextIn:diff(next,TODAY),nextEnt:ent(y+1),probEnd,probLeft,probPct:Math.min(100,Math.max(0,Math.round((probTotal-probLeft)/probTotal*100))),inProb:s.status!=='left'&&probLeft>0,notStarted:s.start>TODAY,startIn:diff(s.start,TODAY),months};
}
const toRaw=(a,b)=>a+'-'+(b==='00:00'?'24:00':b);
const tenure=c=>c.years>0?c.years+' yıl '+(c.months-c.years*12)+' ay':c.months+' ay';
function exitRows(c,s){return [
  {k:'Kalan yıllık izin',v:c.left+' gün',sub:c.left>0?'Kullanılmayan izin ücreti ödenir':c.left<0?'Fazla kullanılmış izin':'Kalan izin yok',c:c.left<0?RED:INK},
  {k:'Alacak 1:1',v:sa(c.p11),sub:'Fazla mesai alacağı',c:INK},
  {k:'Alacak 1:1,5',v:sa(c.p15),sub:'Süre dışı, ×1,5 hesaplı',c:INK},
  {k:'Borç · B-OFF',v:neg(c.borc),sub:c.borc>0?'Eksik çalışma, mahsup edilir':'Borç yok',c:c.borc>0?RED:INK},
  {k:'Net saat',v:sa(c.net),sub:c.net>=0?'Personel lehine':'Personel aleyhine',c:c.net<0?RED:INK},
  {k:'Kıdem',v:tenure(c),sub:'İşe giriş '+fd(s.start),c:INK}];}
function cellView(c,home){
  const other=c.type==='work'&&c.loc!==home;
  let bg='transparent',fg='var(--color-neutral-600)',l1=c.short,l2='';
  if(c.type==='work'){bg=c.ot>0?'var(--color-accent)':'var(--color-surface)';fg=c.ot>0?'var(--color-bg)':'var(--color-text)';l1=c.a;l2=c.b;}
  else if(c.type==='yillik'){bg='var(--color-accent-100)';fg='var(--color-accent-800)';}
  else if(c.type==='boff'){bg='var(--color-neutral-300)';fg='var(--color-neutral-900)';l1='B-OFF';l2='−7,5';}
  else if(c.type==='aoff'){bg='var(--color-neutral-300)';fg='var(--color-neutral-900)';l1='A-OFF';l2='alacak';}
  else if(c.type==='pre'){fg='var(--color-neutral-500)';l1='giriş';l2='öncesi';}
  return {bg,fg,l1,l2,mark:other?'var(--color-text)':'transparent'};
}
function weekView(db,w,all){
  const W=db.weeks[w],dates=wkDates(w),out={};
  if(!W)return {kind:'none',pub:false,cells:out,W:null};
  if(W.src==='import'){
    all.forEach(s=>{const r=W.rows.find(x=>x.key===s.key);if(!r)return;
      out[s.id]=dates.map((d,i)=>{const loc=r.at[i]||s.home;if(d<s.start)return Object.assign({},PRE,{loc});if(s.exit&&d>s.exit.d)return null;return mk(r.c[i],loc);});});
    return {kind:'import',pub:true,cells:out,W};}
  all.forEach(s=>{const a=arr7(W.cells[s.id]);if(a.some(Boolean))out[s.id]=a.map(c=>c&&c.raw?mk(c.raw,c.loc||s.home,c.sh):null);});
  return {kind:'plan',pub:!!W.pub,cells:out,W};
}
function derive(db,all,VW){const R={};all.forEach(s=>R[s.id]={fm:[],use:[],debt:[],yl:[]});
  Object.keys(db.weeks).forEach(w=>{const v=VW(w);if(!v.pub)return;const src=(v.kind==='import'?'Çizelge ':'Plan ')+wkShort(w),ds=wkDates(w);
    Object.keys(v.cells).forEach(id=>{const x=R[id];if(!x)return;v.cells[id].forEach((c,i)=>{if(!c)return;const d=ds[i];
      if(c.type==='work'&&c.ot>0)x.fm.push({d,h:c.ot,src,note:c.short+' · '+sa(c.h)+' net'});
      if(c.type==='yillik')x.yl.push({d,days:1,src});
      if(c.type==='aoff')x.use.push({d,h:DAY,src,note:'A-OFF'});
      if(c.type==='boff')x.debt.push({d,h:DAY,src,note:'B-OFF'});});});});
  return R;}
function scanRows(rows,all,w,dismissed){
  const act=all.filter(s=>s.status!=='left');const matched=[],hires=[];
  rows.forEach((r,i)=>{const s=act.find(x=>x.key===r.key);if(s)matched.push({r,s,i});else if(!r.blank)hires.push({r,i});});
  const keys=new Set(rows.map(r=>r.key));
  const missing=act.filter(s=>!keys.has(s.key)&&s.start<=w&&!((dismissed||{})[w]||{})[s.id]);
  return {matched,hires,missing};
}
function zip(buf){
  const dv=new DataView(buf.buffer,buf.byteOffset,buf.byteLength);let e=-1;
  for(let i=buf.length-22;i>=Math.max(0,buf.length-70000);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break;}
  if(e<0)throw new Error('Dosya okunamadı: Excel dosyası bozuk görünüyor.');
  const n=dv.getUint16(e+10,true);let off=dv.getUint32(e+16,true);const F={};const td=new TextDecoder();
  for(let k=0;k<n;k++){const method=dv.getUint16(off+10,true),cs=dv.getUint32(off+20,true),nl=dv.getUint16(off+28,true),el=dv.getUint16(off+30,true),cl=dv.getUint16(off+32,true),lho=dv.getUint32(off+42,true);
    F[td.decode(buf.subarray(off+46,off+46+nl)).replace(/\\/g,'/')]={method,cs,lho};off+=46+nl+el+cl;}
  return {has:p=>!!F[p],get:async p=>{const f=F[p];if(!f)throw new Error('Excel içinde '+p+' yok.');
    const nl=dv.getUint16(f.lho+26,true),el=dv.getUint16(f.lho+28,true),st=f.lho+30+nl+el,data=buf.subarray(st,st+f.cs);
    if(f.method===0)return td.decode(data);
    if(typeof DecompressionStream==='undefined')throw new Error('Bu cihaz Excel açmayı desteklemiyor. Google Play’den “Android System WebView” uygulamasını güncelleyin.');
    return await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();}};
}
const colNum=L=>{let n=0;for(const ch of L)n=n*26+ch.charCodeAt(0)-64;return n;};
async function readXlsx(file){
  const buf=new Uint8Array(await file.arrayBuffer());
  if(buf[0]!==0x50||buf[1]!==0x4b)throw new Error('Bu dosya .xlsx değil. Excel’de “Farklı kaydet → Excel Çalışma Kitabı (.xlsx)” ile kaydedip tekrar yükleyin.');
  const z=zip(buf),P=new DOMParser(),X=async p=>P.parseFromString(await z.get(p),'application/xml');
  const ss=z.has('xl/sharedStrings.xml')?Array.from((await X('xl/sharedStrings.xml')).getElementsByTagName('si')).map(si=>Array.from(si.getElementsByTagName('t')).map(t=>t.textContent).join('')):[];
  const wb=await X('xl/workbook.xml'),rels=await X('xl/_rels/workbook.xml.rels'),rm={};
  Array.from(rels.getElementsByTagName('Relationship')).forEach(r=>rm[r.getAttribute('Id')]=r.getAttribute('Target'));
  const out=[];
  for(const sh of Array.from(wb.getElementsByTagName('sheet'))){
    let t=rm[sh.getAttribute('r:id')]||'';t=t.replace(/^\/?xl\//,'').replace(/^\//,'');const path='xl/'+t;if(!z.has(path))continue;
    const x=await X(path),grid={};
    for(const c of Array.from(x.getElementsByTagName('c'))){const m=(c.getAttribute('r')||'').match(/^([A-Z]+)(\d+)$/);if(!m)continue;const ty=c.getAttribute('t');let val;
      if(ty==='inlineStr')val=Array.from(c.getElementsByTagName('t')).map(e=>e.textContent).join('');
      else{const v=c.getElementsByTagName('v')[0];val=v?v.textContent:'';if(ty==='s')val=ss[+val]||'';}
      val=String(val).trim();if(!val)continue;(grid[+m[2]]=grid[+m[2]]||{})[colNum(m[1])]=val;}
    out.push({name:sh.getAttribute('name')||'',grid});}
  return out;
}
const KW=new Set(['GÜNLER','GUNLER','PERSONEL','ARRIVAL','DEPARTURE','ROOMS','DAYS','TOTAL HOURS','TOPLAM']);
const locOf=v=>{const u=norm(v);if(u.includes('ELIA'))return 'elia';if(u.includes('ORTUN'))return 'ortunc';if(u==='SPA'||u.includes('SPA '))return 'spa';return null;};
const serial=n=>iso(new Date(Math.round((n-25569)*864e5)));
const hasLetter=s=>/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(s);
function parseGrid(sheet){
  const g=sheet.grid,R=Object.keys(g).map(Number).sort((a,b)=>a-b);let dc=null,dates=null,hr=0;
  for(const r of R){const cols=Object.keys(g[r]).map(Number).sort((a,b)=>a-b).filter(c=>/^\d{5}(\.\d+)?$/.test(g[r][c])&&+g[r][c]>40000&&+g[r][c]<70000);
    for(let i=0;i+6<cols.length&&!dc;i++){const q=cols.slice(i,i+7);if(q.every((c,k)=>k===0||(c===q[k-1]+1&&Math.round(+g[r][c]-+g[r][q[k-1]])===1))){dc=q;dates=q.map(c=>serial(+g[r][c]));hr=r;}}
    if(dc)break;}
  if(!dc){const m=sheet.name.match(/(\d{1,2})[.\/](\d{1,2})\s*-\s*(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/);
    if(m){dates=wkDates(m[5]+'-'+pad(+m[2])+'-'+pad(+m[1]));
      for(const r of R){const c0=Object.keys(g[r]).map(Number).find(c=>/^(MONDAY|PAZARTESI)/.test(norm(g[r][c])));if(c0!=null&&/^(TUESDAY|SALI)/.test(norm(g[r][c0+1]||''))){dc=[0,1,2,3,4,5,6].map(k=>c0+k);hr=r;break;}}}}
  if(!dc)return null;
  const nc=dc[0]-1;let sec=null,last=null;const blocks=[],rows=[];
  for(const r of R){if(r<=hr)continue;const row=g[r],nm=(row[nc]||'').replace(/\s+/g,' ').trim(),vals=dc.map(c=>row[c]||'');
    const sv=vals.map(v=>parseCell(v).type!=='empty'?normRaw(v):''),hasS=sv.some(Boolean);
    const lv=vals.map(v=>parseCell(v).type==='empty'?locOf(v):null),hasL=lv.some(Boolean);
    if(hasS&&nm&&hasLetter(nm)&&!KW.has(norm(nm))){last={name:nm,key:norm(nm),role:'',sec:sec||'ortunc',c:sv,at:Array(7).fill(null),row:r,blank:false};rows.push(last);continue;}
    if(hasL&&!hasS&&last&&!last.blank&&r-last.row<=4){lv.forEach((l,i)=>{if(l)last.at[i]=l;});continue;}
    if(!nm||!hasLetter(nm)||KW.has(norm(nm)))continue;
    const L=locOf(nm),nu=norm(nm);if(L&&(nu.includes('OTEL')||nu.includes('HOTEL')||nu==='SPA')){sec=L;blocks.push(LOC[L].n);continue;}
    if(last&&!last.blank&&!last.role&&r-last.row<=2){last.role=nm;continue;}
    last={name:nm,key:norm(nm),role:'',sec:sec||'ortunc',c:Array(7).fill(''),at:Array(7).fill(null),row:r,blank:true};rows.push(last);}
  const seen=new Set();const uniq=rows.filter(r=>{if(seen.has(r.key))return false;seen.add(r.key);return true;});
  return {sheet:sheet.name,w:wkStart(dates[0]),dates:wkDates(wkStart(dates[0])),rows:uniq.map(r=>({name:r.name,key:r.key,role:r.role,sec:r.sec,c:r.c,at:r.at,blank:r.blank})),blocks:Array.from(new Set(blocks))};
}
function buildReminders(db,cfg){
  const n=cfg.notif||{},items=[],now=Date.now(),all=Object.values(db.staff),staff=all.filter(s=>s.status!=='left'),reqs=Object.values(db.reqs);
  const VWc={},VW=w=>VWc[w]||(VWc[w]=weekView(db,w,all));
  const cellOn=(id,d)=>{const v=VW(wkStart(d));if(v.kind==='plan'&&!v.pub)return null;const a=v.cells[id];return a?a[dow(d)]:null;};
  const at=(d,h,m)=>{const p=d.split('-');return new Date(+p[0],+p[1]-1,+p[2],h,m).getTime();};
  for(let k=0;k<14;k++){const d=addD(TODAY,k),t=addD(d,1);
    if(n.talep!==false){const c=reqs.filter(r=>r.status==='bekliyor'&&r.to>=d).length;if(c)items.push({id:'talep-'+d,at:at(d,9,30),title:'Bekleyen talepler',body:c+' izin / vardiya talebi onay bekliyor.'});}
    if(n.yarin!==false){const lines=[];Object.keys(LOC).forEach(L=>{const w=staff.map(s=>({s,c:cellOn(s.id,t)})).filter(x=>x.c&&x.c.type==='work'&&x.c.loc===L);if(!w.length)return;
        const parts=LOC[L].sh.map(sh=>{const p=w.filter(x=>L==='spa'||x.c.shift===sh).sort((a,b)=>a.c.s-b.c.s);return p.length?(L==='spa'?'':sh+': ')+p.map(x=>x.s.name.split(' ')[0]+' '+x.c.short).join(', '):null;}).filter(Boolean);
        lines.push(LOC[L].s+' · '+parts.join(' · '));});
      if(lines.length)items.push({id:'yarin-'+t,at:at(d,18,0),title:'Yarın · '+DNL[dow(t)]+' '+fs(t),body:lines.join('\n')});}
    if(n.izin!==false)staff.forEach(s=>{const c0=cellOn(s.id,d),c1=cellOn(s.id,t);
      if(c1&&c1.type==='yillik'&&!(c0&&c0.type==='yillik'))items.push({id:'izin-cik-'+s.id+'-'+t,at:at(d,18,0),title:'Yıllık izin · '+s.name,body:'Yarın ('+fs(t)+') yıllık izne çıkıyor.'});
      if(c0&&c0.type==='yillik'&&c1&&c1.type!=='yillik')items.push({id:'izin-don-'+s.id+'-'+t,at:at(d,18,0),title:'İzin dönüşü · '+s.name,body:'Yarın ('+fs(t)+') yıllık izinden dönüyor.'});});}
  if(n.izin!==false)staff.forEach(s=>{let y=1;while(addM(s.start,12*y)<=TODAY)y++;const nx=addM(s.start,12*y);
    [[addD(nx,-7),'7 gün sonra'],[nx,'bugün']].forEach(([d,when])=>{if(d>=TODAY&&diff(d,TODAY)<=30)items.push({id:'hak-'+s.id+'-'+d,at:at(d,9,30),title:'İzin hakkı · '+s.name,body:y+'. yıl '+when+' doluyor ('+fd(nx)+'); +'+ent(y)+' gün yıllık izin eklenir.'});});});
  return items.filter(i=>i.at>now-3600e3).sort((a,b)=>a.at-b.at).slice(0,150);
}
const loadJ=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}};
const cBase=c=>c.url.replace(/\/+$/,'')+'/teams/'+encodeURIComponent(c.team);
const cQ=c=>'.json'+(c.secret?'?auth='+encodeURIComponent(c.secret):'');
function setPath(o,segs,val){let cur=o;for(let i=0;i<segs.length-1;i++){if(cur[segs[i]]==null||typeof cur[segs[i]]!=='object')cur[segs[i]]={};cur=cur[segs[i]];}const k=segs[segs.length-1];if(val==null)delete cur[k];else cur[k]=val;}
function diffDb(a,b){const p={};['staff','weeks','reqs','dismissed'].forEach(g=>{const A=a[g]||{},B=b[g]||{};new Set(Object.keys(A).concat(Object.keys(B))).forEach(k=>{if(JSON.stringify(A[k])!==JSON.stringify(B[k]))p[g+'/'+k]=B[k]===undefined?null:B[k];});});return p;}
const NA=()=>window.Android||null;
const errTxt=e=>{const m=String(e&&e.message||e);return /401|403|Permission/i.test(m)?'Erişim reddedildi: veritabanı kurallarını veya erişim anahtarını kontrol edin.':/404/.test(m)?'Adres bulunamadı: veritabanı adresini kontrol edin.':/Failed to fetch|NetworkError|Load failed/i.test(m)?'İnternet bağlantısı yok veya adres hatalı.':m;};

class Component extends DCLogic {
  fileRef=React.createRef();
  jsonRef=React.createRef();
  state=this.initState();
  initState(){
    const db=normDb(loadJ(LS_DB,null)||seedDb());this.db=db;this.pending=loadJ(LS_PEND,{})||{};
    const cfg=Object.assign({url:'',team:'',secret:'',user:'',on:false,notif:{talep:true,yarin:true,izin:true}},loadJ(LS_CFG,{}));this.cfg=cfg;
    const CUR=wkStart(TODAY);
    return {db,cfg,cfgForm:{url:cfg.url,team:cfg.team,secret:cfg.secret,user:cfg.user,code:''},sync:cfg.on?'connecting':'off',lastSync:0,syncErr:'',
      rqf:'all',wk:CUR,day:dow(TODAY),forcePlan:{},rp:{who:'all',per:'hafta',kind:'vardiya'},tab:'pano',step:0,parsed:null,parseErr:'',parsingFile:'',done:null,
      loc:'all',view:'gun',staffId:null,q:'',sheet:null,form:{},toast:''};
  }
  componentDidMount(){
    window.turnoBack=()=>this.back();
    window.onNativeToast=t=>this.flash(t);
    window.onNativeNotif=()=>{this.forceUpdate();this.queueRem();};
    window.onNativeExport=ok=>this.flash(ok?'Dosya kaydedildi':'Kaydedilmedi');
    this.onOnline=()=>{if(this.cfg.on){this.openStream();this.flush();}};
    this.onVis=()=>{if(document.hidden)return;const t=localIso();if(t!==TODAY){TODAY=t;this.setState({wk:wkStart(t),day:dow(t)});}if(this.cfg.on&&!this.es)this.openStream();this.flush();this.queueRem();};
    window.addEventListener('online',this.onOnline);document.addEventListener('visibilitychange',this.onVis);
    if(!localStorage.getItem(LS_DB))this.persist();
    if(this.cfg.on)this.openStream();
    this.queueRem();
  }
  componentWillUnmount(){[this.tt,this.pt,this.rt,this.ft].forEach(clearTimeout);this.closeStream();window.removeEventListener('online',this.onOnline);document.removeEventListener('visibilitychange',this.onVis);}
  back(){const st=this.state;if(st.sheet){this.setState({sheet:null});return true;}if(st.tab==='personel'&&st.staffId){this.setState({staffId:null});return true;}if(st.tab!=='pano'){this.setState({tab:'pano',staffId:null});return true;}return false;}
  flash(t){clearTimeout(this.tt);this.setState({toast:t});this.tt=setTimeout(()=>this.setState({toast:''}),2800);}
  persist(){clearTimeout(this.pt);this.pt=setTimeout(()=>{try{localStorage.setItem(LS_DB,JSON.stringify(this.db));localStorage.setItem(LS_PEND,JSON.stringify(this.pending));}catch(e){}},200);}
  saveCfg(cfg){this.cfg=cfg;try{localStorage.setItem(LS_CFG,JSON.stringify(cfg));}catch(e){}this.setState({cfg});}
  queueRem(){clearTimeout(this.rt);this.rt=setTimeout(()=>{const A=NA();if(!A||!A.setReminders)return;try{A.setReminders(JSON.stringify(buildReminders(this.db,this.cfg)));}catch(e){}},1200);}
  commit(fn,msg){const old=this.db;const nd=normDb(fn(JSON.parse(JSON.stringify(old))));this.db=nd;Object.assign(this.pending,diffDb(old,nd));this.setState({db:nd});this.persist();this.queueRem();this.flush();if(msg)this.flash(msg);}
  applyDb(d){this.db=d;this.setState({db:d});this.persist();this.queueRem();}
  closeStream(){if(this.es){try{this.es.close();}catch(e){}this.es=null;}}
  openStream(){this.closeStream();const c=this.cfg;if(!c.on||typeof EventSource==='undefined')return;
    try{const es=new EventSource(cBase(c)+cQ(c));this.es=es;
      const h=e=>{let m;try{m=JSON.parse(e.data);}catch(x){return;}if(m&&typeof m.path==='string')this.remote(m.path,m.data,e.type==='patch');};
      es.addEventListener('put',h);es.addEventListener('patch',h);
      es.addEventListener('cancel',()=>{this.setState({sync:'error',syncErr:errTxt('401')});this.closeStream();});
      es.addEventListener('auth_revoked',()=>{this.setState({sync:'error',syncErr:errTxt('401')});this.closeStream();});
      es.onopen=()=>{this.setState({sync:Object.keys(this.pending).length?'pending':'ok'});this.flush();};
      es.onerror=()=>this.setState({sync:navigator.onLine===false?'offline':'retry'});
    }catch(e){this.setState({sync:'error',syncErr:errTxt(e)});}}
  remote(path,data,isPatch){
    let raw=JSON.parse(JSON.stringify(this.db));const segs=path.split('/').filter(Boolean);
    if(!segs.length){if(isPatch)Object.keys(data||{}).forEach(k=>setPath(raw,k.split('/'),data[k]));else raw=data&&typeof data==='object'?data:{};}
    else if(isPatch)Object.keys(data||{}).forEach(k=>setPath(raw,segs.concat(k.split('/')),data[k]));
    else setPath(raw,segs,data);
    Object.keys(this.pending).forEach(k=>setPath(raw,k.split('/'),this.pending[k]));
    const d=normDb(raw);
    if(!segs.length&&!isPatch&&!Object.keys(d.staff).length&&Object.keys(this.db.staff).length){this.pending=Object.assign(diffDb({},this.db),this.pending);this.flush();return;}
    this.applyDb(d);this.setState({lastSync:Date.now(),sync:Object.keys(this.pending).length?'pending':'ok'});}
  async flush(){const c=this.cfg;if(!c.on||this.flushing)return;const keys=Object.keys(this.pending);if(!keys.length)return;
    this.flushing=true;const body={};keys.forEach(k=>body[k]=this.pending[k]);
    try{const r=await fetch(cBase(c)+cQ(c),{method:'PATCH',body:JSON.stringify(body)});if(!r.ok)throw new Error('HTTP '+r.status);
      keys.forEach(k=>{if(JSON.stringify(this.pending[k])===JSON.stringify(body[k]))delete this.pending[k];});this.persist();
      this.setState({sync:'ok',lastSync:Date.now(),syncErr:''});}
    catch(e){this.setState({sync:navigator.onLine===false?'offline':'error',syncErr:errTxt(e)});clearTimeout(this.ft);this.ft=setTimeout(()=>this.flush(),20000);}
    finally{this.flushing=false;if(Object.keys(this.pending).length&&this.state.sync==='ok')setTimeout(()=>this.flush(),300);}}
  async cloudConnect(){const f=this.state.cfgForm;let url=(f.url||'').trim(),team=(f.team||'').trim().replace(/[.#$\[\]\/]/g,'-');
    if(!url||!team){this.flash('Veritabanı adresi ve ekip kodu gerekli');return;}
    if(!/^https?:\/\//.test(url))url='https://'+url;
    const cfg=Object.assign({},this.cfg,{url,team,secret:(f.secret||'').trim(),user:(f.user||'').trim()});
    this.closeStream();this.setState({sync:'connecting',syncErr:''});
    try{const r=await fetch(cBase(cfg)+cQ(cfg));if(!r.ok)throw new Error('HTTP '+r.status);const remote=await r.json();
      if(remote&&remote.staff&&Object.keys(remote.staff).length){this.pending={};this.applyDb(normDb(remote));this.flash('Ekip verisi indirildi');}
      else{const p=await fetch(cBase(cfg)+cQ(cfg),{method:'PUT',body:JSON.stringify(this.db)});if(!p.ok)throw new Error('HTTP '+p.status);this.pending={};this.persist();this.flash('Veriler buluta yüklendi · ekip hazır');}
      this.saveCfg(Object.assign(cfg,{on:true}));this.setState({sync:'ok',lastSync:Date.now(),cfgForm:Object.assign({},f,{url,team})});this.openStream();
    }catch(e){this.setState({sync:this.cfg.on?'error':'off',syncErr:errTxt(e)});this.flash('Bağlanılamadı · '+errTxt(e));if(this.cfg.on)this.openStream();}}
  cloudOff(){this.closeStream();this.saveCfg(Object.assign({},this.cfg,{on:false}));this.setState({sync:'off'});this.flash('Bulut bağlantısı kapatıldı · veriler bu cihazda kaldı');}
  shareCode(){const c=this.cfg;if(!c.on)return;const code='TURNO1|'+c.url+'|'+c.team+'|'+(c.secret||'');
    const text='Turno ekip bağlantı kodu:\n'+code+'\n\nTurno > Ayarlar > Bağlantı kodu alanına yapıştırıp Bağlan’a dokunun.';const A=NA();
    if(A&&A.shareText){A.shareText(text);return;}
    if(navigator.share){navigator.share({text}).catch(()=>{});return;}
    if(navigator.clipboard)navigator.clipboard.writeText(code).then(()=>this.flash('Kod kopyalandı'),()=>{});}
  onCode(v){const p=String(v||'').trim().split('|');const o={code:v};if(p[0]==='TURNO1'&&p.length>=3){o.url=p[1];o.team=p[2];o.secret=p[3]||'';}
    this.setState(s=>({cfgForm:Object.assign({},s.cfgForm,o)}));if(o.url)this.flash('Kod okundu · Bağlan’a dokunun');}
  toggleNotif(k){const n=Object.assign({},this.cfg.notif);n[k]=n[k]===false;this.saveCfg(Object.assign({},this.cfg,{notif:n}));this.queueRem();}
  backupExport(){const txt=JSON.stringify(this.db,null,1),name='turno-yedek-'+TODAY+'.json',A=NA();
    if(A&&A.exportText){A.exportText(name,'application/json',txt);return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();a.remove();this.flash(name+' indirildi');}
  async onJson(e){const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
    try{const d=normDb(JSON.parse(await f.text()));if(!Object.keys(d.staff).length)throw new Error('Yedekte personel yok.');
      if(!window.confirm('Mevcut veriler yedektekiyle değiştirilsin mi?'+(this.cfg.on?' Ekipteki herkes için geçerli olur.':'')))return;
      this.commit(()=>d,'Yedek geri yüklendi · '+Object.keys(d.staff).length+' personel');}catch(err){this.flash('Yedek okunamadı · '+(err.message||err));}}
  async onFile(e){const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
    this.setState({tab:'import',step:1,parseErr:'',parsingFile:f.name});
    try{const sheets=await readXlsx(f);const res=sheets.map(parseGrid).filter(r=>r&&r.rows.length);
      if(!res.length)throw new Error('Çizelge bulunamadı. “Günler” satırında 7 günlük tarih ve altında personel satırları olmalı.');
      res.sort((a,b)=>a.w<b.w?1:-1);this.setState({parsed:Object.assign(res[0],{file:f.name}),step:2});}
    catch(err){this.setState({step:0,parseErr:String(err.message||err)});}}
  applyImport(){const P=this.state.parsed;if(!P)return;const all=Object.values(this.db.staff);const SC=scanRows(P.rows,all,P.w,this.db.dismissed);
    this.commit(d=>{d.weeks[P.w]={src:'import',pub:true,file:P.file,sheet:P.sheet,at:Date.now(),by:this.cfg.user||'',rows:P.rows};return d;});
    const V=weekView(this.db,P.w,Object.values(this.db.staff));let fm=0;Object.keys(V.cells).forEach(id=>V.cells[id].forEach(c=>{if(c)fm+=c.ot;}));
    this.setState({step:3,done:{w:P.w,title:SC.matched.length+' personelin vardiyası, '+sa(fm)+' fazla mesai ve izin kodları hanelere yazıldı.'},parsed:null});
    this.flash(SC.matched.length+' personelin hanesine yazıldı');}
  pdfHtml(R){const h=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    return '<!doctype html><html><head><meta charset="utf-8"><title>'+h(R.fileBase)+'</title><style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{margin:0;background:#fff;color:#201e1d;font-family:Archivo,Arial,Helvetica,sans-serif;font-size:9.5pt}h1{font-size:17pt;margin:0 0 2pt;letter-spacing:-.01em}.k{color:#ae1800;font-size:8pt;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4pt}.m{color:#605d5d;margin:0 0 10pt}.s{display:flex;gap:28pt;padding:8pt 0;margin:0 0 10pt;border-top:2px solid #201e1d;border-bottom:2px solid #201e1d}.s b{display:block;font-size:13pt}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:7.5pt;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #201e1d;padding:4pt}td{border-bottom:1px solid #bab6b6;padding:4pt;vertical-align:top}td.r{color:#ae1800;font-weight:700}.f{margin-top:10pt;color:#7d7979;font-size:7.5pt}</style></head><body><p class="k">Turno · '+h(R.perTxt)+'</p><h1>'+h(R.title)+'</h1><p class="m">'+h(R.note)+'</p><div class="s">'+R.summary.map(s=>'<div>'+h(s.k)+'<b>'+h(s.v)+'</b></div>').join('')+'</div><table><thead><tr><th>Kayıt</th><th>Detay</th>'+R.cols.map(c=>'<th>'+h(c)+'</th>').join('')+'</tr></thead><tbody>'+R.rows.map(r=>'<tr><td><b>'+h(r.title)+'</b></td><td>'+h(r.sub)+'</td>'+r.vals.map((v,i)=>'<td'+(r.hi&&r.hi[i]?' class="r"':'')+'>'+h(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table><p class="f">Oluşturma '+fdt(Date.now())+(this.cfg.user?' · '+h(this.cfg.user):'')+'</p></body></html>';}
  exportPdf(){const R=this._R;if(!R||R.empty)return;const html=this.pdfHtml(R),A=NA();
    if(A&&A.printHtml){A.printHtml(R.fileBase,html);return;}
    const f=document.createElement('iframe');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
    const doc=f.contentWindow.document;doc.open();doc.write(html);doc.close();
    setTimeout(()=>{try{f.contentWindow.focus();f.contentWindow.print();}catch(e){this.flash('Yazdırma penceresi açılamadı');}setTimeout(()=>f.remove(),60000);},500);}
  sharePdf(){const R=this._R;if(!R||R.empty)return;const A=NA();
    if(A&&A.sharePdf){A.sharePdf(R.fileBase+'.pdf',this.pdfHtml(R),R.title+' · '+R.perTxt);this.flash('PDF hazırlanıyor…');return;}
    const text=R.title+'\n'+R.perTxt+'\n'+R.summary.map(s=>s.k+': '+s.v).join('\n');
    if(navigator.share){navigator.share({title:R.title,text}).catch(()=>{});return;}
    window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');}
  buildReport(C,E,VW,all){
    const st=this.state,rp=st.rp,staff=all.filter(s=>s.status!=='left');
    const CUR=wkStart(TODAY),NXT=addD(CUR,7),mS=TODAY.slice(0,8)+'01',mE=addD(addM(mS,1),-1),pS=addM(mS,-1),pE=addD(mS,-1);
    const per={hafta:[CUR,addD(CUR,6),'Haftalık · '+wkLabel(CUR)],sonraki:[NXT,addD(NXT,6),'Haftalık · '+wkLabel(NXT)],ay:[mS,mE,'Aylık · '+MONL[+mS.slice(5,7)-1]+' '+mS.slice(0,4)],gecenay:[pS,pE,'Aylık · '+MONL[+pS.slice(5,7)-1]+' '+pS.slice(0,4)]}[rp.per];
    const [a,b,perTxt]=per;const inR=d=>d>=a&&d<=b;
    const cellAt=(id,d)=>{const v=VW(wkStart(d)),x=v.cells[id],c=x?x[dow(d)]:null;return c&&c.type!=='pre'&&c.type!=='empty'?c:null;};
    const one=all.find(s=>s.id===rp.who);
    const list=one?[one]:staff.filter(s=>rp.who==='all'||rp.who==='loc:'+s.home);
    const scope=one?one.name:rp.who==='all'?'Tüm personel':LOC[rp.who.slice(4)].n;
    const days=[];for(let d=a;d<=b;d=addD(d,1))days.push({d,i:dow(d)});
    const loaded=list.some(s=>days.some(x=>cellAt(s.id,x.d)));
    const draft=Array.from(new Set(days.map(x=>wkStart(x.d)))).some(w=>{const v=VW(w);return v.kind==='plan'&&!v.pub;});
    let note='Bakiyeler '+fd(TODAY)+' itibarıyla.'+(draft?' Taslak plan haftaları vardiyada görünür; fazla mesai ve izinler plan yayınlanınca hanelere yazılır.':'');
    let cols=[],rows=[],summary=[];const K=rp.kind;const sub=s=>s.role+' · '+LOC[s.home].s;
    const isLv=c=>['yillik','boff','aoff'].includes(c.type);
    if(K==='vardiya'){
      if(!loaded){note='Bu dönem için vardiya yok. Çizelge yükleyin veya Çizelge sekmesinden planlayın.';}
      else if(one){cols=['Vardiya','Lokasyon','Net saat','Mesai','Manuel'];
        rows=days.filter(x=>cellAt(one.id,x.d)).map(({d,i})=>{const c=cellAt(one.id,d),adj=one.adj[d]||0;return {d,title:DN[i]+' '+fd(d),sub:c.type==='work'?c.shift:c.desc,vals:[c.short,c.type==='work'?LOC[c.loc].s:'—',c.h?sa(c.h):'—',c.ot?'+'+sa(c.ot):'—',adj?(adj>0?'+':'−')+sa(Math.abs(adj)):'—'],hi:[0,c.type==='work'&&c.loc!==one.home,0,c.ot>0,!!adj]};});
        const ws=days.map(x=>cellAt(one.id,x.d)).filter(Boolean);
        summary=[{k:'Çalışılan gün',v:ws.filter(c=>c.type==='work').length},{k:'Net saat',v:sa(sum(ws,c=>c.h))},{k:'Fazla mesai',v:sa(sum(ws,c=>c.ot))},{k:'İzin / OFF',v:ws.filter(c=>c.type!=='work').length+' gün'}];}
      else{const L2=list.filter(s=>days.some(x=>cellAt(s.id,x.d)));
        if(days.length<=7){cols=days.map(x=>DN[x.i]+' '+(+x.d.slice(8))).concat(['Net toplam']);
          rows=L2.map(s=>{const cs=days.map(x=>cellAt(s.id,x.d));return {title:s.name,sub:sub(s),vals:cs.map(c=>c?c.short+(c.type==='work'&&c.loc!==s.home?' · '+LOC[c.loc].s:''):'—').concat([sa(sum(cs.filter(Boolean),c=>c.h))]),hi:cs.map(c=>!!c&&(c.ot>0||(c.type==='work'&&c.loc!==s.home))).concat([0])};});}
        else{cols=['Çalışılan','Net saat','Fazla mesai','OFF','İzin günü','Başka otel'];
          rows=L2.map(s=>{const cs=days.map(x=>cellAt(s.id,x.d)).filter(Boolean);const ot=sum(cs,c=>c.ot);return {title:s.name,sub:sub(s),vals:[cs.filter(c=>c.type==='work').length+' gün',sa(sum(cs,c=>c.h)),ot?'+'+sa(ot):'—',cs.filter(c=>c.type==='off').length+' gün',cs.filter(isLv).length+' gün',cs.filter(c=>c.type==='work'&&c.loc!==s.home).length+' gün'],hi:[0,0,ot>0,0,0,0]};});}
        const allc=L2.flatMap(s=>days.map(x=>cellAt(s.id,x.d)).filter(Boolean));
        summary=[{k:'Personel',v:L2.length},{k:'Net saat',v:sa(sum(allc,c=>c.h))},{k:'Fazla mesai',v:sa(sum(allc,c=>c.ot))},{k:'İzin / OFF',v:allc.filter(c=>c.type!=='work').length+' gün'}];}
    }
    if(K==='mesai'){
      if(one){const e=E[one.id],c=C[one.id];cols=['Tür','Saat','Durum'];const X=[];
        e.fm.filter(r=>inR(r.d)).forEach(r=>{const ex=addM(r.d,4)<=TODAY;X.push({d:r.d,title:fd(r.d),sub:r.src+(r.note?' · '+r.note:''),vals:['Fazla mesai','+'+sa(r.h),ex?'Süre dışı ×1,5':'1:1 · '+fd(addM(r.d,4))+'’e kadar'],hi:[0,1,ex]});});
        e.use.filter(u=>inR(u.d)).forEach(u=>X.push({d:u.d,title:fd(u.d),sub:u.src+(u.note?' · '+u.note:''),vals:[u.src==='Erken çıkış'?'Erken çıkış':'A-OFF','−'+sa(u.h),'Alacaktan'],hi:[0,0,0]}));
        e.debt.filter(u=>inR(u.d)).forEach(u=>X.push({d:u.d,title:fd(u.d),sub:u.src+(u.note?' · '+u.note:''),vals:['B-OFF','−'+sa(u.h),'Borç'],hi:[0,1,1]}));
        rows=X.sort((x,y)=>-byD(x,y));
        summary=[{k:'Dönemde eklenen',v:sa(sum(e.fm.filter(r=>inR(r.d)),r=>r.h))},{k:'Alacak 1:1',v:sa(c.p11)},{k:'Alacak 1:1,5',v:sa(c.p15)},{k:'Borç',v:neg(c.borc)}];}
      else{cols=['Dönem +','A-OFF / erken','B-OFF','Alacak 1:1','Alacak 1:1,5','Borç','Net'];
        rows=list.map(s=>{const e=E[s.id],c=C[s.id],plus=sum(e.fm.filter(r=>inR(r.d)),r=>r.h),up=sum(e.use.filter(u=>inR(u.d)),u=>u.h),dp=sum(e.debt.filter(u=>inR(u.d)),u=>u.h);
          return {title:s.name,sub:sub(s),vals:[plus?'+'+sa(plus):'—',up?'−'+sa(up):'—',dp?'−'+sa(dp):'—',sa(c.p11),sa(c.p15),neg(c.borc),sa(c.net)],hi:[plus>0,0,dp>0,0,c.p15>0,c.borc>0,c.net<0]};});
        summary=[{k:'Personel',v:list.length},{k:'Dönemde eklenen',v:sa(sum(list,s=>sum(E[s.id].fm.filter(r=>inR(r.d)),r=>r.h)))},{k:'Toplam alacak',v:sa(sum(list,s=>C[s.id].alacak))},{k:'Toplam borç',v:neg(sum(list,s=>C[s.id].borc))}];}
    }
    if(K==='izin'){
      if(one){const e=E[one.id],c=C[one.id];cols=['Tür','Miktar','Kaynak'];const X=[];
        e.yl.filter(y=>inR(y.d)).forEach(y=>X.push({d:y.d,title:fd(y.d),sub:'Yıllık izin',vals:['Yıllık','−'+y.days+' gün',y.src],hi:[0,1,0]}));
        e.use.filter(u=>inR(u.d)&&u.src!=='Erken çıkış').forEach(u=>X.push({d:u.d,title:fd(u.d),sub:'Alacaktan off',vals:['A-OFF','−'+sa(u.h),u.src],hi:[0,0,0]}));
        e.debt.filter(u=>inR(u.d)).forEach(u=>X.push({d:u.d,title:fd(u.d),sub:'Borçlanılan off',vals:['B-OFF','−'+sa(u.h),u.src],hi:[0,1,0]}));
        days.forEach(x=>{const cx=cellAt(one.id,x.d);if(cx&&cx.type==='off')X.push({d:x.d,title:fd(x.d),sub:'Haftalık off',vals:['OFF','1 gün','Çizelge'],hi:[0,0,0]});});
        rows=X.sort((x,y)=>-byD(x,y));
        summary=[{k:'Yıllık hak edilen',v:c.earned+' gün'},{k:'Kullanılan',v:c.used+' gün'},{k:'Kalan',v:c.left+' gün'},{k:'Deneme süresi',v:c.inProb?c.probLeft+' gün kaldı':'Tamamlandı'}];}
      else{cols=['Hak edilen','Kullanılan','Kalan','Dönem yıllık','Dönem A/B-OFF','Deneme'];
        rows=list.map(s=>{const e=E[s.id],c=C[s.id],py=sum(e.yl.filter(y=>inR(y.d)),y=>y.days),mi=sum(e.use.filter(u=>inR(u.d)&&u.src!=='Erken çıkış'),u=>u.h)+sum(e.debt.filter(u=>inR(u.d)),u=>u.h);return {title:s.name,sub:sub(s),vals:[c.earned+' gün',c.used+' gün',c.left+' gün',py?py+' gün':'—',mi?sa(mi):'—',c.inProb?c.probLeft+' gün kaldı':'Tamam'],hi:[0,0,c.left<0,py>0,0,c.inProb]};});
        summary=[{k:'Personel',v:list.length},{k:'Dönemde yıllık izin',v:sum(list,s=>sum(E[s.id].yl.filter(y=>inR(y.d)),y=>y.days))+' gün'},{k:'Kalan yıllık · toplam',v:sum(list,s=>C[s.id].left)+' gün'},{k:'Deneme süresinde',v:list.filter(s=>C[s.id].inProb).length+' kişi'}];}
    }
    const kindTxt={vardiya:'Vardiya çizelgesi',mesai:'Fazla mesai',izin:'İzin durumu'}[K];
    const slug=x=>norm(x).replace(/Ç/g,'C').replace(/Ğ/g,'G').replace(/Ö/g,'O').replace(/Ş/g,'S').replace(/Ü/g,'U').replace(/[^A-Z0-9]+/g,'-').toLowerCase().replace(/^-|-$/g,'');
    return {title:kindTxt+' · '+scope,perTxt,note,summary,cols,
      rows:rows.map(r=>Object.assign({},r,{cells:r.vals.map((v,i)=>({k:cols[i],v:String(v),c:r.hi&&r.hi[i]?RED:INK}))})),
      empty:!rows.length,count:rows.length+' satır',listLabel:one?'Günlük kayıtlar':'Personel listesi',
      fileBase:slug(kindTxt)+'_'+slug(scope)+'_'+a+'_'+b};
  }
  setTime(which,v){this.setState(s=>{const fm=Object.assign({},s.form,{[which]:v});fm[s.sheet==='assign'?'time':'val']=toRaw(fm.ms||'12:00',fm.me||'00:00');return {form:fm};});}
  setManual(){this.setState(s=>{const fm=Object.assign({},s.form,{manual:true});fm.ms=fm.ms||'12:00';fm.me=fm.me||'00:00';fm[s.sheet==='assign'?'time':'val']=toRaw(fm.ms,fm.me);return {form:fm};});}
  setPlan(w,fn,msg){this.commit(d=>{const W=d.weeks[w]&&d.weeks[w].src!=='import'?d.weeks[w]:{src:'plan',pub:false,cells:{}};const cells={};Object.keys(W.cells||{}).forEach(k=>cells[k]=arr7(W.cells[k]));
    W.cells=fn(cells);W.src='plan';const any=Object.keys(W.cells).some(k=>W.cells[k].some(Boolean));if(!any&&!W.pub)delete d.weeks[w];else d.weeks[w]=W;return d;},msg);}
  st(raw,loc,sh){const r=normRaw(raw);return r?{raw:r,loc:loc||null,sh:sh||null}:null;}
  openCell(id,i){const w=this.state.wk,s=this.db.staff[id],c=(weekView(this.db,w,[s]).cells[id]||[])[i];const wk=c&&c.type==='work',man=wk&&PRESETS.indexOf(c.raw)<0;
    this.setState({sheet:'cell',form:{w,id,i,val:c?c.raw:'',loc:wk?c.loc:s.home,manual:man,ms:man?c.raw.split('-')[0]:'',me:man?(c.raw.split('-')[1]==='24:00'?'00:00':c.raw.split('-')[1]):'',sh:wk&&c.shOv?c.shift:''}});}
  openAssign(L,sh,i){this.setState({sheet:'assign',form:{w:this.state.wk,L,sh,i,time:SH_PRE[sh][0],sel:{},q:'',manual:false}});}
  openHire(r,w){const cs=r.c.map(parseCell);const fi=Math.max(0,cs.findIndex(c=>c.type==='work'));
    this.setState({sheet:'hire',form:{w,row:r,name:pretty(r.name),rawKey:r.key,role:pretty(r.role),home:r.sec,start:wkDates(w)[fi],ap:0}});}
  openExit(id,w){this.setState({sheet:'exit',form:{id,w:w||'',d:w?addD(w,-1):TODAY,reason:'',fromSheet:!!w}});}
  setReq(id,o){this.commit(d=>{if(d.reqs[id])d.reqs[id]=Object.assign({},d.reqs[id],o);return d;});}
  delReq(id){this.commit(d=>{delete d.reqs[id];return d;},'Talep silindi');}
  openReq(who){const t=addD(TODAY,1);this.setState({sheet:'req',form:{who:who||'',kind:'izin',from:t,to:t,code:'OFF',val:'08:00-16:00',loc:'',text:'',manual:false}});}
  reqDates(r){const out=[];for(let d=r.from,k=0;d<=r.to&&k<62;d=addD(d,1),k++)out.push(d);return out;}
  applyReq(id){const r=this.db.reqs[id],s=r&&this.db.staff[r.who];if(!s)return;
    const ds=this.reqDates(r).filter(d=>{const W=this.db.weeks[wkStart(d)];return !W||W.src!=='import';});
    if(!ds.length){this.flash('Talep tarihleri yüklenmiş çizelgede; plan haftası değil');return;}
    this.commit(d=>{ds.forEach(dt=>{const w=wkStart(dt),i=dow(dt);const W=d.weeks[w]||{src:'plan',pub:false,cells:{}};W.cells=W.cells||{};const a=arr7(W.cells[s.id]);
      a[i]=r.kind==='izin'?this.st(r.code,s.home):this.st(r.val,r.loc||s.home);W.cells[s.id]=a;d.weeks[w]=W;});d.reqs[id]=Object.assign({},r,{status:'onay',applied:true});return d;},s.name+' · talep plana uygulandı ('+ds.length+' gün)');}
  dismiss(id,w){this.commit(d=>{d.dismissed[w]=Object.assign({},d.dismissed[w],{[id]:true});return d;},'Ayrılmadı olarak işaretlendi');if(this.state.sheet==='exit')this.setState({sheet:null});}
  copyPrev(w){const all=Object.values(this.db.staff),pv=weekView(this.db,addD(w,-7),all);
    this.setPlan(w,cells=>{Object.keys(pv.cells).forEach(id=>{if(this.db.staff[id].status==='left')return;cells[id]=pv.cells[id].map(c=>c&&(c.type==='work'||c.type==='off')?this.st(c.raw,c.loc):null);});return cells;},wkLabel(addD(w,-7))+' vardiyaları kopyalandı (izin kodları hariç)');}
  updStaff(id,fn,msg){this.commit(d=>{d.staff[id]=fn(d.staff[id]);return d;},msg);}
  save(){
    const st=this.state,f=st.form,id=st.staffId;
    if(st.sheet==='assign'){const ids=Object.keys(f.sel).filter(k=>f.sel[k]);if(!ids.length)return;
      this.setPlan(f.w,cells=>{ids.forEach(pid=>{const a=(cells[pid]||Array(7).fill(null)).slice();a[f.i]=this.st(f.time,f.L,f.L==='spa'?null:f.sh);cells[pid]=a;});return cells;},ids.length+' kişi '+DN[f.i]+' '+f.sh+' vardiyasına atandı');
      this.setState({sheet:null});return;}
    if(st.sheet==='cell'){const s=this.db.staff[f.id];
      this.setPlan(f.w,cells=>{const a=(cells[f.id]||Array(7).fill(null)).slice();a[f.i]=f.val?this.st(f.val,parseCell(f.val).type==='work'?f.loc:s.home,f.loc==='spa'?null:f.sh):null;cells[f.id]=a;return cells;},s.name+' · '+DN[f.i]+' güncellendi');
      this.setState({sheet:null});return;}
    const all=Object.values(this.db.staff);
    if(st.sheet==='newStaff'||st.sheet==='hire'){const hire=st.sheet==='hire';const nm=(f.name||'').trim().replace(/\s+/g,' ');const key=hire?f.rawKey:norm(nm);
      if(!nm||!f.start||all.some(s=>s.key===key&&s.status!=='left'))return;
      const nid='p'+Date.now().toString(36);
      const ns={id:nid,name:nm,key,role:(f.role||'').trim()||'Görev girilmemiş',home:f.home,start:f.start,ap:0,ord:Date.now(),fm:[],use:[],debt:[],yl:[],adj:{},status:'active',exit:null};
      if(!hire){if(f.kalan!==''&&f.kalan!=null){ns.ap=calc(ns).earned-(+f.kalan);ns.annualSet={d:TODAY,n:+f.kalan,note:'Kayıtta devir'};}
        if(+f.alacak>0)ns.fm.push({d:TODAY,h:+f.alacak,src:'Devir',note:'Kayıtta devir'});
        if(+f.borc>0)ns.debt.push({d:TODAY,h:+f.borc,src:'Devir',note:'Kayıtta devir'});}
      this.commit(d=>{d.staff[nid]=ns;return d;},hire?nm+' işe alındı · giriş '+fd(f.start):nm+' eklendi');
      this.setState(s=>({sheet:null,tab:hire?s.tab:'personel',staffId:hire?s.staffId:nid}));return;}
    if(st.sheet==='exit'){const s=this.db.staff[f.id];if(!f.d||!f.reason)return;const c=this._C[s.id];
      const snap={left:c.left,p11:c.p11,p15:c.p15,borc:c.borc,net:c.net,years:c.years,months:c.months};
      this.commit(d=>{d.staff[f.id]=Object.assign({},d.staff[f.id],{status:'left',exit:{d:f.d,reason:f.reason,snap}});
        Object.keys(d.weeks).forEach(w=>{const W=d.weeks[w];if(W.src!=='import'&&w>=wkStart(f.d)&&W.cells&&W.cells[f.id]){const a=arr7(W.cells[f.id]);wkDates(w).forEach((dt,i)=>{if(dt>f.d)a[i]=null;});W.cells[f.id]=a;}});return d;},s.name+' için çıkış yapıldı · '+fd(f.d));
      this.setState({sheet:null});return;}
    if(st.sheet==='req'){if(!f.from||f.from<=TODAY||f.to<f.from)return;const rid='r'+Date.now().toString(36);
      this.commit(d=>{d.reqs[rid]={id:rid,who:f.who,from:f.from,to:f.to,kind:f.kind,code:f.kind==='izin'?f.code:'',val:f.kind==='vardiya'?f.val:'',loc:f.kind==='vardiya'?f.loc:(f.who?'':f.loc||''),text:(f.text||'').trim(),status:f.kind==='not'?'not':'bekliyor',by:this.cfg.user||'',at:Date.now()};return d;},f.kind==='not'?'Not eklendi':'Talep eklendi · onay bekliyor');
      this.setState({sheet:null});return;}
    if(st.sheet==='carry'){const n=+f.n||0,e=this._E[id];
      this.updStaff(id,s=>{if(f.type==='alacak')s.fm.push({d:f.d,h:n,src:'Devir',note:f.note});else if(f.type==='borc')s.debt.push({d:f.d,h:n,src:'Devir',note:f.note||'Geçmiş borç'});else if(f.mode==='used')s.yl.push({d:f.d,days:n,src:'Devir'+(f.note?' · '+f.note:'')});else{const c=calc(e);s.ap=c.earned-n-sum(e.yl,l=>l.days);s.annualSet={d:f.d,n,note:f.note};}return s;},
        f.type==='alacak'?'+'+sa(n)+' devir alacak eklendi':f.type==='borc'?sa(n)+' devir borç eklendi':f.mode==='kalan'?'Kalan yıllık izin '+n+' gün olarak ayarlandı':n+' gün kullanılmış izin eklendi');
      this.setState({sheet:null});return;}
    if(st.sheet==='manual'){
      this.updStaff(id,s=>{if(f.type==='fm')s.fm.push({d:f.d,h:f.h,src:'Manuel',note:f.note});else s.use.push({d:f.d,h:f.h,src:'Erken çıkış',note:f.note});s.adj=Object.assign({},s.adj);s.adj[f.d]=(s.adj[f.d]||0)+(f.type==='fm'?f.h:-f.h);return s;},(f.type==='fm'?'+':'−')+sa(f.h)+' · '+fd(f.d)+' kaydedildi');
    }else if(st.sheet==='leave'){
      this.updStaff(id,s=>{if(f.type==='yillik')s.yl.push({d:f.d,days:f.n,src:'Manuel'});else if(f.type==='aoff')s.use.push({d:f.d,h:f.n,src:'İzin girişi',note:'A-OFF'});else s.debt.push({d:f.d,h:f.n,src:'İzin girişi',note:'B-OFF'});return s;},f.type==='yillik'?f.n+' gün yıllık izin düşüldü':f.type==='aoff'?sa(f.n)+' alacaktan düşüldü':sa(f.n)+' borç yazıldı');
    }else if(st.sheet==='start'){
      if(!f.start)return;this.updStaff(id,s=>{s.start=f.start;return s;},'İşe giriş tarihi güncellendi');
    }
    this.setState({sheet:null});
  }
  renderVals(){
    const st=this.state,P=this.props,warn=P.expiryWarnDays??30,db=st.db,cfg=st.cfg;
    const CUR=wkStart(TODAY),NXT=addD(CUR,7),ti=dow(TODAY);
    const all=Object.values(db.staff).sort((a,b)=>(a.ord||0)-(b.ord||0)||a.name.localeCompare(b.name,'tr'));
    const staff=all.filter(s=>s.status!=='left');
    const VWc={},VW=w=>VWc[w]||(VWc[w]=weekView(db,w,all));
    const DV=derive(db,all,VW),E={},C={};
    all.forEach(s=>{const x=DV[s.id];E[s.id]=Object.assign({},s,{fm:s.fm.concat(x.fm),use:s.use.concat(x.use),debt:s.debt.concat(x.debt),yl:s.yl.concat(x.yl)});C[s.id]=calc(E[s.id]);});
    this._C=C;this._E=E;
    const go=t=>()=>this.setState({tab:t,staffId:null,sheet:null});
    const open=id=>()=>this.setState({tab:'personel',staffId:id});
    const A='var(--color-accent)',T=INK,BG='var(--color-bg)';
    const seg=on=>({bg:on?T:'transparent',fg:on?BG:T});
    const isDetail=st.tab==='personel'&&!!st.staffId;
    const cur=isDetail?all.find(s=>s.id===st.staffId):null;
    const reqs=Object.values(db.reqs);
    const editable=w=>{const W=db.weeks[w];return !W||W.src!=='import';};
    const reqsFor=(id,d)=>reqs.filter(r=>r.who===id&&r.status!=='red'&&d>=r.from&&d<=r.to);
    const reqLabel=r=>r.kind==='izin'?r.code:r.kind==='vardiya'?parseCell(r.val).short+(r.loc?' '+LOC[r.loc].s:''):'Not';
    const reqTxt=(id,d)=>{const r=reqsFor(id,d)[0];return r?'Talep · '+reqLabel(r)+(r.status==='bekliyor'?' (bekliyor)':''):'';};
    const rangeTxt=r=>{const n=diff(r.to,r.from)+1;return DN[dow(r.from)]+' '+fs(r.from)+(n>1?' – '+DN[dow(r.to)]+' '+fs(r.to)+' · '+n+' gün':'');};
    const reqItem=r=>{const s=all.find(x=>x.id===r.who),pc=r.kind==='vardiya'?parseCell(r.val):null,inPlan=this.reqDates(r).some(d=>editable(wkStart(d)));
      const what=r.kind==='izin'?r.code+' · '+parseCell(r.code).desc:r.kind==='vardiya'?pc.short+' · net '+sa(pc.h)+(r.loc?' · '+LOC[r.loc].s:''):'';
      return {name:s?s.name:'Genel not',sub:(s?s.role+' · '+LOC[s.home].s:(r.loc?LOC[r.loc].n:'Tüm lokasyonlar'))+(r.by?' · '+r.by:''),kindTag:{izin:'İZİN TALEBİ',vardiya:'VARDİYA TALEBİ',not:'NOT'}[r.kind],kindC:r.kind==='not'?'tag-neutral':'tag-outline',
        hasStatus:r.kind!=='not',statusTag:r.applied?'Plana uygulandı':{bekliyor:'Bekliyor',onay:'Onaylandı',red:'Reddedildi'}[r.status],statusC:r.status==='bekliyor'?'tag-accent':'tag-neutral',
        line:rangeTxt(r)+(what?' · '+what:''),text:r.text,pending:r.status==='bekliyor',canApply:!!s&&r.kind!=='not'&&inPlan&&!r.applied&&r.status!=='red',
        approve:()=>{this.setReq(r.id,{status:'onay'});this.flash('Talep onaylandı');},reject:()=>{this.setReq(r.id,{status:'red'});this.flash('Talep reddedildi');},apply:()=>this.applyReq(r.id),del:()=>this.delReq(r.id)};};
    const pendR=reqs.filter(r=>r.status==='bekliyor'&&r.to>=TODAY).sort((x,y)=>x.from<y.from?-1:1),pendingN=pendR.length;
    const hdr={pano:{kicker:'Ortunç Otel · Elia Otel · Spa',title:'Pano'},ciz:{kicker:isoWeek(st.wk)+'. hafta · 3 lokasyon',title:'Vardiya çizelgesi'},personel:{kicker:staff.length+' aktif personel',title:'Personel'},import:{kicker:'Excel · .xlsx',title:'Çizelge yükle'},rapor:{kicker:'Haftalık · Aylık · PDF',title:'Raporlar'},ayar:{kicker:'Bulut · Bildirim · Yedek',title:'Ayarlar'}}[st.tab];
    if(cur)Object.assign(hdr,{kicker:(cur.status==='left'?'Ayrıldı · ':'')+cur.role+' · '+LOC[cur.home].n,title:cur.name});
    const tc={},tb={};['pano','ciz','personel','rapor','import'].forEach(k=>{tc[k]=st.tab===k?A:T;tb[k]=st.tab===k?A:'transparent';});

    const curV=VW(CUR),imported=curV.kind==='import'||(curV.kind==='plan'&&curV.pub);
    const todayLocs=Object.keys(LOC).map(L=>{const w=staff.map(s=>curV.cells[s.id]&&curV.cells[s.id][ti]).filter(c=>c&&c.type==='work'&&c.loc===L);
      const br=L==='spa'?'Tek vardiya':LOC[L].sh.map(x=>x[0]+' '+w.filter(c=>c.shift===x).length).join(' · ');
      return {name:LOC[L].s,count:w.length,breakdown:br,go:()=>this.setState({tab:'ciz',wk:CUR,loc:L,day:ti,view:'gun'})};});
    const weekFm=sum(staff,s=>sum(DV[s.id].fm.filter(r=>r.d>=CUR&&r.d<=addD(CUR,6)),r=>r.h));
    const stats=[
      {label:'Deneme süresinde',value:staff.filter(s=>C[s.id].inProb).length+' kişi'},
      {label:'Bu hafta fazla mesai',value:imported?sa(weekFm):'—'},
      {label:'Alacak · 1:1 / 1:1,5',value:nf(sum(staff,s=>C[s.id].p11))+' / '+sa(sum(staff,s=>C[s.id].p15))},
      {label:'Borç · B-OFF',value:neg(sum(staff,s=>C[s.id].borc))}];
    const impW=Object.keys(db.weeks).filter(w=>db.weeks[w].src==='import').sort();
    const LW=impW.filter(w=>w<=NXT).pop();
    const SC=LW&&LW>=addD(CUR,-7)?scanRows(db.weeks[LW].rows,all,LW,db.dismissed):{matched:[],hires:[],missing:[]};
    const alerts=[];
    SC.hires.forEach(x=>alerts.push({tag:'YENİ İSİM',tagc:'tag-accent',name:pretty(x.r.name),text:wkLabel(LW)+' çizelgesinde vardiyası var, personel kaydı yok. İşe giriş bilgilerini girin.',value:'İşe al',u:-10,open:()=>this.openHire(x.r,LW)}));
    SC.missing.forEach(s=>alerts.push({tag:'ÇİZELGEDE YOK',tagc:'tag-accent',name:s.name,text:wkLabel(LW)+' çizelgesinde yer almıyor. İşten ayrıldı mı?',value:'Kontrol',u:-9,open:()=>this.openExit(s.id,LW)}));
    if(pendingN)alerts.push({tag:'TALEP',tagc:'tag-outline',name:'Gelecek günler',text:pendingN+' izin / vardiya talebi onay bekliyor.',value:pendingN+' adet',u:-8,open:()=>this.setState({tab:'ciz',wk:wkStart(pendR[0].from<TODAY?TODAY:pendR[0].from),view:'talep',staffId:null})});
    staff.forEach(s=>{const c=C[s.id],o=open(s.id);
      if(c.inProb&&c.probLeft<=30)alerts.push({tag:'DENEME SÜRESİ',tagc:'tag-accent',name:s.name,text:'Deneme süresi '+fd(c.probEnd)+' tarihinde bitiyor.',value:c.probLeft+' gün',u:c.probLeft,open:o});
      c.act.filter(r=>r.left>0&&diff(r.exp,TODAY)<=warn).forEach(r=>alerts.push({tag:'DENKLEŞTİRME',tagc:'tag-outline',name:s.name,text:fd(r.d)+' tarihli '+sa(r.left)+' alacak '+fd(r.exp)+' tarihinde 4 ayı dolduruyor; kullanılmazsa 1:1,5 olur.',value:diff(r.exp,TODAY)+' gün',u:diff(r.exp,TODAY),open:o}));
      if(c.expLeft>0)alerts.push({tag:'SÜRE DIŞI',tagc:'tag-accent',name:s.name,text:sa(c.expLeft)+' mesai 4 aylık denkleştirme süresi dışında; 1:1,5 oranıyla hesaplandı.',value:sa(c.p15),u:-1,open:o});
      if(c.borc>0)alerts.push({tag:'BORÇ SAAT',tagc:'tag-neutral',name:s.name,text:'Bakiye eksiye düştü. Sonraki fazla mesailer önce bu borcu kapatır.',value:'−'+sa(c.borc),u:40,open:o});
      if(c.nextIn<=30)alerts.push({tag:'İZİN HAKKI',tagc:'tag-neutral',name:s.name,text:fd(c.next)+' itibarıyla '+(c.years+1)+'. yıl dolar; +'+c.nextEnt+' gün yıllık izin eklenir.',value:c.nextIn+' gün',u:c.nextIn+2,open:o});});
    alerts.sort((a,b)=>a.u-b.u);

    const locTabs=[['all','Tümü'],['ortunc','Ortunç'],['elia','Elia'],['spa','Spa']].map(([k,l])=>({label:l,bg:st.loc===k?T:'transparent',fg:st.loc===k?BG:T,go:()=>this.setState({loc:k})}));
    const wk=st.wk,WD=wkDates(wk),V=VW(wk),isPlan=V.kind!=='import',day=Math.min(6,Math.max(0,st.day));
    const VS={};
    if(isPlan)staff.forEach(s=>{VS[s.id]=(V.cells[s.id]||Array(7).fill(null)).map(c=>c||Object.assign({},EMPTYC,{loc:s.home}));});
    else staff.forEach(s=>{if(V.cells[s.id])VS[s.id]=V.cells[s.id].map(c=>c||Object.assign({},EMPTYC,{loc:s.home}));});
    const showGrid=V.kind!=='none'||wk>=CUR||!!st.forcePlan[wk];
    const pv=VW(addD(wk,-7)),noPrev=!Object.keys(pv.cells).length;
    const rowGo=id=>isPlan?()=>this.openCell(id,day):open(id);
    const dayStrip=WD.map((d,i)=>({dn:DN[i],num:+d.slice(8),mark:d===TODAY?'Bugün':'',bg:day===i?A:'transparent',fg:day===i?BG:T,hfg:d===TODAY?RED:T,go:()=>this.setState({day:i})}));
    const locs=st.loc==='all'?Object.keys(LOC):[st.loc];
    const dayGroups=[];
    if(showGrid)locs.forEach(L=>{
      const pre=st.loc==='all'?LOC[L].s+' · ':'';
      const working=staff.filter(s=>VS[s.id]).map(s=>({s,c:VS[s.id][day]})).filter(x=>x.c.type==='work'&&x.c.loc===L);
      LOC[L].sh.forEach(sh=>{const rows=working.filter(x=>L==='spa'||x.c.shift===sh).sort((a,b)=>a.c.s-b.c.s);
        dayGroups.push({title:pre+sh,sub:SH_H[sh]+' · '+rows.length+' kişi',empty:!rows.length,canAdd:isPlan,add:()=>this.openAssign(L,sh,day),rows:rows.map(({s,c})=>{const adj=s.adj[WD[day]]||0;return {name:s.name,role:s.role,time:c.short,moved:c.loc!==s.home,movedTxt:LOC[s.home].s+' → '+LOC[c.loc].s,ot:c.ot>0,otTxt:'+'+sa(c.ot)+' mesai',adj:!!adj,adjTxt:(adj>0?'+':'−')+sa(Math.abs(adj))+' manuel',open:rowGo(s.id),sid:s.id};})});});
      const off=staff.filter(s=>s.home===L&&VS[s.id]&&!['work','empty'].includes(VS[s.id][day].type));
      if(off.length)dayGroups.push({title:pre+'İzinli / OFF',sub:off.length+' kişi',empty:false,rows:off.map(s=>{const c=VS[s.id][day];return {name:s.name,role:c.desc,time:c.short,moved:false,ot:false,adj:false,open:rowGo(s.id),sid:s.id};})});
      const away=staff.filter(s=>s.home===L&&VS[s.id]&&VS[s.id][day].type==='work'&&VS[s.id][day].loc!==L);
      if(away.length)dayGroups.push({title:pre+'Başka lokasyonda',sub:away.length+' kişi',empty:false,rows:away.map(s=>{const c=VS[s.id][day];return {name:s.name,role:s.role,time:c.short,moved:true,movedTxt:LOC[L].s+' → '+LOC[c.loc].s,ot:false,adj:false,open:rowGo(s.id),sid:s.id};})});
      const una=isPlan?staff.filter(s=>s.home===L&&VS[s.id][day].type==='empty'):[];
      if(una.length)dayGroups.push({title:pre+'Atanmamış',sub:una.length+' kişi · dokunarak atayın',empty:false,rows:una.map(s=>({name:s.name,role:s.role,time:'+',moved:false,ot:false,adj:false,open:rowGo(s.id),sid:s.id}))});
    });
    dayGroups.forEach(g=>g.rows.forEach(r=>{const t=reqTxt(r.sid,WD[day]);r.req=!!t;r.reqTxt=t;}));
    const dayNotes=reqs.filter(r=>!r.who&&r.kind==='not'&&WD[day]>=r.from&&WD[day]<=r.to&&(st.loc==='all'||!r.loc||r.loc===st.loc)).map(r=>({text:(r.loc?LOC[r.loc].s+' · ':'')+r.text}));
    const weekRows=staff.filter(s=>VS[s.id]&&(st.loc==='all'||s.home===st.loc||VS[s.id].some(c=>c.type==='work'&&c.loc===st.loc))).map(s=>{const cs=VS[s.id];const parts=s.name.split(' ');
      return {name:parts[0]+(parts.length>1?' '+parts[parts.length-1][0]+'.':''),total:sa(sum(cs,c=>c.h))+(sum(cs,c=>c.ot)?' · +'+nf(sum(cs,c=>c.ot)):''),cells:cs.map((c,i)=>Object.assign(cellView(c,s.home),c.type==='empty'?{l1:isPlan?'+':'—',l2:''}:{},{go:isPlan?()=>this.openCell(s.id,i):open(s.id),rq:reqsFor(s.id,WD[i]).length?A:'transparent'})),open:open(s.id)};});
    const wkNav={label:wkLabel(wk),sub:(V.kind==='import'?'Yüklendi'+(V.W.file?' · '+V.W.file:''):V.kind==='plan'?'Plan · '+(V.pub?'yayında':'taslak'):'Çizelge yok')+(wk===CUR?' · bu hafta':wk===NXT?' · gelecek hafta':'')};
    const toWk=w=>this.setState({wk:w,day:w===CUR?ti:0});

    const rqAll=reqs.filter(r=>r.to>=TODAY&&(st.loc==='all'||(r.who?(all.find(x=>x.id===r.who)||{}).home===st.loc:(!r.loc||r.loc===st.loc))));
    const rqF=st.rqf==='all'?rqAll:rqAll.filter(r=>st.rqf==='not'?r.kind==='not':r.status===st.rqf);
    const rqG={};rqF.slice().sort((x,y)=>x.from<y.from?-1:1).forEach(r=>{const k=wkStart(r.from);(rqG[k]=rqG[k]||[]).push(r);});
    const rq={summary:pendingN+' bekleyen · '+rqAll.length+' kayıt',hasPending:pendingN>0,pendingTxt:pendingN+' talep onay bekliyor →',empty:!rqF.length,
      filters:[['all','Tümü'],['bekliyor','Bekleyen'],['onay','Onaylı'],['not','Notlar']].map(([k,l])=>Object.assign({label:l,go:()=>this.setState({rqf:k})},seg(st.rqf===k))),
      groups:Object.keys(rqG).sort().map(k=>({title:fs(k)+' – '+fs(addD(k,6)),sub:(k===wk?'Görüntülenen hafta · ':'')+rqG[k].length+' kayıt',items:rqG[k].map(reqItem)}))};
    const qn=norm(st.q||'');
    const staffRows=staff.filter(s=>(st.loc==='all'||s.home===st.loc)&&(!qn||s.key.includes(qn))).map(s=>{const c=C[s.id];
      return {name:s.name,sub:s.role+' · '+LOC[s.home].s+' · izin '+c.left+' g',inProb:c.inProb,probTxt:c.notStarted?'Başlıyor · '+c.startIn+' g':'Deneme · '+c.probLeft+' g',fmTxt:'Alacak '+sa(c.alacak)+(c.borc?' · borç '+sa(c.borc):''),open:open(s.id)};});
    const leftRows=all.filter(s=>s.status==='left'&&(!qn||s.key.includes(qn))).map(s=>({name:s.name,sub:s.role+' · '+LOC[s.home].s+' · çıkış '+fd(s.exit.d)+' · '+s.exit.reason,open:open(s.id)}));

    let d={fmWarn:[],fmRecs:[],week:[],ledger:[],exitRows:[],reqs:[]};
    if(cur){const c=C[cur.id],e=E[cur.id];
      const fmWarn=[];
      c.act.filter(r=>r.left>0&&diff(r.exp,TODAY)<=warn).forEach(r=>fmWarn.push({text:sa(r.left)+' alacak '+fd(r.exp)+' tarihinde 4 ayı dolduruyor ('+diff(r.exp,TODAY)+' gün). Kullanılmazsa 1:1,5 oranına geçer.'}));
      if(c.expLeft>0)fmWarn.push({text:'Denkleştirme süresi dışında: '+sa(c.expLeft)+' mesai × 1,5 = '+sa(c.p15)+'. Bu bakiye 1:1,5 olarak ayrı izlenir.'});
      if(c.borc>0)fmWarn.push({text:'Bakiye eksiye düştü: borç '+sa(c.borc)+'. Personel fazla mesai yaptıkça önce bu borç kapanır, sonra bakiye artıya çıkar.'});
      const fmRecs=c.recs.slice().reverse().map(r=>{const ex=r.exp<=TODAY;return {date:fd(r.d),h:(r.left<r.h?sa(r.left)+' / ':'')+'+'+sa(r.h),status:(r.paid>0?sa(r.paid)+' borca mahsup · ':'')+(ex?'Süre dışı · ×1,5':(r.left<=0?'Kullanıldı':'1:1 · '+diff(r.exp,TODAY)+' gün kaldı')),sc:ex?RED:(r.left<=0?'var(--color-neutral-600)':T)};});
      const L=[];
      if(cur.annualSet)L.push({d:cur.annualSet.d,title:'Yıllık izin devri',sub:fd(cur.annualSet.d)+' · kalan '+cur.annualSet.n+' gün olarak ayarlandı'+(cur.annualSet.note?' · '+cur.annualSet.note:''),amt:cur.annualSet.n+' gün',c:T});
      e.fm.forEach(r=>L.push({d:r.d,title:r.src==='Devir'?'Devir alacak':r.src==='Manuel'?'Manuel fazla mesai':'Fazla mesai',sub:fd(r.d)+' · '+r.src+(r.note?' · '+r.note:''),amt:'+'+sa(r.h),c:T}));
      e.use.forEach(u=>L.push({d:u.d,title:u.src==='Erken çıkış'?'Erken çıkış':'Alacaktan off (A-OFF)',sub:fd(u.d)+' · '+u.src+(u.note&&u.note!=='A-OFF'?' · '+u.note:''),amt:'−'+sa(u.h),c:RED}));
      e.debt.forEach(u=>L.push({d:u.d,title:u.src==='Devir'?'Devir borç':'Borçlanılan off (B-OFF)',sub:fd(u.d)+' · '+u.src+' · borç hanesine, alacaktan düşer',amt:'−'+sa(u.h),c:RED}));
      e.yl.forEach(y=>L.push({d:y.d,title:String(y.src).indexOf('Devir')===0?'Devir · kullanılmış yıllık izin':'Yıllık izin',sub:fd(y.d)+' · '+y.src,amt:'−'+y.days+' gün',c:RED}));
      L.sort((a,b)=>-byD(a,b));
      const CW=wkDates(CUR),cs=curV.cells[cur.id],isLeft=cur.status==='left';
      const snap=isLeft&&cur.exit.snap?Object.assign({},c,cur.exit.snap):c;
      d={role:cur.role,locName:LOC[cur.home].n,startF:fd(cur.start),tenure:tenure(c),inProb:c.inProb,probLeft:c.probLeft,probPct:c.probPct+'%',probEndF:fd(c.probEnd),probTag:c.notStarted?'Başlamadı · '+fd(cur.start)+' tarihinde başlar':c.inProb?'Devam ediyor':'Tamamlandı',probTagC:c.inProb?'tag-accent':'tag-neutral',
        earned:c.earned,used:c.used,leftA:c.left,leftC:c.left<0?A:T,
        annualNote:(c.years===0?'Henüz 1 yıl dolmadı. İlk hak ediş ':c.years+' yıl tamamlandı. Sonraki hak ediş ')+fd(c.next)+' · +'+c.nextEnt+' gün ('+c.nextIn+' gün sonra). Kullanılanlara önceki kayıtlar dahildir.',
        p11:sa(c.p11),p15:sa(c.p15),p15C:c.p15>0?RED:T,borc:neg(c.borc),borcC:c.borc>0?RED:T,net:sa(c.net),netC:c.net<0?RED:T,fmWarn,fmRecs,noRecs:!fmRecs.length,
        left:isLeft,active:!isLeft,exitTxt:isLeft?fd(cur.exit.d)+' · '+cur.exit.reason:'',exitRows:isLeft?exitRows(snap,cur):[],
        hasWeek:!!cs,week:cs?cs.map((x0,i)=>{const x=x0||Object.assign({},EMPTYC,{loc:cur.home}),v=cellView(x,cur.home),a=cur.adj[CW[i]]||0;return Object.assign(v,{dn:DN[i]+' '+(+CW[i].slice(8)),note:a?(a>0?'+':'−')+nf(Math.abs(a)):(v.mark!=='transparent'?LOC[x.loc].s:'')});}):[],
        ledger:L,noLedger:!L.length,reqs:reqs.filter(r=>r.who===cur.id&&r.to>=TODAY).sort((x,y)=>x.from<y.from?-1:1).map(reqItem)};d.noReqs=!d.reqs.length;}

    const f=st.form,cc=cur?C[cur.id]:null;
    const isManual=st.sheet==='manual',isLeave=st.sheet==='leave',isStart=st.sheet==='start';
    const isAssign=st.sheet==='assign',isCell=st.sheet==='cell',isNew=st.sheet==='newStaff',isHire=st.sheet==='hire',isExit=st.sheet==='exit',isPF=isNew||isHire;
    let preview={label:'',value:'',warn:''},amtLabel='',amtTxt='',stepv=1,minv=1,maxv=24,key='h',saveDisabled=false,saveLabel='Kaydet';
    if(isManual&&cc){amtLabel='Saat';amtTxt=sa(f.h);stepv=0.5;minv=0.5;maxv=12;
      if(f.type==='fm')preview={label:'Bakiye (net)',value:sa(cc.net)+' → '+sa(cc.net+f.h),warn:cc.borc>0?'Önce '+sa(Math.min(cc.borc,f.h))+' borç kapanır'+(f.h>cc.borc?', kalan '+sa(f.h-cc.borc)+' alacağa yazılır.':'.'):'4 ay içinde kullanılmazsa 1:1,5 oranına geçer.'};
      else{const after=cc.alacak-f.h;preview={label:'Alacak (toplam)',value:sa(cc.alacak)+' → '+sa(Math.max(0,after)),warn:after<0?sa(-after)+' alacakla karşılanmıyor; borca yazılır.':'Alacak saatlerinden düşülür.'};}}
    if(isLeave&&cc){key='n';const y=f.type==='yillik';amtLabel=y?'Gün':'Saat';amtTxt=y?f.n+' gün':sa(f.n);stepv=y?1:0.5;minv=y?1:0.5;maxv=y?30:60;
      if(y){const after=cc.left-f.n;preview={label:'Kalan yıllık izin',value:cc.left+' → '+after+' gün',warn:after<0?'Bakiye yetersiz; eksi bakiye olarak kaydedilir.':''};}
      else if(f.type==='aoff'){const after=cc.alacak-f.n;preview={label:'Alacak (toplam)',value:sa(cc.alacak)+' → '+sa(Math.max(0,after)),warn:after<0?sa(-after)+' alacakla karşılanmıyor; borca yazılır.':'En eski alacaktan düşülür.'};}
      else{const after=r2(cc.net-f.n);preview={label:'Bakiye (net)',value:sa(cc.net)+' → '+sa(after),warn:'Borç hanesine −'+sa(f.n)+' yazılır, alacak '+sa(f.n)+' düşer.'+(after<0?' Bakiye eksiye iner; fazla mesai yapıldıkça kapanır.':'')};}}
    if(isStart&&f.start){const pe=addM(f.start,2);preview={label:'Deneme süresi bitişi',value:fd(pe),warn:diff(pe,TODAY)>0?diff(pe,TODAY)+' gün kaldı':''};}
    let sh={kicker:cur?cur.name:'',title:isManual?'Saat ekle / düş':isLeave?'İzin kullandır':'İşe giriş tarihi'};
    const setF=o=>this.setState(s=>({form:Object.assign({},s.form,o)}));
    const asg={presets:[],people:[],selCount:0},cellUI={locs:[],presets:[],codes:[],shifts:[]},nw={locs:[],roles:[]},hire={info:'',days:[]},ex={info:'',rows:[],reasons:[],canDismiss:false};
    if(isAssign){const pc=parseCell(f.time),FD=wkDates(f.w),FV=VW(f.w);
      asg.presets=SH_PRE[f.sh].map(t=>{const c=parseCell(t);return Object.assign({label:c.short,sub:sa(c.h)+(c.ot?' · +'+nf(c.ot):''),go:()=>setF({time:t,manual:false})},seg(!f.manual&&f.time===t));});
      const aq=norm(f.q||'');
      asg.people=staff.filter(s=>!aq||s.key.includes(aq)||!!f.sel[s.id]).slice().sort((x,y)=>(y.home===f.L)-(x.home===f.L)).map(s=>{const c=(FV.cells[s.id]||[])[f.i];const on=!!f.sel[s.id];
        const rt=reqTxt(s.id,FD[f.i]);return {name:s.name,sub:s.role+' · '+LOC[s.home].s+(s.home!==f.L?' · başka otel':'')+(rt?' · '+rt:''),now:c?(c.type==='work'?c.short+' '+LOC[c.loc].s:c.short):'Boş',nc:c?T:'var(--color-neutral-500)',box:on?A:'transparent',toggle:()=>setF({sel:Object.assign({},f.sel,{[s.id]:!on})})};});
      asg.none=!asg.people.length;const ids=Object.keys(f.sel).filter(k=>f.sel[k]);asg.selCount=ids.length;const chg=ids.filter(k=>(FV.cells[k]||[])[f.i]).length;
      preview={label:DN[f.i]+' '+fs(FD[f.i]),value:ids.length+' kişi · '+pc.short,warn:[chg?chg+' kişinin mevcut ataması değişecek.':'',pc.ot?sa(pc.h)+' net: kişi başı +'+sa(pc.ot)+' fazla mesai.':''].filter(Boolean).join(' ')};
      sh={kicker:'Plan · '+DN[f.i]+' '+fs(FD[f.i]),title:LOC[f.L].s+' · '+f.sh+' vardiyası'};saveDisabled=!ids.length;}
    if(isCell){const s=all.find(x=>x.id===f.id),FD=wkDates(f.w);
      cellUI.locs=Object.keys(LOC).map(L=>Object.assign({label:LOC[L].s,go:()=>setF({loc:L})},seg(f.loc===L)));
      cellUI.presets=PRESETS.map(t=>{const c=parseCell(t);return Object.assign({label:c.short,sub:sa(c.h)+(c.ot?' · +'+nf(c.ot):''),go:()=>setF({val:t,manual:false})},seg(!f.manual&&f.val===t));});
      cellUI.codes=CODES.concat(['']).map(t=>Object.assign({label:t||'Boş',sub:t?parseCell(t).desc:'Atamayı kaldır',go:()=>setF({val:t,manual:false})},seg(!f.manual&&f.val===t)));
      const cr=reqsFor(f.id,FD[f.i])[0];cellUI.hasReq=!!cr;
      if(cr){cellUI.reqTxt=(cr.kind==='not'?'Not':'Talep')+' · '+reqLabel(cr)+(cr.text?' · '+cr.text:'')+(cr.status==='bekliyor'?' (bekliyor)':'');
        cellUI.useReq=()=>{if(cr.kind==='izin')setF({val:cr.code,manual:false});else if(cr.kind==='vardiya'){const man=PRESETS.indexOf(cr.val)<0,p=cr.val.split('-');setF({val:cr.val,loc:cr.loc||s.home,manual:man,ms:p[0],me:p[1]==='24:00'?'00:00':p[1]});}};}
      const cw=f.val&&parseCell(f.val).type==='work';cellUI.showSh=!!cw&&f.loc!=='spa';
      cellUI.shifts=[['','Otomatik']].concat(LOC[f.loc].sh.map(x=>[x,x])).map(([k,l])=>Object.assign({label:l,go:()=>setF({sh:k})},seg((f.sh||'')===k)));
      const c=f.val?parseCell(f.val):null;
      preview={label:'Seçim',value:c?(c.type==='work'?c.short+' · '+LOC[f.loc].s:c.desc):'Boş',warn:[c&&c.type==='work'&&f.loc!==s.home?LOC[s.home].s+' personeli bu gün '+LOC[f.loc].n+'’de çalışacak.':'',c&&c.ot?'+'+sa(c.ot)+' fazla mesai.':''].filter(Boolean).join(' ')};
      sh={kicker:s.name+' · '+s.role,title:DN[f.i]+' '+fs(FD[f.i])};}
    if(isPF){nw.locs=Object.keys(LOC).map(L=>Object.assign({label:LOC[L].n,go:()=>setF({home:L})},seg(f.home===L)));
      nw.roles=Array.from(new Set(staff.map(s=>s.role).filter(r=>r!=='Görev girilmemiş'))).map(r=>Object.assign({label:r,go:()=>setF({role:r})},seg(f.role===r)));
      const nm=(f.name||'').trim(),k=isHire?f.rawKey:norm(nm),dup=!!nm&&all.some(s=>s.key===k&&s.status!=='left'),pe=f.start?addM(f.start,2):'';
      const w=[!nm?'Ad soyad gerekli.':dup?'Bu isim zaten kayıtlı.':''];
      if(isHire&&f.row){const HD=wkDates(f.w),cs=f.row.c.map(parseCell);
        const before=cs.filter((c,i)=>HD[i]<f.start&&c.type==='work').length;
        hire.days=HD.map((dd,i)=>Object.assign({dn:DN[i],num:+dd.slice(8),code:cs[i]?(cs[i].type==='empty'?'':cs[i].short):'',go:()=>setF({start:dd})},seg(f.start===dd)));
        hire.info=LOC[f.row.sec].n+' bloğunda '+cs.filter(c=>c.type==='work').length+' vardiya ile geçiyor ('+wkLabel(f.w)+'), personel kaydı yok. Kişi geldiği gün işe başlatılır; isim çizelgedeki yazımla eşleşir.';
        if(before)w.push('İşe giriş öncesindeki '+before+' vardiya sayılmaz, hanesine yazılmaz.');
        sh={kicker:'Yeni isim algılandı',title:'İşe al'};saveLabel='İşe al ve haneye yaz';}
      else sh={kicker:'Personel',title:'Yeni personel'};
      preview={label:'Deneme süresi bitişi',value:pe?fd(pe):'—',warn:w.filter(Boolean).join(' ')};
      saveDisabled=!nm||dup||!f.start;}
    if(isExit){const s=all.find(x=>x.id===f.id),c=C[s.id];
      ex.rows=exitRows(c,s);ex.canDismiss=!!f.fromSheet;ex.dismiss=()=>this.dismiss(s.id,f.w);
      ex.reasons=REASONS.map(r=>Object.assign({label:r,go:()=>setF({reason:r})},seg(f.reason===r)));
      ex.info=(f.fromSheet?wkLabel(f.w)+' çizelgesinde yer almıyor. ':'')+(c.inProb?'Deneme süresi içinde ('+c.probLeft+' gün kalmıştı). ':'')+'Bakiyeler '+fd(TODAY)+' itibarıyla hesaplandı; çıkışla birlikte kayıt arşivlenir.';
      preview={label:'Son çalışma günü',value:f.d?fd(f.d):'—',warn:!f.reason?'Çıkış nedenini seçin.':''};
      sh={kicker:s.name+' · '+s.role,title:'İşten çıkış'};saveDisabled=!f.d||!f.reason;saveLabel='Çıkışı onayla';}
    const isReq=st.sheet==='req';
    const tm={on:!!f.manual&&(isAssign||isCell||(isReq&&f.kind==='vardiya')),ms:f.ms||'12:00',me:f.me||'00:00',info:'',setManual:()=>this.setManual(),onMs:e=>this.setTime('ms',e.target.value),onMe:e=>this.setTime('me',e.target.value)};
    Object.assign(tm,seg(!!f.manual));
    if(tm.on){const pc=parseCell(isAssign?f.time:f.val);if(pc.type==='work')tm.info='Süre '+nf(pc.span)+' sa · mola 0,5 sa · net '+sa(pc.h)+(pc.ot?' · +'+sa(pc.ot)+' fazla mesai':'')+(isAssign?' · '+f.sh+' grubunda görünür':'')+(pc.span>16?' · süreyi kontrol edin':'');}
    const rqf={whoOpts:[],kinds:[],codes:[],presets:[],locs:[],isIzin:false,isVardiya:false,textLabel:'Not'};
    if(isReq){const s=all.find(x=>x.id===f.who);rqf.isIzin=f.kind==='izin';rqf.isVardiya=f.kind==='vardiya';rqf.textLabel=f.kind==='not'?'Not metni':'Açıklama (isteğe bağlı)';
      rqf.whoOpts=staff.map(x=>({id:x.id,name:x.name+' · '+LOC[x.home].s}));
      rqf.kinds=[['izin','İzin talebi'],['vardiya','Vardiya / saat'],['not','Not']].map(([k,l])=>Object.assign({label:l,go:()=>setF({kind:k})},seg(f.kind===k)));
      rqf.codes=CODES.map(c=>Object.assign({label:c,sub:parseCell(c).desc,go:()=>setF({code:c})},seg(f.code===c)));
      rqf.presets=PRESETS.map(t=>{const c=parseCell(t);return Object.assign({label:c.short,sub:sa(c.h)+(c.ot?' +'+nf(c.ot):''),go:()=>setF({val:t,manual:false})},seg(!f.manual&&f.val===t));});
      rqf.locs=[['','Kendi']].concat(Object.keys(LOC).map(L=>[L,LOC[L].s])).map(([k,l])=>Object.assign({label:l,go:()=>setF({loc:k})},seg((f.loc||'')===k)));
      const n=f.from&&f.to&&f.to>=f.from?diff(f.to,f.from)+1:0,w=[];
      if(!f.from||f.from<=TODAY)w.push('Gelecek bir tarih seçin.');
      if(f.from&&f.to&&f.to<f.from)w.push('Bitiş başlangıçtan önce olamaz.');
      if(f.kind!=='not'&&!s)w.push('Personel seçin.');
      if(f.kind==='not'&&!(f.text||'').trim())w.push('Not metni yazın.');
      if(s&&f.kind==='izin'&&f.code==='Y-İZİN'&&n)w.push('Kalan yıllık izin '+C[s.id].left+' gün, talep '+n+' gün.');
      if(s&&n){const cl=this.reqDates({from:f.from,to:f.to}).filter(dt=>{const v=VW(wkStart(dt));return v.kind==='plan'&&v.cells[s.id]&&v.cells[s.id][dow(dt)];}).length;if(cl)w.push(cl+' gün plandaki mevcut atamayla çakışıyor.');}
      preview={label:'Tarih',value:n?rangeTxt({from:f.from,to:f.to}):'—',warn:w.join(' ')};
      sh={kicker:s?s.name:'Gelecek günler',title:'Talep / not ekle'};
      saveDisabled=!f.from||f.from<=TODAY||!f.to||f.to<f.from||(f.kind!=='not'&&!s)||(f.kind==='not'&&!(f.text||'').trim());}
    const isCarry=st.sheet==='carry',carry={types:[],modes:[],isY:false,dateLabel:'',amtLabel:''};
    if(isCarry&&cc){const n=+f.n||0,e=E[cur.id];carry.isY=f.type==='yillik';
      carry.types=[['alacak','Alacak (saat)'],['borc','Borç (saat)'],['yillik','Yıllık izin']].map(([k,l])=>Object.assign({label:l,go:()=>setF({type:k,n:k==='yillik'?'':7.5})},seg(f.type===k)));
      carry.modes=[['kalan','Kalan gün (devir)'],['used','Kullanılmış gün']].map(([k,l])=>Object.assign({label:l,go:()=>setF({mode:k})},seg(f.mode===k)));
      carry.dateLabel=f.type==='alacak'?'Mesainin yapıldığı tarih · 4 ay bu tarihten sayılır':f.type==='borc'?'Borç tarihi':'Kayıt tarihi';
      carry.amtLabel=f.type==='yillik'?(f.mode==='kalan'?'Devreden kalan izin (gün)':'Kullanılmış izin (gün)'):'Saat';
      const sim=Object.assign({},e,{fm:e.fm.slice(),debt:e.debt.slice(),yl:e.yl.slice()});
      if(f.type==='alacak')sim.fm.push({d:f.d,h:n});else if(f.type==='borc')sim.debt.push({d:f.d,h:n});else if(f.mode==='used')sim.yl.push({d:f.d,days:n});else sim.ap=cc.earned-n-sum(e.yl,l=>l.days);
      const sc=calc(sim);
      if(f.type==='yillik')preview={label:'Kalan yıllık izin',value:cc.left+' → '+sc.left+' gün',warn:f.mode==='kalan'?'Hak edilen '+cc.earned+' gün; kullanılan '+(cc.earned-n)+' gün olarak ayarlanır.':''};
      else preview={label:'Bakiye (net)',value:sa(cc.net)+' → '+sa(sc.net),warn:f.type==='alacak'&&f.d?(addM(f.d,4)<=TODAY?'4 aylık süre dolmuş: 1:1,5 olarak hesaplanır (×1,5 = '+sa(n*1.5)+').':'Denkleştirme bitişi '+fd(addM(f.d,4))+'.'):(cc.alacak>0?'Mevcut alacaktan düşülür; yetmezse bakiye eksiye iner.':'Bakiye eksiye iner; fazla mesai yapıldıkça kapanır.')};
      if(f.d&&f.d>TODAY)preview.warn='Bugün veya geçmiş bir tarih seçin.';
      sh={kicker:cur.name,title:'Geçmiş bakiye · devir'};
      saveDisabled=!f.d||f.d>TODAY||f.n===''||n<0||(!(f.type==='yillik'&&f.mode==='kalan')&&n<=0);}
    const leaveTypes=[['yillik','Yıllık izin'],['aoff','A-OFF · alacaktan'],['boff','B-OFF · borç']].map(([k,l])=>Object.assign({label:l,go:()=>setF({type:k,n:k==='yillik'?1:DAY})},seg(f.type===k)));
    const dateChips=wkDates(CUR).map((dd,i)=>Object.assign({dn:DN[i],num:+dd.slice(8),go:()=>setF({d:dd})},seg(f.d===dd)));

    const rv={changes:[],writes:[],stats:[],hires:[],missing:[]};
    if(st.parsed){const PR=st.parsed,SP=scanRows(PR.rows,all,PR.w,db.dismissed),PD=PR.dates;let fmT=0;
      const PW=db.weeks[addD(PR.w,-7)],prevRows=PW&&PW.src==='import'?PW.rows:null;
      SP.matched.forEach(({r,s,i})=>{const cs=r.c.map((c,j)=>PD[j]<s.start?PRE:parseCell(c));
        const mv=r.at.map((a,j)=>a&&a!==s.home&&cs[j].type==='work'?j:-1).filter(j=>j>=0);
        if(mv.length)rv.changes.push({name:s.name,text:LOC[s.home].n+' → '+LOC[r.at[mv[0]]].n+' · '+DN[mv[0]]+(mv.length>1?'–'+DN[mv[mv.length-1]]:'')+' ('+mv.length+' gün). Lokasyon satırından algılandı.'});
        if(prevRows){const pi=prevRows.findIndex(x=>x.key===r.key);if(pi>=0&&pi!==i)rv.changes.push({name:s.name,text:'Çizelge sırası '+(pi+1)+' → '+(i+1)+'. İsimle eşleştirildi.'});}
        const preN=r.c.filter((c,j)=>PD[j]<s.start&&parseCell(c).type==='work').length;
        if(preN)rv.changes.push({name:s.name,text:'İşe giriş '+fd(s.start)+'; öncesindeki '+preN+' vardiya sayılmadı.'});
        const ot=sum(cs,c=>c.ot),otd=cs.map((c,j)=>c.ot?DN[j]:null).filter(Boolean);fmT+=ot;
        if(ot)rv.writes.push({name:s.name,why:'Fazla mesai · '+otd.join(', ')+' (7,5 sa üzeri)',amt:'+'+sa(ot),c:T});
        [['yillik','Yıllık izin',1,' gün'],['boff','B-OFF → borç hanesine',DAY,' sa'],['aoff','A-OFF → alacaktan',DAY,' sa']].forEach(([t,l,m,u])=>{const n=cs.filter(c=>c.type===t).length;if(n)rv.writes.push({name:s.name,why:l+' · '+n+' gün',amt:'−'+nf(n*m)+u,c:RED});});});
      rv.hires=SP.hires.map(x=>{const cs=x.r.c.map(parseCell),fi=cs.findIndex(c=>c.type==='work');return {name:pretty(x.r.name),text:LOC[x.r.sec].n+(x.r.role?' · '+pretty(x.r.role):'')+(fi>=0?' · ilk vardiya '+DN[fi]+' '+fs(PD[fi]):'')+' · '+cs.filter(c=>c.type==='work').length+' vardiya',go:()=>this.openHire(x.r,PR.w)};});
      rv.missing=SP.missing.map(s=>{const c=C[s.id];return {name:s.name,text:s.role+' · '+LOC[s.home].s+' · kalan izin '+c.left+' gün · alacak '+sa(c.alacak)+(c.borc?' · borç '+sa(c.borc):''),exit:()=>this.openExit(s.id,PR.w),keep:()=>this.dismiss(s.id,PR.w)};});
      rv.hasHires=rv.hires.length>0;rv.hasMissing=rv.missing.length>0;rv.hasChanges=rv.changes.length>0;
      rv.stats=[{k:'Eşleşen',v:SP.matched.length},{k:'Fazla mesai',v:sa(fmT)},{k:'Yeni isim',v:SP.hires.length},{k:'Çizelgede yok',v:SP.missing.length}];
      const keysM=new Set(SP.matched.map(x=>x.r.key)),emp=PR.rows.filter(r=>r.blank&&!keysM.has(r.key)).map(r=>pretty(r.name));
      rv.emptyCount=emp.length;rv.emptyNames=emp.join(', ');rv.hasEmpty=emp.length>0;
      rv.file=PR.file;rv.wkLabel=wkLabel(PR.w);rv.blocks=(PR.blocks.length?PR.blocks.join(' · ')+' bloklarından okundu':'Sayfa okundu')+' · sayfa: '+PR.sheet;
      const OW=db.weeks[PR.w];rv.overwrite=OW?(OW.src==='import'?'Bu hafta '+fdt(OW.at)+' tarihinde yüklenmişti ('+(OW.file||'çizelge')+'). Yeni dosya eskisinin yerine geçer.':'Bu hafta için uygulamada plan var; çizelge planın yerine geçer.'):'';}
    const recent=impW.slice().reverse().slice(0,5).map(w=>{const W=db.weeks[w];return {file:W.file||'Çizelge',sub:wkLabel(w)+(W.by?' · '+W.by:'')+(W.at?' · '+fdt(W.at):''),go:()=>this.setState({tab:'ciz',wk:w,day:w===CUR?ti:0,view:'hafta'})};});

    const R=this.buildReport(C,E,VW,all);this._R=R;const rp=st.rp;
    const setRp=o=>this.setState(s=>({rp:Object.assign({},s.rp,o)}));
    const pn=Object.keys(this.pending).length,bad=['offline','error'].includes(st.sync);
    const syncTxt=!cfg.on?'Bulut kapalı · yalnızca bu cihaz':({connecting:'Buluta bağlanıyor…',ok:pn?pn+' değişiklik gönderiliyor':'Bulut · senkron',pending:pn+' değişiklik gönderiliyor',offline:'Çevrimdışı · '+pn+' değişiklik bekliyor',retry:'Bulut · yeniden bağlanıyor',error:'Bulut bağlantı sorunu'}[st.sync]||'Bulut');
    const Nt=NA(),hasNative=!!(Nt&&Nt.setReminders);let perm=true;try{perm=!hasNative||!Nt.notificationsAllowed||Nt.notificationsAllowed();}catch(e){}
    const nOn=cfg.notif||{};
    const cfF=st.cfgForm,setCf=o=>this.setState(s=>({cfgForm:Object.assign({},s.cfgForm,o)}));
    return {
      todayTxt:DNL[ti]+', '+(+TODAY.slice(8))+' '+MONL[+TODAY.slice(5,7)-1]+' '+TODAY.slice(0,4)+' · '+isoWeek(TODAY)+'. hafta',curWkLabel:wkLabel(CUR),
      syncTxt,syncC:bad&&cfg.on?RED:'var(--color-neutral-700)',syncWarn:cfg.on&&bad,gearBg:st.tab==='ayar'?T:'transparent',gearFg:st.tab==='ayar'?BG:T,goAyar:go('ayar'),isAyar:st.tab==='ayar',
      todayIso:TODAY,minFuture:addD(TODAY,1),fileRef:this.fileRef,jsonRef:this.jsonRef,onFile:e=>this.onFile(e),onJson:e=>this.onJson(e),
      isPlan,showGrid,noGrid:!showGrid,wkLabel:wkLabel(wk),wkNav,wkPrev:()=>toWk(addD(wk,-7)),wkNext:()=>toWk(addD(wk,7)),wkToday:()=>toWk(CUR),
      startPlan:()=>this.setState(s=>({forcePlan:Object.assign({},s.forcePlan,{[wk]:true})})),noPrev,
      planInfo:{filled:sum(staff,s=>(V.cells[s.id]||[]).filter(Boolean).length),total:staff.length*7,people:staff.filter(s=>(V.cells[s.id]||[]).some(Boolean)).length,tag:V.pub?'Yayında':'Taslak',tagc:V.pub?'tag-neutral':'tag-accent',pubLabel:V.pub?'Yayında · değişiklikler hanelere işlenir':'Planı yayınla ve hanelere yaz'},
      copyPrev:()=>this.copyPrev(wk),clearPlan:()=>this.setPlan(wk,()=>({}),'Plan temizlendi'),
      publishPlan:()=>{if(V.pub)return;this.commit(d=>{const W=d.weeks[wk]||{src:'plan',cells:{}};W.pub=true;W.src='plan';d.weeks[wk]=W;return d;},'Plan yayınlandı · mesai ve izinler hanelere yazıldı');},
      isAssign,isCell,isNew,isHire,isExit,isPF,asg,cellUI,nw,hire,ex,saveDisabled,saveLabel,
      openNew:()=>this.setState({sheet:'newStaff',form:{name:'',role:'',home:st.loc!=='all'?st.loc:'ortunc',start:TODAY,ap:0,kalan:'',alacak:'',borc:''}}),
      isReq,rqf,rq,dayNotes,isTalepView:st.view==='talep',vTalep:seg(st.view==='talep'),setTalep:()=>this.setState({view:'talep'}),
      openReqNew:()=>this.openReq(''),openReqCur:()=>cur&&this.openReq(cur.id),
      onReqWho:e=>setF({who:e.target.value}),onReqFrom:e=>{const v=e.target.value;this.setState(S=>({form:Object.assign({},S.form,{from:v,to:!S.form.to||S.form.to<v?v:S.form.to})}));},onReqTo:e=>setF({to:e.target.value}),onReqText:e=>setF({text:e.target.value}),
      tm,onAsgQ:e=>setF({q:e.target.value}),
      isCarry,carry,openCarry:()=>this.setState({sheet:'carry',form:{type:'alacak',mode:'kalan',d:addD(TODAY,-1),n:7.5,note:''}}),onN:e=>setF({n:e.target.value}),
      onNKalan:e=>setF({kalan:e.target.value}),onNAlacak:e=>setF({alacak:e.target.value}),onNBorc:e=>setF({borc:e.target.value}),
      openExitCur:()=>cur&&this.openExit(cur.id,''),
      onNName:e=>setF({name:e.target.value}),onNRole:e=>setF({role:e.target.value}),onNAp:e=>setF({ap:e.target.value}),
      isRapor:st.tab==='rapor',goRapor:go('rapor'),R,rpWho:rp.who,onWho:e=>setRp({who:e.target.value}),
      whoOpts:all.map(s=>({id:s.id,name:s.name+(s.status==='left'?' (ayrıldı)':'')})),
      perOpts:[['hafta','Bu hafta',wkShort(CUR)],['sonraki','Gelecek hafta',wkShort(NXT)],['ay','Bu ay',MONL[+TODAY.slice(5,7)-1]],['gecenay','Geçen ay',MONL[(+TODAY.slice(5,7)+10)%12]]].map(([k,l,sb])=>Object.assign({label:l,sub:sb,go:()=>setRp({per:k})},seg(rp.per===k))),
      kindOpts:[['vardiya','Vardiya'],['mesai','Fazla mesai'],['izin','İzin durumu']].map(([k,l])=>Object.assign({label:l,go:()=>setRp({kind:k})},seg(rp.kind===k))),
      exportPdf:()=>this.exportPdf(),sharePdf:()=>this.sharePdf(),
      openReport:()=>this.setState(s=>({tab:'rapor',staffId:null,rp:Object.assign({},s.rp,{who:s.staffId})})),
      hdr,tc,tb,isDetail,isPano:st.tab==='pano',isCiz:st.tab==='ciz',isList:st.tab==='personel'&&!st.staffId,isImport:st.tab==='import',
      imported,notImported:!imported,todayLocs,stats,alerts,alertCount:alerts.length+' kayıt',
      locTabs,isDayView:st.view==='gun',isWeekView:st.view==='hafta',vGun:seg(st.view==='gun'),vHafta:seg(st.view==='hafta'),
      setGun:()=>this.setState({view:'gun'}),setHafta:()=>this.setState({view:'hafta'}),dayStrip,dayGroups,weekRows,
      q:st.q,onQ:e=>this.setState({q:e.target.value}),staffRows,noStaff:!staffRows.length,leftRows,hasLeft:leftRows.length>0,leftCount:leftRows.length,d,
      back:()=>this.setState({staffId:null}),
      goPano:go('pano'),goCiz:()=>this.setState({tab:'ciz',staffId:null,sheet:null}),goPersonel:go('personel'),goImport:()=>this.setState({tab:'import',staffId:null,step:st.step===1||st.step===2?st.step:0}),
      step0:st.step===0,step1:st.step===1,step2:st.step===2,step3:st.step===3,parsingFile:st.parsingFile,parseErr:st.parseErr,recent,hasRecent:recent.length>0,
      pickFile:()=>{this.setState({parseErr:''});this.fileRef.current&&this.fileRef.current.click();},rv,
      applyImport:()=>this.applyImport(),cancelImport:()=>this.setState({step:0,parsed:null}),reimport:()=>this.setState({step:0,parsed:null}),
      doneTitle:st.done?st.done.title:'',doneWk:st.done?wkLabel(st.done.w):'',goDoneWk:()=>st.done&&this.setState({tab:'ciz',wk:st.done.w,day:st.done.w===CUR?ti:0}),
      rules:[{k:'Tarih',v:'Hafta, “Günler” satırındaki tarihlerden okunur (Pzt–Paz).'},{k:'7,5 sa',v:'1 günlük çalışma periyodu: 7,5 sa çalışma + 0,5 sa yemek ve dinlenme molası. 08–16 vardiyası 7,5 sa net sayılır; üzeri fazla mesaidir.'},{k:'4 ay',v:'Alacak 1:1 izlenir; 4 ay içinde kullanılmazsa uyarıyla 1:1,5 olur.'},{k:'OFF',v:'Normal haftalık off; bakiyeyi etkilemez.'},{k:'Y-İZİN',v:'Yıllık izinden 1 gün düşer.'},{k:'B-OFF',v:'Borçlanılan off. Borç hanesine −7,5 sa yazılır; alacak 7,5 sa düşer, gerekirse eksiye iner. Sonraki fazla mesailer önce borcu kapatır.'},{k:'A-OFF',v:'Alacak saatlerinden 7,5 sa düşülür (en eski alacaktan).'},{k:'Yeni isim',v:'Kaydı olmayan isim için işe alım uyarısı çıkar; işe giriş günü seçilir, öncesindeki vardiyalar sayılmaz.'},{k:'Eksik isim',v:'Kayıtlı olup çizelgede olmayan personel için “işten ayrıldı mı?” sorulur.'},{k:'Lokasyon',v:'İsmin altındaki lokasyon satırı (Elia, Ortunç, Spa) o gün çalışılan yeri belirler; boşsa kişinin kendi lokasyonu sayılır.'}],
      toast:st.toast,sheetOpen:!!st.sheet&&(!!cur||isAssign||isCell||isNew||isHire||isExit||isReq),closeSheet:()=>this.setState({sheet:null}),sh,isManual,isLeave,isStart,needsDate:isManual||isLeave,
      openManual:()=>this.setState({sheet:'manual',form:{type:'fm',d:TODAY,h:1,note:''}}),
      openLeave:()=>this.setState({sheet:'leave',form:{type:'yillik',d:TODAY,n:1}}),
      openStart:()=>this.setState({sheet:'start',form:{start:cur?cur.start:''}}),
      mt:{fm:seg(f.type==='fm'),erken:seg(f.type==='erken')},setFm:()=>setF({type:'fm'}),setErken:()=>setF({type:'erken'}),
      leaveTypes,dateChips,form:f,onDate:e=>setF({d:e.target.value}),onNote:e=>setF({note:e.target.value}),onStart:e=>setF({start:e.target.value}),
      amtLabel,amtTxt,inc:()=>setF({[key]:Math.min(maxv,(f[key]||0)+stepv)}),dec:()=>setF({[key]:Math.max(minv,(f[key]||0)-stepv)}),
      preview,saveSheet:()=>this.save(),
      cfgForm:cfF,onCfgUser:e=>{const v=e.target.value;setCf({user:v});this.saveCfg(Object.assign({},this.cfg,{user:v.trim()}));},onCfgUrl:e=>setCf({url:e.target.value}),onCfgTeam:e=>setCf({team:e.target.value}),onCfgSecret:e=>setCf({secret:e.target.value}),onCfgCode:e=>this.onCode(e.target.value),
      cloud:{on:!!cfg.on,tag:!cfg.on?'Kapalı':({connecting:'Bağlanıyor',ok:'Bağlı',pending:'Gönderiliyor',offline:'Çevrimdışı',retry:'Yeniden bağlanıyor',error:'Hata'}[st.sync]||'Bağlı'),tagc:!cfg.on?'tag-neutral':bad?'tag-accent':'tag-outline',
        info:cfg.on?'Ekip “'+cfg.team+'” · son eşitleme '+(st.lastSync?fdt(st.lastSync):'—')+(pn?' · '+pn+' değişiklik sırada':'')+(st.syncErr&&bad?' · '+st.syncErr:''):'Bağlanınca ekipteki tüm telefonlar aynı veriyi görür ve değişiklikler anında herkese gider. İlk bağlanan cihaz kendi verisini buluta yükler; sonrakiler buluttan indirir.',
        connectLabel:cfg.on?'Yeniden bağlan':'Bağlan',err:!cfg.on&&st.syncErr?st.syncErr:''},
      cloudConnect:()=>this.cloudConnect(),cloudOff:()=>this.cloudOff(),cloudShare:()=>this.shareCode(),
      nt:{needPerm:hasNative&&!perm,noNative:!hasNative,askPerm:()=>{try{Nt.requestNotifications();}catch(e){}},
        items:[['talep','Bekleyen talepler','Her gün 09:30 · onay bekleyen talep varsa'],['yarin','Yarınki vardiya listesi','Her gün 18:00 · lokasyon ve vardiyaya göre'],['izin','Yıllık izin','Çıkış / dönüş akşam 18:00 · yeni hak ediş 7 gün önce']].map(([k,l,sb])=>({label:l,sub:sb,box:nOn[k]!==false?A:'transparent',go:()=>this.toggleNotif(k)}))},
      backupExport:()=>this.backupExport(),backupImport:()=>this.jsonRef.current&&this.jsonRef.current.click(),
      appInfo:'Turno '+APP_VER+' · '+all.length+' personel kaydı · '+Object.keys(db.weeks).length+' hafta'
    };
  }
}
