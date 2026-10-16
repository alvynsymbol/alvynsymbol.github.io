'use strict';
const config = window.ALVYN_CONFIG || {};
document.querySelectorAll('.plan').forEach(plan => {
  const front = plan.querySelector('.plan-front');
  const back = plan.querySelector('.plan-back');
  plan.querySelectorAll('.flip-button').forEach(button => button.addEventListener('click', () => {
    const flipped = plan.classList.toggle('flipped');
    front.inert = flipped;
    back.inert = !flipped;
    front.querySelector('button').setAttribute('aria-expanded', String(flipped));
    (flipped ? back : front).querySelector('button').focus({preventScroll:true});
  }));
});
const load = document.querySelector('#load-data');
if (load) {
 const discover = document.querySelector('#discover');
 const output = document.querySelector('#demo-output');
 const board = document.querySelector('.discovery-board');
 const chart = document.querySelector('.demo-chart');
 const formula = document.querySelector('#demo-formula');
 const orb = document.querySelector('.thinking-orb');
 const idle = document.querySelector('.board-idle');
 let revealTimer;
 load.addEventListener('click', () => {
  clearTimeout(revealTimer);
  board.classList.remove('is-thinking', 'is-revealed');
  board.setAttribute('aria-busy','false');
  chart.hidden=false; formula.hidden=true; orb.hidden=true; idle.hidden=true;
  discover.disabled=false; load.disabled=true;
  output.textContent='72 synthetic observations loaded. Discover formula reveals the known example relationship.';
 });
 discover.addEventListener('click', () => {
  discover.disabled=true; orb.hidden=false;
  board.classList.add('is-thinking'); board.setAttribute('aria-busy','true');
  output.textContent='Preparing the example formula.';
  revealTimer=setTimeout(() => {
   orb.hidden=true; board.classList.remove('is-thinking');board.classList.add('is-revealed');
   board.setAttribute('aria-busy','false');formula.hidden=false;
   output.textContent='Example formula revealed. This illustration uses a known synthetic relationship, not the Alvyn engine.';
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 2200);
 });
 document.querySelector('#replay').addEventListener('click', () => {
  clearTimeout(revealTimer);
  board.classList.remove('is-thinking','is-revealed');board.setAttribute('aria-busy','false');
  chart.hidden=true;formula.hidden=true;orb.hidden=true;idle.hidden=false;
  discover.disabled=true;load.disabled=false;
  output.textContent='Load the example data to begin.';
 });
}
const contact = document.querySelector('#contact-form');
if(contact) {
 contact.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contact);
  const message = `Alvyn Symbol enquiry\nName: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\n\n${String(data.get('message')).trim()}`;
  const url = `https://wa.me/989126633870?text=${encodeURIComponent(message)}`;
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = 'Continue to WhatsApp ↗';
  contact.querySelector('.form-status').replaceChildren(document.createTextNode('Your message is ready. Review and send it in WhatsApp. '), link);
  link.click();
 });
}
const license = document.querySelector('#license-form');
if(license) {
 const button = document.querySelector('#activate');
 const status = license.querySelector('.form-status');
 let endpoint;
 try { endpoint = new URL(config.licenseEndpoint); if(endpoint.protocol !== 'https:') endpoint = null; } catch { endpoint = null; }
 if(endpoint) {button.disabled=false; button.textContent='Generate license ↓'; status.textContent='Your details will be sent securely to the activation service.';}
 license.addEventListener('submit', async event => {
  event.preventDefault(); if(!endpoint) return;
  button.disabled=true; status.textContent='Verifying your activation code…';
  const data = new FormData(license);
  try {
   const response = await fetch(endpoint.href, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:String(data.get('name')).trim(),email:String(data.get('email')).trim(),code:String(data.get('code')).trim()}),signal:AbortSignal.timeout(20000),credentials:'omit',cache:'no-store'});
   if(!response.ok) throw new Error(response.status === 429 ? 'Too many attempts. Please try again later.' : 'Activation could not be completed. Check your details or contact support.');
   const contentType = response.headers.get('content-type') || '';
   if(!/application\/(octet-stream|vnd\.alvyn\.license)/i.test(contentType)) throw new Error('The activation service returned an unexpected file format. Please contact support.');
   const blob = await response.blob(); if(!blob.size || blob.size > 1024*1024) throw new Error('The license response is invalid. Please contact support.');
   const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download='alvynsymbol.lis';a.textContent='Download your license again';
   status.replaceChildren(document.createTextNode('License ready. '),a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},60000);
   license.reset();
  } catch(error) {status.textContent=error.name==='TimeoutError' ? 'The request timed out. Please try again.' : error.message;}
  finally {button.disabled=false;}
 });
}

// Visual-only typewriter; the complete heading remains available to screen readers.
const typedHeadline = document.querySelector('#typed-headline');
if (typedHeadline) {
 const phrases = ['When the formula speaks.', 'There’s a formula in your data.', 'A formula can reveal what AI cannot.'];
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 let phraseIndex = 0, position = phrases[0].length, deleting = true, typingTimer;
 function renderHeadline(text) {
  const match = /formula/i.exec(text);
  if (!match) { typedHeadline.textContent = text; return; }
  const word = document.createElement('span'); word.className = 'formula-word'; word.textContent = match[0];
  typedHeadline.replaceChildren(document.createTextNode(text.slice(0, match.index)), word, document.createTextNode(text.slice(match.index + match[0].length)));
 }
 function tickHeadline() {
  if (document.hidden || reducedMotion.matches) return;
  const phrase = phrases[phraseIndex];
  position += deleting ? -1 : 1;
  renderHeadline(phrase.slice(0, position));
  let delay = deleting ? 35 : 85;
  if (position === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }
  else if (position === phrase.length && !deleting) { deleting = true; delay = 2800; }
  typingTimer = setTimeout(tickHeadline, delay);
 }
 function restartHeadline() {
  clearTimeout(typingTimer);
  if (reducedMotion.matches) {renderHeadline(phrases[0]);return;}
  if (!document.hidden) typingTimer = setTimeout(tickHeadline, 2800);
 }
 reducedMotion.addEventListener('change', () => {phraseIndex=0;position=phrases[0].length;deleting=true;renderHeadline(phrases[0]);restartHeadline();});
 document.addEventListener('visibilitychange', restartHeadline);
 restartHeadline();
}

// Open relocated information panels when reached through footer links.
function openLinkedDetail() {
 const id = location.hash.slice(1);
 const target = document.getElementById(id);
 if (target && target.tagName === 'DETAILS') target.open = true;
}
window.addEventListener('hashchange', openLinkedDetail);
openLinkedDetail();

const walkthrough = document.querySelector('.walkthrough');
if (walkthrough) {
 const slides = [...walkthrough.querySelectorAll('.walkthrough-slide')];
 const dots = [...walkthrough.querySelectorAll('.walkthrough-dot')];
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let current = 0, paused = motion.matches, timer, hovering = false, focused = false;
 function showSlide(index) {
  current = index;
  slides.forEach((slide,i) => {slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});
  dots.forEach((dot,i) => dot.setAttribute('aria-pressed',String(i===index)));
 }
 function scheduleSlide() {
  clearTimeout(timer);
  if (!paused && !hovering && !focused && !document.hidden) timer = setTimeout(() => {showSlide((current+1)%slides.length);scheduleSlide();},4000);
 }
 dots.forEach((dot,i) => dot.addEventListener('click',() => {showSlide(i);scheduleSlide();}));
 walkthrough.addEventListener('pointerenter',() => {hovering=true;scheduleSlide();});
 walkthrough.addEventListener('pointerleave',() => {hovering=false;scheduleSlide();});
 walkthrough.addEventListener('focusin',() => {focused=true;scheduleSlide();});
 walkthrough.addEventListener('focusout',event => {if(!walkthrough.contains(event.relatedTarget)){focused=false;scheduleSlide();}});
 document.addEventListener('visibilitychange',scheduleSlide);
 motion.addEventListener('change',() => {paused=motion.matches;scheduleSlide();});
 scheduleSlide();
}
