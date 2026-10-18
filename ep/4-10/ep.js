/* ══ 4-10 앙상블 계보 ═════════════════════════════════════════════ */
var TREECOL={bag:'#7aa063',boost:'#d4a54a',one:'#a65d7d'};

/* ── 히어로: 나란히 선 숲과 한 줄로 이어진 부스팅 ── */
heroStage($('heroCv'),{bg:'sc_grove',bgY:1,fly:'point',robo:'stack',motif:function(ctx,t,W,H){
  ctx.fillStyle='rgba(13,12,28,.8)';rr(ctx,250,24,600,268,16);ctx.fill();
  var tg=NPC.draw('tree',4,TREECOL.bag),tb=NPC.draw('tree',4,TREECOL.boost);ctx.imageSmoothingEnabled=false;
  ctx.font=font(13,700);ctx.textAlign='center';ctx.fillStyle='#8fb878';ctx.fillText('배깅 · 동시에 키워 평균',395,50);ctx.fillStyle='#d4a54a';ctx.fillText('부스팅 · 차례로 오답 고치기',705,50);
  for(var i=0;i<5;i++){var x=290+i*48,y=150+(i%2)*28,ph=(t*1.4+i*.6)%3;ctx.drawImage(tg,x,y);
    if(ph<1.2){ctx.fillStyle=rgba('#8fb878',1-ph/1.2);ctx.fillRect(x+15,y-10-ph*40,8,8);}}
  glow(ctx,395,86,30,'#8fb878',.35);ctx.font=font(14,700);ctx.fillStyle='#efe6d8';ctx.fillText('평균',395,92);
  var k=Math.floor(t*1.2)%6;
  for(i=0;i<5;i++){var bx=570+i*58,by=170;ctx.globalAlpha=i<=k?1:.3;ctx.drawImage(tb,bx,by);ctx.globalAlpha=1;
    if(i<4){ctx.strokeStyle=rgba('#d4a54a',i<k?.9:.25);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx+40,by+24);ctx.lineTo(bx+56,by+24);ctx.stroke();
      ctx.fillStyle=rgba('#d4a54a',i<k?.9:.25);ctx.beginPath();ctx.moveTo(bx+56,by+19);ctx.lineTo(bx+62,by+24);ctx.lineTo(bx+56,by+29);ctx.fill();}}
  var res=[1,.55,.3,.17,.1,.06][k];ctx.fillStyle='#d9823b';ctx.fillRect(600,120-res*50,22,res*50);ctx.font=font(12);ctx.fillStyle='#efe6d8';ctx.textAlign='left';ctx.fillText('남은 오답 '+Math.round(res*100)+'%',630,118);}});

/* ══ 01 계보도와 신상 파일 ══ */
var MEM=[
 {k:'rf',n:'랜덤 포레스트',fam:'bag',dual:1,one:'다양한 의견의 평균',core:'데이터를 복원 추출로 다시 뽑아 트리를 여럿 키우고, 자를 때마다 특징도 몇 개만 무작위로 고려한다. 분류는 다수결, 회귀는 평균.',when:'표 데이터의 첫 번째 튼튼한 기준 모델. 설정을 거의 안 건드려도 잘 버틴다.',weak:'트리가 많으면 모델이 크고 예측이 느리다. 학습 범위 밖의 값은 회귀로 예측하지 못한다(4-6).',diff:'Extra Trees보다 자르는 지점을 꼼꼼히 고른다. GBM과 달리 트리끼리 서로 모른 채 동시에 큰다.',src:'Breiman (2001)'},
 {k:'et',n:'Extra Trees',fam:'bag',one:'자르는 지점까지 무작위',core:'특징뿐 아니라 자르는 지점(문턱)도 무작위로 고른다. 보통 데이터를 다시 뽑지 않고 전체로 키운다.',when:'랜덤 포레스트보다 빠르게, 더 부드러운 경계를 원할 때.',weak:'무작위성이 커서 쓸모 있는 특징이 적으면 정확도가 떨어질 수 있다.',diff:'랜덤 포레스트에서 무작위를 한 단계 더 넣은 형제. 트리 하나하나는 더 엉성하지만 평균은 더 매끈하다.',src:'Geurts, Ernst & Wehenkel (2006)'},
 {k:'gbm',n:'GBM',fam:'boost',dual:1,one:'오답 노트의 연쇄',core:'앞 단계까지의 예측이 틀린 만큼(잔차, 더 일반적으로는 손실의 기울기)을 다음 작은 트리가 배우고, 학습률만큼 더한다.',when:'잡음이 적은 표 데이터에서 정확도를 끝까지 올리고 싶을 때.',weak:'단계가 많고 학습률이 크면 잡음까지 외운다. 트리를 차례로 키워 병렬화가 어렵다.',diff:'배깅파와 달리 트리끼리 서로의 오답을 안다. 아래 세 후손의 원형이다.',src:'Friedman (2001)'},
 {k:'xgb',n:'XGBoost',fam:'boost',one:'규제와 병렬 계산으로 튼튼하게',core:'GBM의 목적 함수에 트리 복잡도에 대한 규제항을 넣고, 2차 미분까지 써서 잎 값을 정한다. 자르는 지점은 병렬로, 큰 데이터에서는 근사로 찾는다.',when:'검증된 기본값과 넓은 생태계가 필요할 때. 결측값·희소 데이터도 알아서 다룬다.',weak:'설정할 하이퍼파라미터가 많다.',diff:'GBM에 규제와 시스템 최적화를 더한 맏이.',src:'Chen & Guestrin (2016)'},
 {k:'lgb',n:'LightGBM',fam:'boost',one:'히스토그램과 잎 단위 성장으로 빠르게',core:'값을 구간(히스토그램)으로 묶어 자르는 지점을 빨리 찾고, 오차가 가장 큰 잎부터 키운다. GOSS로 기울기가 작은 표본을 줄이고, EFB로 동시에 0이 아닌 일이 드문 특징을 묶는다.',when:'데이터가 크고 학습이 빨라야 할 때.',weak:'잎 단위 성장은 작은 데이터에서 과적합하기 쉬워 잎 수·깊이 제한이 필요하다.',diff:'XGBoost와 원리는 같고, 빠르게 만드는 장치가 다르다.',src:'Ke et al. (2017)'},
 {k:'cat',n:'CatBoost',fam:'boost',one:'범주형 특징에 강하다',core:'범주형 값을 "앞선 데이터만 보고 계산한 목표 평균"(순서 있는 목표 통계)으로 바꾸고, 순서 있는 부스팅으로 예측이 정답을 미리 엿보는 치우침을 막는다.',when:'도시·업종·등급처럼 범주형 열이 많은 표.',weak:'숫자 특징만 있는 큰 데이터에서는 LightGBM보다 학습이 느릴 수 있다.',diff:'대칭(oblivious) 트리를 써서 예측이 빠르다. 범주형 처리가 형제들과 가장 다르다.',src:'Prokhorenkova et al. (2018)'}];
var NODE={ens:[550,34],bag:[270,104],boost:[790,104],rf:[270,184],et:[270,264],gbm:[790,184],xgb:[640,274],lgb:[790,274],cat:[940,274]};
var EDGE=[['ens','bag'],['ens','boost'],['bag','rf'],['rf','et'],['boost','gbm'],['gbm','xgb'],['gbm','lgb'],['gbm','cat']];
var SEL='rf';
(function(){var cv=$('linCv');
 function draw(){var H=320,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),s=Wd/1100;ctx.clearRect(0,0,Wd,H);ctx.save();ctx.scale(s,1);
  function P(k){return NODE[k]}
  EDGE.forEach(function(e){var a=P(e[0]),b=P(e[1]),on=e[1]===SEL||(e[1]==='bag'&&(SEL==='rf'||SEL==='et'))||(e[1]==='boost'&&MEM.some(function(m){return m.k===SEL&&m.fam==='boost'}))||(e[1]==='rf'&&SEL==='et')||(e[1]==='gbm'&&['xgb','lgb','cat'].indexOf(SEL)>=0);
    ctx.strokeStyle=on?C.amber:C.rule;ctx.lineWidth=on?3:1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]+16);ctx.bezierCurveTo(a[0],(a[1]+b[1])/2,b[0],(a[1]+b[1])/2,b[0],b[1]-16);ctx.stroke();});
  var lab={ens:'앙상블 연합',bag:'배깅 (분산 ↓)',boost:'부스팅 (편향 ↓)'};
  Object.keys(NODE).forEach(function(k){var p=P(k),m=MEM.filter(function(q){return q.k===k})[0],txt=m?m.n:lab[k];ctx.font=font(m?14:13.5,700);var tw=ctx.measureText(txt).width+28,col=m?(m.fam==='bag'?C.gfp:C.amber):(k==='ens'?C.stain:(k==='bag'?C.gfp:C.amber));
    ctx.fillStyle=k===SEL?rgba(col,.28):C.panel2;rr(ctx,p[0]-tw/2,p[1]-16,tw,32,10);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=k===SEL?3:1.5;ctx.stroke();
    ctx.fillStyle=C.text;ctx.textAlign='center';ctx.fillText(txt,p[0],p[1]+5);
    if(m&&m.dual){ctx.font=font(11,700);var bw=ctx.measureText('4-6·4-7에서도 만남').width+14;ctx.fillStyle=rgba(C.info,.2);rr(ctx,p[0]+tw/2+6,p[1]-11,bw,22,11);ctx.fill();ctx.strokeStyle=C.info;ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=C.info;ctx.fillText('4-6·4-7에서도 만남',p[0]+tw/2+6+bw/2,p[1]+4);}});
  ctx.font=font(11.5);ctx.fillStyle=C.muted;ctx.textAlign='left';ctx.fillText('트리끼리 서로 모른 채 동시에',150,140);ctx.textAlign='right';ctx.fillText('앞 트리의 오답을 다음 트리가',1060,140);
  ctx.restore();stamp(ctx,Wd,'인포그래픽 하단을 다시 그림');}
 var host=$('members');
 MEM.forEach(function(m){var b=document.createElement('button');b.className='dcard';b.setAttribute('data-k',m.k);b.setAttribute('aria-pressed',m.k===SEL?'true':'false');
  var tok=NPC.el('token',2,null,m.fam==='bag'?TREECOL.bag:TREECOL.boost);tok.style.cssText='align-self:flex-end;width:20px;height:24px;image-rendering:pixelated;margin-bottom:-28px';b.appendChild(tok);
  b.insertAdjacentHTML('beforeend','<b style="font-size:15px">'+m.n+'</b><span class="muted" style="font-size:12.5px">'+(m.fam==='bag'?'배깅파':'부스팅파')+(m.dual?' · 두 가문 소속':'')+'</span><span class="res" style="color:var(--text);font-weight:500">'+m.one+'</span>');
  b.addEventListener('click',function(){SEL=m.k;host.querySelectorAll('.dcard').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});ui();});host.appendChild(b);});
 function ui(){var m=MEM.filter(function(q){return q.k===SEL})[0];
  $('dossier').innerHTML='<span class="tag">신상 파일 · '+(m.fam==='bag'?'배깅파':'부스팅파')+'</span><h3 style="margin:4px 0 6px">'+m.n+(m.dual?' <span class="soon" style="font-size:12px;border:1px solid var(--info);color:var(--info);border-radius:999px;padding:1px 8px;vertical-align:3px">두 가문 소속</span>':'')+'</h3>'+
   '<p style="margin:0 0 8px"><b>특기.</b> '+m.one+'</p><p style="margin:0 0 8px"><b>핵심.</b> '+m.core+'</p><p style="margin:0 0 8px"><b>언제 쓰나.</b> '+m.when+'</p><p style="margin:0 0 8px"><b>약점.</b> '+m.weak+'</p><p style="margin:0 0 8px"><b>형제와의 차이.</b> '+m.diff+'</p>'+
   '<p class="muted" style="margin:0;font-size:13px">원 논문: '+m.src+(['xgb','lgb','cat'].indexOf(m.k)>=0?' · 이 페이지에서는 따로 돌리지 않는다(개념). 원리는 03장 GBM과 같다.':'')+'</p>';draw();}
 ui();onRedraw(draw);})();

/* ══ 02 배깅 vs 단일 트리 ══ */
function bandRegion(cv,model,H){var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),n=40,S=Math.min(Wd,H),ox=(Wd-S)/2,cw=S/n;ctx.clearRect(0,0,Wd,H);
  for(var a=0;a<n;a++)for(var b=0;b<n;b++){var p=model.predict([-1+(a+.5)*2/n,1-(b+.5)*2/n]);ctx.fillStyle=p?rgba(C.orange,.26):rgba(C.info,.14);ctx.fillRect(ox+a*cw,b*cw,cw+.5,cw+.5);}
  ctx.strokeStyle=C.text;ctx.setLineDash([4,4]);ctx.lineWidth=1.1;[0.35,-0.35].forEach(function(o){ctx.beginPath();for(var q=0;q<=60;q++){var x=-1+q/30,y=0.45*Math.sin(2.4*x)+o;var X0=ox+(x+1)/2*S,Y0=(1-y)/2*S;q?ctx.lineTo(X0,Y0):ctx.moveTo(X0,Y0);}ctx.stroke();});ctx.setLineDash([]);
  LIN.BAND.forEach(function(d){circ(ctx,ox+(d.x[0]+1)/2*S,(1-d.x[1])/2*S,2.2,d.y?C.orange:C.info);});}
(function(){var seed=1,cur=LIN.draw(1),g=[LIN.grid(cur.one),LIN.grid(cur.f)],hist={one:[],f:[]},last=null,auto=0;
 npcLine($('treeHost'),['tree','tree','tree'],3,'<b>그루 형제</b> 스물다섯이 저마다 다른 표본으로 자라 한 표씩 던진다. 한 그루의 엉뚱한 경계는 다른 그루들의 표에 묻힌다.');
 $('treeHost').querySelectorAll('canvas').forEach(function(c,i){var src=NPC.draw('tree',3,[TREECOL.bag,'#8fb878','#5f8a4e'][i]);c.getContext('2d').clearRect(0,0,c.width,c.height);c.getContext('2d').drawImage(src,0,0);});
 function draw(){bandRegion($('oneCv'),cur.one,220);bandRegion($('rfCv'),cur.f,220);}
 function avg(a){return a.length?a.reduce(function(s,v){return s+v},0)/a.length:null}
 function ui(){var o=avg(hist.one),f=avg(hist.f);
  $('bagStat').innerHTML='<div class="f"><b class="num">'+(last?pct(last[0],0):'—')+'</b><span>트리 1그루 · 바로 전과 달라진 칸</span></div><div class="r"><b class="num">'+(last?pct(last[1],0):'—')+'</b><span>포레스트 · 바로 전과 달라진 칸</span></div><div><b class="num">'+(o==null?'—':pct(o,0)+' vs '+pct(f,0))+'</b><span>'+(seed-1)+'번 다시 뽑은 평균 흔들림 (1그루 vs 25그루)</span></div>';}
 function again(){seed++;cur=LIN.draw(seed);var ng=[LIN.grid(cur.one),LIN.grid(cur.f)];last=[LIN.changed(g[0],ng[0]),LIN.changed(g[1],ng[1])];hist.one.push(last[0]);hist.f.push(last[1]);g=ng;draw();ui();}
 $('bagDraw').addEventListener('click',again);
 $('bagAuto').addEventListener('click',async function(){if(auto)return;auto=1;this.disabled=true;for(var i=0;i<5;i++){again();await wait(REDUCE?10:450);}auto=0;this.disabled=false;});
 draw();ui();onRedraw(draw);})();

/* ══ 03 부스팅 단계 재생 ══ */
(function(){var cv=$('bstCv'),k=0,run=false,acc=0,B=LIN.BOOST,A=LIN.APT;
 var chain=$('bstChain');for(var i=0;i<10;i++){var c=NPC.el('tree',2,null,TREECOL.boost);c.style.opacity=.25;c.style.imageRendering='pixelated';c.style.width='18px';c.style.height='24px';chain.appendChild(c);}
 function maeAt(j){var s=0;A.forEach(function(d){s+=Math.abs(B.predictK([d.a],j)-d.p)});return s/A.length;}
 var MAES=[];for(i=0;i<=10;i++)MAES.push(maeAt(i));
 function draw(){var H=290,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=44,r=Wd-12,tp=12,bt=H-34;ctx.clearRect(0,0,Wd,H);
  function px(a){return l+(a-20)/100*(r-l)}function py(p){return bt-(p-0.5)/7*(bt-tp)}
  ctx.strokeStyle=C.rule;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();
  ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.fillText('면적 (㎡)',(l+r)/2,H-6);[20,60,100,120].forEach(function(v){ctx.fillText(v,px(v),bt+14);});
  ctx.textAlign='right';[1,3,5,7].forEach(function(v){ctx.fillText(v,l-6,py(v)+4);});ctx.save();ctx.translate(11,(tp+bt)/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText('매매가 (억 원)',0,0);ctx.restore();
  A.forEach(function(d){var pr=B.predictK([d.a],k);ctx.strokeStyle=rgba(C.orange,.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px(d.a),py(d.p));ctx.lineTo(px(d.a),py(pr));ctx.stroke();circ(ctx,px(d.a),py(d.p),3.2,C.info);});
  if(k>0){ctx.strokeStyle=rgba(C.amber,.9);ctx.lineWidth=1.6;ctx.setLineDash([4,3]);ctx.beginPath();for(var q=0;q<=200;q++){var a=20+q/2,v=B.predictK([a],k-1)+B.lr*B.trees[k-1].predict([a]),u=B.predictK([a],k-1);var y0=py(u),y1=py(v);if(q%8===0){ctx.moveTo(px(a),y0);ctx.lineTo(px(a),y1);}}ctx.stroke();ctx.setLineDash([]);}
  ctx.strokeStyle=C.stain;ctx.lineWidth=3;ctx.beginPath();for(q=0;q<=200;q++){a=20+q/2;var yy=py(B.predictK([a],k));q?ctx.lineTo(px(a),yy):ctx.moveTo(px(a),yy);}ctx.stroke();
  ctx.font=font(12,700);ctx.fillStyle=C.text;ctx.textAlign='left';ctx.fillText(k===0?'시작: 모두 평균 '+fx(B.f0,2)+'억으로 예측':'트리 '+k+'그루까지 더한 예측',l+8,tp+14);
  stamp(ctx,Wd,'예시 데이터');}
 function ui(){$('bstVal').textContent=k;$('bstSl').value=k;chain.querySelectorAll('canvas').forEach(function(c,i){c.style.opacity=i<k?1:.25;});
  $('bstStat').innerHTML='<div><b class="num">'+k+'</b><span>더한 트리</span></div><div><b class="num">'+fx(MAES[k],2)+'억</b><span>평균 잔차 (빗나간 금액)</span></div><div><b class="num">'+pct(1-MAES[k]/MAES[0],0)+'</b><span>처음보다 줄어든 오차</span></div>';
  $('bstPlay').textContent=run?'❚❚ 멈춤':'▶ 재생';draw();}
 $('bstSl').addEventListener('input',function(){run=false;k=+this.value;ui();});
 $('bstPlay').addEventListener('click',function(){if(k>=10)k=0;run=!run;ui();});
 $('bstReset').addEventListener('click',function(){run=false;k=0;ui();});
 onTick(cv,function(dt){if(!run)return;acc+=dt;if(acc>(REDUCE?.2:.8)){acc=0;k++;if(k>=10){k=10;run=false;}ui();}});
 ui();onRedraw(draw);})();

/* ══ 04 층 단위 vs 잎 단위 ══ */
(function(){var cv=$('growCv'),n=3;
 function draw(){var H=230,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),half=Wd/2;ctx.clearRect(0,0,Wd,H);
  function node(x,y,leaf,col){ctx.fillStyle=leaf?rgba(col,.35):C.panel2;ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();ctx.stroke();}
  function edge(a,b){ctx.strokeStyle=C.rule;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  /* 층 단위: 나눈 순서대로 BFS */
  var lv=[{x:half/2,y:36,d:0,w:half*0.42}],q=[lv[0]],cnt=0;lv[0].kids=null;
  while(cnt<n&&q.length){var p=q.shift();p.kids=[{x:p.x-p.w/2,y:p.y+52,d:p.d+1,w:p.w/2},{x:p.x+p.w/2,y:p.y+52,d:p.d+1,w:p.w/2}];q.push(p.kids[0],p.kids[1]);cnt++;}
  function drawT(p,col){if(p.kids){p.kids.forEach(function(k){edge([p.x,p.y],[k.x,k.y]);drawT(k,col);});}node(p.x,p.y,!p.kids,col);}
  drawT(lv[0],C.gfp);
  /* 잎 단위: 늘 오른쪽(오차 큰) 잎 하나만 나눈다 */
  var root={x:half+half/2,y:36,w:half*0.42},cur=root;for(var i=0;i<n;i++){cur.kids=[{x:cur.x-cur.w/2,y:cur.y+38,w:cur.w/1.6},{x:cur.x+cur.w/2*0.6,y:cur.y+38,w:cur.w/1.6}];cur=i%2?cur.kids[0]:cur.kids[1];}
  drawT(root,C.amber);
  ctx.font=font(12,700);ctx.textAlign='center';ctx.fillStyle=C.gfp;ctx.fillText('층 단위 (XGBoost 기본)',half/2,H-10);ctx.fillStyle=C.amber;ctx.fillText('잎 단위 (LightGBM)',half+half/2,H-10);
  ctx.strokeStyle=C.rule;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(half,10);ctx.lineTo(half,H-24);ctx.stroke();ctx.setLineDash([]);
  stamp(ctx,Wd,'개념 도식');}
 $('growSl').addEventListener('input',function(){n=+this.value;$('growVal').textContent=n;draw();});draw();onRedraw(draw);})();

/* ══ 담판: 표 데이터에서 배깅 vs 부스팅 ══ */
function duelRender(box,o,note){box.innerHTML=statGrid([[pct(o.rf),'초파리 · 랜덤 포레스트 25그루 · 검증','f'],[pct(o.gb),'Money-Robo · GBM 60단계 · 검증','r'],[pct(o.one),'참고 · 트리 1그루 · 검증']])+
  '<div class="tw" style="margin-top:10px"><table class="tb"><thead><tr><th>데이터 벌</th><th>트리 1그루</th><th>랜덤 포레스트</th><th>GBM</th></tr></thead><tbody>'+o.rows.map(function(r){return '<tr><td>'+r[0]+'번</td><td>'+pct(r[1])+'</td><td>'+(r[2]>r[3]?'<b>'+pct(r[2])+'</b>':pct(r[2]))+'</td><td>'+(r[3]>r[2]?'<b>'+pct(r[3])+'</b>':pct(r[3]))+'</td></tr>';}).join('')+'</tbody></table></div>'+(note||'');}
Duel('d10',{title:'표 데이터, 배깅이냐 부스팅이냐',q:'대출 600건의 상환 여부를 맞힌다. 특징은 소득·부채 같은 숫자 8개이고, 잘못 적힌 정답은 2%뿐이다. 400건으로 배우고 200건으로 잰다. 데이터를 세 벌 만들어 평균한다. 누가 더 잘 맞힐까?',
 fly:['랜덤 포레스트 25그루','그냥 둬도 잘 버텨. 다양한 의견의 평균이지.'],robo:['GBM 60단계','오답 노트를 60번 고치면 더 맞힌다. 표 데이터는 부스팅이야.'],roboMood:'stack',
 run:async function(p){var o=await LIN.duel(0.02,[1,2,3],p);var w=o.gb>o.rf?'r':(o.gb<o.rf?'f':'d');
  return {winner:w,measure:'세 벌 평균 검증 정확도는 Money-Robo 쪽 GBM이 '+pct(o.gb)+', 초파리 쪽 랜덤 포레스트가 '+pct(o.rf)+'예요. 차이는 '+fx((o.gb-o.rf)*100,1)+'%p로 크지 않아요. 트리 1그루는 '+pct(o.one)+'라 둘 다 한 그루보다는 확실히 나아요.',
   verdict:'잡음이 적은 표 데이터에서는 오답을 차례로 고치는 쪽이 조금 더 맞힌다. 다만 차이는 작다. 이 구역은 Money-Robo 쪽이다.',key:'표 데이터에서 부스팅이 자주 이기지만, 잡음 앞에서는 장담 못 한다.',
   render:function(box){duelRender(box,o);}};},
 alts:[{label:'잡음 많게 (정답 10% 뒤집기)',run:async function(box){var o=await LIN.duel(0.10,[1,2,3]);
   duelRender(box,o,say('fly','arms','봐, 잡음이 늘면 '+(o.rf>=o.gb?'포레스트가 앞서잖아. '+pct(o.rf)+' 대 '+pct(o.gb)+'.':'차이가 '+fx((o.gb-o.rf)*100,1)+'%p로 줄었지.')+' 오답을 끝까지 고치다 잘못 적힌 정답까지 고친 거야.')+say('robo','sigh','잡음 많은 장부에선 학습률을 낮추고 단계 수를 검증으로 골라야겠군.'));}},
  {label:'데이터 다섯 벌로 다시',run:async function(box){var o=await LIN.duel(0.02,[1,2,3,4,5]);
   duelRender(box,o,say('asst','ledger','다섯 벌 평균은 GBM '+pct(o.gb)+', 랜덤 포레스트 '+pct(o.rf)+'예요. 벌마다 이기는 쪽이 바뀌기도 해요. 차이가 1%p 안팎이면 데이터를 여러 벌로 재 봐야 해요.'));}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q10:[
 {q:'배깅(랜덤 포레스트)이 주로 줄이는 것은?',o:[['분산 — 데이터를 다시 뽑을 때마다 크게 흔들리는 것',1,'02장에서 한 그루는 다시 뽑을 때마다 경계가 크게 바뀌었고, 25그루의 다수결은 덜 바뀌었다.'],['편향 — 매번 같은 쪽으로 틀리는 것',0,'편향은 부스팅이 주로 줄인다(03장).'],['학습 시간',0,'트리를 여럿 키우니 시간은 오히려 는다.']]},
 {q:'부스팅의 다음 트리가 배우는 것은?',o:[['앞 단계까지 예측이 틀린 만큼(잔차)',1,'03장에서 1번 트리는 매매가가 아니라 평균과의 차이를 배웠다. 이것이 "오답 노트의 연쇄"다.'],['처음 데이터를 다시 뽑은 표본',0,'다시 뽑기는 배깅의 방법이다.'],['다른 트리들의 다수결',0,'다수결은 배깅(랜덤 포레스트)의 방법이다.']]},
 {q:'범주형 열(도시, 업종 등)이 많은 표에서 특기를 살리는 후손은?',o:[['CatBoost',1,'순서 있는 목표 통계로 범주형 값을 직접 다루는 것이 특기다.'],['Extra Trees',0,'Extra Trees는 배깅파로, 자르는 지점을 무작위로 고르는 것이 특기다.'],['LightGBM의 GOSS',0,'GOSS는 기울기가 작은 표본을 줄여 학습을 빠르게 하는 장치다.']]},
 {q:'담판에서 잡음(잘못 적힌 정답)을 늘리면 GBM의 앞섬이 줄거나 뒤집히는 까닭은?',o:[['오답을 끝까지 고치다 잘못 적힌 정답까지 맞추려 해서',1,'부스팅은 틀린 곳에 집중하니, 잡음 점도 "고칠 오답"으로 본다. 학습률과 단계 수를 검증으로 골라 막는다.'],['랜덤 포레스트가 잡음 점을 지워서',0,'포레스트도 잡음 점을 지우지 않는다. 다수결로 그 영향이 묻힐 뿐이다.'],['트리 수가 모자라서',0,'트리를 늘리면 부스팅은 오히려 잡음을 더 외울 수 있다.']]}]};

var PROMPTS=[
 {t:'① 내 표 데이터로 배깅 vs 부스팅',use:'표 데이터에 어떤 앙상블을 쓸지 정할 때',p:'내 표 데이터 〔예) loans.csv, 정답 열 repaid(0/1)〕로 랜덤 포레스트, Extra Trees, GradientBoosting, HistGradientBoosting을 비교하는 scikit-learn 코드를 짜 줘.\n\n- 5겹 교차 검증 평균과 표준편차를 표로\n- 부스팅은 학습률과 단계 수를 검증 데이터로 고르는 부분 포함\n- 마지막 성능은 따로 떼어 둔 시험 데이터로 한 번만\n\n결과를 보고 차이가 의미 있는 크기인지 해석해 줘.'},
 {t:'② XGBoost·LightGBM·CatBoost 고르기',use:'세 후손 중 하나를 골라야 할 때',p:'내 데이터는 〔행 수, 숫자 열 수, 범주형 열 수와 각 범주 개수, 결측값 비율〕이다. XGBoost, LightGBM, CatBoost 중 무엇부터 시도할지 이유와 함께 추천해 줘. 각 라이브러리에서 꼭 조정할 하이퍼파라미터 5개씩, 과적합을 막는 설정, 조기 종료 쓰는 법을 예시 코드와 함께 정리해 줘. 공식 문서 기준으로 설명하고, 버전에 따라 달라지는 부분은 표시해 줘.'},
 {t:'③ 잡음 많은 데이터에서 부스팅 다루기',use:'정답이 자주 잘못 적히는 데이터일 때',p:'정답에 잡음이 많은 데이터에서 GBM 계열이 과적합하지 않도록 하는 방법을 정리해 줘. 1) 학습률·단계 수·조기 종료 2) 잎 수·최소 표본 수·부분 표본(subsample) 3) 손실 함수 바꾸기 4) 랜덤 포레스트와의 비교 실험 설계. 내 데이터 상황은 〔설명〕이다. 파이썬 예시 코드도 붙여 줘.'},
 {t:'④ 수업용 앙상블 계보 활동',use:'강의에서 배깅과 부스팅을 몸으로 보여 주고 싶을 때',p:'고등학생 대상 30분 활동을 기획해 줘. 1) 배깅: 학생 여럿이 같은 질문에 따로 추측하고 평균 내기 2) 부스팅: 앞 학생이 틀린 문제만 다음 학생에게 넘기기 3) 두 활동에서 무엇이 줄어드는지(흔들림 vs 치우침) 정리하는 질문 세 개와 예상 답. 준비물과 시간 배분도 적어 줘.'}];
var GL=[
 ['앙상블','배깅','데이터를 복원 추출로 다시 뽑아 모델 여럿을 키우고 평균·다수결로 합치는 방법.'],['앙상블','부스팅','앞 모델이 틀린 곳을 다음 모델이 차례로 고쳐 쌓는 방법.'],
 ['앙상블','복원 추출','뽑은 것을 다시 넣고 뽑기. 같은 점이 여러 번, 어떤 점은 한 번도 안 뽑힌다.'],['앙상블','랜덤 포레스트','배깅에 "자를 때 특징 일부만 보기"를 더한 트리 숲.'],
 ['앙상블','Extra Trees','자르는 지점까지 무작위로 고르는 트리 숲.'],['앙상블','GBM','잔차(손실의 기울기)를 다음 트리가 배우는 경사 부스팅.'],
 ['앙상블','잔차','정답에서 지금 예측을 뺀 값. 남은 오답.'],['앙상블','학습률','새 트리가 배운 값 가운데 예측에 더하는 몫. 작을수록 천천히, 안전하게 배운다.'],
 ['평가','분산','데이터를 다시 뽑을 때마다 모델이 흔들리는 정도.'],['평가','편향','모델이 매번 같은 쪽으로 틀리는 치우침.'],
 ['후손','XGBoost','규제항과 2차 근사, 병렬 분할 찾기를 더한 GBM 구현.'],['후손','LightGBM','히스토그램 분할과 잎 단위 성장, GOSS·EFB로 빠르게 만든 GBM 구현.'],
 ['후손','CatBoost','순서 있는 부스팅과 범주형 특징 직접 처리가 특기인 GBM 구현.'],['후손','잎 단위 성장','오차가 가장 큰 잎부터 나누는 트리 키우기. 층 단위는 한 층을 모두 나눈다.'],
 ['데이터','범주형 특징','도시·업종처럼 이름표로 된 특징.']];
var ANALOGY=[
 ['배깅','같은 문제를 여러 사람이 따로 풀고 다수결',2,'초파리 무리가 저마다 냄새를 따라가도 무리 전체의 방향은 덜 흔들린다','사람들의 실수가 서로 비슷하면(같은 실수) 평균해도 줄지 않는다(4-5)'],
 ['부스팅','오답 노트를 다음 사람에게 넘기기',1,'','오답 노트에 잘못된 정답까지 적혀 있으면 그것도 열심히 외운다(담판의 잡음)'],
 ['학습률','고칠 때 한 번에 조금씩만',1,'','너무 작으면 단계가 아주 많이 필요하다. 그래서 단계 수와 함께 고른다'],
 ['잎 단위 성장','가장 급한 일부터 처리하기',1,'','급한 일만 쫓다 보면 한쪽으로 치우친다. 그래서 깊이 제한을 함께 건다']];
var REFS=[
 'Breiman, L. (1996). Bagging predictors. <i>Machine Learning</i>, 24(2), 123–140. — 배깅',
 'Breiman, L. (2001). Random forests. <i>Machine Learning</i>, 45(1), 5–32. — 랜덤 포레스트',
 'Geurts, P., Ernst, D., &amp; Wehenkel, L. (2006). Extremely randomized trees. <i>Machine Learning</i>, 63(1), 3–42. — Extra Trees',
 'Friedman, J. H. (2001). Greedy function approximation: A gradient boosting machine. <i>The Annals of Statistics</i>, 29(5), 1189–1232. — GBM',
 'Chen, T., &amp; Guestrin, C. (2016). XGBoost: A scalable tree boosting system. <i>Proceedings of the 22nd ACM SIGKDD</i>, 785–794. — XGBoost',
 'Ke, G., et al. (2017). LightGBM: A highly efficient gradient boosting decision tree. <i>Advances in Neural Information Processing Systems 30</i>. — LightGBM',
 'Prokhorenkova, L., et al. (2018). CatBoost: Unbiased boosting with categorical features. <i>Advances in Neural Information Processing Systems 31</i>. — CatBoost',
 'Pawar, P. <i>Machine Learning Algorithm Family Tree</i> (인포그래픽). — 앙상블 칸의 구성'];
var TIP={who:'4-5 앙상블 연합을 읽은 학습자. 결정 트리와 과적합(4-2)을 알면 좋다',goal:'① 배깅파와 부스팅파의 계보를 그리고 여섯 조직원의 특기를 한 줄로 말한다 ② 다시 뽑기 실험으로 배깅이 분산을 줄임을 확인한다 ③ 단계 재생으로 부스팅이 잔차를 배움을 설명한다 ④ 잡음이 부스팅의 앞섬을 줄이는 까닭을 말한다',time:'읽기 15분 · 실험과 담판 12분 · Colab 10분',
 plans:[['강의형 30분','01장 계보도 5분 → 02장 다시 뽑기를 다섯 번 누르며 흔들림 숫자 받아 적기 8분 → 03장 재생을 멈춰 가며 "다음 트리는 무엇을 배우나" 묻기 7분 → 담판과 잡음 조건 10분.'],['실무 OJT 60분','04장 비교표 10분 → 프롬프트 ①·②로 사내 표 데이터에 네 모델 교차 검증 35분 → 차이가 의미 있는 크기인지 토론 15분.'],['1:1 튜터링','담판을 열기 전에 승자와 차이 크기를 예측하게 하고, "잡음 많게"의 결과를 03장의 잔차 그림으로 설명하게 한다.']],
 myths:[['부스팅이 늘 랜덤 포레스트보다 낫다','잡음이 많거나 데이터가 작으면 차이가 사라지거나 뒤집힌다(담판)'],['트리를 많이 넣을수록 좋다','배깅은 대체로 그렇지만, 부스팅은 단계가 많으면 과적합한다'],['XGBoost·LightGBM·CatBoost는 서로 다른 알고리즘이다','셋 다 경사 부스팅이다. 다른 것은 빠르고 튼튼하게 만드는 장치다']]};
var CODE={title:'배깅 vs 부스팅, 잡음별로',sub:'담판 재현 · numpy, scikit-learn · CPU 30초 안팎',file:'bagging_vs_boosting',
 desc:'담판을 옮겼다. 특징 8개짜리 표 데이터를 만들고 정답을 0%·2%·10%·25% 뒤집으며, 트리 1그루, 랜덤 포레스트, Extra Trees, GBM, 히스토그램 GBM(LightGBM과 같은 방식)의 검증 정확도를 비교한다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 같지만 난수 생성기와 트리 구현이 달라 숫자는 조금 다르다. 비교는 세 벌 평균이며, 1%p 안팎의 차이는 벌에 따라 뒤집힐 수 있다.'};
