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
if(load) {
 const discover = document.querySelector('#discover');
 const output = document.querySelector('#demo-output');
 const chart = document.querySelector('.demo-chart');
 const formula = document.querySelector('#demo-formula');
 const initial = output.innerHTML;
 load.addEventListener('click', () => {
   output.textContent = 'Example data loaded. Ready to explore the relationship.';
   chart.hidden = false; chart.classList.remove('revealed'); formula.hidden = true;
   discover.disabled = false; load.disabled = true;
 });
 discover.addEventListener('click', () => {
   chart.classList.add('revealed'); formula.hidden = false;
   output.textContent = 'Illustration complete. A readable equation describes these example points.';
   discover.disabled = true;
 });
 document.querySelector('#replay').addEventListener('click', () => {
   output.innerHTML = initial; chart.hidden = true; chart.classList.remove('revealed');
   formula.hidden = true; discover.disabled = true; load.disabled = false;
 });
}
const contact = document.querySelector('#contact-form');
if(contact) {
 if(config.contactEmail) {
   contact.querySelector('[type=submit]').textContent = 'Open email message ↗';
   contact.querySelector('.form-note').textContent = 'Opens your email app with a prepared message. You choose when to send it.';
 }
 contact.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contact);
  const message = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  const field = document.querySelector('#prepared-message'); field.value = message; field.hidden = false;
  if(config.contactEmail) {
   location.href = `mailto:${encodeURIComponent(config.contactEmail)}?subject=${encodeURIComponent('Alvyn Symbol enquiry')}&body=${encodeURIComponent(message)}`;
   contact.querySelector('.form-status').textContent = 'Your message is prepared below. Send it using your email app.';
  } else {
   contact.querySelector('.form-status').textContent = 'Message prepared below. It has not been sent. You can copy and save it while a contact channel is being added.';
  }
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
