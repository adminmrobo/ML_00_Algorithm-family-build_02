/* ══ 4-6 회귀파 일곱 ═══════════════════════════════════════════════ */
var APT=REG.apt(1),APT0=REG.apt(0),YMAX=22;
var BASE=(function(){var mu=ML.mean(APT.tr.map(function(d){return d.p}));return {mu:mu,va:REG.maeOf(function(){return mu},APT.va),tr:REG.maeOf(function(){return mu},APT.tr)};})();

/* 공용: 면적-매매가 평면 */
function aptFrame(cv,H,opt){opt=opt||{};var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=46,r=Wd-12,tp=12,bt=H-30,x0=opt.x0||20,x1=opt.x1||120,y1=opt.y1||YMAX;ctx.clearRect(0,0,Wd,H);
  function px(a){return l+(a-x0)/(x1-x0)*(r-l)}function py(p){return bt-p/y1*(bt-tp)}
  ctx.strokeStyle=C.rule;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();
  ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.fillText('면적 (㎡)',(l+r)/2,H-5);
  for(var a=Math.ceil(x0/20)*20;a<=x1;a+=20)ctx.fillText(a,px(a),bt+14);
  ctx.textAlign='right';for(var p=0;p<=y1;p+=(y1>25?10:5))ctx.fillText(p,l-6,py(p)+4);
  ctx.save();ctx.translate(11,(tp+bt)/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText('매매가 (억 원)',0,0);ctx.restore();
  return {ctx:ctx,C:C,W:Wd,px:px,py:py,l:l,r:r,tp:tp,bt:bt};}
function aptPoints(F,S,dim){S.tr.forEach(function(d){circ(F.ctx,F.px(d.a),F.py(d.p),3.1,rgba(F.C.info,dim?.35:.9));});
  S.va.forEach(function(d){circ(F.ctx,F.px(d.a),F.py(d.p),3.1,null,rgba(F.C.amber,dim?.4:.95),1.6);});}
function aptCurve(F,f,col,lw,x0,x1){var ctx=F.ctx;ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.beginPath();x0=x0||20;x1=x1||120;for(var q=0;q<=200;q++){var a=x0+(x1-x0)*q/200,v=f(a);var Y=Math.max(F.tp-4,Math.min(F.bt+4,F.py(v)));q?ctx.lineTo(F.px(a),Y):ctx.moveTo(F.px(a),Y);}ctx.stroke();}
function aptTruth(F,curved,x0,x1){F.ctx.setLineDash([5,5]);aptCurve(F,function(a){return REG.truth(curved,a)},rgba(F.C.text,.55),1.5,x0,x1);F.ctx.setLineDash([]);}
function eok(v){return fx(v,2)+'억'}

/* ── 히어로: 조직원 패 서른네 개 ── */
var ROWS=[['회귀파',7,'#82b8ff'],['분류파',8,'#82b8ff'],['비지도 (군집·차원 축소)',9,'#8fb878'],['강화',3,'#d4a54a'],['앙상블',7,'#b56a8a']];
heroStage($('heroCv'),{bg:'sc_registry',bgY:.35,fly:'ruler',robo:'stack',motif:function(ctx,t,W,H){
  ctx.fillStyle='rgba(15,13,11,.8)';rr(ctx,250,22,600,262,16);ctx.fill();ctx.strokeStyle='rgba(212,165,74,.5)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.font=font(14,700);ctx.textAlign='center';ctx.fillStyle='#d4a54a';ctx.fillText('조직원 명부 · 서른네 명',550,46);
  var shown=34,k=0;ROWS.forEach(function(row,i){var y=64+i*42;ctx.font=font(11.5,700);ctx.textAlign='right';ctx.fillStyle=i===0?'#efe6d8':'rgba(239,230,216,.6)';ctx.fillText(row[0],420,y+24);
    for(var j=0;j<row[1];j++){var x=432+j*44;if(k<shown){var tok=NPC.draw('token',3,row[2]);ctx.globalAlpha=i===0?1:.55;ctx.drawImage(tok,x,y);ctx.globalAlpha=1;
      if(i===0){var g=(Math.sin(t*3-j*.6)+1)/2;ctx.strokeStyle=rgba('#d4a54a',.25+.5*g);ctx.lineWidth=2;ctx.strokeRect(x-3,y-3,36,42);}}k++;}});}});
document.querySelectorAll('#door6 a').forEach(function(a){a.insertBefore(NPC.crest(a.getAttribute('data-c'),2,''),a.firstChild);});

/* ── 신상 파일 ── */
var MEMBERS=[
 {k:'lin',n:'선형 회귀',s:'직선 하나',one:'가장 단순한 직선 하나로 답한다.',eq:'ŷ = w·x + b',when:'관계가 거의 직선일 때, 결과를 기울기로 설명해야 할 때',weak:'휜 관계를 못 따라간다. 튀는 값에 끌려간다',diff:'형제 모두의 출발점. 나머지 여섯은 여기에 규제를 더하거나 직선을 버린 것이다'},
 {k:'ridge',n:'Ridge',s:'L2 규제',one:'가중치를 골고루 작게 눌러 출렁임을 줄인다.',eq:'오차² 합 + λ·Σw²',when:'특징이 많고 서로 비슷할 때',weak:'가중치가 0이 되지 않아 특징을 골라 주지는 않는다',diff:'Lasso와 달리 모든 특징을 조금씩 남긴다'},
 {k:'lasso',n:'Lasso',s:'L1 규제',one:'쓸모없는 가중치를 0으로 만들어 특징을 고른다.',eq:'오차² 합 + λ·Σ|w|',when:'특징 가운데 진짜 쓸모 있는 것이 몇 개뿐일 때',weak:'비슷한 특징이 여럿이면 그중 하나만 골라 들쭉날쭉하다',diff:'Ridge는 줄이기만, Lasso는 지운다'},
 {k:'enet',n:'Elastic Net',s:'L1 + L2',one:'Ridge와 Lasso를 섞어 둘의 장점을 함께 쓴다.',eq:'오차² 합 + λ(α·Σ|w| + (1−α)·Σw²)',when:'특징이 많고, 서로 겹치는 특징 묶음이 있을 때',weak:'조정할 값이 λ와 α 둘이다',diff:'α = 1이면 Lasso, α = 0이면 Ridge'},
 {k:'svr',n:'SVR',s:'ε 띠',one:'폭 ε 안의 오차는 봐주고, 밖으로 나간 만큼만 벌한다.',eq:'Σ max(0, |y − ŷ| − ε) + λ‖w‖²',when:'잡음에 덜 흔들리고 싶을 때, 커널로 곡선을 그릴 때',weak:'데이터가 많으면 느리다. ε과 커널 설정을 골라야 한다',diff:'다른 형제는 모든 오차를 세지만, SVR은 띠 안의 오차를 0으로 본다'},
 {k:'tree',n:'결정 트리 회귀',s:'계단',one:'질문으로 집을 나누고 칸마다 평균을 답한다.',eq:'ŷ = 그 칸의 평균값',when:'관계가 꺾이거나 구간마다 다를 때, 규칙을 읽고 싶을 때',weak:'계단이 거칠다. 깊게 키우면 외운다. 훈련 범위 밖은 맞히지 못한다',diff:'직선을 아예 버렸다. 깊이 하나로 단순함을 조절한다'},
 {k:'gbm',n:'GBM 회귀',s:'계단 덧대기',one:'틀린 만큼을 다음 트리가 배우며 계단을 매끈하게 다듬는다.',eq:'F_m = F_(m−1) + η·트리_m(잔차)',when:'관계가 복잡한 표 데이터에서 정확도가 중요할 때',weak:'설정할 값이 많고, 잡음까지 따라갈 수 있다. 범위 밖은 평평하다',diff:'트리 회귀를 여러 번 덧댄 것. 4-10 앙상블 계보에서 다시 만난다'}];
var FITS={};MEMBERS.forEach(function(m){FITS[m.k]=REG.fitMember(m.k,APT);});
(function(){var host=$('mlist'),cur='lin',cv=$('fileCv'),col='#82b8ff';
 MEMBERS.forEach(function(m,i){var b=document.createElement('button');b.type='button';b.setAttribute('data-v',m.k);b.setAttribute('aria-pressed',i===0?'true':'false');
   b.appendChild(NPC.el('token',2,'',col));b.insertAdjacentHTML('beforeend','<span><b>'+(i+1)+'. '+m.n+'</b><small>'+m.s+'</small></span>');host.appendChild(b);});
 npcLine($('scareHost'),['scare'],2,'문 앞 허수아비 <b>기준이</b>: "나는 집이 몇 ㎡든 늘 평균값 '+eok(BASE.mu)+'만 답한다." 기준이의 검증 MAE는 '+eok(BASE.va)+'. 조직원이라면 적어도 이보다는 잘 맞혀야 한다.');
 function draw(){var F=aptFrame(cv,280),m=FITS[cur];aptPoints(F,APT,cur==='svr');aptTruth(F,1);
   if(cur==='svr'){var e=m.f.eps;F.ctx.fillStyle=rgba(F.C.gfp,.14);F.ctx.beginPath();for(var q=0;q<=200;q++){var a=20+q/2;F.ctx.lineTo(F.px(a),F.py(m.f(a)+e));}for(q=200;q>=0;q--){a=20+q/2;F.ctx.lineTo(F.px(a),F.py(m.f(a)-e));}F.ctx.fill();}
   aptCurve(F,m.f,F.C.gfp,3);F.ctx.font=font(11.5,700);F.ctx.fillStyle=F.C.text;F.ctx.textAlign='left';F.ctx.fillText(MEMBERS.filter(function(x){return x.k===cur})[0].n,F.l+8,F.tp+14);stamp(F.ctx,F.W,'예시 데이터');}
 function ui(){var M=MEMBERS.filter(function(x){return x.k===cur})[0],m=FITS[cur],best=MEMBERS.reduce(function(a,x){return FITS[x.k].va<FITS[a.k].va?x:a});
   $('mpanel').innerHTML='<dl><dt>특기 한 줄</dt><dd><b>'+M.one+'</b></dd><dt>핵심 식</dt><dd><code class="eq">'+M.eq+'</code></dd><dt>언제 쓰나</dt><dd>'+M.when+'</dd><dt>약점</dt><dd>'+M.weak+'</dd><dt>형제와의 차이</dt><dd>'+M.diff+'</dd></dl>';
   $('fileStat').innerHTML='<div><b class="num">'+eok(m.tr)+'</b><span>훈련 MAE (80채)</span></div><div><b class="num">'+eok(m.va)+'</b><span>검증 MAE (40채)</span></div><div><b class="num">'+eok(BASE.va)+'</b><span>기준이(평균만) 검증 MAE</span></div><div><b class="num">'+best.n+'</b><span>일곱 중 검증 1위</span></div>';draw();}
 seg('#mlist button',function(v){cur=v;ui();});ui();onRedraw(draw);})();

/* ── 01 직선과 잔차 ── */
(function(){var cv=$('linCv'),mode=1;
 function draw(){var S=mode?APT:APT0,d=REG.duel(S),F=aptFrame(cv,260);
   S.tr.forEach(function(p){var y0=d.lin.f(p.a);F.ctx.strokeStyle=rgba(p.p>y0?F.C.orange:F.C.info,.75);F.ctx.lineWidth=2;F.ctx.beginPath();F.ctx.moveTo(F.px(p.a),F.py(p.p));F.ctx.lineTo(F.px(p.a),F.py(y0));F.ctx.stroke();circ(F.ctx,F.px(p.a),F.py(p.p),3,F.C.text);});
   aptCurve(F,d.lin.f,F.C.gfp,3);stamp(F.ctx,F.W,'예시 데이터');return d;}
 function ui(){var d=draw();$('linInfo').innerHTML='<b>배운 직선:</b> 매매가 ≈ '+fx(d.lin.b,2)+' + '+fx(d.lin.w,3)+' × 면적. 검증 MAE '+eok(d.lin.va)+'. '+(mode?'주황(직선보다 위)은 작은 집과 큰 집에, 파랑(아래)은 중간 크기에 몰려 있다. 직선이 휜 모양을 놓쳤다는 뜻이다.':'잔차가 위아래로 고르게 흩어져 무늬가 없다. 직선으로 충분하다.');}
 seg('#m1 .pills button',function(v){mode=+v;ui();});ui();onRedraw(function(){draw();});})();

/* ── 02 규제 3형제 ── */
var TAB=REG.table(),LAMS=[0,0.01,0.02,0.05,0.1,0.2,0.3,0.5,0.75,1,1.5,2];
(function(){var kind='lasso',li=5;
 function ui(){var lam=LAMS[li],s=REG.shrink(TAB,kind,lam),mx=3;$('lamVal').textContent=lam;
   $('wBars').innerHTML=REG.FEATS.map(function(f,j){var w=s.w[j],z=Math.abs(w)<1e-6,noise=j>=5;return '<div class="row"><span style="'+(noise?'color:var(--muted)':'')+'">'+f+'</span><div class="tr"><div class="fl" style="width:'+Math.min(100,Math.abs(w)/mx*100)+'%;background:'+(w>=0?'var(--info)':'var(--orange)')+'"></div></div><span class="v" style="'+(z?'color:var(--eye)':'')+'">'+(z?'0':fx(w,2))+'</span></div>';}).join('');
   var zn=s.w.slice(5).filter(function(v){return Math.abs(v)<1e-6}).length;
   $('wStat').innerHTML='<div><b class="num">'+s.zeros+'개</b><span>0이 된 가중치</span></div><div><b class="num">'+zn+' / 5</b><span>그중 잡음 특징</span></div><div><b class="num">'+eok(s.va)+'</b><span>검증 MAE (32채)</span></div>';}
 seg('#m2 .pills button',function(v){kind=v;ui();});$('lamSl').addEventListener('input',function(){li=+this.value;ui();});ui();})();

/* ── 03 SVR ── */
(function(){var cv=$('svrCv'),EPS=[0.1,0.25,0.5,0.75,1,1.5,2,3,4],ei=2,phi=ML.rff(1,80,4,7),A=APT.tr.map(function(d){return [(d.a-70)/30]}),Y=APT.tr.map(function(d){return d.p}),cache={};
 function model(e){if(!cache[e]){var m=ML.svr(A,Y,e,0.0005,1500,0.5,phi);cache[e]=function(a){return m.predict([(a-70)/30])};}return cache[e];}
 function draw(){var e=EPS[ei],f=model(e),F=aptFrame(cv,260),ctx=F.ctx;
   ctx.fillStyle=rgba(F.C.gfp,.15);ctx.beginPath();for(var q=0;q<=200;q++){var a=20+q/2;ctx.lineTo(F.px(a),F.py(f(a)+e));}for(q=200;q>=0;q--){a=20+q/2;ctx.lineTo(F.px(a),F.py(f(a)-e));}ctx.fill();
   var inside=0;APT.tr.forEach(function(d){var o=Math.abs(d.p-f(d.a))<=e;if(o)inside++;circ(ctx,F.px(d.a),F.py(d.p),3.1,o?rgba(F.C.info,.3):F.C.info);});
   aptCurve(F,f,F.C.gfp,3);stamp(F.ctx,F.W,'RBF 커널 근사');
   $('epsVal').textContent=e;$('svrStat').innerHTML='<div><b class="num">'+inside+' / '+APT.tr.length+'</b><span>띠 안의 점 (벌점 0)</span></div><div><b class="num">'+eok(REG.maeOf(f,APT.tr))+'</b><span>훈련 MAE</span></div><div><b class="num">'+eok(REG.maeOf(f,APT.va))+'</b><span>검증 MAE</span></div>';}
 $('epsSl').addEventListener('input',function(){ei=+this.value;draw();});draw();onRedraw(draw);})();

/* ── 04 트리 회귀 깊이 ── */
var TDEP=[];(function(){var A=APT.tr.map(function(d){return [d.a]}),Y=APT.tr.map(function(d){return d.p});for(var dp=1;dp<=12;dp++){var t=ML.regTree(A,Y,dp,1),f=(function(t){return function(a){return t.predict([a])}})(t);TDEP.push({f:f,leaves:t.leaves,tr:REG.maeOf(f,APT.tr),va:REG.maeOf(f,APT.va)});}})();
(function(){var cv=$('trCv'),cc=$('trCurve'),dep=3;
 function draw(){var o=TDEP[dep-1],F=aptFrame(cv,240);aptPoints(F,APT);aptTruth(F,1);aptCurve(F,o.f,F.C.gfp,2.6);F.ctx.font=font(11.5,700);F.ctx.fillStyle=F.C.text;F.ctx.textAlign='left';F.ctx.fillText('깊이 '+dep+' · 잎 '+o.leaves+'개',F.l+8,F.tp+14);stamp(F.ctx,F.W,'점선 = 진짜 규칙');
   var H=150,Wd=fit(cc,H),ctx=cc.getContext('2d'),C=cols(),l=40,r=Wd-10,tp=10,bt=H-24,mx=2.2;ctx.clearRect(0,0,Wd,H);
   function px(d){return l+(d-1)/11*(r-l)}function py(v){return bt-Math.min(v,mx)/mx*(bt-tp)}
   ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='right';[0,1,2].forEach(function(v){ctx.fillText(v,l-4,py(v)+4);});ctx.textAlign='center';[1,3,6,9,12].forEach(function(v){ctx.fillText(v,px(v),bt+14);});
   [['tr',C.gfp],['va',C.amber]].forEach(function(s){ctx.strokeStyle=s[1];ctx.lineWidth=2.4;ctx.beginPath();TDEP.forEach(function(o,i){var X=px(i+1),Y=py(o[s[0]]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.stroke();TDEP.forEach(function(o,i){circ(ctx,px(i+1),py(o[s[0]]),i+1===dep?5:2.5,s[1]);});});
   ctx.fillStyle=C.text;ctx.textAlign='left';ctx.font=font(11,700);ctx.fillText('훈련 '+eok(o.tr)+' · 검증 '+eok(o.va)+' (MAE)',l+6,tp+12);}
 $('trSl').addEventListener('input',function(){dep=+this.value;$('trVal').textContent=dep;draw();});draw();onRedraw(draw);})();

/* ── 04 GBM 덧대기 재생 ── */
var GBM=FITS.gbm.f.g;
(function(){var cv=$('gbCv'),k=1,run=false,acc=0,M=GBM.trees.length;
 function fk(a){return GBM.predictK([a],k)}
 function draw(){var H=280,F=aptFrame(cv,H),ctx=F.ctx;aptPoints(F,APT,true);aptTruth(F,1);
   if(k>1)aptCurve(F,function(a){return GBM.predictK([a],k-1)},rgba(F.C.muted,.6),1.5);aptCurve(F,fk,F.C.gfp,3);
   ctx.font=font(11.5,700);ctx.fillStyle=F.C.text;ctx.textAlign='left';ctx.fillText(k+'그루째 누적 예측 (회색 = 한 그루 전)',F.l+8,F.tp+14);stamp(ctx,F.W,'예시 데이터');}
 function ui(){$('gbStat').innerHTML='<div><b class="num">'+k+' / '+M+'</b><span>트리 수</span></div><div><b class="num">'+eok(REG.maeOf(fk,APT.tr))+'</b><span>훈련 MAE</span></div><div><b class="num">'+eok(REG.maeOf(fk,APT.va))+'</b><span>검증 MAE</span></div>';$('gbPlay').textContent=run?'❚❚ 멈춤':'▶ 덧대기';}
 function go(){draw();ui();}
 $('gbPlay').addEventListener('click',function(){if(k>=M)k=1;run=!run;go();});$('gbStep').addEventListener('click',function(){run=false;k=Math.min(M,k+1);go();});$('gbReset').addEventListener('click',function(){run=false;k=1;go();});
 onTick(cv,function(dt){if(!run)return;acc+=dt;var step=k<10?.35:(k<30?.12:.05);if(acc>step){acc=0;k++;if(k>=M){k=M;run=false;}go();}});go();onRedraw(draw);})();

/* ── 담판: 선형 회귀 vs GBM 회귀 ── */
function duelFigure(id,S,d,curved,x1){var F=aptFrame($(id),230,{x1:x1||120,y1:x1?32:YMAX});aptPoints(F,S,true);aptTruth(F,curved,20,x1||120);
  aptCurve(F,d.lin.f,F.C.c_fly||F.C.eye,2.8,20,x1||120);aptCurve(F,d.gbm.f,F.C.c_robo||F.C.info,2.8,20,x1||120);
  if(x1){F.ctx.fillStyle=rgba(F.C.amber,.08);F.ctx.fillRect(F.px(120),F.tp,F.px(x1)-F.px(120),F.bt-F.tp);F.ctx.font=font(11);F.ctx.fillStyle=F.C.amber;F.ctx.textAlign='left';F.ctx.fillText('훈련 범위 밖',F.px(121),F.tp+14);}
  stamp(F.ctx,F.W,'예시 데이터');}
function duelLegend(){return '<div class="legend"><span><i style="background:var(--c-fly)"></i>초파리 · 선형 회귀</span><span><i style="background:var(--c-robo)"></i>Money-Robo · GBM 회귀</span><span><i style="background:var(--muted)"></i>점선 = 진짜 규칙</span></div>';}
Duel('d6',{title:'휜 집값을 무엇으로 맞힐까',q:'아파트 120채(훈련 80, 검증 40). 넓은 집일수록 값이 가파르게 오르는 휜 데이터다. 처음 보는 40채의 매매가를 누가 덜 빗나갈까? 검증 MAE(평균 몇 억 빗나갔나)로 잰다.',
 fly:['선형 회귀','단순한 게 설명하기 좋아. 기울기 하나면 끝이야.'],robo:['GBM 회귀 (트리 100그루)','매매가는 곡선이야. 비싼 걸로 간다.'],roboMood:'chart',
 run:async function(p){p(.3);await wait(120);var d=REG.duel(APT);p(1);
  return {winner:d.gbm.va<d.lin.va?'r':(d.gbm.va>d.lin.va?'f':'d'),big:d.lin.va>1.5*d.gbm.va,
   measure:'처음 보는 40채에서 초파리 쪽 선형 회귀는 평균 '+eok(d.lin.va)+', Money-Robo 쪽 GBM 회귀는 평균 '+eok(d.gbm.va)+' 빗나갔어요. 훈련 80채에서는 '+eok(d.lin.tr)+' 대 '+eok(d.gbm.tr)+'예요. 기준이(늘 평균만)는 '+eok(BASE.va)+'였어요.',
   verdict:'데이터가 휘었으면 직선은 진다. 직선은 작은 집과 큰 집을 싸게, 중간 집을 비싸게 불렀다. 이 구역은 Money-Robo 쪽이다.',key:'모델의 모양이 데이터의 모양을 따라가야 한다.',
   render:function(box){box.innerHTML=statGrid([[eok(d.lin.tr),'초파리 · 훈련 MAE','f'],[eok(d.lin.va),'초파리 · 검증 MAE','f'],[eok(d.gbm.tr),'Money-Robo · 훈련 MAE','r'],[eok(d.gbm.va),'Money-Robo · 검증 MAE','r']])+
    '<div class="cwrap" style="margin-top:12px"><canvas class="fig" id="dA" aria-label="휜 데이터 위에 선형 회귀 직선과 GBM 회귀의 계단 곡선"></canvas></div>'+duelLegend();
    function dr(){duelFigure('dA',APT,d,1);}setTimeout(dr,0);onRedraw(dr);}};},
 alts:[{label:'데이터가 거의 직선이라면?',run:async function(box){var d=REG.duel(APT0);
   box.innerHTML=statGrid([[eok(d.lin.va),'초파리 · 선형 · 검증 MAE','f'],[eok(d.gbm.va),'Money-Robo · GBM · 검증 MAE','r']])+'<div class="cwrap" style="margin-top:10px"><canvas class="fig" id="dB" aria-label="거의 직선인 데이터 위의 두 예측선"></canvas></div>'+duelLegend()+
    say('fly','arms','봐, 거의 직선이면 내 직선이 '+eok(d.lin.va)+', GBM은 '+eok(d.gbm.va)+'. 계단을 100번 덧댈 필요가 없지. 게다가 내 건 "1㎡에 '+fx(d.lin.w,3)+'억"이라고 한 줄로 설명돼.')+say('robo','sigh','…같은 숫자면 싼 쪽이 이득이긴 하지.');
   function dr(){duelFigure('dB',APT0,d,0);}setTimeout(dr,0);}},
  {label:'훈련 범위 밖(125~150㎡)을 물으면?',run:async function(box){var d=REG.duel(APT),el=0,eg=0,n=0;for(var a=125;a<=150;a+=5){var t=REG.truth(1,a);el+=Math.abs(d.lin.f(a)-t);eg+=Math.abs(d.gbm.f(a)-t);n++;}
   box.innerHTML=statGrid([[eok(el/n),'초파리 · 선형 · 평균 오차','f'],[eok(eg/n),'Money-Robo · GBM · 평균 오차','r'],[eok(d.gbm.f(150)),'GBM이 부른 150㎡ 값'],[eok(REG.truth(1,150)),'진짜 규칙의 150㎡ 값']])+
    '<div class="cwrap" style="margin-top:10px"><canvas class="fig" id="dC" aria-label="훈련 범위 밖까지 넓힌 그림. GBM 예측은 120㎡ 뒤로 평평하고, 직선은 계속 오르지만 진짜 곡선보다 덜 오른다"></canvas></div>'+duelLegend()+
    say('asst','ledger','둘 다 틀리지만 GBM이 더 틀려요. 트리는 칸마다 훈련 집값의 평균을 답하니까, 가장 큰 훈련 집보다 비싼 값을 부를 수 없어요. 그래서 120㎡ 뒤로는 평평해요.')+say('fly','point','배운 범위 밖에서는 아무도 믿지 마. 그게 진짜 교훈이야.');
   function dr(){duelFigure('dC',APT,d,1,150);}setTimeout(dr,0);}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q6:[
 {q:'특징 10개 가운데 쓸모없는 잡음 특징의 가중치를 정확히 0으로 만들어 "특징 고르기"까지 해 주는 조직원은?',o:[['Lasso',1,'L1 벌점(절댓값의 합)은 작은 가중치를 0으로 밀어낸다. 02장에서 λ를 올리면 잡음 막대부터 0이 됐다.'],['Ridge',0,'Ridge의 L2 벌점은 가중치를 작게 만들 뿐 0으로 만들지는 않는다.'],['결정 트리 회귀',0,'트리는 가중치가 없다. 쓰지 않는 특징이 생길 수는 있지만 규제와는 다른 이야기다.']]},
 {q:'선형 회귀의 잔차가 "가운데는 아래, 양 끝은 위"로 몰려 있다. 무슨 뜻일까?',o:[['데이터가 휘어 있어 직선이 그 모양을 놓쳤다',1,'잔차에 무늬가 있으면 모델이 데이터의 모양을 다 담지 못한 것이다. 01장에서 거의 직선 데이터로 바꾸면 무늬가 사라졌다.'],['잡음이 너무 많다',0,'잡음이면 잔차가 위아래로 고르게 흩어진다. 무늬가 생기지 않는다.'],['데이터가 너무 적다',0,'데이터 수와 상관없이 휜 모양은 잔차의 무늬로 드러난다.']]},
 {q:'GBM 회귀가 150㎡ 아파트값을 120㎡ 값과 거의 같게 부른 까닭은?',o:[['트리는 칸마다 훈련 데이터의 평균을 답해서 훈련 범위 밖으로 값을 늘려 그리지 못한다',1,'트리 계열은 외삽을 못 한다. 담판의 두 번째 조건 바꾸기에서 120㎡ 뒤 예측이 평평했다.'],['학습률이 너무 작아서',0,'학습률은 트리 하나가 고치는 양이다. 트리를 더 덧대도 범위 밖은 여전히 평평하다.'],['트리가 100그루뿐이라서',0,'1,000그루여도 마찬가지다. 각 트리가 범위 밖에 새 값을 만들지 못한다.']]}]};

var PROMPTS=[
 {t:'① 회귀파 일곱 한꺼번에 비교',use:'내 데이터에 어떤 회귀 모델이 맞는지 처음 고를 때',p:'scikit-learn으로 아래 일곱 회귀 모델을 같은 훈련/검증 분할에서 비교하는 코드를 만들어 줘: LinearRegression, Ridge, Lasso, ElasticNet, SVR(RBF), DecisionTreeRegressor, GradientBoostingRegressor.\n\n- 내 데이터: 〔예) houses.csv, 정답 열 price〕\n- 특징 열: 〔예) 면적, 층, 역까지 거리, 건물 나이〕\n\n선형 계열과 SVR에는 표준화를 파이프라인으로 넣고, 훈련 MAE·검증 MAE 표와 "늘 평균만 답하는" 기준선 MAE도 함께 보여 줘. 결과 표를 읽는 법도 세 줄로 설명해 줘.'},
 {t:'② Lasso로 특징 고르기',use:'특징이 많아 무엇이 중요한지 모를 때',p:'LassoCV로 규제 세기 λ(alpha)를 교차 검증으로 고르고, 가중치가 0이 아닌 특징만 남기는 코드를 만들어 줘. 특징은 표준화한 뒤 넣고, alpha에 따라 가중치가 0으로 줄어드는 경로 그림(lasso path)도 그려 줘. 서로 비슷한 특징이 있을 때 Lasso가 그중 하나만 고르는 문제와 ElasticNet으로 대응하는 법도 알려 줘. 내 데이터는 〔설명〕이다.'},
 {t:'③ 잔차 그림으로 모델 점검',use:'선형 회귀 결과가 믿을 만한지 확인하고 싶을 때',p:'선형 회귀를 맞춘 뒤 잔차 그림(예측값 대비 잔차, 특징 대비 잔차)을 그리고, 거기서 휜 관계·구간별 차이·튀는 값을 알아보는 법을 설명해 줘. 무늬가 보이면 다항 특징, 로그 변환, 트리 계열 모델 가운데 무엇을 먼저 시도할지 판단 기준도 표로 정리해 줘.'},
 {t:'④ 수업용: 외삽의 위험 보여 주기',use:'모델이 배운 범위 밖을 예측하는 위험을 가르칠 때',p:'훈련 데이터 범위 밖을 예측(외삽)할 때 선형 회귀와 트리 계열(GBM, 랜덤 포레스트)이 각각 어떻게 실패하는지 보여 주는 5분짜리 Colab 시연을 만들어 줘. 1) 휜 데이터를 만들고 일부 구간만 훈련에 쓰기 2) 두 모델의 예측선을 훈련 범위 밖까지 그리기 3) 학생에게 던질 질문 세 개.'}];
var GL=[
 ['파','회귀','숫자를 맞히는 지도학습.'],['평가','MAE','평균 절대 오차. 예측이 평균 얼마나 빗나갔는지.'],['평가','잔차','정답 − 예측. 점과 예측선 사이 세로 거리.'],
 ['모델','선형 회귀','오차 제곱합이 가장 작은 직선(평면)을 찾는 회귀.'],['모델','가중치','특징마다 곱하는 수. 클수록 그 특징의 영향이 크다.'],
 ['학습','규제','가중치 크기에 벌점을 매겨 모델을 단순하게 만드는 방법.'],['학습','λ (람다)','규제 세기. 클수록 가중치가 더 작아진다.'],
 ['모델','Ridge','가중치 제곱합(L2)에 벌점을 주는 회귀.'],['모델','Lasso','가중치 절댓값 합(L1)에 벌점을 주는 회귀. 가중치를 0으로 만든다.'],['모델','Elastic Net','L1과 L2 벌점을 섞은 회귀.'],
 ['모델','SVR','폭 ε 안의 오차는 봐주는 서포트 벡터 회귀.'],['학습','커널','점들을 다른 공간으로 옮겨 곡선 관계를 직선처럼 다루게 하는 계산 요령.'],
 ['모델','결정 트리 회귀','질문으로 데이터를 나누고 칸마다 평균값을 답하는 회귀.'],['모델','GBM','그레이디언트 부스팅. 잔차를 다음 트리가 배우게 하며 덧대는 앙상블.'],
 ['학습','학습률','GBM에서 트리 하나가 예측을 고치는 비율(η).'],['평가','외삽','훈련 데이터 범위 밖을 예측하는 일. 대부분의 모델이 약하다.'],['평가','기준선','늘 평균만 답하는 것처럼 가장 단순한 비교 대상.']];
var ANALOGY=[
 ['선형 회귀','자 하나로 그은 경향선',1,'','현실의 관계는 자로 그을 수 없을 만큼 휘어 있을 때가 많다'],
 ['규제','짐 가방 무게 제한',1,'','무게 제한(λ)이 너무 빡빡하면 꼭 필요한 짐(진짜 특징)까지 빠진다'],
 ['GBM 회귀','덧칠로 완성하는 그림',2,'초파리 뇌의 버섯체가 같은 냄새를 여러 번 겪으며 반응을 조금씩 고쳐 가는 것','버섯체는 잔차를 계산하지 않는다. "조금씩 고친다"는 모양만 닮았다'],
 ['SVR의 ε 띠','오차 범위 ±0.5억은 봐주는 감정평가',1,'','현실의 감정평가는 띠 폭을 정하는 기준이 있지만, SVR의 ε은 사람이 고르는 설정값이다']];
var REFS=[
 'Hoerl, A. E., &amp; Kennard, R. W. (1970). Ridge regression: Biased estimation for nonorthogonal problems. <i>Technometrics</i>, 12(1), 55–67. — Ridge',
 'Tibshirani, R. (1996). Regression shrinkage and selection via the lasso. <i>Journal of the Royal Statistical Society: Series B</i>, 58(1), 267–288. — Lasso',
 'Zou, H., &amp; Hastie, T. (2005). Regularization and variable selection via the elastic net. <i>Journal of the Royal Statistical Society: Series B</i>, 67(2), 301–320. — Elastic Net',
 'Drucker, H., Burges, C. J. C., Kaufman, L., Smola, A., &amp; Vapnik, V. (1997). Support vector regression machines. <i>Advances in Neural Information Processing Systems 9</i>. — SVR',
 'Friedman, J. H. (2001). Greedy function approximation: A gradient boosting machine. <i>The Annals of Statistics</i>, 29(5), 1189–1232. — GBM',
 'Rahimi, A., &amp; Recht, B. (2007). Random features for large-scale kernel machines. <i>Advances in Neural Information Processing Systems 20</i>. — 이 페이지의 RBF 커널 근사'];
var TIP={who:'회귀를 한 번 배운 학습자. 4-2를 읽었으면 좋다',goal:'① 회귀파 일곱의 특기를 한 줄씩 말한다 ② 규제(L1·L2)가 가중치를 어떻게 바꾸는지 설명한다 ③ 데이터 모양에 따라 직선과 트리 계열 중 무엇이 맞는지, 그리고 외삽의 위험을 판단한다',time:'읽기 15분 · 신상 파일과 슬라이더 10분 · 담판 5분 · Colab 10분',
 plans:[['강의형 40분','신상 파일에서 일곱 명을 차례로 눌러 보며 "검증 1위 맞히기" 10분 → 01장 잔차 무늬 5분 → 02장 λ 슬라이더 10분(잡음 막대가 먼저 0이 되는지) → 04장 GBM 재생 5분 → 담판과 조건 바꾸기 10분.'],['실무 OJT 60분','프롬프트 ①로 사내 데이터에 일곱 모델을 돌려 표 만들기 30분 → 잔차 그림 점검(프롬프트 ③) 20분 → 공유 10분.'],['1:1 튜터링','담판을 열기 전에 승자를 맞히게 한 뒤, "거의 직선" 조건에서 승패가 뒤집히는 까닭을 01장 잔차 그림으로 설명하게 한다.']],
 myths:[['비싼 모델(GBM)이 늘 이긴다','관계가 거의 직선이면 선형 회귀가 같거나 더 낫고 설명도 쉽다(담판 조건 바꾸기)'],['규제는 성능을 깎는다','잡음 특징이 많으면 규제가 검증 오차를 오히려 줄인다(02장)'],['검증 오차가 작으면 어디서든 믿어도 된다','훈련 범위 밖에서는 어떤 모델도 크게 틀릴 수 있다. 트리 계열은 아예 평평해진다']]};
var CODE={title:'회귀파 일곱, 같은 집값에 세우기',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'regression_seven',
 desc:'신상 파일과 담판을 옮겼다. 휜 집값 데이터와 거의 직선인 데이터에 회귀 일곱 모델을 같은 분할로 맞추고 검증 MAE 표를 낸다. Lasso가 잡음 특징을 0으로 만드는지도 확인한다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 같지만 난수 생성기와 구현이 달라 숫자는 조금 다르다(SVR은 여기서 정식 RBF 커널로 푼다). 결론(휜 데이터에서는 GBM이 직선보다 덜 빗나가고, 거의 직선이면 차이가 사라진다)은 같다.'};
