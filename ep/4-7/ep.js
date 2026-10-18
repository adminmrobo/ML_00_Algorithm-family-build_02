/* ══ 4-7 분류파 여덟 ════════════════════════════════════════════ */
var TOKCOL='#7d9cc0';
function mById(id){for(var i=0;i<CLS.MEM.length;i++)if(CLS.MEM[i].id===id)return CLS.MEM[i];}
var OPT={k:7,kernel:'rbf',depth:4};

/* 경계 그리기: f = CLS.fit 결과, sh = 데이터 모양. o.prob이면 확률을 진하기로, o.margin이면 SVM 여백 */
function boundary(cv,f,sh,H,o){o=o||{};var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),n=56,S=Math.min(Wd,H),ox=(Wd-S)/2,cw=S/n,D=CLS.DOM,m=f.m,sc=[];ctx.clearRect(0,0,Wd,H);
  function X(a){return -D+(a+.5)*2*D/n}function Y(b){return D-(b+.5)*2*D/n}
  for(var a=0;a<n;a++){sc.push([]);for(var b=0;b<n;b++){var x=[X(a),Y(b)],p;
    if(o.prob&&m.prob){p=m.prob(x);ctx.fillStyle=p>=.5?rgba(C.orange,.08+.32*(p-.5)*2):rgba(C.info,.06+.26*(.5-p)*2);}
    else{p=m.predict(x);ctx.fillStyle=p?rgba(C.orange,.24):rgba(C.info,.15);}
    if(o.margin)sc[a].push(m.score(x));ctx.fillRect(ox+a*cw,b*cw,cw+.5,cw+.5);}}
  if(o.margin){[[0,2.2,1],[1,1.2,.55],[-1,1.2,.55]].forEach(function(L){ctx.strokeStyle=rgba(C.text,L[2]);ctx.lineWidth=L[1];ctx.beginPath();
    for(var a=0;a<n-1;a++)for(var b=0;b<n-1;b++){var v=[sc[a][b]-L[0],sc[a+1][b]-L[0],sc[a+1][b+1]-L[0],sc[a][b+1]-L[0]],cx=[[a,b],[a+1,b],[a+1,b+1],[a,b+1]],P=[];
      for(var e=0;e<4;e++){var v0=v[e],v1=v[(e+1)%4];if(v0*v1<0){var t=v0/(v0-v1),A=cx[e],B=cx[(e+1)%4];P.push([ox+(A[0]+(B[0]-A[0])*t+.5)*cw,(A[1]+(B[1]-A[1])*t+.5)*cw]);}}
      if(P.length>=2){ctx.moveTo(P[0][0],P[0][1]);ctx.lineTo(P[1][0],P[1][1]);}}ctx.stroke();});}
  var pts=o.pts||CLS.SH[sh].tr;pts.forEach(function(d){circ(ctx,ox+(d.x[0]+D)/(2*D)*S,(D-d.x[1])/(2*D)*S,2.6,d.y?C.orange:C.info,o.ring?C.text:null,1);});
  return {ctx:ctx,Wd:Wd};}
function kpi(f){return statGrid([[pct(f.tr),'훈련 정확도'],[pct(f.va),'검증 정확도'],[fx(f.ms,0)+' ms','이 컴퓨터에서 학습 시간']]);}

/* ── 히어로: 경계선이 직선 → 원 → 계단으로 바뀐다 ── */
(function(){var G={},names=[['log','로지스틱 · 직선'],['knn','KNN · 이웃 다수결'],['tree','결정 트리 · 계단']],n=34,D=CLS.DOM;
 names.forEach(function(q){var f=CLS.fit(q[0],'circ',OPT),g=[];for(var a=0;a<n;a++)for(var b=0;b<n;b++)g.push(f.m.predict([-D+(a+.5)*2*D/n,D-(b+.5)*2*D/n]));G[q[0]]=g;});
 heroStage($('heroCv'),{bg:'sc_border',bgY:1,fly:'ruler',robo:'sapling',motif:function(ctx,t,W,H){
  ctx.fillStyle='rgba(13,12,28,.8)';rr(ctx,262,18,576,280,16);ctx.fill();
  for(var i=0;i<8;i++){var tk=NPC.draw('token',3,TOKCOL);if(tk)ctx.drawImage(tk,300+i*66,30+Math.round(Math.sin(t*2+i)*2));}
  var k=Math.floor(t/2.4)%3,q=names[k],g=G[q[0]],S=170,x0=465,y0=96,cw=S/n;
  for(var a=0;a<n;a++)for(var b=0;b<n;b++){ctx.fillStyle=g[a*n+b]?'rgba(255,154,77,.32)':'rgba(130,184,255,.22)';ctx.fillRect(x0+a*cw,y0+b*cw,cw+.5,cw+.5);}
  CLS.SH.circ.tr.forEach(function(d,j){if(j%2)return;ctx.fillStyle=d.y?'#ff9a4d':'#82b8ff';ctx.fillRect(Math.round(x0+(d.x[0]+D)/(2*D)*S)-2,Math.round(y0+(D-d.x[1])/(2*D)*S)-2,4,4);});
  ctx.strokeStyle='#d4a54a';ctx.lineWidth=2;ctx.strokeRect(x0,y0,S,S);ctx.font=font(14,700);ctx.fillStyle='#eceaf3';ctx.textAlign='center';ctx.fillText(q[1],x0+S/2,y0+S+22);}});})();

/* ── 01 직선 경계 ── */
(function(){var cv=$('m1Cv'),cur='log';
 function draw(){var f=CLS.fit(cur,'lin',{kernel:'lin'}),o=boundary(cv,f,'lin',260,cur==='log'?{prob:1}:{margin:1});stamp(o.ctx,o.Wd,cur==='log'?'색이 진할수록 확률이 0·1에 가깝다':'굵은 선 = 경계 · 옅은 선 = 여백 가장자리');
  $('m1Info').innerHTML=(cur==='log'?'<b>로지스틱 회귀.</b> 경계에서 멀어질수록 색이 진하다. 경계 위의 점은 "반반"이다. ':'<b>SVM.</b> 굵은 선이 경계, 양옆 옅은 선이 여백의 가장자리다. 여백 안쪽이나 너머에 있는 점만 경계를 움직인다. ')+
   '훈련 '+pct(f.tr)+' · 검증 '+pct(f.va)+'. 둘 다 직선이라 이 데이터에서는 거의 같은 자리에 선을 긋는다.';}
 seg('#m1 .pills button',function(v){cur=v;draw();});draw();onRedraw(draw);})();

/* ── 02 이웃과 확률 ── */
(function(){var cv=$('m2Cv'),cur='knn';
 npcLine($('tokHost'),['token'],3,'조직원 패: 분류파 여덟은 패 하나씩을 받았다. <b>04 신상 파일</b>에서 패를 눌러 한 명씩 불러낸다.');
 var tk=$('tokHost').querySelector('canvas');if(tk){var src=NPC.draw('token',3,TOKCOL);tk.getContext('2d').drawImage(src,0,0);}
 function draw(){var f=CLS.fit(cur,'band',{k:OPT.k}),o=boundary(cv,f,'band',260,cur==='nb'?{prob:1}:{});stamp(o.ctx,o.Wd,cur==='knn'?'k = '+OPT.k:'확률 색');
  $('m2K').hidden=cur!=='knn';
  $('m2Info').innerHTML=cur==='knn'?'<b>KNN, k = '+OPT.k+'.</b> 훈련 '+pct(f.tr)+' · 검증 '+pct(f.va)+'. '+(OPT.k<=3?'이웃이 적으면 점 하나하나를 따라 경계가 들쭉날쭉하다. k = 1이면 훈련 점은 모두 맞힌다(자기 자신이 가장 가까운 이웃).':OPT.k>=25?'이웃이 많으면 경계가 뭉개져 띠의 휘어진 끝을 놓친다.':'적당한 k에서 띠 모양을 따라 매끈한 경계가 나온다.'):
   '<b>나이브 베이즈.</b> 훈련 '+pct(f.tr)+' · 검증 '+pct(f.va)+'. 무리마다 x와 y를 따로 종 모양 분포로 요약해서 경계가 매끈한 곡선 하나다. 띠의 휘어진 끝까지는 따라가지 못한다.';}
 $('m2Sl').addEventListener('input',function(){OPT.k=+this.value;$('m2Kv').textContent=OPT.k;draw();});
 seg('#m2 .pills button',function(v){cur=v;draw();});draw();onRedraw(draw);})();

/* ── 03 트리 계열 ── */
(function(){var cv=$('m3Cv'),cur='tree';
 var TXT={tree:'한 그루. 질문이 축 하나만 보기 때문에 원을 계단으로 흉내 낸다. 깊이를 키우면 계단이 잘아지지만 잡음도 외운다.',rf:'25그루의 다수결. 그루마다 다른 데이터를 봐서 계단 모서리가 평균으로 누그러진다.',gbm:'40그루를 차례로. 앞 그루가 틀린 곳을 다음 그루가 고친다.',xgb:'값을 32칸으로 묶은 GBM 60그루. XGBoost·LightGBM이 빠른 까닭 중 하나(구간 나누기)를 같은 원리로 흉내 냈다.'};
 function draw(){var f=CLS.fit(cur,'circ',{depth:OPT.depth}),o=boundary(cv,f,'circ',260,{});stamp(o.ctx,o.Wd,cur==='xgb'?'같은 원리의 GBM으로 흉내':cur==='tree'?'깊이 '+OPT.depth:'');
  $('m3D').hidden=cur!=='tree';$('m3Info').innerHTML='<b>'+mById(cur).n+'.</b> '+TXT[cur]+' 훈련 '+pct(f.tr)+' · 검증 '+pct(f.va)+'.';}
 $('m3Sl').addEventListener('input',function(){OPT.depth=+this.value;$('m3Dv').textContent=OPT.depth;draw();});
 seg('#m3 .pills button',function(v){cur=v;draw();});draw();onRedraw(draw);})();

/* ── 04 신상 파일 ── */
(function(){var sh='circ',cur='log';
 $('mlist').innerHTML=CLS.MEM.map(function(m,i){return '<button type="button" data-v="'+m.id+'" aria-pressed="'+(i===0)+'"><span class="tk" aria-hidden="true"></span><span><b>'+m.n+'</b><span>'+m.s+'</span></span></button>';}).join('');
 $('mlist').querySelectorAll('.tk').forEach(function(s){s.appendChild(NPC.el('token',2,null,TOKCOL));});
 function ctl(){var h='';if(cur==='knn')h='<label>이웃 수 k <b class="num" id="dK">'+OPT.k+'</b> <input type="range" id="dKs" min="1" max="41" step="2" value="'+OPT.k+'"></label>';
  else if(cur==='svm')h='<span>커널</span><span class="pills" role="group" aria-label="커널"><button data-v="lin" aria-pressed="'+(OPT.kernel==='lin')+'">선형</button><button data-v="rbf" aria-pressed="'+(OPT.kernel==='rbf')+'">RBF (근사)</button></span>';
  else if(cur==='tree')h='<label>깊이 <b class="num" id="dD">'+OPT.depth+'</b> <input type="range" id="dDs" min="1" max="10" step="1" value="'+OPT.depth+'"></label>';
  else h='<span>조절할 값 없음 (기본 설정)</span>';$('dosCtl').innerHTML=h;
  if($('dKs'))$('dKs').addEventListener('input',function(){OPT.k=+this.value;$('dK').textContent=OPT.k;draw();});
  if($('dDs'))$('dDs').addEventListener('input',function(){OPT.depth=+this.value;$('dD').textContent=OPT.depth;draw();});
  if(cur==='svm')seg('#dosCtl .pills button',function(v){OPT.kernel=v;draw();});}
 function file(){var m=mById(cur);$('dosFile').innerHTML='<h4>'+m.n+(m.id==='rf'||m.id==='gbm'?'<span class="badge2">4-5·4-10에서도 만남</span>':'')+'</h4><dl><dt>특기</dt><dd>'+m.s+'</dd><dt>근거</dt><dd>'+m.why+'</dd><dt>경계 모양</dt><dd>'+m.shape+'</dd><dt>언제 쓰나</dt><dd>'+m.when+'</dd><dt>약점</dt><dd>'+m.weak+'</dd><dt>형제와 차이</dt><dd>'+m.vs+'</dd></dl>'+(m.sim?'<p class="muted" style="font-size:12.5px;margin:8px 0 0">이 페이지에서는 같은 원리(값을 구간으로 묶은 GBM)로 흉내 낸다. 실제 라이브러리의 결과와는 다르다.</p>':'');}
 function draw(){var f=CLS.fit(cur,sh,OPT),o=boundary($('dosCv'),f,sh,300,{});stamp(o.ctx,o.Wd,CLS.SHN[sh]+(cur==='svm'&&OPT.kernel==='rbf'?' · RBF 근사':''));$('dosKpi').innerHTML=kpi(f);}
 function all(){ctl();file();draw();}
 seg('#mlist button',function(v){cur=v;all();});seg('#shapePills button',function(v){sh=v;draw();});all();onRedraw(draw);})();

/* 정확도 표: 화면을 막지 않도록 칸마다 쉬어 가며 계산 */
(async function(){var SHS=['lin','band','circ'],R={},o={k:7,kernel:'rbf',depth:4};await wait(300);
 for(var i=0;i<CLS.MEM.length;i++){R[CLS.MEM[i].id]={};for(var j=0;j<3;j++){R[CLS.MEM[i].id][SHS[j]]=CLS.fit(CLS.MEM[i].id,SHS[j],o).va;await wait(0);}}
 var best={};SHS.forEach(function(s){best[s]=Math.max.apply(null,CLS.MEM.map(function(m){return R[m.id][s]}));});
 $('accTbl').innerHTML='<table class="tb acc"><thead><tr><th>조직원</th>'+SHS.map(function(s){return '<th>'+CLS.SHN[s]+'</th>'}).join('')+'</tr></thead><tbody>'+CLS.MEM.map(function(m){return '<tr><td>'+m.n+'</td>'+SHS.map(function(s){var v=R[m.id][s];return '<td class="'+(v===best[s]?'hi':v<.7?'lo':'')+'">'+pct(v)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>';})();

/* ── 담판: 동심원 ── */
Duel('d7',{title:'동심원을 누가 가를까',q:'안쪽 원(주황)과 바깥 고리(파랑)로 놓인 점 300개. 200개로 배우고 처음 보는 100개로 잰다. 직선 하나로 확률을 내는 로지스틱 회귀와, 나무 25그루의 랜덤 포레스트가 맞붙는다.',
 fly:['로지스틱 회귀','확률로 답하니 믿을 만해.'],robo:['랜덤 포레스트','나무 스물다섯 그루면 어떤 모양도 받아 낸다.'],roboMood:'stack',
 run:async function(p){p(.3);await wait(120);var a=CLS.fit('log','circ'),b=CLS.fit('rf','circ');p(1);var w=a.va>b.va?'f':(a.va<b.va?'r':'d');
  return {winner:w,big:Math.abs(a.va-b.va)>=.1,measure:'처음 보는 100개에서 로지스틱 회귀 '+pct(a.va)+', 랜덤 포레스트 '+pct(b.va)+'예요. 로지스틱은 훈련 데이터에서도 '+pct(a.tr)+'라서, 파랑·주황이 반반인 데이터에서 동전 던지기와 크게 다르지 않아요.',
   verdict:'직선 하나로는 동그라미를 가를 수 없다. 모델이 그릴 수 있는 경계 모양이 데이터 모양과 맞아야 한다. 이 구역은 Money-Robo 쪽이다.',key:'경계 모양이 데이터 모양을 담을 수 있어야 한다.',
   render:function(box){box.innerHTML=statGrid([[pct(a.tr),'초파리 · 훈련','f'],[pct(a.va),'초파리 · 검증','f'],[pct(b.tr),'Money-Robo · 훈련','r'],[pct(b.va),'Money-Robo · 검증','r']])+
    '<div class="two" style="margin-top:12px"><figure style="margin:0"><canvas class="fig" id="dA" aria-label="로지스틱 회귀의 직선 경계"></canvas><figcaption class="muted" style="font-size:13px">초파리 · 로지스틱 회귀</figcaption></figure><figure style="margin:0"><canvas class="fig" id="dB" aria-label="랜덤 포레스트의 계단 모양 원 경계"></canvas><figcaption class="muted" style="font-size:13px">Money-Robo · 랜덤 포레스트</figcaption></figure></div>';
    function dr(){boundary($('dA'),a,'circ',220,{});boundary($('dB'),b,'circ',220,{});}setTimeout(dr,0);onRedraw(dr);}};},
 alts:[{label:'직선으로 나뉘는 데이터라면?',run:async function(box){var a=CLS.fit('log','lin'),b=CLS.fit('rf','lin');
   box.innerHTML=statGrid([[pct(a.va),'로지스틱 · 검증','f'],[pct(b.va),'랜덤 포레스트 · 검증','r'],[CLS.size('log',a)+'개','로지스틱이 기억하는 숫자'],[CLS.size('rf',b).toLocaleString()+'개','숲의 질문·잎 수']])+
    say('fly','arms','거봐, 경계가 직선이면 내 쪽이 '+pct(a.va)+'로 숲('+pct(b.va)+')과 비슷하거나 낫지. 숫자 세 개(특징마다 가중치 하나씩, 그리고 절편 하나)로 끝나고, 어느 특징이 얼마나 중요한지도 바로 읽혀.')+
    say('robo','meh','…숲은 질문과 잎을 '+CLS.size('rf',b).toLocaleString()+'개나 들고 다니네. 이번엔 본전.');}},
  {label:'KNN으로 바꾸면?',run:async function(box){var a=CLS.fit('log','circ'),c=CLS.fit('knn','circ',{k:7});
   box.innerHTML=statGrid([[pct(a.va),'로지스틱 · 검증','f'],[pct(c.va),'KNN (k = 7) · 검증','r']])+
    say('robo','happy','KNN도 '+pct(c.va)+'! 이웃에게 물어보면 원이든 띠든 따라간다고.')+say('asst','ledger','KNN은 배우는 시간은 거의 없지만, 예측할 때마다 훈련 점 200개와 모두 거리를 재요. 점이 수백만 개가 되면 느려져요.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q7:[
 {q:'동심원 데이터에서 로지스틱 회귀가 반반 수준으로 떨어지는 까닭은?',o:[['그릴 수 있는 경계가 직선 하나뿐이라서',1,'안쪽 원과 바깥 고리는 어떤 직선으로도 가를 수 없다. 반지름 같은 특징을 손으로 만들어 넣으면 로지스틱도 가를 수 있다.'],['학습을 덜 해서',0,'학습을 더 오래 해도 직선은 직선이다.'],['데이터가 너무 적어서',0,'점을 늘려도 경계 모양의 한계는 그대로다.']]},
 {q:'KNN에서 k = 1로 두면 훈련 정확도가 100%가 되는 까닭은?',o:[['훈련 점 자신이 가장 가까운 이웃이라서',1,'자기 자신을 보고 답하니 늘 맞는다. 그래서 KNN은 검증 데이터로 재야 한다.'],['k가 작을수록 모델이 단순해서',0,'반대다. k가 작을수록 경계가 들쭉날쭉하고 복잡해진다.'],['KNN이 확률을 쓰지 않아서',0,'확률과는 상관없다.']]},
 {q:'XGBoost · LightGBM · CatBoost와 GBM의 관계로 맞는 것은?',o:[['원리는 같고, 더 빠르고 튼튼하게 만든 구현이다',1,'틀린 만큼을 다음 나무가 배우는 부스팅 원리는 같다. 구간 나누기, 규제, 범주형 특징 처리 등으로 속도와 안정성을 높였다.'],['신경망을 쓰는 전혀 다른 방법이다',0,'셋 다 나무를 쓰는 부스팅이다.'],['배깅의 한 종류다',0,'배깅의 대표는 랜덤 포레스트다. 셋은 부스팅이다.']]}]};

var PROMPTS=[
 {t:'① 내 데이터에 분류파 여덟 세워 보기',use:'어떤 분류기가 맞을지 감이 없을 때',p:'아래 코드는 같은 데이터에 분류기 여덟 개(로지스틱, SVM, KNN, 나이브 베이즈, 결정 트리, 랜덤 포레스트, GBM, HistGradientBoosting)를 돌려 검증 정확도를 비교한다. 내 데이터에 맞게 바꿔 줘.\n\n- 내 데이터: 〔예) loans.csv, 정답 열 default(0/1)〕\n- 특징 열: 〔예) 소득, 부채, 연체 횟수〕\n\n특징 표준화가 필요한 모델(로지스틱, SVM, KNN)은 파이프라인으로 묶고, 교차 검증 5겹의 평균과 표준편차, 학습 시간을 표로 보여 줘.'},
 {t:'② 경계 그림 그리기',use:'모델이 평면을 어떻게 가르는지 눈으로 보고 싶을 때',p:'특징 두 개 〔예) 나이, 소득〕만 골라 분류기 〔예) 로지스틱, KNN, 랜덤 포레스트〕의 결정 경계를 나란히 그려 줘. 배경색은 예측한 무리, 점은 실제 정답으로 칠하고, 그림 제목에 검증 정확도를 넣어 줘. matplotlib만 써 줘.'},
 {t:'③ 직선 모델에 곡선을 가르치기',use:'로지스틱 회귀를 유지하면서 성능을 올리고 싶을 때',p:'로지스틱 회귀가 곡선 경계를 못 그어서 성능이 낮다. 1) 특징을 손으로 만들기(제곱, 곱, 반지름 등) 2) 다항 특징(PolynomialFeatures) 3) 스플라인 특징 세 방법을 내 데이터 〔설명〕에 적용하는 코드를 써 주고, 각각 해석 가능성이 얼마나 남는지도 설명해 줘.'},
 {t:'④ 수업용 "경계 모양" 활동지',use:'강의에서 분류기 차이를 체험하게 하고 싶을 때',p:'고등학생 대상 30분 활동을 기획해 줘. 모눈종이에 파랑·빨강 점을 찍고 학생들이 1) 자 하나(로지스틱) 2) 가까운 이웃 3개에게 묻기(KNN) 3) 가로·세로 선만 긋기(결정 트리)로 경계를 그어 보게 한다. 준비물, 진행 순서, 질문 세 개와 예상 답을 써 줘.'}];
var GL=[
 ['모델','로지스틱 회귀','점수를 시그모이드로 0~1 확률로 바꾸는 직선 분류기.'],['모델','SVM','두 무리 사이 여백이 가장 넓은 경계를 고르는 분류기.'],
 ['모델','서포트 벡터','여백 가장자리에 닿아 SVM 경계를 정하는 훈련 점.'],['모델','커널','점을 더 높은 차원으로 옮긴 것처럼 계산해 곡선 경계를 긋게 하는 요령. RBF가 대표.'],
 ['모델','KNN','가장 가까운 이웃 k개의 다수결로 정하는 방법.'],['모델','나이브 베이즈','특징이 서로 독립이라고 가정하고 베이즈 정리로 무리 확률을 계산하는 분류기.'],
 ['모델','결정 트리','예/아니오 질문을 이어 붙이는 모델. 경계가 가로·세로 계단이다.'],['모델','랜덤 포레스트','다르게 뽑은 데이터로 키운 트리 여럿의 다수결(배깅).'],
 ['모델','GBM','앞 트리가 틀린 만큼을 다음 트리가 배워 더하는 부스팅.'],['모델','XGBoost · LightGBM · CatBoost','GBM을 빠르고 튼튼하게 만든 대표 라이브러리 셋.'],
 ['개념','결정 경계','평면(특징 공간)에서 예측 이름표가 바뀌는 선.'],['개념','여백','SVM에서 경계와 가장 가까운 점 사이의 거리. 마진.'],
 ['개념','시그모이드','어떤 수든 0과 1 사이로 눌러 주는 S자 함수 σ.'],['개념','베이즈 정리','P(무리|특징) ∝ P(무리)·P(특징|무리).'],['평가','검증 정확도','배우는 동안 보여 주지 않은 데이터에서 맞힌 비율.']];
var ANALOGY=[
 ['로지스틱 회귀','자 하나로 운동장에 선 긋기',1,'','자는 곧은 선만 긋는다. 동그란 화단은 자 하나로 둘러쌀 수 없다'],
 ['SVM','두 동네 사이에 가장 넓은 도로 내기',1,'','도로 가장자리에 붙은 집(서포트 벡터)만 도로 위치를 정한다. 먼 집은 상관없다'],
 ['KNN','처음 이사 온 동네에서 옆집 일곱 곳에 물어보기',2,'초파리는 냄새가 비슷한 기억을 떠올려 판단한다(4-1 시리즈의 초파리 뇌)','KNN은 기억을 통째로 들고 다녀 물어볼 때마다 다 뒤진다. 뇌는 미리 요약해 둔다'],
 ['결정 트리','스무고개',1,'','질문이 하나씩만 보니, 비스듬한 선은 계단으로만 흉내 낸다']];
var REFS=[
 'Cortes, C., &amp; Vapnik, V. (1995). Support-vector networks. <i>Machine Learning</i>, 20(3), 273–297. — SVM',
 'Cover, T., &amp; Hart, P. (1967). Nearest neighbor pattern classification. <i>IEEE Transactions on Information Theory</i>, 13(1), 21–27. — KNN',
 'Breiman, L. (2001). Random forests. <i>Machine Learning</i>, 45(1), 5–32. — 랜덤 포레스트',
 'Chen, T., &amp; Guestrin, C. (2016). XGBoost: A scalable tree boosting system. <i>Proceedings of KDD 2016</i>, 785–794. — XGBoost',
 'Ke, G., et al. (2017). LightGBM: A highly efficient gradient boosting decision tree. <i>Advances in Neural Information Processing Systems 30</i>. — LightGBM',
 'Pawar, P. <i>Machine Learning Algorithm Family Tree</i> (인포그래픽). — 분류 칸의 구성'];
var TIP={who:'4-2 지도 가문을 읽은 학습자. 분류와 정확도를 안다',goal:'① 분류 모델이 결국 결정 경계를 긋는다는 것을 설명한다 ② 여덟 조직원의 근거와 경계 모양을 짝짓는다 ③ 데이터 모양에 따라 알맞은 조직원이 달라짐을 정확도 표로 보인다',time:'읽기 15분 · 신상 파일과 담판 15분 · Colab 10분',
 plans:[['강의형 30분','01~03장을 한 장씩 5분 → 04장에서 데이터 모양을 바꿀 때마다 학생에게 "누가 1등일까" 먼저 묻기 10분 → 담판 5분.'],['실무 OJT 60분','04장 정확도 표 10분 → 사내 데이터로 프롬프트 ①을 돌려 교차 검증 표 만들기 35분 → "가장 정확한 것"과 "가장 설명하기 쉬운 것"이 다를 때 무엇을 고를지 토론 15분.'],['1:1 튜터링','동심원에서 로지스틱이 지는 까닭을 말로 설명하게 하고, 프롬프트 ③으로 반지름 특징을 넣어 로지스틱이 이기는 것을 직접 확인하게 한다.']],
 myths:[['복잡한 모델이 늘 정확하다','직선으로 나뉘는 데이터에서는 로지스틱이 숲과 비슷하거나 낫다(조건 바꾸기)'],['KNN은 학습을 하니 빠르다','KNN은 학습이 거의 없고, 예측할 때 모든 점과 거리를 잰다'],['XGBoost는 GBM과 다른 알고리즘이다','같은 부스팅 원리를 빠르고 튼튼하게 구현한 것이다']]};
var CODE={title:'데이터 모양 × 분류파 여덟',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'classification_eight',
 desc:'04장과 담판을 옮겼다. 직선으로 나뉘는 데이터, 띠 모양(make_moons), 동심원(make_circles)에 분류기 여덟 개를 돌려 검증 정확도 표를 만든다. XGBoost형 자리에는 같은 원리의 HistGradientBoostingClassifier를 쓴다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 비슷하지만 난수 생성기와 구현이 달라 숫자는 조금 다르다. 결론(동심원에서 로지스틱은 반반 수준, 트리 계열·RBF SVM·KNN은 90% 이상)은 같다.'};
