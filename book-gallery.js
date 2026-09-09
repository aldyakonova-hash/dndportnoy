(function(){
'use strict';
var dialog=document.createElement('dialog');dialog.id='bookGallery';dialog.setAttribute('aria-label','Иллюстрации главы');
dialog.innerHTML='<button type="button" class="bg-close k-icon-btn" aria-label="Закрыть галерею">×</button><img class="bg-image" alt=""><p class="bg-caption" aria-live="polite"></p><nav class="bg-nav" aria-label="Иллюстрации"><button type="button" class="bg-prev k-icon-btn" aria-label="Предыдущая иллюстрация">←</button><span class="bg-counter" aria-live="polite"></span><button type="button" class="bg-next k-icon-btn" aria-label="Следующая иллюстрация">→</button></nav>';
document.body.appendChild(dialog);
var list=[],index=0,focusBefore,overflowBefore,start=null;
var image=dialog.querySelector('.bg-image');image.draggable=false;
function show(){index=(index+list.length)%list.length;var item=list[index];image.src=item.src;image.alt=item.caption;dialog.querySelector('.bg-caption').textContent=item.caption;dialog.querySelector('.bg-counter').textContent=(index+1)+' / '+list.length;dialog.querySelectorAll('.bg-prev,.bg-next').forEach(function(b){b.disabled=list.length<2});}
function move(n){index+=n;show();}
function resolve(src){var map=window.__IMG||{};return map[src]||map[src.replace(/\.(jpg|png)$/,'')]||src;}
function open(im){var key=(location.hash.match(/kniga\/(ch\d+)/)||[])[1]||document.querySelector('#flow').dataset.chapter;var chapters=window.__D&&window.__D.chapters;var ch=chapters&&chapters.find(function(c){return c.key===key});if(!ch)return;
var host=document.createElement('div');host.innerHTML=ch.body;list=Array.from(host.querySelectorAll('figure img')).map(function(img,i){var caption=img.closest('figure').querySelector('figcaption');return {src:resolve(img.getAttribute('src')),caption:(caption&&caption.textContent.trim())||img.alt||'Иллюстрация '+(i+1)};});if(!list.length)return;
index=list.findIndex(function(x){return new URL(x.src,location.href).href===im.src});if(index<0)index=0;focusBefore=im;overflowBefore=document.body.style.overflow;document.body.style.overflow='hidden';dialog.setAttribute('aria-label','Иллюстрации главы «'+ch.title+'»');show();dialog.showModal();dialog.querySelector('.bg-close').focus();}
dialog.querySelector('.bg-close').onclick=function(){dialog.close()};dialog.querySelector('.bg-prev').onclick=function(){move(-1)};dialog.querySelector('.bg-next').onclick=function(){move(1)};
dialog.addEventListener('close',function(){document.body.style.overflow=overflowBefore;image.removeAttribute('src');if(focusBefore&&focusBefore.isConnected)focusBefore.focus({preventScroll:true});});
document.addEventListener('click',function(e){var im=e.target.closest('#r-kniga .b-pg figure img');if(!im||im.closest('#bProbe,.b-flip'))return;e.preventDefault();e.stopImmediatePropagation();open(im);},true);
document.addEventListener('keydown',function(e){if(dialog.open){if(['ArrowLeft','ArrowRight','Escape',' '].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();if(e.key==='Escape')dialog.close();else if(e.key==='ArrowLeft')move(-1);else move(1);}return;}if((e.key==='Enter'||e.key===' ')&&e.target.matches('#r-kniga .b-pg figure img')){e.preventDefault();e.stopImmediatePropagation();open(e.target);}},true);
image.addEventListener('pointerdown',function(e){start={x:e.clientX,y:e.clientY};image.setPointerCapture(e.pointerId)});image.addEventListener('pointerup',function(e){if(!start)return;var dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1)});image.addEventListener('pointercancel',function(){start=null});
function enhance(){document.querySelectorAll('#r-kniga .b-pg figure img:not([role="button"])').forEach(function(im){im.tabIndex=0;im.setAttribute('role','button');im.setAttribute('aria-label','Открыть галерею: '+im.alt);});}
new MutationObserver(enhance).observe(document.querySelector('#reader'),{childList:true,subtree:true});enhance();
})();
