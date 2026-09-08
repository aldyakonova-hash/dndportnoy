(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('is-calm');
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
const cards=JSON.parse($('#jd-cards').textContent);
const btn=(text,fn)=>{const b=el('button','w4-button',text);b.type='button';b.onclick=fn;return b};
const profiles={
 sasha:['img/portraits/sandria-3.jpg',17,13,'100,151,255','Свет в навершии посоха'],
 samik:['img/characters/lucius-20260909/scene-01.webp',26,43,'255,169,72','Фонарь в трактире'],
 vitya:['img/characters/dwarf/dwarf-scene-03-music.webp',43,44,'216,175,108','Тёплый отблеск на инструменте'],
 dee:['img/portraits/fronki-2.jpg',80,51,'255,166,74','Лампа у стола'],
 georg:['img/portraits/georgos-3.jpg',13,75,'183,207,235','Разряд вдоль клинка'],
 joe:['img/portraits/joe-2.jpg',10,9,'255,178,82','Фонарь у музыканта'],
 zug:['img/zug-sheet.jpg',16,69,'169,144,227','Магия в ладони'],
 tas:['img/characters/tas/tas-scene-05-melting-plate.webp',61,52,'255,121,48','Жар металла'],
 vergely:['w4-vergely-live.png',82,20,'255,167,70','Фонарь · эскиз иллюстрации'],
 trar:['w4-trar-live.png',80,16,'255,167,70','Фонарь · эскиз иллюстрации'],
 eleonora:['w4-eleonora-live.png',84,12,'255,167,70','Фонарь · эскиз иллюстрации'],
 shmyg:['img/characters/shmyg/shmyg-scene-04-infernal-letters.webp',94,52,'255,178,93','Свет над письмом']
};
let mapPromise;
const rooms={church_port:[230,85,360,360],catacombs:[350,400,310,295],catacombs_cells:[260,730,520,285],catacombs_hall:[710,355,470,280],catacombs_dragon:[1050,620,460,410]};
async function map(){
 const root=$('#r-karta');if(root.hidden||!window.__karta||$('.w4-map-tabs',root))return;
 const tabs=el('div','w4-map-tabs');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Слой карты');
 const city=btn('I · Флан',()=>change(false)), under=btn('II · Под городом',()=>change(true));city.setAttribute('aria-pressed','true');under.setAttribute('aria-pressed','false');tabs.append(city,under);
 const shell=$('#shell',root);shell.before(tabs);
 const underList=el('div','w4-under-list');underList.hidden=true;$('#list',root).after(underList);const names=['Церковь портового квартала','Спуск в катакомбы','Комната с клетками','Освещённый зал','Тупик с драконом'];Object.keys(rooms).forEach((id,i)=>underList.append(btn(names[i],()=>$('.w4-room[data-room='+id+']',root)?.dispatchEvent(new MouseEvent('click',{bubbles:true})))));
 const sheet=el('div','w4-dungeon');sheet.hidden=true;$('#canvas',root).append(sheet);
 const note=el('p','w4-map-note','Тот же город, другой лист. Нажмите на помещение, чтобы приблизиться и прочитать его историю.');note.hidden=true;tabs.after(note);
 async function change(on){
  if(on&&!sheet.firstChild){
   under.disabled=true;under.textContent='Разворачиваем лист…';
   try{mapPromise??=fetch('assets/dungeon-engraving-v4.svg').then(r=>{if(!r.ok)throw Error('map');return r.text()});sheet.innerHTML=await mapPromise;
    $$('.w4-room',sheet).forEach(g=>{const go=()=>{const b=rooms[g.dataset.room];$$('.w4-room',sheet).forEach(n=>n.classList.toggle('is-selected',n===g));window.__karta.openUnder(g.dataset.room,{x:b[0],y:b[1],w:b[2],h:b[3]})};g.onclick=go;g.addEventListener('w4:room',go);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
   }catch(e){note.hidden=false;note.textContent='Не удалось открыть лист. Попробуйте ещё раз.';mapPromise=null;return}finally{under.disabled=false;under.textContent='II · Под городом'}
  }
  root.classList.toggle('w4-under',on);underList.hidden=!on;sheet.hidden=!on;note.hidden=!on;city.setAttribute('aria-pressed',String(!on));under.setAttribute('aria-pressed',String(on));window.__karta.fit();
 }
}

function liveFigure(id,name){
 const p=profiles[id];if(!p)return null;
 const f=el('figure','w4-live');f.dataset.hero=id;f.style.setProperty('--lx',p[1]+'%');f.style.setProperty('--ly',p[2]+'%');f.style.setProperty('--light',p[3]);
 const scene=el('div','w4-live-scene');const img=el('img');img.src='assets/'+p[0];img.alt=name+' — '+p[4];img.loading='lazy';scene.append(img,el('i','w4-live-halo'),el('i','w4-live-core'));f.append(scene);
 const cap=el('figcaption');cap.append(el('span','',p[4]));
 const toggle=btn('Погасить свет',()=>{f.classList.toggle('is-dark');toggle.textContent=f.classList.contains('is-dark')?'Зажечь свет':'Погасить свет';toggle.setAttribute('aria-pressed',String(!f.classList.contains('is-dark')))});toggle.setAttribute('aria-pressed','true');cap.append(toggle);f.append(cap);
 scene.onpointermove=e=>{if(calm())return;const r=scene.getBoundingClientRect();f.style.setProperty('--reflection',(e.clientX-r.left)/r.width*100+'%')};
 return f;
}
addEventListener('w4:dossier',e=>{
 const {id,name}=e.detail,p=profiles[id];if(!p)return;
 requestAnimationFrame(()=>{
 const sheet=$('#r-lica #dosSheet');if(!sheet||$('.w4-live',sheet))return;
 const f=liveFigure(id,name);const heading=el('div','w4-live-heading');heading.append(el('span','','Живая иллюстрация'));
 const select=el('select');select.setAttribute('aria-label','Живая иллюстрация персонажа');cards.filter(c=>profiles[c.id]).forEach(c=>{const o=el('option','',c.name);o.value=c.id;o.selected=c.id===id;select.append(o)});select.onchange=()=>{window.__lica.open(cards.findIndex(c=>c.id===select.value));setTimeout(()=>$('.w4-dossier-art')?.scrollIntoView({block:'start'}),80)};heading.append(select);
 const section=el('section','w4-dossier-art');section.append(heading,f);const jump=btn('К живой иллюстрации ↓',()=>section.scrollIntoView({block:'start',behavior:calm()?'instant':'smooth'}));jump.classList.add('w4-live-jump');$('.l-dos__top',sheet)?.append(jump);const body=$('.l-dos__body',sheet);if(body)body.prepend(section);else sheet.append(section);
 });
});

function roman(n){let result='';for(const [v,t] of [[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']])while(n>=v){result+=t;n-=v}return result}
function deck(){
 const root=$('#r-lica');if(root.hidden||!window.__lica||root.dataset.w4Deck)return;root.dataset.w4Deck='1';
 const hint=$('.l-tray__hint',root);if(hint)hint.textContent='Выберите до трёх карт. Четвёртая вернёт первую в колоду. Нажмите карту, чтобы перевернуть; досье открывается кнопкой под ней.';
 const fan=$('#fan',root), row=$('#trayRow',root);if(!fan||!row)return;
 const adjust=()=>{const all=$$('.l-fan__c',fan),idx=all.findIndex(n=>n.getAttribute('aria-selected')==='true');all.forEach((n,i)=>n.style.setProperty('--w4-space',idx<0||i===idx?'0px':(i<idx?-7:7)+'px'))};
 new MutationObserver(adjust).observe(fan,{attributes:true,subtree:true,attributeFilter:['aria-selected'],childList:true});adjust();
 const enhance=()=>{$$('.original-card-unit',row).forEach(unit=>{if(!$('.l-open',unit))unit.remove()});$$('.l-open',row).forEach(card=>{
  if(card.dataset.w4)return;card.dataset.w4='1';const c=cards[+card.dataset.i];if(!c)return;
  card.classList.add('original-card');card.setAttribute('aria-label','Перевернуть карту: '+c.name);card.setAttribute('aria-pressed','false');
  const front=el('span','original-face original-front'),portrait=$('.l-open__ph',card);
  if(portrait)front.append(portrait);card.replaceChildren();
  const title=el('span','original-card-title',c.name);title.append(el('small','',roman(+card.dataset.i+1)+' · '+(c.line||c.tag||'')));front.append(el('span','original-foil'),title);
  const inner=el('span','original-card-inner'),back=el('span','original-face original-back');
  back.append(el('span','sigil','✧'),el('b','',c.id==='dee'?'Чужим голосом.':c.name),el('p','',c.id==='dee'?'Птица, которая не говорит, а повторяет.\n\nСвоим голосом — редко, и это слышно всем.':(c.lede||c.line||c.tag)),el('span','original-foil'));
  inner.append(front,back);card.append(inner);back.setAttribute('aria-hidden','true');
  const unit=el('div','original-card-unit'),actions=el('div','original-card-actions');card.before(unit);unit.append(card,actions);
  const flip=()=>{const on=card.getAttribute('aria-pressed')!=='true';card.setAttribute('aria-pressed',String(on));front.setAttribute('aria-hidden',String(on));back.setAttribute('aria-hidden',String(!on));};
  const dossier=btn('Открыть досье',()=>window.__lica.open(+card.dataset.i));actions.append(dossier);
  card.addEventListener('click',e=>{e.stopPropagation();flip()});
  card.addEventListener('pointermove',e=>{if(calm()||e.pointerType==='touch')return;const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;card.style.setProperty('--rx',(-y*16)+'deg');card.style.setProperty('--ry',(x*24)+'deg');card.style.setProperty('--shine',(50+x*70)+'%')});
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','-12deg');card.style.setProperty('--shine','50%')});
 });};new MutationObserver(enhance).observe(row,{childList:true,subtree:true});enhance();
 const intro=el('div','w4-deck-note');intro.append(el('span','','У каждой карты — свой оборот. Живой свет — внутри досье.'));intro.append(btn('Открыть живую иллюстрацию',()=>{window.__lica.open(3);setTimeout(()=>$('.w4-dossier-art')?.scrollIntoView({block:'start',behavior:calm()?'instant':'smooth'}),120)}));row.parentElement.before(intro);
}

function panelDepth(){window.__motionPanels?.()}

function water(){const root=$('#r-omut');if(root.hidden)return;const well=$('.o-well',root);if(!well||$('.w4-water',well))return;const surface=el('div','w4-water');surface.setAttribute('aria-hidden','true');well.append(surface);const trigger=btn('Пробудить связи',()=>window.__omut.select('pc_fronki'));trigger.classList.add('w4-water-button');well.append(trigger);}
addEventListener('wow:memory',e=>{const surface=$('.w4-water');if(!surface||calm())return;surface.replaceChildren();const {x,y,neighbors=[]}=e.detail;
 for(let i=0;i<3;i++){const ring=el('i','w4-ring');ring.style.cssText=`left:${x}px;top:${y}px;animation-delay:${i*.15}s`;surface.append(ring)}
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('w4-connections');surface.append(svg);
 neighbors.slice(0,16).forEach((p,i)=>{const path=document.createElementNS(ns,'path');const dx=p.x-x,dy=p.y-y;path.setAttribute('d',`M${x} ${y} Q${(x+p.x)/2-dy*.1} ${(y+p.y)/2+dx*.1} ${p.x} ${p.y}`);path.setAttribute('pathLength','1');path.style.animationDelay=i*.065+'s';svg.append(path);const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);dot.setAttribute('r','5');dot.style.animationDelay=(i*.065+.5)+'s';svg.append(dot)});
 setTimeout(()=>{if(surface.contains(svg))surface.replaceChildren()},3000);
});

function letterPlace(){const root=$('#r-kniga');if(root.hidden)return;const side=$('#bBody11 .b-row__side',root);if(!side||$('.w4-letter-trigger',side))return;const b=btn('Раскрыть запечатанный фрагмент',openLetter);b.classList.add('w4-letter-trigger');b.prepend(Object.assign(el('img'),{src:'assets/sealed-letter-v3.png',alt:''}));side.prepend(b);}
function showLetterPlace(){letterPlace();const b=$('#r-kniga #bHead11');if(b&&b.getAttribute('aria-expanded')!=='true')b.click();$('.w4-letter-trigger')?.scrollIntoView({behavior:calm()?'instant':'smooth',block:'center'})}
function openLetter(){window.__openLetter5?.()}
function boot(){panelDepth();map();deck();water();letterPlace()}
addEventListener('hashchange',()=>setTimeout(boot,80));$$('.route').forEach(r=>r.addEventListener('route:show',()=>setTimeout(boot,80)));setTimeout(boot,100);
})();
