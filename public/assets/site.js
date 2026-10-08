document.getElementById('year').textContent=new Date().getFullYear();

(()=>{"use strict";
const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(reduce||!("IntersectionObserver" in window))return;
const targets=[
...document.querySelectorAll(".hero .eyebrow,.hero h1,.hero .hero-side,.section-top,.section-title,.showcase-card,.about-grid,.approach-item,.contact h2,.contact .actions")
];targets.forEach((node,i)=>{node.dataset.reveal="";if(node.matches(".showcase-card"))node.style.setProperty("--reveal-delay",(i%2)*100+"ms")});
document.documentElement.classList.add("js-motion");
const io=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target)}})},{rootMargin:"0px 0px -28px 0px",threshold:.06});
targets.forEach(node=>io.observe(node));
requestAnimationFrame(()=>{document.querySelectorAll(".hero [data-reveal]").forEach((node,i)=>{node.style.setProperty("--reveal-delay",(i*120)+"ms")})});
})();
;

(()=>{"use strict";
const mm=window.matchMedia("(prefers-reduced-motion: reduce)");
const fine=window.matchMedia("(hover:hover) and (pointer:fine)");
const cards=[...document.querySelectorAll(".showcase-card")];
if(mm.matches||!cards.length)return;
let frame=0;
if(fine.matches)cards.forEach(card=>{
 const panel=card.querySelector(".showcase-window");
 card.addEventListener("pointermove",event=>{
  if(frame)return;
  frame=requestAnimationFrame(()=>{
   frame=0;
   const rect=card.getBoundingClientRect();
   const fx=Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2));
   const fy=Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2));
   panel.style.setProperty("--ty",(fx*4).toFixed(2)+"deg");
   panel.style.setProperty("--tx",(-fy*3).toFixed(2)+"deg");
  });
 },{passive:true});
 card.addEventListener("pointerleave",()=>{
  panel.style.setProperty("--tx","0deg");
  panel.style.setProperty("--ty","0deg");
 });
});
if(window.innerWidth<901)return;
let ticking=false;
const onScroll=()=>{
 if(ticking)return;
 ticking=true;
 requestAnimationFrame(()=>{
  ticking=false;
  for(const card of cards){
   const box=card.getBoundingClientRect();
   if(box.bottom<0||box.top>window.innerHeight)continue;
   const center=box.top+box.height/2;
   const shift=Math.max(-14,Math.min(14,(window.innerHeight/2-center)*.024));
   card.querySelector(".showcase-window").style.setProperty("--float-y",shift.toFixed(1)+"px");
  }
 });
};
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();
