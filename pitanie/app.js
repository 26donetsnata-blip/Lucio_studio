
"use strict";
const IMG={
 e1:"assets/exercises/01-heel-to-toe-rocking.jpg",
 e2:"assets/exercises/02-heel-drops.jpg",
 e3:"assets/exercises/03-butterfly.jpg",
 e4:"assets/exercises/04-japanese-vibration.jpg",
 e5:"assets/exercises/05-knees-to-chest.jpg"
};


/* ===== контент курса подключается отдельно (см. README) ===== */
let P={},CATS=[],KASHI=[],BERRIES=[],OILS=[],FISH=[],MEALS=[],RECIPE=null,
    WR=[],ALLERG=[],AIDS={},EX=[];
const CKEY="pitanie.content.v1", SKEY="pitanie.state.v1";
function applyContent(c){
  P=c.P||{};CATS=c.CATS||[];KASHI=c.KASHI||[];BERRIES=c.BERRIES||[];OILS=c.OILS||[];
  FISH=c.FISH||[];MEALS=c.MEALS||[];RECIPE=c.RECIPE||null;WR=c.WR||[];
  ALLERG=c.ALLERG||[];AIDS=c.AIDS||{};EX=c.EX||[];
}
function hasContent(){return MEALS.length>0&&Object.keys(P).length>0}
function loadContent(){
  try{const r=localStorage.getItem(CKEY);if(r){applyContent(JSON.parse(r));return true}}catch(e){}
  return false;
}
function saveContent(c){try{localStorage.setItem(CKEY,JSON.stringify(c))}catch(e){}}

/* ===== сохранение в браузере ===== */
function saveState(){
  try{localStorage.setItem(SKEY,JSON.stringify({pr:S.pr,log:S.log,step:S.step,src:S.src}))}catch(e){}
}
function loadState(){
  try{const r=JSON.parse(localStorage.getItem(SKEY));if(!r)return;
    if(r.pr)Object.assign(S.pr,r.pr);
    if(r.log)Object.assign(S.log,r.log);
    if(r.step)S.step=r.step; if(r.src)S.src=r.src;
  }catch(e){}
}
function exportAll(){
  const blob=new Blob([JSON.stringify({pr:S.pr,log:S.log},null,1)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="моё-питание-"+iso(today0())+".json";
  a.click();
}

/* ===== экран импорта контента курса ===== */
function scImport(){
  return{h:["Первый запуск","Подключите материалы","Один раз — дальше приложение работает само"],
  b:'<div class="card"><span style="font-size:13.5px;line-height:1.55">В приложении нет меню, рецептов и списка продуктов — это материалы платного курса, и они не выкладываются в интернет. Их нужно подключить файлом один раз, после чего они сохранятся в этом браузере.</span></div>'+
    '<label class="btn" style="display:block;text-align:center;cursor:pointer">Выбрать файл с материалами'+
    '<input type="file" accept="application/json,.json" id="imp" style="display:none"></label>'+
    '<div id="imperr"></div>'+
    '<div class="card flat"><span class="lb">Что внутри файла</span>'+
    '<span style="font-size:12.5px;color:var(--soft);line-height:1.5">Лист продуктов с порциями и калорийностью, меню по дням со способами, рецепты, водный режим и описания упражнений.</span></div>'+
    '<div class="card g"><span style="font-size:12.5px">Файл никуда не отправляется. Он читается прямо в браузере и остаётся на вашем устройстве.</span></div>'};
}
function wireImport(){
  const el=document.getElementById("imp");
  if(!el)return;
  el.addEventListener("change",ev=>{
    const f=ev.target.files&&ev.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      let c;
      try{c=JSON.parse(r.result)}catch(e){
        document.getElementById("imperr").innerHTML='<div class="card w"><span style="font-size:12.5px">Файл не читается как JSON. Проверьте, что выбран правильный файл.</span></div>';return}
      if(!c||!c.P||!c.MEALS){
        document.getElementById("imperr").innerHTML='<div class="card w"><span style="font-size:12.5px">В файле нет списка продуктов или меню. Похоже, это не тот файл.</span></div>';return}
      applyContent(c);saveContent(c);render();
    };
    r.readAsText(f);
  });
}
/* ===== ступени и текущий день программы ===== */
const STAGES=[["detox","Детокс",7],["express","Экспресс",14],
              ["marathon","Марафон",30],["balance","Баланс",33]];
const TOTAL=84;
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function today0(){const t=new Date();t.setHours(0,0,0,0);return t}
function prog(){
  const s=new Date(S.pr.start+"T00:00:00");
  if(isNaN(s.getTime()))return{ok:0,bad:1};
  const t=today0(),day=Math.round((t-s)/86400000)+1;
  if(day<1)return{ok:0,before:1-day,sdate:s};
  if(day>TOTAL)return{ok:0,after:day-TOTAL,day:day};
  let acc=0,st=STAGES[0],sd=day;
  for(let i=0;i<STAGES.length;i++){
    if(day<=acc+STAGES[i][2]){st=STAGES[i];sd=day-acc;break}
    acc+=STAGES[i][2];
  }
  return{ok:1,day,code:st[0],stage:st[1],stageDays:st[2],stageDay:sd,
         pct:Math.round(day/TOTAL*100),date:t};
}
function dlabel(d){
  const s=d.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long"});
  return s.charAt(0).toUpperCase()+s.slice(1);
}

/* ===== состояние ===== */
const S={step:1,tab:"day",calc:0,src:"meth",ex:null,sheet:null,
 pr:{name:"",age:48,sex:"ж",height:168,weight:81.2,goal:68,
  m:{waist:81,hips:104,chest:97,belly:92},mGoal:{waist:70},
  banned:[],disliked:[],bfWeek:"07:30",bfWeekend:"09:00",sleep:"23:00",gap:180,
  variant:"I",waterCoef:30,protKcal:120,start:iso(today0())},
 log:{water:0,ritual:{},eaten:{},ways:{bf:1,sn1:1,ln:2,sn2:1,dn:1},
  picks:{"bf-1":"blueberry","bf-2":"buckwheat","bf-3":"olive","sn1-1":"kefir",
   "ln-0":"cod","ln-1":"quinoa","ln-3":"flax","sn2-0":"apple","sn2-1":"tvorog12",
   "dn-0":"potato","dn-1":"carrot","dn-2":"chicken"},
  weight:78.4,m:{waist:78,hips:102,chest:96,belly:88}}};

/* ===== расчёты ===== */
const t2m=s=>{const a=s.split(":");return +a[0]*60+ +a[1]};
const m2t=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")};
function sched(we){
  const bf=t2m(we?S.pr.bfWeekend:S.pr.bfWeek),g=+S.pr.gap,L=t2m("19:00");
  const raw=[bf,bf+g,bf+2*g,bf+3*g,bf+4*g];
  const times=[raw[0],raw[1],raw[2],raw[3],Math.min(raw[4],L)];
  const gaps=times.map((t,i)=>i?t-times[i-1]:null);
  const sl=t2m(S.pr.sleep)||1440;
  return{times,gaps,clamped:raw[4]>L,ideal:m2t(L-4*g),
   late:sl<=t2m("23:00")?"20:30":"21:00",
   toSleep:(sl<=times[4]?sl+1440:sl)-times[4]};
}
function water(){const b=Math.round(S.pr.weight*S.pr.waterCoef),m=S.pr.sex==="ж"?2000:2500;
  return{v:Math.max(b,m),byW:b,min:m}}
const kg=id=>{const p=P[id];return((S.src==="usda"&&p.ku)?p.ku:p.k)/p.pg};
const cg=id=>P[id].cb/P[id].pg;
function sv(mid,i,sl){
  if(sl.zero)return{k:0,cb:0,name:sl.fix||"—",g:sl.g,u:sl.u};
  if(sl.prot)return{k:+S.pr.protKcal,cb:2,name:sl.fix,g:sl.g,u:sl.u};
  const id=S.log.picks[mid+"-"+i]||sl.allow[0],p=P[id];
  return{k:Math.round(kg(id)*sl.g),cb:Math.round(cg(id)*sl.g),name:p.n,g:sl.g,u:sl.u||p.u||"г",id};
}
const msl=m=>m.ways[S.log.ways[m.id]||1];
function mt(m){let k=0,cb=0;msl(m).forEach((s,i)=>{const v=sv(m.id,i,s);k+=v.k;cb+=v.cb});return{k,cb}}
function dt(){let k=0,cb=0;MEALS.forEach(m=>{const t=mt(m);k+=t.k;cb+=t.cb});
  WR.forEach(r=>{if(r.kcal&&S.log.ritual[r.id])k+=r.kcal});return{k,cb}}
function bad(){let o=[];S.pr.banned.forEach(a=>(AIDS[a]||[]).forEach(i=>o.push(i)));return o}
const allow=sl=>(sl.allow||[]).filter(i=>bad().indexOf(i)<0);
const bmi=w=>+(w/Math.pow(S.pr.height/100,2)).toFixed(1);
function gpct(){const a=S.pr.weight-S.pr.goal;if(a<=0)return 0;
  return Math.max(0,Math.min(100,Math.round((S.pr.weight-S.log.weight)/a*100)))}

const E=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SW='<svg viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>';
const CK='<svg viewBox="0 0 12 12"><path d="M2 6.2l2.8 2.8L10 3"/></svg>';
const cc=s=>'<div class="calc">'+E(s)+'</div>';
const bmiL=v=>v<18.5?"ниже нормы":v<25?"норма":v<30?"избыточный":"высокий";

/* ===== знакомство ===== */
function onb(){
  const st=S.step,s=sched(0),w=water();
  let h,b,btn="Дальше";
  if(st===1){
    h=["Шаг 1 из 4","Знакомство","Отвечать один раз — дальше не спросим"];
    b='<div class="field"><span class="lb">Как вас зовут</span>'+
      '<input data-in="name" value="'+E(S.pr.name)+'" placeholder="Имя"></div>'+
      '<div class="two"><div class="field"><span class="lb">Возраст</span>'+
      '<input data-in="age" type="number" value="'+S.pr.age+'"></div>'+
      '<div class="field"><span class="lb">Пол</span>'+
      '<div class="seg" style="padding:4px 3px"><button data-act="sex" data-v="ж" class="'+(S.pr.sex==="ж"?"on":"")+'">Женский</button>'+
      '<button data-act="sex" data-v="м" class="'+(S.pr.sex==="м"?"on":"")+'">М</button></div></div></div>'+
      '<div class="cat">Когда начинаете<i></i></div>'+
      '<div class="field"><span class="lb">Дата старта программы</span>'+
      '<input data-in="start" type="date" value="'+E(S.pr.start)+'"></div>'+
      (function(){const g=prog();
        if(g.bad)return '<div class="card w"><span style="font-size:12.5px">Укажите дату — от неё считается всё остальное.</span></div>';
        if(g.before)return '<div class="card g"><span style="font-size:12.5px">Программа начнётся через <b>'+g.before+'</b> дн. Приложение будет ждать и включится в первый день Детокса.</span></div>';
        if(g.after)return '<div class="card w"><span style="font-size:12.5px">С этой даты прошло '+g.day+' дней — программа на 84 дня уже закончилась бы. Проверьте дату.</span></div>';
        return '<div class="card"><div class="rowb"><span style="font-size:14px">Сегодня это</span>'+
          '<span class="nm">'+g.stage+' · день '+g.stageDay+'</span></div>'+
          '<div class="glass"><i style="width:'+g.pct+'%"></i></div>'+
          '<span class="hint">День '+g.day+' из 84 · пройдено '+g.pct+'%. Программа: Детокс 7 дней, Экспресс 14, Марафон 30, дальше Баланс.</span></div>';
      })()+
      '<div class="card flat"><div class="rowb"><span style="font-size:14px">Вариант Детокса</span></div>'+
      '<div class="seg"><button data-act="var" data-v="I" class="'+(S.pr.variant==="I"?"on":"")+'">I вариант</button>'+
      '<button data-act="var" data-v="II" class="'+(S.pr.variant==="II"?"on":"")+'">II вариант</button></div>'+
      '<span class="hint">В Детоксе два варианта программы целиком — выбор делается один раз, на старте.</span></div>'+
      '<div class="card g"><span style="font-size:12.5px">Возраст и пол нужны только для нормы воды и трактовки ИМТ. Всё остаётся в вашем браузере и никуда не отправляется.</span></div>';
  }
  if(st===2){
    h=["Шаг 2 из 4","Где вы сейчас","И куда хотите прийти"];
    const b1=bmi(S.pr.weight),b2=bmi(S.pr.goal);
    b='<div class="two"><div class="field"><span class="lb">Рост, см</span>'+
      '<input data-in="height" type="number" value="'+S.pr.height+'"></div>'+
      '<div class="field"><span class="lb">Вес, кг</span>'+
      '<input data-in="weight" type="number" step="0.1" value="'+S.pr.weight+'"></div></div>'+
      '<div class="card"><div class="rowb"><span style="font-size:14px">ИМТ сейчас</span>'+
      '<span class="nm">'+b1+' <span class="hint">'+bmiL(b1)+'</span></span></div>'+
      cc("ИМТ = "+S.pr.weight+" / ("+S.pr.height+"/100)² = "+b1)+'</div>'+
      '<div class="cat">Замеры<i></i></div>'+
      '<div class="two"><div class="field"><span class="lb">Талия</span><input data-in="m.waist" type="number" value="'+S.pr.m.waist+'"></div>'+
      '<div class="field"><span class="lb">Бёдра</span><input data-in="m.hips" type="number" value="'+S.pr.m.hips+'"></div></div>'+
      '<div class="two"><div class="field"><span class="lb">Грудь</span><input data-in="m.chest" type="number" value="'+S.pr.m.chest+'"></div>'+
      '<div class="field"><span class="lb">Живот</span><input data-in="m.belly" type="number" value="'+S.pr.m.belly+'"></div></div>'+
      '<div class="cat">Цель<i></i></div>'+
      '<div class="two"><div class="field"><span class="lb">Хочу весить</span><input data-in="goal" type="number" step="0.1" value="'+S.pr.goal+'"></div>'+
      '<div class="field"><span class="lb">Талия</span><input data-in="mGoal.waist" type="number" value="'+S.pr.mGoal.waist+'"></div></div>'+
      '<div class="card '+(b2<18.5?"w":"g")+'"><span style="font-size:12.5px">'+
      (b2<18.5?"Цель "+S.pr.goal+" кг даёт ИМТ "+b2+" — это ниже здорового диапазона. Решение ваше, но стоит обсудить с врачом."
              :"Цель "+S.pr.goal+" кг при росте "+S.pr.height+" см — ИМТ "+b2+", "+bmiL(b2)+". Путь: "+(S.pr.weight-S.pr.goal).toFixed(1)+" кг.")+
      '</span></div>';
  }
  if(st===3){
    h=["Шаг 3 из 4","Что вам нельзя","Эти продукты исчезнут из меню"];
    b='<div class="field"><span class="lb">Аллергия и непереносимость</span><div class="chips">'+
      ALLERG.map(a=>'<button class="chip '+(S.pr.banned.indexOf(a[0])>=0?"on":"")+'" data-act="ban" data-v="'+a[0]+'">'+a[1]+(S.pr.banned.indexOf(a[0])>=0?" ✕":"")+'</button>').join("")+
      '</div></div>'+
      (bad().length?'<div class="card w"><span style="font-size:12.5px">Убрано из всех предложений: <b>'+bad().map(i=>P[i].n).join(", ")+'</b>. Где они были в меню, приложение предложит замену из той же категории — по «Листу продуктов питания».</span></div>':
       '<div class="card g"><span style="font-size:12.5px">Ограничений нет. Если появятся — можно добавить в любой момент, меню пересоберётся.</span></div>')+
      '<div class="field"><span class="lb">Просто не люблю</span><div class="chips">'+
      ["liver","kefir","bulgur"].map(i=>'<button class="chip '+(S.pr.disliked.indexOf(i)>=0?"on":"")+'" data-act="dis" data-v="'+i+'">'+P[i].n+'</button>').join("")+
      '</div><span class="hint">Не запрещаем — показываем последними в списке замен.</span></div>';
  }
  if(st===4){
    h=["Шаг 4 из 4","Ваш день","Остальное посчитаем сами"];
    const nm=["Завтрак","Перекус","Обед","Перекус","Ужин"];
    b='<div class="two"><div class="field"><span class="lb">Завтрак, будни</span><input data-in="bfWeek" type="time" value="'+S.pr.bfWeek+'"></div>'+
      '<div class="field"><span class="lb">Выходные</span><input data-in="bfWeekend" type="time" value="'+S.pr.bfWeekend+'"></div></div>'+
      '<div class="two"><div class="field"><span class="lb">Сон</span><input data-in="sleep" type="time" value="'+S.pr.sleep+'"></div>'+
      '<div class="field"><span class="lb">Перерыв, мин</span><input data-in="gap" type="number" step="15" value="'+S.pr.gap+'"></div></div>'+
      '<div class="cat">Получается так<i></i></div><div class="card" style="gap:0;padding:6px 16px">'+
      s.times.map((t,i)=>'<div class="rowb" style="padding:9px 0;'+(i?"border-top:1px solid var(--rule)":"")+'">'+
        '<span class="tm" style="font-size:16px;width:54px">'+m2t(t)+'</span>'+
        '<span style="flex:1;font-size:14px">'+nm[i]+'</span>'+
        '<span class="hint">'+(s.gaps[i]?Math.floor(s.gaps[i]/60)+" ч"+(s.gaps[i]%60?" "+s.gaps[i]%60:""):"")+'</span></div>').join("")+
      '</div>'+cc("ужин = min(завтрак + 4×перерыв, 19:00)\n= min("+m2t(t2m(S.pr.bfWeek)+4*S.pr.gap)+", 19:00) = "+m2t(s.times[4]))+
      (s.clamped?'<div class="card w"><span style="font-size:12.5px">Ужин упёрся в правило «до 19:00», поэтому последний перерыв короче. Чтобы везде было по '+(S.pr.gap/60)+' ч — завтракайте в <b>'+s.ideal+'</b>.</span></div>'
                :'<div class="card g"><span style="font-size:12.5px">Все перерывы держатся, ужин в '+m2t(s.times[4])+' — до 19:00.</span></div>')+
      '<div class="card"><div class="rowb"><span style="font-size:14px">Норма воды</span><span class="nm">'+w.v+' мл</span></div>'+
      cc("max(вес × коэф, минимум по полу)\n= max("+S.pr.weight+" × "+S.pr.waterCoef+", "+w.min+") = "+w.v)+
      '<span class="hint">30 мл на кг — клиническое правило. В материалах курса нормы воды нет.</span></div>'+
      '<div class="card"><div class="rowb"><span style="font-size:14px">Поздний перекус</span><span class="nm">'+s.late+'</span></div>'+
      '<span class="hint">Считается от времени сна. До сна после ужина '+Math.floor(s.toSleep/60)+' ч — рекомендация не меньше 2–3.</span></div>';
    btn="Начать программу";
  }
  return{h,b,f:'<button class="btn" data-act="next">'+btn+'</button>'+
    (st>1?'<button class="btn ghost" data-act="back">Назад</button>':""),steps:st};
}

/* ===== день ===== */
function scDay(){
  const s=sched(0),d=dt();let o="";
  MEALS.forEach((m,mi)=>{
    const sl=msl(m),t=mt(m),eat=!!S.log.eaten[m.id],ways=Object.keys(m.ways).length>1;
    if(m.type==="snack"){
      o+='<div class="snack"><span class="bar"></span><span class="in">'+
        '<span class="rowb"><span class="sn">'+m.t+'</span><span class="tm">'+m2t(s.times[mi])+'</span></span>'+
        '<span style="font-size:13.5px">'+sl.map((x,i)=>{const v=sv(m.id,i,x);
          return E(v.name)+(v.g&&!x.zero?" "+v.g+" "+(v.u||"г"):"")}).join(" · ")+'</span>'+
        '<span class="hint">'+t.k+' ккал · '+t.cb+' г углеводов</span></span>'+
        '<button class="tick '+(eat?"on":"")+'" data-act="eat" data-v="'+m.id+'">'+(eat?CK:"")+'</button></div>';
      return;
    }
    o+='<div class="card '+(mi===2?"a":"")+'"'+(eat?' style="opacity:.7"':"")+'>'+
      '<div class="rowb"><span class="nm">'+m.t+'</span><span class="tm">'+m2t(s.times[mi])+'</span></div>'+
      (ways?'<div class="seg">'+Object.keys(m.ways).map(w=>'<button data-act="way" data-m="'+m.id+'" data-v="'+w+'" class="'+((S.log.ways[m.id]||1)==w?"on":"")+'">Способ '+w+'</button>').join("")+'</div>':"")+
      '<div class="slots">'+sl.map((x,i)=>{const v=sv(m.id,i,x),can=!x.zero&&!x.prot;
        return '<button class="slot"'+(can?' data-act="pick" data-m="'+m.id+'" data-i="'+i+'"':" disabled")+'>'+
          '<span class="l"><span class="k">'+E(x.k)+(x.recipe?" · рецепт":"")+'</span>'+
          '<span class="p">'+E(v.name)+(can?SW:"")+'</span></span>'+
          '<span class="g">'+(x.zero&&!v.g?"—":v.g+" "+(v.u||"г"))+'</span></button>'}).join("")+'</div>'+
      cc(sl.map((x,i)=>{const v=sv(m.id,i,x);
        if(x.zero)return x.k+": не считается";
        if(x.prot)return x.k+": "+v.k+" ккал (порция по упаковке)";
        return v.name+": "+v.g+" г × "+kg(v.id).toFixed(2)+" = "+v.k+" ккал"}).join("\n")+"\nитого "+t.k+" ккал")+
      '<div class="mf"><span class="kc">'+t.k+' ккал · '+t.cb+' г углеводов</span>'+
      '<button class="tick '+(eat?"on":"")+'" data-act="eat" data-v="'+m.id+'">'+(eat?CK:"")+'</button></div></div>';
  });
  o+='<div class="card g"><div class="rowb"><span style="font-size:14px">За день</span>'+
    '<span class="nm">'+d.k+' ккал · '+d.cb+' г угл.</span></div>'+
    '<span class="hint">Медовая вода добавляет 27 ккал — она считается здесь, а не «в воде».</span></div>';
  const g=prog();
  if(!g.ok){
    let msg;
    if(g.before)msg='Программа начнётся через <b>'+g.before+'</b> дн. Пока можно заполнить профиль, настроить расписание и посмотреть справочник.';
    else if(g.after)msg='84 дня программы позади. Чтобы начать заново, поменяйте дату старта в профиле.';
    else msg='Укажите дату старта — от неё считается номер дня и ступень.';
    return{h:["Программа","Ещё не начали","Меню появится в первый день"],
      b:'<div class="card w"><span style="font-size:13px">'+msg+'</span></div>'+
        '<div class="card"><div class="rowb"><span style="font-size:14px">Ваше расписание</span></div>'+
        s.times.map((x,i)=>'<div class="rowb"><span class="tm" style="width:54px">'+m2t(x)+'</span>'+
          '<span style="flex:1;font-size:13.5px">'+["Завтрак","Перекус","Обед","Перекус","Ужин"][i]+'</span></div>').join("")+
        '</div>'};
  }
  const vr=g.code==="detox"?" · "+S.pr.variant+" вариант":"";
  return{h:[g.stage+vr+" · день "+g.stageDay+" из "+g.stageDays, dlabel(g.date),
    "День "+g.day+" из 84 · пройдено "+g.pct+"% · ужин до 19:00"],b:o};
}

/* ===== вода ===== */
function scWater(){
  const w=water(),s=sched(0);
  const rit=WR.reduce((a,r)=>a+(S.log.ritual[r.id]?r.ml:0),0),tot=S.log.water+rit;
  const pct=Math.min(100,Math.round(tot/w.v*100));
  return{h:["Сегодня","Вода","Норма "+w.v+" мл — "+S.pr.waterCoef+" мл на ваши "+S.pr.weight+" кг"],
  b:'<div class="card" style="gap:4px"><div class="ring">'+
    '<svg viewBox="0 0 186 186"><circle cx="93" cy="93" r="80" fill="none" stroke="#E8DFCF" stroke-width="13"/>'+
    '<circle cx="93" cy="93" r="80" fill="none" stroke="#8FA58F" stroke-width="13" stroke-linecap="round" '+
    'stroke-dasharray="502.6" stroke-dashoffset="'+(502.6*(1-pct/100)).toFixed(1)+'"/></svg>'+
    '<span class="in"><span class="v">'+tot+'</span><span class="u">мл выпито</span>'+
    '<span class="r">'+(tot>=w.v?"норма закрыта":"осталось "+(w.v-tot)+" из "+w.v)+'</span></span></div>'+
    cc("норма = max("+S.pr.weight+" × "+S.pr.waterCoef+", "+w.min+") = "+w.v+" мл\nвыпито = свободная "+S.log.water+" + режим "+rit+" = "+tot)+'</div>'+
    '<div class="quick"><button data-act="w" data-v="160">+160</button><button data-act="w" data-v="250">+250</button>'+
    '<button data-act="w" data-v="320">+320</button><button data-act="w" data-v="-160">−160</button></div>'+
    '<div class="cat">Водный режим · 1120 мл из нормы<i></i></div>'+
    WR.map(r=>{const on=!!S.log.ritual[r.id],tm=(r.at!==undefined?" · "+m2t(s.times[r.at]-15):"");
      return '<div class="card '+(on?"g":"")+'" style="padding:11px 14px">'+
      '<div class="rowb"><button class="tick '+(on?"on":"")+'" data-act="rit" data-v="'+r.id+'" style="width:24px;height:24px;border-radius:8px">'+(on?CK:"")+'</button>'+
      '<span style="flex:1"><b style="font-size:13.5px">'+r.n+'</b>'+
      '<div style="font-size:11.5px;color:var(--faint)">'+r.w+tm+(r.kcal?" · "+r.kcal+" ккал":"")+'</div></span>'+
      '<span class="tm">'+r.ml+'</span></div></div>'}).join("")+
    '<div class="card w"><span style="font-size:12.5px">Время пунктов взято из вашего расписания — за 15 минут до приёма пищи. Поменяете завтрак, сдвинутся и они.</span></div>'+
    '<div class="field"><span class="lb">Коэффициент, мл на кг</span><input data-in="waterCoef" type="number" value="'+S.pr.waterCoef+'">'+
    '<span class="hint">Правило 30–35 мл/кг. Куратор может назвать своё.</span></div>'};
}

/* ===== продукты ===== */
function scProd(){
  const b=bad();
  let o='<div class="seg"><button data-act="src" data-v="meth" class="'+(S.src==="meth"?"on":"")+'">По методичке</button>'+
    '<button data-act="src" data-v="usda" class="'+(S.src==="usda"?"on":"")+'">По USDA</button></div>';
  CATS.forEach(c=>{
    const ids=Object.keys(P).filter(i=>P[i].c===c&&b.indexOf(i)<0);
    if(!ids.length)return;
    o+='<div class="cat">'+c+'<i></i></div>';
    ids.forEach(i=>{const p=P[i],main=(S.src==="usda"&&p.ku)?p.ku:p.k,alt=(S.src==="meth"&&p.ku)?p.ku:0;
      o+='<button class="pi" data-act="info" data-v="'+i+'"><span class="pn">'+E(p.n)+'</span>'+
        '<span class="pp">'+p.pg+' '+(p.u||"г")+'</span><span class="pk">'+main+(alt?'<s>'+alt+' USDA</s>':"")+'</span></button>'});
  });
  if(b.length)o+='<div class="card w" style="margin-top:12px"><span style="font-size:12.5px">Скрыто по вашим ограничениям: <b>'+b.map(i=>P[i].n).join(", ")+'</b></span></div>';
  o+='<div class="card" style="margin-top:12px"><span style="font-size:12.5px">Вторая цифра показывается только там, где методичка и USDA расходятся: белая рыба ≈ −18%, печень −25…−45%.</span></div>';
  return{h:["Справочник","Продукты","Порции по «Листу продуктов питания»"],b:o};
}

/* ===== результаты ===== */
function scRes(){
  const pct=gpct(),lost=(S.pr.weight-S.log.weight).toFixed(1),left=(S.log.weight-S.pr.goal).toFixed(1);
  const M=[["waist","Талия"],["hips","Бёдра"],["chest","Грудь"],["belly","Живот"]];
  const g=prog();
  return{h:[g.ok?g.stage+" · день "+g.stageDay:"Программа не начата","Результаты","Взвешивание утром натощак"],
  b:'<div class="kpi"><div class="kb"><span class="kl">Сейчас</span><span class="kv">'+S.log.weight+'</span></div>'+
    '<div class="kb g"><span class="kl">Ушло</span><span class="kv">−'+lost+'</span></div>'+
    '<div class="kb"><span class="kl">До цели</span><span class="kv">'+left+'</span></div></div>'+
    '<div class="field"><span class="lb">Вес сегодня, кг</span><input data-in="log.weight" type="number" step="0.1" value="'+S.log.weight+'">'+
    '<span class="hint">Поменяйте — пересчитается путь, ИМТ и норма воды.</span></div>'+
    '<div class="card"><div class="rowb"><span class="lb">Путь к цели</span><span class="hint">ИМТ '+bmi(S.log.weight)+' → '+bmi(S.pr.goal)+'</span></div>'+
    '<div class="track"><span class="fl" style="width:'+pct+'%"></span><span class="dt" style="left:'+pct+'%"></span>'+
    '<span class="l2" style="left:0"><b>'+S.pr.weight+'</b>старт</span>'+
    '<span class="l2" style="left:100%"><b>'+S.pr.goal+'</b>цель</span></div>'+
    '<div class="rowb" style="border-top:1px solid var(--rule);padding-top:9px">'+
    '<span class="nm" style="font-size:16px">Осталось '+left+' кг</span>'+
    '<span style="font-size:12px;color:var(--sage);font-weight:600">пройдено '+pct+'%</span></div>'+
    cc("пройдено = (старт − сейчас) / (старт − цель)\n= ("+S.pr.weight+" − "+S.log.weight+") / ("+S.pr.weight+" − "+S.pr.goal+") = "+pct+"%")+'</div>'+
    '<div class="cat">Замеры<i></i></div><div class="card" style="gap:0;padding:6px 16px">'+
    M.map((x,i)=>{const st=S.pr.m[x[0]],nw=S.log.m[x[0]],g=S.pr.mGoal[x[0]];
      return '<div class="rowb" style="padding:10px 0;'+(i?"border-top:1px solid var(--rule)":"")+'">'+
      '<span style="flex:1;font-size:14px">'+x[1]+'</span><span class="tm" style="font-size:14px">'+nw+' см</span>'+
      '<span style="font-size:12px;color:var(--sage);width:32px;text-align:right">−'+(st-nw)+'</span>'+
      '<span class="hint" style="width:54px;text-align:right">'+(g?"цель "+g:"")+'</span></div>'}).join("")+'</div>'+
    '<button class="btn ghost" data-act="export">Сохранить мои данные файлом</button>'+
    '<div class="card w"><span style="font-size:12.5px"><b>Метод «зубцов»</b> включится на Балансе: набор 2000 ккал до +1,5 кг, максимум 7 дней, затем снижение 1200 ккал, пока набранное не уйдёт. Приложение будет считать дни само.</span></div>'};
}

/* ===== практики ===== */
function scPr(){
  if(!S.ex){
    return{h:["Практики · движение","Лимфатическая зарядка","Лимфа движется снизу вверх, а насоса у неё нет"],
    b:'<div class="card" style="padding:12px 16px"><div class="rowb"><span class="lb">На этой неделе</span><span class="tm">2 из 3</span></div>'+
      '<div class="glass" style="margin-top:8px"><i style="width:66%"></i></div></div>'+
      '<div class="exgrid">'+EX.map((e,i)=>'<button class="excard'+(i===4?" wide":"")+'" data-act="ex" data-v="'+e.id+'">'+
        '<span class="im"><img src="'+IMG[e.img]+'" alt="'+E(e.n)+'"></span>'+
        (e.flag?'<span class="flag"><svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg></span>':"")+
        '<span class="cp"><b>'+E(e.n)+'</b><span>'+E(e.p)+'</span></span>'+
      '</button>').join("")+'</div>'+
      '<div class="card w"><span style="font-size:12.5px">Значок с восклицательным знаком означает противопоказание — видно до того, как вы начали.</span></div>'+
      '<div class="card"><span style="font-size:12.5px">Второй комплекс — моторика ЖКТ, 8 упражнений. И процедуры: ванны и обёртывания.</span></div>'};
  }
  const e=EX.find(x=>x.id===S.ex);
  return{h:["Лимфатическая зарядка · "+(EX.indexOf(e)+1)+" из 5",e.n,e.d],
  b:'<button class="btn ghost" data-act="exback">← Все упражнения</button>'+
    '<div class="exbig"><img src="'+IMG[e.img]+'" alt="'+E(e.n)+'"></div>'+
    '<div class="meta">'+e.m.map(x=>'<div><span class="ml">'+x[0]+'</span><span class="mv">'+x[1]+'</span></div>').join("")+'</div>'+
    '<div class="cat">Как делать<i></i></div><div class="howto">'+
    e.s.map((x,i)=>'<div class="hr"><b>'+(i+1)+'</b><span>'+E(x)+'</span></div>').join("")+'</div>'+
    (e.w?'<div class="warn"><b>Осторожно.</b> '+E(e.w)+'</div>':"")+
    '<div class="card"><span style="font-size:12.5px">Текст — из «Зарядки для лимфатической системы», 8 урок. Ничего не додумано.</span></div>'};
}

/* ===== рендер ===== */
const NAV=[["day","День",'<path d="M4 7h16M4 12h16M4 17h10"/>'],
 ["water","Вода",'<path d="M12 3s6 6.5 6 10.5A6 6 0 016 13.5C6 9.5 12 3 12 3z"/>'],
 ["prod","Продукты",'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'],
 ["res","Результаты",'<path d="M4 17l5-6 4 3 7-8"/>'],
 ["pr","Практики",'<path d="M12 20s-7-4.5-7-9a4 4 0 017-2.5A4 4 0 0119 11c0 4.5-7 9-7 9z"/>']];

function render(){
  document.body.classList.toggle("sc",!!S.calc);
  let v,steps=null,f="";
  if(!hasContent()){
    v=scImport();
    document.getElementById("head").innerHTML='<div class="top"><div class="tt">'+
      '<div class="kick">'+E(v.h[0])+'</div><h1>'+E(v.h[1])+'</h1>'+
      '<div class="sub">'+E(v.h[2])+'</div></div></div>';
    document.getElementById("steps").innerHTML="";
    document.getElementById("body").innerHTML=v.b;
    document.getElementById("foot").innerHTML="";
    const n0=document.getElementById("nav");n0.innerHTML="";n0.style.display="none";
    wireImport();
    return;
  }
  if(S.step<=4){const o=onb();v={h:o.h,b:o.b};steps=o.steps;f=o.f}
  else if(S.tab==="day")v=scDay();
  else if(S.tab==="water")v=scWater();
  else if(S.tab==="prod")v=scProd();
  else if(S.tab==="res")v=scRes();
  else v=scPr();
  document.getElementById("head").innerHTML='<div class="top"><div class="tt">'+
    '<div class="kick">'+E(v.h[0])+'</div><h1>'+E(v.h[1])+'</h1>'+
    '<div class="sub">'+E(v.h[2]||"")+'</div></div>'+
    '<button class="qbtn '+(S.calc?"on":"")+'" data-act="calc" title="Показать расчёт">?</button></div>';
  document.getElementById("steps").innerHTML=steps?
    '<div class="steps">'+[1,2,3,4].map(i=>'<i class="st '+(i<=steps?"on":"")+'"></i>').join("")+'</div>':"";
  document.getElementById("body").innerHTML=v.b;
  document.getElementById("foot").innerHTML=f;
  const n=document.getElementById("nav");
  n.innerHTML=S.step<=4?"":NAV.map(x=>'<button data-act="tab" data-v="'+x[0]+'" class="'+(S.tab===x[0]?"on":"")+'">'+
    '<span class="ic"><svg viewBox="0 0 24 24">'+x[2]+'</svg></span>'+x[1]+'</button>').join("");
  n.style.display=S.step<=4?"none":"grid";
  saveState();
}

/* ===== шторки ===== */
function openPick(mid,i){
  const m=MEALS.find(x=>x.id===mid),sl=msl(m)[i],ids=allow(sl),cur=S.log.picks[mid+"-"+i];
  const dis=id=>S.pr.disliked.indexOf(id)>=0;
  const srt=ids.slice().sort((a,b)=>(dis(a)?1:0)-(dis(b)?1:0));
  S.sheet={mid,i};
  document.getElementById("sh").innerHTML='<div class="kick">'+E(m.t)+' · замена</div><h2>'+E(sl.k)+'</h2>'+
    '<div class="sub">'+sl.g+' '+(sl.u||"г")+'</div>';
  document.getElementById("sb").innerHTML=
    (sl.q?'<div class="quote">«'+E(sl.q)+'»<div style="font-style:normal;font-size:11px;color:var(--faint);margin-top:6px;font-family:var(--sans)">Меню ступени Детокс</div></div>':"")+
    (sl.recipe?'<button class="btn ghost" data-act="recipe">Посмотреть рецепт</button>':"")+
    (srt.length?srt.map(id=>{const p=P[id];
      return '<button class="pi" data-act="set" data-v="'+id+'"><span class="pn">'+E(p.n)+
        (dis(id)?' <span class="hint">не любите</span>':"")+(id===cur?" ✓":"")+'</span>'+
        '<span class="pp">'+p.pg+' '+(p.u||"г")+'</span><span class="pk">'+Math.round(kg(id)*sl.g)+'</span></button>'}).join("")
     :'<div class="card w"><span style="font-size:12.5px">В этом слоте не осталось разрешённых продуктов из-за ваших ограничений. Приложение не подставит запрещённое — подберите замену из соседней категории.</span></div>')+
    '<div class="card"><span style="font-size:12px;color:var(--soft)">Ккал считаются на '+sl.g+' '+(sl.u||"г")+', а не на порцию из листа. Поэтому цифры отличаются от справочника.</span></div>';
  document.getElementById("sheet").classList.add("on");
}
function openRecipe(){
  const R=RECIPE;
  document.getElementById("sh").innerHTML='<div class="kick">Обед · способ 2</div><h2>'+E(R.t)+'</h2>'+
    '<div class="sub">'+R.out+' г в готовом виде</div>';
  document.getElementById("sb").innerHTML=
    '<div class="warn"><b>'+R.out+' г — это готовой рыбы.</b> Сырой понадобится около 200 г: при запекании уходит примерно четверть веса.</div>'+
    '<div class="meta"><div><span class="ml">Готовить</span><span class="mv">'+R.time+' мин</span></div>'+
    '<div><span class="ml">Духовка</span><span class="mv">'+R.temp+'</span></div>'+
    '<div><span class="ml">Выход</span><span class="mv">'+R.out+' г</span></div></div>'+
    '<div class="cat">Ингредиенты<i></i></div>'+
    R.ing.map(x=>'<div class="pi" style="cursor:default"><span class="pn">'+E(x[0])+'</span><span class="pk">'+E(x[1])+'</span></div>').join("")+
    '<div class="cat">Приготовление<i></i></div><div class="howto">'+
    R.steps.map((x,i)=>'<div class="hr"><b>'+(i+1)+'</b><span>'+E(x)+'</span></div>').join("")+'</div>'+
    '<div class="card"><b style="font-size:13px">Если духовки нет</b><span style="font-size:12.5px;color:var(--soft)">'+E(R.noOven)+'</span></div>'+
    '<div class="card w"><span style="font-size:12.5px">Жарить нельзя: масло в программе считается отдельной порцией и указано в меню там, где положено.</span></div>';
  document.getElementById("sheet").classList.add("on");
}
function openInfo(id){
  const p=P[id];
  document.getElementById("sh").innerHTML='<div class="kick">'+E(p.c)+'</div><h2>'+E(p.n)+'</h2>'+
    '<div class="sub">Порция '+p.pg+' '+(p.u||"г")+'</div>';
  document.getElementById("sb").innerHTML=
    '<div class="kpi"><div class="kb"><span class="kl">По методичке</span><span class="kv">'+p.k+'</span></div>'+
    (p.ku?'<div class="kb" style="background:var(--terraL)"><span class="kl">По USDA</span><span class="kv" style="color:#8A4A2C">'+p.ku+'</span></div>':"")+
    '<div class="kb"><span class="kl">Углеводы</span><span class="kv">'+p.cb+'</span></div></div>'+
    (p.ku?'<div class="card w"><span style="font-size:12.5px">Расхождение <b>'+Math.round((p.ku-p.k)/p.ku*100)+'%</b>. В системе обменных порций важна равнозначность порций, а не абсолютная точность — но знать полезно.</span></div>'
         :'<div class="card g"><span style="font-size:12.5px">С USDA сходится, расхождения нет.</span></div>')+
    (p.note?'<div class="card"><span style="font-size:12.5px">'+E(p.note)+'</span></div>':"")+
    '<div class="card"><span style="font-size:12.5px">На 1 г: <b>'+(p.k/p.pg).toFixed(2)+' ккал</b>, '+(p.cb/p.pg).toFixed(2)+' г углеводов. Из этого считаются граммовки в меню.</span></div>';
  document.getElementById("sheet").classList.add("on");
}
function close(){document.getElementById("sheet").classList.remove("on");S.sheet=null;render()}
function fix(){const b=bad();
  MEALS.forEach(m=>Object.keys(m.ways).forEach(w=>m.ways[w].forEach((sl,i)=>{
    const k=m.id+"-"+i,c=S.log.picks[k];
    if(c&&b.indexOf(c)>=0){const ok=allow(sl);if(ok.length)S.log.picks[k]=ok[0];else delete S.log.picks[k]}})))}

document.addEventListener("click",e=>{
  const t=e.target.closest("[data-act]");if(!t)return;
  const a=t.dataset.act,v=t.dataset.v;
  if(a==="calc")S.calc=!S.calc;
  else if(a==="export"){exportAll();return}
  else if(a==="next"){if(S.step<4)S.step++;else{S.step=5;S.tab="day"}}
  else if(a==="back"){if(S.step>1)S.step--}
  else if(a==="sex")S.pr.sex=v;
  else if(a==="var")S.pr.variant=v;
  else if(a==="ban"){const i=S.pr.banned.indexOf(v);i<0?S.pr.banned.push(v):S.pr.banned.splice(i,1);fix()}
  else if(a==="dis"){const i=S.pr.disliked.indexOf(v);i<0?S.pr.disliked.push(v):S.pr.disliked.splice(i,1)}
  else if(a==="tab"){S.tab=v;if(v!=="pr")S.ex=null}
  else if(a==="ex")S.ex=v;
  else if(a==="exback")S.ex=null;
  else if(a==="way")S.log.ways[t.dataset.m]=+v;
  else if(a==="eat")S.log.eaten[v]=!S.log.eaten[v];
  else if(a==="w")S.log.water=Math.max(0,S.log.water+ +v);
  else if(a==="rit")S.log.ritual[v]=!S.log.ritual[v];
  else if(a==="src")S.src=v;
  else if(a==="pick"){openPick(t.dataset.m,+t.dataset.i);return}
  else if(a==="recipe"){openRecipe();return}
  else if(a==="info"){openInfo(v);return}
  else if(a==="set"){S.log.picks[S.sheet.mid+"-"+S.sheet.i]=v;close();return}
  else if(a==="close"){close();return}
  render();
});
document.addEventListener("change",e=>{
  const el=e.target.closest("[data-in]");if(!el)return;
  const p=el.dataset.in,val=el.type==="number"?(parseFloat(el.value)||0):el.value;
  if(p.indexOf("log.")===0){const k=p.slice(4);if(k==="weight")S.log.weight=val;else S.log.m[k]=val}
  else if(p.indexOf(".")>0){const x=p.split(".");S.pr[x[0]][x[1]]=val}
  else S.pr[p]=val;
  render();
});
loadContent();
loadState();
render();
