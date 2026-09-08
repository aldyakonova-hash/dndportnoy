(() => {
'use strict';
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const calm=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('is-calm');
const fine=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;
const node=(tag,cls)=>Object.assign(document.createElement(tag),{className:cls});
const frames=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
let slow=false, running=[];
const animate=(target,keys,options)=>{const a=target.animate(keys,{fill:'both',...options});a.playbackRate=slow?.25:1;running.push(a);a.finished.catch(()=>{}).finally(()=>{running=running.filter(x=>x!==a)});return a};

// Transparent sprites are composed over a complete clean plate. Crop windows
// run through transparent padding only, never along anatomy or painted ground.
const panelSpecs=[
 {back:'crypt-empty.png',restoreFoot:true,parts:[
  {file:'crypt-ghost-alpha.png',crop:[0,260,1024,1080],canvas:[1024,1536],box:[329,506,390,411],depth:.3,free:true,opacity:.75}
 ]},
 {back:'w4-festival-back.png',parts:[
  {file:'festival-cut.png',crop:[0,700,440,750],canvas:[1073,1466],box:[0,770,300,511],depth:.8,grounded:true,clip:'0,700 395,700 395,1285 440,1285 440,1450 0,1450'},
  {file:'festival-cut.png',crop:[395,980,215,310],canvas:[1073,1466],box:[318,913,142,205],depth:.4,grounded:true},
  {file:'festival-cut.png',crop:[610,650,463,740],canvas:[1073,1466],box:[494,720,350,559],depth:.65,grounded:true}
 ]},
 {back:'w4-rift-back.png',parts:[
  {file:'bear-v6.png',crop:[0,0,1254,1254],canvas:[1254,1254],box:[77,495,247,247],depth:.55,grounded:true,name:'медведица'},
  {file:'warrior-v6.png',crop:[0,0,1254,1254],canvas:[1254,1254],box:[271,327,351,351],depth:.8,free:true,name:'Люциус'}
 ]},
 {parts:[],fix:true}
];
// Four transparent sprite cells, each used as its own independently moving object.
const detailCells=[[0,0,627,627],[627,0,627,627],[0,627,627,627],[627,627,627,627]];
const addDetail=(scene,cell,box,depth,name)=>panelSpecs[scene].parts.push({file:'panorama-details-v6.png',canvas:[1254,1254],crop:detailCells[cell],box,depth,detail:true,name});
addDetail(0,3,[342,1094,62,62],.8,'ключ');
addDetail(0,3,[620,943,42,42],.55,'ключ вдали');
addDetail(1,0,[264,867,90,110],.8,'лента');
addDetail(1,2,[285,1100,56,56],1,'перо');
addDetail(1,0,[715,700,67,82],.55,'лента вдали');
addDetail(2,1,[516,526,53,53],.7,'карта');
addDetail(2,1,[318,740,38,38],.5,'карта вдали');
addDetail(3,2,[364,1034,50,50],.85,'перо в порту');
addDetail(3,0,[668,672,54,75],.65,'лента в порту');
const panels=[];let ticking=false,lastTime=0;
function motionTick(t){
 ticking=false;const dt=Math.min((t-lastTime)/1000||.016,.04);lastTime=t;
 if(document.hidden||$('#r-index').hidden||calm())return;
 const time=t/1000;
 for(const p of panels){
  const rect=p.cam.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)continue;
  const progress=Math.max(-1,Math.min(1,(innerHeight*.5-(rect.top+rect.height*.5))/(rect.height*.5)));
  const scale=Math.min(rect.width/845,1.7);
  p.x+=(p.tx-p.x)*Math.min(dt*5,1);p.y+=(p.ty-p.y)*Math.min(dt*5,1);
  p.cam.style.setProperty('--camera-x',(p.x*3*scale).toFixed(2)+'px');
  for(const layer of p.layers){
   const d=layer.depth,phase=p.phase+layer.phase;
   const x=(p.x*10+progress*7+Math.sin(time*(layer.detail?.31:.22)+phase)*(layer.detail?7:1.5))*d*scale;
   const y=layer.grounded?0:(p.y*4+progress*8+Math.sin(time*(layer.detail?.43:.32)+phase)*(layer.detail?11:3))*d*scale;
   const rotation=layer.detail?Math.sin(time*.28+phase)*6:0;
   layer.img.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rotation.toFixed(2)}deg)`;
  }
 }
 ticking=true;requestAnimationFrame(motionTick);
}
function start(){if(!ticking&&!calm()){ticking=true;requestAnimationFrame(motionTick)}}
function sprite(part,i,j){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 const [x,y,w,h]=part.box,[cx,cy,cw,ch]=part.crop;
 svg.setAttribute('viewBox',`${cx} ${cy} ${cw} ${ch}`);svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('aria-hidden','true');
 svg.setAttribute('class','motion-sprite'+(part.detail?' motion-detail':''));svg.dataset.subject=part.name||`figure-${i}-${j}`;
 svg.style.cssText=`left:${x/845*100}%;top:${y/1300*100}%;width:${w/845*100}%;height:${h/1300*100}%;opacity:${part.opacity||1}`;
 const clip=part.clip?`<defs><clipPath id="sprite-${i}-${j}"><polygon points="${part.clip}"/></clipPath></defs>`:'';
 svg.innerHTML=`${clip}<image href="assets/${part.file}" width="${part.canvas[0]}" height="${part.canvas[1]}" ${part.clip?`clip-path="url(#sprite-${i}-${j})"`:''}/>`;
 return svg;
}
window.__motionPanels=()=>{
 if($('#r-index').hidden)return;
 $$('#r-index .p-act').forEach((act,i)=>{
  if(act.dataset.layers6)return;const spec=panelSpecs[i],cam=$('.p-act__cam',act),base=$('img',cam);if(!spec||!base)return;
  act.dataset.layers6='loading';const p={act,cam,layers:[],tx:0,ty:0,x:0,y:0,phase:i*.8};
  const urls=[...(spec.back?[spec.back]:[]),...spec.parts.map(s=>s.file)];
  Promise.all([...new Set(urls)].map(file=>{const im=new Image();im.src=`assets/${file}`;return im.decode()})).then(()=>{
   if(spec.back)base.src=`assets/${spec.back}`;
   if(spec.restoreFoot){const foot=node('img','motion-original-foot');foot.src='assets/img/scroll/01-sklep.jpg';foot.alt='';cam.append(foot)}
   cam.classList.add('motion-separated');spec.parts.forEach((part,j)=>{const img=sprite(part,i,j);cam.append(img);p.layers.push({...part,img,phase:j*1.2})});
   if(spec.fix){const fix=node('img','w4-fronki-fix');fix.src='assets/w4-port-two-legs.png';fix.alt='';cam.append(fix)}
   act.dataset.layers6='ready';panels.push(p);start();
  }).catch(()=>{act.dataset.layers6='failed'});
  act.addEventListener('pointermove',e=>{if(!fine())return;const r=act.getBoundingClientRect();p.tx=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));p.ty=e.clientY/innerHeight*2-1;start()});
  act.addEventListener('pointerleave',()=>{p.tx=0;p.ty=0});
 });
 $$('#r-index .p-portal').forEach(a=>{if(a.dataset.transition5)return;a.dataset.transition5='1';a.addEventListener('click',e=>{
  if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||calm())return;
  e.preventDefault();e.stopImmediatePropagation();passThrough(a);
 },true)});
 start();
};
addEventListener('visibilitychange',start);addEventListener('scroll',start,{passive:true});
new MutationObserver(()=>{if(calm())panels.forEach(p=>{p.cam.style.setProperty('--camera-x','0px');p.layers.forEach(l=>l.img.style.transform='none')});else start()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});

let crossing=false;
async function passThrough(a){
 if(crossing)return;crossing=true;a.dataset.passage='started';
 const r=a.getBoundingClientRect(),pad=9,left=r.left+pad,right=r.right-pad,top=r.top+pad,bottom=r.bottom-pad;
 const cx=(left+right)/2,cy=(top+bottom)/2,rise=Math.min((right-left)/2,(bottom-top)*.36);
 // Cut a real arch-shaped opening out of the old page snapshot. The destination
 // is already rendered behind that opening before the camera moves forward.
 const hole=`M0 0H${innerWidth}V${innerHeight}H0Z M${left} ${bottom}V${top+rise}Q${left} ${top} ${cx} ${top}Q${right} ${top} ${right} ${top+rise}V${bottom}Z`;
 if(!document.startViewTransition){
  const oldRoot=$('#r-index'),scene=oldRoot.cloneNode(true),cover=node('div','motion-passage');
  scene.classList.remove('route');scene.removeAttribute('hidden');scene.inert=true;
  scene.style.cssText=`position:absolute;left:0;top:${-scrollY}px;width:${innerWidth}px;max-width:none;margin:0;`;
  cover.style.cssText=`position:fixed;inset:0;z-index:10000;overflow:hidden;pointer-events:none;clip-path:path(evenodd, "${hole}");transform-origin:${cx}px ${cy}px;`;
  cover.append(scene);document.body.append(cover);a.dataset.passage='mounted';
  let cancelled=false;const cancel=e=>{if(e.key==='Escape'){cancelled=true;cover.remove()}};addEventListener('keydown',cancel);
  try{
   location.hash=a.getAttribute('href');await new Promise(resolve=>{addEventListener('hashchange',resolve,{once:true});setTimeout(resolve,350)});await frames();
   if(cancelled)return;
   const scale=Math.max(innerWidth/(right-left),innerHeight/(bottom-top))*2.2;
   a.dataset.passage='flying';const flight=animate(cover,[{transform:'scale(1)',opacity:1},{opacity:1,offset:.8},{transform:`scale(${scale})`,opacity:0}],{duration:950,easing:'cubic-bezier(.77,0,.175,1)'});
   await flight.finished.catch(()=>{});
  }finally{a.dataset.passage='finished';cover.remove();crossing=false;removeEventListener('keydown',cancel)}
  return;
 }
 const style=node('style','motion-vt-style');style.textContent=`::view-transition-group(root){animation:none}::view-transition-old(root){animation:none;mix-blend-mode:normal;z-index:2;clip-path:path(evenodd, "${hole}");transform-origin:${cx}px ${cy}px}::view-transition-new(root){animation:none;mix-blend-mode:normal;z-index:1;transform-origin:${cx}px ${cy}px}::view-transition{pointer-events:none}`;document.head.append(style);
 const vt=document.startViewTransition(async()=>{location.hash=a.getAttribute('href');await new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;resolve()};addEventListener('hashchange',finish,{once:true});setTimeout(finish,300)})});
 const cancel=e=>{if(e.key==='Escape')vt.skipTransition()};addEventListener('keydown',cancel);
 try{
  await vt.ready;a.dataset.passage='native-flying';const scale=Math.max(innerWidth/(right-left),innerHeight/(bottom-top))*2.2;
  const old=animate(document.documentElement,[{transform:'scale(1)',opacity:1},{opacity:1,offset:.72},{transform:`scale(${scale})`,opacity:0}],{duration:900,easing:'cubic-bezier(.77,0,.175,1)',pseudoElement:'::view-transition-old(root)'});
  animate(document.documentElement,[{transform:'scale(.94)',filter:'brightness(.68)'},{transform:'scale(1)',filter:'brightness(1)'}],{duration:900,easing:'cubic-bezier(.23,1,.32,1)',pseudoElement:'::view-transition-new(root)'});
  await old.finished.catch(()=>{});await vt.finished;
 }catch(e){a.dataset.passage='failed';a.dataset.passageError=e.message;vt.skipTransition()}finally{if(a.dataset.passage!=='failed')a.dataset.passage='native-finished';style.remove();crossing=false;removeEventListener('keydown',cancel)}
}

// Thin-film colour and specular reflection on the actual cards, not a showcase duplicate.
function foil(card){
 if(card.classList.contains('original-card')||card.dataset.foil5)return;card.dataset.foil5='1';
 if(card.classList.contains('l-fan__c')){
  card.classList.add('original-fan-light');
  const light=node('i','original-fan-glint');light.setAttribute('aria-hidden','true');card.append(light);
  card.addEventListener('pointermove',e=>{
   if(calm()||e.pointerType==='touch'||e.buttons)return;
   const r=card.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
   card.style.setProperty('--fan-shine',(15+x*70)+'%');card.style.setProperty('--fan-angle',(103+x*24)+'deg');card.style.setProperty('--fan-y',(y*100)+'%');card.classList.add('original-fan-lit');
  });
  const clear=()=>card.classList.remove('original-fan-lit');card.addEventListener('pointerleave',clear);card.addEventListener('pointerdown',clear);card.addEventListener('pointercancel',clear);return;
 }

 const rich=!card.classList.contains('l-secondary-card');if(rich)card.classList.add('motion-rich-card');
 const hosts=$$('.w4-card-front,.w4-card-back',card);if(!hosts.length)hosts.push(card);
 hosts.forEach(host=>{host.append(node('i','motion-foil'),node('i','motion-glare'),node('i','motion-foil-edge'));if(rich){const frame=node('i','motion-gilt-frame');frame.setAttribute('aria-hidden','true');host.append(frame)}});
 const move=e=>{if(calm()||!fine())return;const r=card.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
  card.classList.add('motion-lit');card.style.setProperty('--foil-x',x*100+'%');card.style.setProperty('--foil-y',y*100+'%');card.style.setProperty('--foil-angle',(115+(x-.5)*35)+'deg');
  $$('.motion-glare',card).forEach(n=>n.style.transform=`translate3d(${(x-.5)*75}%,${(y-.5)*35}%,0) rotate(-22deg)`);
  if(card.classList.contains('l-open')){card.style.rotate=`${-(y-.5)} ${x-.5} 0 ${Math.hypot(x-.5,y-.5)*12}deg`}
 };
 card.addEventListener('pointermove',move);card.addEventListener('pointerleave',()=>{if(card.dataset.lightHeld)return;card.classList.remove('motion-lit');card.style.rotate='none'});
 if(card.classList.contains('l-open')){
  const b=node('button','w4-button motion-light-test');b.type='button';b.textContent='Повернуть к свету';const flip=card.nextElementSibling?.classList.contains('w4-flip')?card.nextElementSibling:null;const unit=node('div','motion-card-unit');card.before(unit);unit.append(card,b);if(flip)unit.append(flip);
  let test=[];b.onclick=()=>{
   if(calm())return;if(card.dataset.lightHeld){delete card.dataset.lightHeld;test.forEach(a=>a.cancel());test=[];card.classList.remove('motion-lit');b.textContent='Повернуть к свету';return}card.dataset.lightHeld='1';b.textContent='Убрать от света';card.classList.add('motion-lit');const a=animate(card,[{rotate:'0 1 0 -8deg'},{rotate:'1 1 0 8deg',offset:.55},{rotate:'0 1 0 4deg'}],{duration:1500,easing:'cubic-bezier(.45,0,.55,1)'});
   test.push(a);$$('.motion-glare',card).forEach(n=>test.push(animate(n,[{transform:'translate3d(-70%,-15%,0) rotate(-22deg)'},{transform:'translate3d(8%,0,0) rotate(-22deg)'}],{duration:1500,easing:'cubic-bezier(.45,0,.55,1)'})));
  };
 }
}
function cards(){$$('#trayRow .motion-card-unit').forEach(unit=>{if(!$('.l-open',unit))unit.remove()});if($('#r-lica').hidden)return;$$('#r-lica .l-fan__c,#r-lica .l-open[data-w4]').forEach(foil)}
new MutationObserver(cards).observe($('#r-lica #trayRow'),{childList:true,subtree:true});
new MutationObserver(cards).observe($('#r-lica #fanStage'),{childList:true});
addEventListener('hashchange',()=>setTimeout(cards,150));setTimeout(cards,300);

let letter,letterAnimations=[],opened=false,opener;
function stopLetter(){letterAnimations.forEach(a=>a.cancel());letterAnimations=[]}
function fold(open){
 stopLetter();opened=open;
 const button=$('[data-unseal]',letter);button.textContent=open?'Сложить письмо':'Разломить печать';
 $('.fold-copy',letter).inert=!open;$('.fold-seal-target',letter).hidden=open;
 if(!open){letter.classList.remove('unsealed');return}
 letter.classList.add('unsealed');const instant=calm();
 const run=(q,k,o)=>{const a=animate($(q,letter),k,{...o,duration:instant?1:o.duration,delay:instant?0:o.delay||0});letterAnimations.push(a);return a};
 run('.wax-piece.left',[{transform:'translate3d(0,0,0) rotate(0)'},{transform:'translate3d(-7%,2%,4px) rotate(-7deg)',offset:.25},{transform:'translate3d(-210%,220%,35px) rotate(-32deg)'}],{duration:850,easing:'cubic-bezier(.32,.72,0,1)'});
 run('.wax-piece.right',[{transform:'translate3d(0,0,0) rotate(0)'},{transform:'translate3d(7%,3%,4px) rotate(6deg)',offset:.25},{transform:'translate3d(215%,240%,28px) rotate(41deg)'}],{duration:960,easing:'cubic-bezier(.32,.72,0,1)'});
 run('.fold-top',[{transform:'rotateX(-180deg)'},{transform:'rotateX(0deg)'}],{delay:360,duration:1450,easing:'cubic-bezier(.42,0,.18,1)'});
 run('.fold-bottom',[{transform:'rotateX(180deg)'},{transform:'rotateX(0deg)'}],{delay:670,duration:1480,easing:'cubic-bezier(.42,0,.18,1)'});
 run('.fold-top .fold-shade',[{opacity:.5},{opacity:.3,offset:.45},{opacity:0}],{delay:360,duration:1450,easing:'ease-in-out'});
 run('.fold-bottom .fold-shade',[{opacity:.55},{opacity:.26,offset:.45},{opacity:0}],{delay:670,duration:1480,easing:'ease-in-out'});
 run('.fold-copy',[{opacity:0},{opacity:1}],{delay:1570,duration:520,easing:'ease-in-out'});
}
window.__openLetter5=()=>{
 opener=document.activeElement;
 if(!letter){letter=node('dialog','fold-dialog');letter.setAttribute('aria-labelledby','fold-title');letter.innerHTML=`<header><span id="fold-title">ХРОНИКА · XII</span><button class="w4-button" data-close>Закрыть</button></header><div class="fold-stage"><div class="fold-page"><div class="fold-center"></div><div class="fold-part fold-top"><div class="fold-face front"></div><div class="fold-face back"></div><i class="fold-shade"></i></div><div class="fold-part fold-bottom"><div class="fold-face front"></div><div class="fold-face back"></div><i class="fold-shade"></i></div><div class="fold-copy"><small>О ДВЕРЯХ</small><blockquote>— Сколько раз мы сегодня выбирали, — сказал Дварф в темноту коридора, — закрыть дверь или не закрыть. И каждый раз, когда не закрывали, кончалось плохо. Спасительный принцип. Если есть возможность закрыть дверь — закрой.</blockquote><a href="#/kniga/ch12">Читать XII главу →</a></div></div><div class="fold-seal"><i class="wax-piece left"></i><i class="wax-piece right"></i><button class="fold-seal-target" aria-label="Разломить сургучную печать"></button></div></div><footer><button class="w4-button" data-unseal>Разломить печать</button><span>Фрагмент хроники</span></footer>`;document.body.append(letter);
  $('[data-close]',letter).onclick=()=>letter.close();$('[data-unseal]',letter).onclick=()=>fold(!opened);$('.fold-seal-target',letter).onclick=()=>fold(true);$('a',letter).onclick=()=>letter.close();letter.addEventListener('close',()=>{stopLetter();opener?.focus()});
 }
 letter.showModal();fold(false);
};
})();
