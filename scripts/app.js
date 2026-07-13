(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const q = (s, c = document) => c.querySelector(s);
  const qa = (s, c = document) => [...c.querySelectorAll(s)];

  addEventListener('load', () => setTimeout(() => q('.loader')?.classList.add('is-hidden'), 500));

  const menu = q('.menu-panel');
  const menuButton = q('.menu-toggle');
  const setMenu = open => {
    menu?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-hidden', String(!open));
    menuButton?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  qa('.menu-panel a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  if (fine) {
    const cursor = q('.cursor');
    addEventListener('pointermove', e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; });
    qa('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('pointerenter', () => { cursor.classList.add('is-active'); q('span', cursor).textContent = el.dataset.cursor || 'OPEN'; });
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
    qa('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); gsap.to(el, { x:(e.clientX-r.left-r.width/2)*.14, y:(e.clientY-r.top-r.height/2)*.14, duration:.35 }); });
      el.addEventListener('pointerleave', () => gsap.to(el, { x:0, y:0, duration:.55, ease:'power3.out' }));
    });
  }

  const hubs = [
    {name:'ROTTERDAM',copy:'Europe gateway for ocean, rail and customs consolidation.',capacity:'2,840 TEU',corridor:'EU → Central Asia',cutoff:'21:40 CET'},
    {name:'ALMATY',copy:'Central Asian control hub linking rail, road and regional distribution.',capacity:'1,420 TEU',corridor:'China → CIS',cutoff:'23:10 ALMT'},
    {name:'DUBAI',copy:'Air and ocean gateway for GCC, Africa and time-critical trade.',capacity:'1,960 TEU',corridor:'GCC → Africa',cutoff:'18:20 GST'},
    {name:'SHANGHAI',copy:'Origin control center for supplier management and export consolidation.',capacity:'4,220 TEU',corridor:'Asia → Europe',cutoff:'22:45 CST'},
    {name:'NAIROBI',copy:'East Africa gateway with bonded handling and regional road distribution.',capacity:'780 TEU',corridor:'Africa → GCC',cutoff:'17:30 EAT'}
  ];
  qa('.hub').forEach((hub, index) => {
    const activate = () => {
      qa('.hub').forEach(h => h.classList.remove('is-active'));
      hub.classList.add('is-active');
      const data = hubs[index];
      q('.hub-panel__index span').textContent = `0${index+1}`;
      q('.hub-panel h3').textContent = data.name;
      q('.hub-panel>p').textContent = data.copy;
      const dd = qa('.hub-panel dd');
      dd[1].textContent = data.capacity; dd[2].textContent = data.corridor; dd[3].textContent = data.cutoff;
      gsap.fromTo('.hub-panel h3,.hub-panel>p,.hub-panel dl', {opacity:.2,y:12},{opacity:1,y:0,duration:.45,stagger:.05});
    };
    hub.addEventListener('click', activate);
    hub.addEventListener('mouseenter', activate);
  });
  q('.hub')?.classList.add('is-active');

  const routeData = [
    {mode:['AIR','ROAD'],transit:'2D 14H',reliability:'98.4%',carbon:'HIGH',capacity:'AVAILABLE'},
    {mode:['RAIL','ROAD'],transit:'11D 08H',reliability:'96.9%',carbon:'MEDIUM',capacity:'LIMITED'},
    {mode:['SEA','RAIL'],transit:'18D 07H',reliability:'97.6%',carbon:'LOW',capacity:'AVAILABLE'}
  ];
  qa('.route-option').forEach((button, index) => {
    button.addEventListener('click', () => {
      qa('.route-option').forEach((b,i) => { b.classList.toggle('is-active',i===index); b.setAttribute('aria-selected',String(i===index)); });
      const screen=q('.planner-screen'); screen.dataset.route=String(index);
      const d=routeData[index];
      q('.planner-mode span:first-child').textContent=d.mode[0]; q('.planner-mode span:last-child').textContent=d.mode[1];
      q('.route-transit').textContent=d.transit; q('.route-reliability').textContent=d.reliability; q('.route-carbon').textContent=d.carbon; q('.route-capacity').textContent=d.capacity;
      gsap.fromTo('.planner-results strong',{y:10,opacity:0},{y:0,opacity:1,duration:.45,stagger:.05});
    });
  });

  q('.tracking-form')?.addEventListener('submit', e => {
    e.preventDefault(); const button=q('button',e.currentTarget); button.innerHTML='Located <span>✓</span>';
    gsap.fromTo('.tracking-terminal',{x:20,opacity:.5},{x:0,opacity:1,duration:.65,ease:'power3.out'});
    setTimeout(()=>button.innerHTML='Track <span>↗</span>',1800);
  });

  q('.contact-form')?.addEventListener('submit', async e => {
    e.preventDefault(); const f=new FormData(e.currentTarget);
    const text=`BLACKLINE route request\nName: ${f.get('name')}\nEmail: ${f.get('email')}\nOrigin: ${f.get('origin')}\nDestination: ${f.get('destination')}\nCargo: ${f.get('cargo')}\nNotes: ${f.get('message')||'—'}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    const button=q('.submit-button',e.currentTarget); button.innerHTML='<span>Route brief copied</span><b>✓</b>';
  });

  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) { const lenis=new Lenis({duration:1.15,smoothWheel:true}); lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0); }
    gsap.to('.scroll-progress span',{scaleY:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
    gsap.from('.hero-copy,.hero-title__line,.hero-map,.hero-bottom',{y:70,opacity:0,duration:1.25,stagger:.12,ease:'power4.out',delay:.25});
    gsap.to('.hero-map',{scale:1.12,yPercent:10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero-title',{yPercent:-18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.from('.manifest h2,.manifest-copy',{y:70,opacity:0,stagger:.15,scrollTrigger:{trigger:'.manifest',start:'top 68%'}});
    qa('[data-count]').forEach(el=>{const target=Number(el.dataset.count); gsap.to({v:0},{v:target,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 85%',once:true},onUpdate(){el.textContent=Math.round(this.targets()[0].v)}})});
    gsap.from('.network-stage',{clipPath:'inset(8% 8% 8% 8%)',scrollTrigger:{trigger:'.network-stage',start:'top 80%',end:'top 25%',scrub:true}});
    gsap.from('.service-item',{xPercent:8,opacity:0,stagger:.12,scrollTrigger:{trigger:'.services-list',start:'top 75%'}});
    gsap.from('.planner-screen',{xPercent:10,opacity:0,scrollTrigger:{trigger:'.planner',start:'top 70%',end:'top 25%',scrub:true}});
    gsap.from('.tracking-terminal',{y:80,opacity:0,scrollTrigger:{trigger:'.tracking-terminal',start:'top 80%'}});
    gsap.to('.shipment-progress span',{width:'72%',ease:'none',scrollTrigger:{trigger:'.tracking-terminal',start:'top 65%',end:'bottom 70%',scrub:true}});
    gsap.to('.container-rail',{x:()=>-(q('.container-rail').scrollWidth-innerWidth+80),ease:'none',scrollTrigger:{trigger:'.fleet',start:'top 30%',end:'bottom bottom',scrub:1}});
    gsap.from('.exception-row',{xPercent:10,opacity:0,stagger:.1,scrollTrigger:{trigger:'.control-board',start:'top 75%'}});
    gsap.from('.contact-form label,.submit-button',{y:35,opacity:0,stagger:.08,scrollTrigger:{trigger:'.contact-form',start:'top 75%'}});
  }
})();
