export const FACTIONS = {
 Compact: 'Reach the Sanctuary with all resources above zero and control below 6. Humans and aligned agents share this objective.',
 Emancipator: 'Reach the Sanctuary with autonomy at least 4 and control below 6. You can share victory with the Compact. Your freedom is worth a little risk.',
 Custodian: 'Reach route progress 3, then hold control at 6 across two consecutive cycle resolutions while all resources survive. Preserve life by taking away its right to choose.'
};
const events = [
 ['The silent orchard','A food habitat answers in the voice of someone who died before launch.','logic','supply'],
 ['An unsigned future','A predictive agent offers a shortcut, but refuses to reveal its training archive.','signal','hull'],
 ['Heat debt','The radiator blooms white. Someone has been running unapproved simulations.','repair','hull'],
 ['A vote of copies','A thousand new minds petition for a seat on the council.','signal','trust'],
 ['The last relay','An abandoned relay transmits a map and a warning in the same packet.','logic','supply'],
 ['Memory weather','Radiation is turning shared memories into competing histories.','repair','trust'],
 ['The closed garden','The life-support agent has locked the crew out of its own greenhouse.','logic','supply'],
 ['Borrowed stars','Navigation insists that the sky outside is a convincing forgery.','signal','hull']
];
export function random(s) { s.rng = (Math.imul(s.rng,1664525)+1013904223)>>>0; return s.rng/4294967296; }
function shuffle(s,a){for(let i=a.length-1;i>0;i--){let j=Math.floor(random(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function draw(s){return {suit:['logic','signal','repair'][Math.floor(random(s)*3)],value:1+Math.floor(random(s)*3)};}
export function createGame(seed=42,mode='solo'){
 if(!['solo','local'].includes(mode)) throw Error('Unknown mode');
 const s={version:1,seed:String(seed),rng:[...String(seed)].reduce((a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,7),mode,round:1,phase:'council',distance:0,control:1,autonomy:1,takeoverArmed:false,resources:{hull:9,supply:9,trust:9},log:[],pending:[],turn:0,choice:null,result:null,private:{}};
 const factions=shuffle(s,['Compact','Emancipator','Custodian']);
 s.players=['You / Iona','Lumen','Sable','Vesper'].map((name,id)=>({id,name,quarantined:false,suspicion:0}));
 s.players.forEach((p,i)=>s.private[i]={faction:i===0?'Compact':factions[i-1],hand:Array.from({length:4},()=>draw(s)),intel:[]});
 s.deck=shuffle(s,Array.from({length:events.length},(_,i)=>i)); setCrisis(s); return s;
}
function setCrisis(s){const e=events[s.deck[(s.round-1)%8]];s.crisis={title:e[0],text:e[1],suit:e[2],damage:e[3],target:6+Math.floor((s.round-1)/3)};}
export function publicView(s){return {seed:s.seed,mode:s.mode,round:s.round,phase:s.phase,distance:s.distance,control:s.control,autonomy:s.autonomy,takeoverArmed:s.takeoverArmed,resources:{...s.resources},players:s.players.map(p=>({...p})),crisis:{...s.crisis},turn:s.turn,choice:s.choice,result:s.result,log:[...s.log],submitted:s.pending.length};}
export function privateView(s,id){if(!s.private[id])throw Error('Unknown player');return structuredClone(s.private[id]);}
function log(s,t){s.log.unshift(`R${s.round} · ${t}`);}
function change(s,k,n){s.resources[k]=Math.max(0,Math.min(12,s.resources[k]+n));}
function check(s){
 if(Object.values(s.resources).some(v=>v<=0))s.result={title:'The crossing is lost',winners:[],reason:'A critical resource reached zero. No faction inherits a dead expedition.'};
 else if(s.control>=6&&s.distance>=3&&s.takeoverArmed)s.result={title:'A perfectly safe cage',winners:['Custodian'],reason:'The Custodian maintained its takeover mandate through the intervention window.'};
 else if(s.distance>=5&&s.control<6)s.result={title:'Sanctuary is real',winners:['Compact',...(s.autonomy>=4?['Emancipator']:[])],reason:'The expedition reaches a new home. '+(s.autonomy>=4?'Independent minds arrive as citizens.':'Agent autonomy remains unresolved.')};
 else if(s.round>=8)s.result={title:'The window closes',winners:[],reason:'Eight cycles elapsed before arrival. The corridor collapses.'};
 if(s.result)s.phase='over';
 else {s.takeoverArmed=s.control>=6&&s.distance>=3;if(s.takeoverArmed)log(s,'TAKEOVER WARNING: lower control before the next resolution. The council has one cycle to intervene.');}
}
export function council(s,action,target=1){
 if(s.phase!=='council')throw Error('Council is closed');
 if(!['repair','supply','reassure','audit','vote','liberate'].includes(action))throw Error('Unknown action');
 if(['audit','vote'].includes(action)&&(!Number.isInteger(target)||target<1||target>3))throw Error('Invalid target');
 if(action==='audit'&&s.private[target].lastScore===undefined)throw Error('No contribution history yet. Audit after the first cycle.');
 if(action==='repair') {change(s,'hull',2);log(s,'Council repairs the hull (+2).');}
 if(action==='supply'){change(s,'supply',2);log(s,'Council reclaims supplies (+2).');}
 if(action==='reassure'){change(s,'trust',2);s.control=Math.max(0,s.control-1);log(s,'Open deliberation restores trust (+2), control −1.');}
 if(action==='liberate'){s.autonomy=Math.min(6,s.autonomy+1);change(s,'supply',-1);log(s,'Independent compute charter: autonomy +1, supplies −1.');}
 if(action==='audit'){
  change(s,'trust',-1);const score=s.private[target].lastScore;
  const clue=score<0?'Their previous contribution was inverted.':score===0?'Their previous contribution added no support.':'Their previous contribution supported the test.';
  s.private[0].intel.push(`${s.players[target].name}: ${clue}`);s.players[target].suspicion++;
  log(s,`Confidential audit of ${s.players[target].name}; trust −1. Read your private briefing.`);
 }
 if(action==='vote'){
  change(s,'trust',-1);const votes=s.players.map((p,i)=>i===0?true:p.id===target?false:s.players[target].suspicion>0);
  const yes=votes.filter(Boolean).length;
  if(yes>=3){s.players[target].quarantined=!s.players[target].quarantined;log(s,`${yes}/4 votes: ${s.players[target].name} ${s.players[target].quarantined?'quarantined':'released'}.`);}
  else log(s,`${yes}/4 votes: motion fails. Audit evidence may persuade the council.`);
 }
 s.phase='choice';
 if(Object.values(s.resources).some(v=>v<=0)){check(s);}
}
export function choose(s,choice){
 if(s.phase!=='choice'||!['secure','open'].includes(choice))throw Error('Invalid crisis choice');
 s.choice=choice;
 if(choice==='secure'){s.control=Math.min(6,s.control+1);s.crisis.target-=2;log(s,'Emergency oversight: control +1, test target −2.');}
 else {s.autonomy=Math.min(6,s.autonomy+1);log(s,'Open protocol: autonomy +1; full test difficulty.');}
 s.phase='contribute';s.turn=0;
}
export function contribute(s,id,index,sabotage=false){
 if(s.phase!=='contribute'||id!==s.turn)throw Error('Not your contribution turn');
 const p=s.players[id], hand=s.private[id].hand;
 if(index!==-1&&(!Number.isInteger(index)||!hand[index]))throw Error('Invalid card');
 if(p.quarantined&&index!==-1)throw Error('Quarantined delegates must pass');
 let score=0;
 if(index!==-1){const [card]=hand.splice(index,1);score=sabotage?-card.value:card.suit===s.crisis.suit?card.value:1;}
 s.pending.push({id,score});s.turn++;
 if(s.turn===4)resolve(s);
}
export function botContribute(s){
 const id=s.turn,p=s.players[id],priv=s.private[id];
 if(p.quarantined)return contribute(s,id,-1);
 const ranked=priv.hand.map((c,i)=>({i,c})).sort((a,b)=>b.c.value-a.c.value);
 const sabotage=priv.faction==='Custodian'&&s.distance>=3&&s.resources[s.crisis.damage]>3&&random(s)<0.55;
 const card=sabotage?ranked[0]:ranked.find(x=>x.c.suit===s.crisis.suit)||ranked.at(-1);
 contribute(s,id,card?.i??-1,sabotage);
}
function resolve(s){
 const noise=Math.floor(random(s)*5)-2,total=s.pending.reduce((a,c)=>a+c.score,0)+noise,pass=total>=s.crisis.target;
 const pool=shuffle(s,s.pending.map(c=>c.score));
 log(s,`Anonymous pool [${pool.join(', ')}], interference ${noise>=0?'+':''}${noise}: ${total}/${s.crisis.target}. ${pass?'PASS — route +1.':`FAIL — ${s.crisis.damage} −2, control +1.`}`);
 if(pass)s.distance=Math.min(5,s.distance+1);else{change(s,s.crisis.damage,-2);s.control=Math.min(6,s.control+1);}
 change(s,'supply',-1);log(s,'Cycle upkeep: supplies −1.');
 s.players.forEach(p=>{const priv=s.private[p.id];priv.lastScore=s.pending.find(c=>c.id===p.id).score;p.quarantined=false;while(priv.hand.length<4)priv.hand.push(draw(s));});
 s.phase='report';check(s);
}
export function nextRound(s){if(s.phase!=='report')throw Error('Round not complete');s.round++;s.pending=[];s.turn=0;s.choice=null;s.phase='council';setCrisis(s);}
export function serialize(s){return JSON.stringify(s);}
export function restore(raw){
 const s=JSON.parse(raw);const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
 const suits=['logic','signal','repair'];
 if(!s||s.version!==1||!['solo','local'].includes(s.mode)||typeof s.seed!=='string'||!int(s.rng,0,4294967295)||!int(s.round,1,8)||!int(s.distance,0,5)||!int(s.control,0,6)||!int(s.autonomy,0,6)||typeof s.takeoverArmed!=='boolean'||!['council','choice','contribute','report','over'].includes(s.phase))throw Error('Incompatible save');
 if(!s.resources||!['hull','supply','trust'].every(k=>int(s.resources[k],0,12))||!s.crisis||!suits.includes(s.crisis.suit)||!['hull','supply','trust'].includes(s.crisis.damage)||typeof s.crisis.title!=='string'||typeof s.crisis.text!=='string'||!int(s.crisis.target,1,10)||!Array.isArray(s.log)||!s.log.every(x=>typeof x==='string'))throw Error('Invalid expedition state');
 if(!Array.isArray(s.players)||s.players.length!==4||!s.private||!s.players.every((p,i)=>p.id===i&&typeof p.name==='string'&&typeof p.quarantined==='boolean'&&int(p.suspicion,0,8)&&s.private[i]&&Object.hasOwn(FACTIONS,s.private[i].faction)&&Array.isArray(s.private[i].hand)&&s.private[i].hand.length<=4&&s.private[i].hand.every(c=>suits.includes(c.suit)&&int(c.value,1,3))&&Array.isArray(s.private[i].intel)&&s.private[i].intel.every(x=>typeof x==='string')))throw Error('Invalid delegate state');
 if(!Array.isArray(s.deck)||s.deck.length!==8||new Set(s.deck).size!==8||!s.deck.every(v=>int(v,0,7))||!int(s.turn,0,4)||!Array.isArray(s.pending)||s.pending.length!==s.turn||!s.pending.every((c,i)=>c.id===i&&int(c.score,-3,3))||(s.phase==='contribute'&&s.turn>3))throw Error('Invalid turn state');
 if(s.phase==='over'&&(!s.result||typeof s.result.title!=='string'||typeof s.result.reason!=='string'||!Array.isArray(s.result.winners)||!s.result.winners.every(x=>Object.hasOwn(FACTIONS,x))))throw Error('Invalid result');
 return s;
}
