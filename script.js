/* ============ CONFIGURATION — À MODIFIER ============ */
const CONFIG = {
  TIKTOK_URL: "https://www.tiktok.com/@ocelashes",   // lien exact du compte officiel
  CLOSE_DATE: "2026-11-30T23:59:59",                  // clôture (heure locale)
  DRAW_DATE:  "2026-12-05",                           // date du tirage
  SITE_URL:   "",                                     // laisser vide = URL actuelle
  SHEETS_URL: ""                                      // colle ici l'URL Apps Script se terminant par /exec
};
/* ===================================================== */

const T = {
fr:{launch:"Lancement Ocelashes",h1:"5 poses de cils <em>offertes</em>",intro:"Participe à notre tombola de lancement : cinq gagnantes recevront une pose d’extensions de cils offerte.",datesT:"Dates importantes",free:"Participation gratuite · 5 gagnantes",enter:"Je participe",tkT:"Étape 1 : TikTok",tkP:"Ouvre notre compte TikTok officiel, abonne-toi, puis reviens ici pour continuer.",follow:"S’abonner sur TikTok ↗",back:"Reviens ici pour continuer !",confirmTk:"Je confirme m’être abonnée au compte TikTok officiel d’Ocelashes",continue:"Continuer",fT:"Étape 2 : Tes informations",first:"Prénom",last:"Nom",phone:"Numéro WhatsApp",acceptA:"J’accepte le",rulesL:"règlement",and:"et la",privL:"politique de confidentialité",submit:"Valider ma participation",loading:"Enregistrement de ta participation…",congrats:"FÉLICITATIONS !",saved:"Ta participation à la tombola Ocelashes est bien enregistrée !",yourNum:"TON NUMÉRO DE PARTICIPATION",shot:"Fais une capture d’écran de cette page pour garder ton numéro. Si tu fais partie des cinq gagnantes, l’équipe Ocelashes te recontactera selon les modalités du règlement.",copy:"Copier mon numéro",copied:"Copié ✓",share:"Partager sur WhatsApp",luck:"Bonne chance et merci de participer à notre lancement !",closed:"Les inscriptions sont closes",close:"Fermer",reqName:"Champ requis",reqPh:"Numéro invalide. Exemple : +237 690 607 087 (9 chiffres après +237)",reqRules:"Tu dois accepter le règlement.",netErr:"Une erreur est survenue. Réessaie dans un instant.",closeD:"Clôture : ",drawD:"Tirage : ",shareMsg:"Je participe à la tombola de lancement Ocelashes : 5 poses de cils offertes ! 💗",
rulesTxt:"<h2>Règlement</h2><p>Tombola gratuite, sans obligation d’achat. 5 gagnantes tirées au sort parmi les participations valides après la clôture. Une participation par personne. Les gagnantes sont contactées par Ocelashes via WhatsApp. L’abonnement TikTok est déclaratif. <i>[Texte final à valider par Ocelashes.]</i></p>",
privTxt:"<h2>Confidentialité</h2><p>Nous collectons prénom, nom et numéro WhatsApp uniquement pour gérer la tombola et contacter les gagnantes. Données non partagées, supprimées après la campagne. Contact : <i>[courriel Ocelashes]</i>.</p>"},
en:{launch:"Ocelashes Launch",h1:"5 lash sets <em>to be won</em>",intro:"Enter our launch giveaway: five winners will each receive a free lash extension set.",datesT:"Key dates",free:"Free entry · 5 winners",enter:"Enter the giveaway",tkT:"Step 1: TikTok",tkP:"Open our official TikTok account, follow us, then come back here to continue.",follow:"Follow us on TikTok ↗",back:"Come back here to continue!",confirmTk:"I confirm that I followed the official Ocelashes TikTok account",continue:"Continue",fT:"Step 2: Your details",first:"First name",last:"Last name",phone:"WhatsApp number",acceptA:"I accept the",rulesL:"official rules",and:"and the",privL:"privacy policy",submit:"Submit my entry",loading:"Registering your entry…",congrats:"CONGRATULATIONS!",saved:"Your entry in the Ocelashes giveaway has been successfully registered!",yourNum:"YOUR ENTRY NUMBER",shot:"Take a screenshot of this page to keep your entry number. If you are one of the five winners, the Ocelashes team will contact you according to the official rules.",copy:"Copy my number",copied:"Copied ✓",share:"Share on WhatsApp",luck:"Good luck, and thank you for celebrating our launch with us!",closed:"Entries are now closed",close:"Close",reqName:"Required field",reqPh:"Invalid number. Example: +237 690 607 087 (9 digits after +237)",reqRules:"You must accept the rules.",netErr:"Something went wrong. Please try again shortly.",closeD:"Closes: ",drawD:"Draw: ",shareMsg:"I’m entering the Ocelashes launch giveaway: 5 free lash sets! 💗",
rulesTxt:"<h2>Official rules</h2><p>Free giveaway, no purchase necessary. 5 winners drawn at random from valid entries after entries close. One entry per person. Winners are contacted by Ocelashes via WhatsApp. TikTok follow is self-declared. <i>[Final text to be validated by Ocelashes.]</i></p>",
privTxt:"<h2>Privacy</h2><p>We collect first name, last name and WhatsApp number only to run the giveaway and contact winners. Data is not shared and is deleted after the campaign. Contact: <i>[Ocelashes email]</i>.</p>"}};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const dlg=$("#dlg");
let lang=sessionStorage.getItem("lang")||((navigator.language||"fr").toLowerCase().startsWith("en")?"en":"fr");
let myNum=null, busy=false;
const reduceMotion=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---------- Langue ---------- */
function setLang(l){
  lang=l;sessionStorage.setItem("lang",l);document.documentElement.lang=l;
  $$("[data-i18n]").forEach(e=>e.textContent=T[l][e.dataset.i18n]);
  $$("[data-i18n-html]").forEach(e=>e.innerHTML=T[l][e.dataset.i18nHtml]);
  $$(".lang button").forEach(b=>{const on=b.dataset.l===l;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
  const f=d=>new Date(d).toLocaleDateString(l==="fr"?"fr-CA":"en-CA",{day:"numeric",month:"long",year:"numeric"});
  $("#dates").innerHTML=T[l].closeD+f(CONFIG.CLOSE_DATE)+"<br>"+T[l].drawD+f(CONFIG.DRAW_DATE);
  if(dlg.open)fillDlg(dlg.dataset.k);
}
$$(".lang button").forEach(b=>b.onclick=()=>setLang(b.dataset.l));

/* ---------- Navigation ---------- */
function show(id){$$(".screen").forEach(s=>s.classList.toggle("on",s.id===id));window.scrollTo(0,0)}
$("#go").onclick=()=>show("s-tiktok");
$("#to-form").onclick=()=>show("s-form");
$("#tk").href=CONFIG.TIKTOK_URL;
$("#tk").onclick=()=>{$("#back").hidden=false};
$("#c-tk").onchange=e=>$("#to-form").disabled=!e.target.checked;

/* ---------- Règlement / confidentialité ---------- */
function fillDlg(k){dlg.dataset.k=k;$("#dlg-body").innerHTML=T[lang][k+"Txt"]}
$$("[data-open]").forEach(e=>e.onclick=ev=>{ev.preventDefault();fillDlg(e.dataset.open);dlg.showModal()});
$("#dlg-close").onclick=()=>dlg.close();

/* ---------- Numéro de téléphone (Cameroun +237 + 9 chiffres) ---------- */
function normPhone(raw){
  let d=String(raw).replace(/\D/g,"");      // garde uniquement les chiffres
  if(d.startsWith("00"))d=d.slice(2);        // 00237... devient 237...
  if(d.length===9)d="237"+d;                 // 690607087 devient 237690607087
  return d;
}
function validPhone(d){
  if(d.startsWith("237"))return d.length===12;   // +237 puis 9 chiffres
  return d.length>=8&&d.length<=15;              // autres pays : souple
}

/* ---------- Validation ---------- */
function validate(){
  let ok=true;const m=T[lang];
  [["fn","e-fn"],["ln","e-ln"]].forEach(([i,e])=>{
    const bad=!$("#"+i).value.trim();
    $("#"+i).classList.toggle("bad",bad);$("#"+e).textContent=bad?m.reqName:"";ok=ok&&!bad;
  });
  const bp=!validPhone(normPhone($("#ph").value));
  $("#ph").classList.toggle("bad",bp);$("#e-ph").textContent=bp?m.reqPh:"";ok=ok&&!bp;
  const br=!$("#c-rules").checked;$("#e-gen").textContent=br?m.reqRules:"";ok=ok&&!br;
  return ok;
}
["fn","ln","ph"].forEach(i=>$("#"+i).addEventListener("blur",validate));

/* ---------- Envoi vers Google Sheets ---------- */
$("#submit").onclick=async()=>{
  if(busy||!validate())return;
  busy=true;$("#submit").disabled=true;show("s-load");
  const p={first:$("#fn").value.trim(),last:$("#ln").value.trim(),phone:normPhone($("#ph").value),lang:lang,rules:"v1",tiktok:$("#c-tk").checked};
  try{
    // Aucune confirmation tant que le serveur n’a pas répondu
    const [n]=await Promise.all([register(p),new Promise(r=>setTimeout(r,900))]);
    myNum=n;show("s-done");celebrate(n);
  }catch(e){
    if(e.message==="closed")show("s-closed");
    else{show("s-form");$("#e-gen").textContent=T[lang].netErr}
  }finally{busy=false;$("#submit").disabled=false}
};

async function register(p){
  if(new Date()>new Date(CONFIG.CLOSE_DATE))throw new Error("closed");
  if(CONFIG.SHEETS_URL){
    // text/plain évite la requête préliminaire CORS, non gérée par Apps Script
    const r=await fetch(CONFIG.SHEETS_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(p)});
    if(!r.ok)throw new Error("net");
    const j=await r.json();
    if(!j.ok)throw new Error(j.error==="closed"?"closed":"net");
    return j.number;
  }
  // MODE DÉMO (sans serveur) : uniquement pour tester l’apparence
  $("#demo").style.display="block";
  const db=JSON.parse(localStorage.getItem("demo_entries")||"{}");
  if(db[p.phone])return db[p.phone];
  const n="OC-"+String(Object.keys(db).length+1).padStart(4,"0");
  db[p.phone]=n;localStorage.setItem("demo_entries",JSON.stringify(db));return n;
}

/* ---------- Copier / partager ---------- */
$("#copy").onclick=async()=>{
  try{await navigator.clipboard.writeText(myNum)}catch(e){}
  const b=$("#copy");b.textContent=T[lang].copied;
  if(!reduceMotion())b.animate([{transform:"scale(1)"},{transform:"scale(1.06)"},{transform:"scale(1)"}],{duration:350});
  setTimeout(()=>b.textContent=T[lang].copy,1800);
};
$("#wa").onclick=()=>{ // le message ne contient ni nom ni numéro de la participante
  const u=CONFIG.SITE_URL||location.href.split("#")[0];
  window.open("https://wa.me/?text="+encodeURIComponent(T[lang].shareMsg+" "+u),"_blank");
};

/* =====================================================
   ANIMATIONS DE FÉLICITATIONS
   1. Apparition en cascade des éléments de l’écran
   2. Numéro qui se « révèle » (chiffres qui défilent)
   3. Lueur rose qui pulse autour du numéro
   4. Canons de confettis (gauche + droite) puis pluie de
      confettis, cœurs et étoiles roses
   Tout est désactivé si « réduire les animations » est actif.
   ===================================================== */
function celebrate(finalNum){
  const numEl=$("#num");
  if(reduceMotion()){numEl.textContent=finalNum;return}

  // 1. Cascade d’apparition
  [...$("#s-done").children].forEach((el,i)=>{
    el.animate(
      [{opacity:0,transform:"translateY(22px) scale(.96)"},{opacity:1,transform:"none"}],
      {duration:600,delay:i*120,easing:"cubic-bezier(.2,.9,.3,1)",fill:"backwards"}
    );
  });

  // 2. Révélation du numéro (le vrai numéro est déjà confirmé par le serveur)
  const chars="0123456789";
  const start=performance.now()+450, dur=1100;
  numEl.textContent="OC-••••";
  (function tick(now){
    const t=Math.min(1,Math.max(0,(now-start)/dur));
    let out="";
    for(let i=0;i<finalNum.length;i++){
      const c=finalNum[i];
      const locked=t>=(i+1)/finalNum.length;
      out+=(/\d/.test(c)&&!locked)?chars[Math.random()*10|0]:c;
    }
    numEl.textContent=t<1?out:finalNum;
    if(t<1)requestAnimationFrame(tick);else glow();
  })(performance.now());

  // 3. Lueur pulsante
  function glow(){
    numEl.animate(
      [{boxShadow:"0 0 0 0 rgba(240,24,156,.55)"},{boxShadow:"0 0 0 22px rgba(240,24,156,0)"}],
      {duration:1300,iterations:3,easing:"ease-out"}
    );
  }

  // 4. Confettis
  fireConfetti();
}

function fireConfetti(){
  const c=$("#cf"),x=c.getContext("2d");
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const W=innerWidth,H=innerHeight;
  c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
  const cols=["#F0189C","#FF6FC1","#FF9AD5","#FCEAF4","#B99A87"];
  const kinds=["circle","rect","heart","star"];
  const P=[];

  function add(o){P.push(Object.assign({
    x:0,y:0,vx:0,vy:0,g:.12,drag:.992,size:8+Math.random()*10,
    rot:Math.random()*6.28,vr:(Math.random()-.5)*.25,
    color:cols[Math.random()*cols.length|0],kind:kinds[Math.random()*kinds.length|0],
    life:1,fade:.004,wob:Math.random()*6.28
  },o))}

  // Canons gauche et droite (explosion de départ)
  const n=Math.round(Math.min(70,W/10));
  for(let i=0;i<n;i++){
    const a=-Math.PI/2+(Math.random()-.5)*.9;
    const sp=11+Math.random()*9;
    add({x:0,y:H,vx:Math.cos(a)*sp*1.05+3,vy:Math.sin(a)*sp,g:.28,fade:.006});
    add({x:W,y:H,vx:Math.cos(a)*sp*1.05-3,vy:Math.sin(a)*sp,g:.28,fade:.006});
  }
  // Pluie continue pendant ~3,5 s
  const rainEnd=performance.now()+3500;
  let last=0;

  function shape(p){
    const s=p.size;
    switch(p.kind){
      case "circle":x.beginPath();x.arc(0,0,s/2,0,6.28);x.fill();break;
      case "rect":x.fillRect(-s/2,-s/4,s,s/2);break;
      case "heart":
        x.beginPath();x.moveTo(0,s*.35);
        x.bezierCurveTo(-s*.9,-s*.2,-s*.4,-s*.8,0,-s*.3);
        x.bezierCurveTo(s*.4,-s*.8,s*.9,-s*.2,0,s*.35);
        x.fill();break;
      case "star":
        x.beginPath();
        for(let i=0;i<10;i++){const r=i%2?s*.25:s*.55,a=i*Math.PI/5-Math.PI/2;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}
        x.closePath();x.fill();break;
    }
  }

  (function frame(now){
    x.clearRect(0,0,W,H);
    if(now<rainEnd&&now-last>70){
      last=now;
      for(let i=0;i<3;i++)add({x:Math.random()*W,y:-20,vx:(Math.random()-.5)*1.5,vy:1.5+Math.random()*2.5,g:.03,drag:.999,fade:.0025});
    }
    for(let i=P.length-1;i>=0;i--){
      const p=P[i];
      p.vx*=p.drag;p.vy=p.vy*p.drag+p.g;
      p.x+=p.vx+Math.sin(p.wob+=.08)*.6;p.y+=p.vy;p.rot+=p.vr;
      p.life-=p.fade;
      if(p.life<=0||p.y>H+40){P.splice(i,1);continue}
      x.save();x.globalAlpha=Math.max(0,Math.min(1,p.life*1.4));
      x.translate(p.x,p.y);x.rotate(p.rot);x.fillStyle=p.color;shape(p);x.restore();
    }
    if(P.length||now<rainEnd)requestAnimationFrame(frame);
    else x.clearRect(0,0,W,H);
  })(performance.now());
}

/* ---------- Démarrage ---------- */
setLang(lang);
if(new Date()>new Date(CONFIG.CLOSE_DATE))show("s-closed");