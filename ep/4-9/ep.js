/* ══ 4-9 강화 삼대 ═══════════════════════════════════════════════ */
var GENS=[
 {k:'sweep_top',n:'Q-Learning',t:'쓱싹이 1세 · 할아버지',one:'칸마다 행동의 값을 표에 적는다',learn:'상태·행동별 값 Q(s, a)',keep:'표',core:'받은 보상 + 다음 칸의 가장 좋은 값으로 표를 조금 고친다',good:'단순하고 원리가 투명하다. 작은 세계에서 빠르다',weak:'상태가 많아지면 표가 감당하지 못한다',born:'Watkins 1989 (학위논문) · Watkins &amp; Dayan 1992'},
 {k:'sweep2',n:'DQN',t:'쓱싹이 2세 · 아버지',one:'표 대신 신경망이 Q 값을 계산한다',learn:'같음 · Q(s, a)',keep:'심층 신경망',core:'경험 재생과 목표 네트워크로 학습을 안정시킨다',good:'게임 화면처럼 거대한 상태 공간',weak:'행동이 연속적이면(관절 각도 등) 다루기 어렵다',born:'Mnih 외 2013 (공개) · 2015 Nature'},
 {k:'sweep3',n:'PPO',t:'쓱싹이 3세 · 막내',one:'정책을 조금씩, 안전하게 고친다',learn:'정책 π(a | s) 자체',keep:'신경망',core:'확률 비율의 변화량을 1 ± ε 안으로 자른다',good:'학습이 안정적이고 연속 행동도 다룬다',weak:'표본(경험)이 많이 들고, 손잡이가 여럿이다',born:'Schulman 외 2017 (공개)'}];

/* ── 히어로: 표 → 신경망 → 정책 ── */
heroStage($('heroCv'),{bg:'sc_maze',bgY:.5,fly:'point',robo:'tux',motif:function(ctx,t,W,H){var C=cols(),X=[330,550,770],y0=46;
  ctx.fillStyle='rgba(13,12,28,.78)';rr(ctx,236,24,628,236,16);ctx.fill();
  ctx.font=font(13,700);ctx.textAlign='center';['Q-Learning · 표','DQN · 신경망','PPO · 정책'].forEach(function(s,i){ctx.fillStyle=['#d4a54a','#8fb878','#b56a8a'][i];ctx.fillText(s,X[i],y0);});
  /* 표 */var r=ML.R(5);for(var a=0;a<4;a++)for(var b=0;b<4;b++){var v=(Math.sin(t*1.2+a*.7+b*.5)+1)/2*(a+b)/6;ctx.fillStyle=rgba('#d4a54a',.15+.7*v);ctx.fillRect(X[0]-62+a*31,y0+16+b*31,28,28);}
  /* 신경망 */var L=[[-60,3],[0,5],[60,4]],P=[];L.forEach(function(l,i){var pp=[];for(var j=0;j<l[1];j++)pp.push([X[1]+l[0],y0+30+(j+.5)*(120/l[1])]);P.push(pp);});
  ctx.lineWidth=1;for(var i=0;i<2;i++)P[i].forEach(function(p){P[i+1].forEach(function(q){ctx.strokeStyle=rgba('#8fb878',.25+.25*Math.sin(t*2+p[1]*.05+q[1]*.03));ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});});
  P.forEach(function(l){l.forEach(function(p){circ(ctx,p[0],p[1],5,'#1a1714','#8fb878',2);});});
  /* 정책 막대 */var pr=[.15+.1*Math.sin(t),.45-.1*Math.sin(t),.25,.15];pr.forEach(function(p,i){ctx.fillStyle=rgba('#b56a8a',.85);var h=p*200;ctx.fillRect(X[2]-58+i*30,y0+150-h,22,h);});
  ctx.fillStyle='#a89a86';ctx.font=font(10.5);['↑','→','↓','←'].forEach(function(s,i){ctx.fillText(s,X[2]-47+i*30,y0+166);});
  ctx.strokeStyle='rgba(239,230,216,.5)';ctx.lineWidth=2;[0,1].forEach(function(i){ctx.beginPath();ctx.moveTo(X[i]+80,y0+75);ctx.lineTo(X[i+1]-80,y0+75);ctx.stroke();ctx.beginPath();ctx.moveTo(X[i+1]-86,y0+70);ctx.lineTo(X[i+1]-80,y0+75);ctx.lineTo(X[i+1]-86,y0+80);ctx.stroke();});
  var sx=(t*60)%700;['sweep_top','sweep2','sweep3'].forEach(function(k,i){var c=NPC.draw(k,3);if(c)ctx.drawImage(c,200+((sx+i*233)%700),y0+188-c.height);});}});

/* ── 01 신상 파일과 계보 ── */
(function(){var host=$('files');GENS.forEach(function(g){var d=document.createElement('div');d.className='dcard';d.style.cursor='default';d.style.minHeight='0';
  var cv=NPC.el(g.k,3,g.t);cv.style.alignSelf='flex-start';d.appendChild(cv);
  d.insertAdjacentHTML('beforeend','<b style="font-size:16px">'+g.n+'</b><span class="muted" style="font-size:13px">'+g.t+'</span><span><b>특기</b> '+g.one+'</span><span><b>배우는 것</b> '+g.learn+'</span><span><b>저장</b> '+g.keep+'</span><span><b>핵심</b> '+g.core+'</span><span><b>강점</b> '+g.good+'</span><span><b>약점</b> '+g.weak+'</span><span class="muted" style="font-size:13px">처음 나온 곳: '+g.born+'</span>');host.appendChild(d);});
 var cv=$('tlCv');function draw(){var H=170,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=30,r=Wd-30,y=70;ctx.clearRect(0,0,Wd,H);
  function px(yr){return l+(yr-1986)/(2022-1986)*(r-l)}
  ctx.strokeStyle=C.rule;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(l,y);ctx.lineTo(r,y);ctx.stroke();
  ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='center';[1990,2000,2010,2020].forEach(function(v){ctx.fillText(v,px(v),y+16);ctx.fillRect(px(v)-1,y-4,2,8);});
  var y0_=0;var ev=[[1989,'Q-Learning','학위논문',C.amber,0],[1992,'','논문 (Watkins & Dayan)',C.amber,1],[2013,'DQN','공개 (Mnih 외)',C.gfp,0],[2015,'','Nature 논문',C.gfp,1],[2017,'PPO','공개 (Schulman 외)',C.stain,0]];
  ev.forEach(function(e){var x=px(e[0]),up=!e[4];circ(ctx,x,y,6,e[3]);ctx.fillStyle=e[3];ctx.font=font(Wd<520?10:11.5,700);ctx.fillText(e[1]?e[1]+' '+e[0]:''+e[0],x,up?y-26:y+40);ctx.font=font(Wd<520?9.5:10.5);ctx.fillStyle=C.muted;ctx.fillText(e[2],x,up?y-12:y+54);});
  ['sweep_top','sweep2','sweep3'].forEach(function(k,i){var c=NPC.draw(k,2);if(c)ctx.drawImage(c,px([1989,2013,2017][i])-c.width/2,8);});}draw();onRedraw(draw);
 function ex(){var a=+$('ex1a').value,g=+$('ex1g').value,q=2,rw=-0.1,nx=8,tg=rw+g*nx,nq=q+a*(tg-q);$('ex1av').textContent=fx(a,1);$('ex1gv').textContent=fx(g,2);
  $('ex1out').innerHTML='목표값 = −0.1 + '+fx(g,2)+' × 8.0 = <b>'+fx(tg,2)+'</b><br>새 Q = 2.0 + '+fx(a,1)+' × ('+fx(tg,2)+' − 2.0) = <b>'+fx(nq,2)+'</b>';}
 $('ex1a').addEventListener('input',ex);$('ex1g').addEventListener('input',ex);ex();})();

/* ── 02 격자 미로 ── */
var MAZE=[6,7,8,16,17,18];
(function(){var cv=$('gridCv'),sc=$('stepCv'),n=5,R=null,ep=0,run=false,acc=0,EPS=60;
 npcLine($('sweepHost'),['sweep_top'],3,'말단 조직원 <b>쓱싹이</b>: "삐빅! 충전기 칸에 닿으면 +10, 벽에 부딪히면 쿵(−1), 한 걸음마다 −0.1."');
 function train(){R=ML.qgrid(n,MAZE,24,0,{alpha:+$('slA').value,gamma:+$('slG').value,eps:+$('slE').value,episodes:EPS,seed:9,snapEvery:1});ep=1;draw();ui();}
 function Qat(){return R.snaps[ep-1];}
 function path(Q){var s=0,p=[0],seen={};var DX=[0,1,0,-1],DY=[-1,0,1,0];while(s!==24&&p.length<40){if(seen[s])break;seen[s]=1;var q=Q[s];if(!q.some(function(v){return v!==0}))break;var a=q.indexOf(Math.max.apply(null,q)),x=s%n+DX[a],y=Math.floor(s/n)+DY[a];if(x<0||y<0||x>=n||y>=n||MAZE.indexOf(y*n+x)>=0)break;s=y*n+x;p.push(s);}return {p:p,ok:s===24};}
 function draw(){var H=Math.min(352,(cv.clientWidth||330)+26),Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),S=Math.min(Wd,H-30)-4,ox=(Wd-S)/2,oy=28,cs=S/n,Q=Qat();ctx.clearRect(0,0,Wd,H);
  var mx=0.01;Q.forEach(function(q){q.forEach(function(v){mx=Math.max(mx,Math.abs(v));});});
  for(var s=0;s<n*n;s++){var x=ox+(s%n)*cs,y=oy+Math.floor(s/n)*cs,cx=x+cs/2,cy=y+cs/2;
   if(MAZE.indexOf(s)>=0){ctx.fillStyle=C.rule;ctx.fillRect(x+1,y+1,cs-2,cs-2);continue;}
   ctx.fillStyle=C.panel2;ctx.fillRect(x+1,y+1,cs-2,cs-2);
   if(s===24){ctx.fillStyle=rgba(C.amber,.35);ctx.fillRect(x+1,y+1,cs-2,cs-2);ctx.fillStyle=C.amber;ctx.font=font(Math.max(10,cs*.16),700);ctx.textAlign='center';ctx.fillText('충전기',cx,cy+4);continue;}
   var tri=[[[x+2,y+2],[x+cs-2,y+2]],[[x+cs-2,y+2],[x+cs-2,y+cs-2]],[[x+cs-2,y+cs-2],[x+2,y+cs-2]],[[x+2,y+cs-2],[x+2,y+2]]];
   Q[s].forEach(function(v,a){var k=v/mx;ctx.fillStyle=k>=0?rgba(C.gfp,.08+.75*k):rgba(C.eye,.08+.6*(-k));ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(tri[a][0][0],tri[a][0][1]);ctx.lineTo(tri[a][1][0],tri[a][1][1]);ctx.closePath();ctx.fill();});
   if(Q[s].some(function(v){return v!==0})){var b=Q[s].indexOf(Math.max.apply(null,Q[s])),dx=[0,1,0,-1][b],dy=[-1,0,1,0][b],L=cs*.28;ctx.strokeStyle=C.text;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx-dx*L,cy-dy*L);ctx.lineTo(cx+dx*L,cy+dy*L);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+dx*L,cy+dy*L);ctx.lineTo(cx+dx*L*.45-dy*L*.4,cy+dy*L*.45+dx*L*.4);ctx.moveTo(cx+dx*L,cy+dy*L);ctx.lineTo(cx+dx*L*.45+dy*L*.4,cy+dy*L*.45-dx*L*.4);ctx.stroke();}}
  var P=path(Q);ctx.strokeStyle=rgba(C.amber,.85);ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();P.p.forEach(function(s,i){var X=ox+(s%n+.5)*cs,Y=oy+(Math.floor(s/n)+.5)*cs;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.stroke();ctx.setLineDash([]);
  var bot=NPC.draw('sweep_top',Math.max(2,Math.round(cs/22)));if(bot){var e=P.p[P.p.length-1];ctx.drawImage(bot,ox+(e%n+.5)*cs-bot.width/2,oy+(Math.floor(e/n)+.5)*cs-bot.height/2);}
  stamp(ctx,Wd,'판 '+ep+' / '+EPS);
  var h=140,W2=fit(sc,h),c2=sc.getContext('2d'),l=34,r=W2-8,tp=10,bt=h-22,mxs=Math.max.apply(null,R.hist);c2.clearRect(0,0,W2,h);
  c2.strokeStyle=C.rule;c2.beginPath();c2.moveTo(l,tp);c2.lineTo(l,bt);c2.lineTo(r,bt);c2.stroke();c2.font=font(10.5);c2.fillStyle=C.muted;c2.textAlign='right';[0,Math.round(mxs/2),mxs].forEach(function(v){c2.fillText(v,l-4,bt-v/mxs*(bt-tp)+4);});
  c2.textAlign='center';c2.fillText('판',(l+r)/2,h-4);c2.strokeStyle=C.amber;c2.lineWidth=2;c2.beginPath();R.hist.forEach(function(v,i){var X=l+i/(EPS-1)*(r-l),Y=bt-v/mxs*(bt-tp);i?c2.lineTo(X,Y):c2.moveTo(X,Y);});c2.stroke();
  var X=l+(ep-1)/(EPS-1)*(r-l);c2.strokeStyle=C.text;c2.setLineDash([3,3]);c2.beginPath();c2.moveTo(X,tp);c2.lineTo(X,bt);c2.stroke();c2.setLineDash([]);
  c2.textAlign='left';c2.fillStyle=C.muted;c2.fillText('충전기까지 걸음 수 (최단 8걸음)',l+6,tp+10);}
 function ui(){var Q=Qat(),filled=Q.filter(function(q){return q.some(function(v){return v!==0})}).length,P=path(Q);
  $('gStat').innerHTML='<div><b class="num">'+ep+'</b><span>지난 판 수</span></div><div><b class="num">'+R.hist[ep-1]+'</b><span>이번 판 걸음 수</span></div><div><b class="num">'+filled+' / 19</b><span>값이 적힌 칸</span></div><div><b class="num">'+(P.ok?'찾음':'아직')+'</b><span>출발점에서 충전기 길</span></div>';
  $('gPlay').textContent=run?'❚❚ 멈춤':'▶ 재생';
  $('gInfo').innerHTML='출발 칸(왼쪽 위)에서 '+EPS+'판을 연습한다. 처음에는 값이 모두 0이라 아무 데나 헤맨다. 충전기에 한 번 닿으면 바로 옆 칸의 값이 오르고, 판을 거듭할수록 그 값이 한 칸씩 뒤로 번진다. γ를 낮추면 먼 칸까지 값이 잘 번지지 않고, ε를 0으로 두면 처음 찾은 길만 고집한다.';}
 $('gPlay').addEventListener('click',function(){if(ep>=EPS)ep=1;run=!run;ui();});
 $('gStep').addEventListener('click',function(){run=false;ep=Math.min(EPS,ep+1);draw();ui();});
 $('gReset').addEventListener('click',function(){run=false;ep=1;draw();ui();});
 [['slA','slAv',1],['slG','slGv',2],['slE','slEv',2]].forEach(function(s){$(s[0]).addEventListener('input',function(){$(s[1]).textContent=fx(+this.value,s[2]);run=false;train();});});
 onTick(cv,function(dt){if(!run)return;acc+=dt;if(acc>.22){acc=0;ep++;if(ep>=EPS){ep=EPS;run=false;}draw();ui();}});
 train();onRedraw(draw);})();

/* ── 02 격자를 키우면? ── */
(function(){var cv=$('sizeCv'),v=0,r=ML.R(84),PIX=[];for(var i=0;i<84*84;i++)PIX.push(r()<.5?1:0);
 var INFO=[
  ['5×5 미로','상태 25개 × 행동 4개 = <b>100칸</b>. 몇십 판이면 다 채운다. Q 표가 가장 잘하는 크기다.'],
  ['20×20 격자','상태 400개 × 행동 4개 = <b>1,600칸</b>. 칸마다 여러 번 들러야 값이 맞아지니, 같은 연습량으로는 대부분의 칸이 엉터리로 남는다(담판에서 직접 잰다).'],
  ['84×84 흑백 화면','화면 한 장이 곧 상태다. 칸마다 검정·흰색 두 가지만 있어도 가능한 화면은 2<sup>84×84</sup> = <b>2<sup>7056</sup>가지</b>(약 10<sup>2124</sup>), 회색 256단계면 256<sup>7056</sup> = 2<sup>56448</sup>가지다. 우주의 원자 수(약 10<sup>80</sup>)보다 훨씬 많아 표를 만들 수조차 없다. 그래서 <a href="#m3">DQN</a>은 표 대신 신경망을 쓴다.']];
 function draw(){var H=220,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),S=H-20,ox=(Wd-S)/2,oy=10;ctx.clearRect(0,0,Wd,H);
  if(v<2){var n=v?20:5,cs=S/n;for(var a=0;a<n;a++)for(var b=0;b<n;b++){ctx.fillStyle=(a===n-1&&b===n-1)?rgba(C.amber,.6):C.panel2;ctx.fillRect(ox+a*cs+.5,oy+b*cs+.5,cs-1,cs-1);}
   if(v===0)MAZE.forEach(function(s){ctx.fillStyle=C.rule;ctx.fillRect(ox+(s%5)*cs+.5,oy+Math.floor(s/5)*cs+.5,cs-1,cs-1);});}
  else{var c=S/84;PIX.forEach(function(p,i){ctx.fillStyle=p?'#efe6d8':'#1a1714';ctx.fillRect(ox+(i%84)*c,oy+Math.floor(i/84)*c,c+.3,c+.3);});ctx.strokeStyle=C.rule;ctx.strokeRect(ox,oy,S,S);}
  ctx.font=font(12,700);ctx.fillStyle=C.text;ctx.textAlign='left';var tx=ox+S+14;if(tx+120<Wd){ctx.fillText(['상태 25개','상태 400개','상태 2^7056개'][v],tx,oy+20);ctx.font=font(11);ctx.fillStyle=C.muted;ctx.fillText(['Q 표 100칸','Q 표 1,600칸','표를 만들 수 없음'][v],tx,oy+38);}
  stamp(ctx,Wd,v===2?'무작위 화면 한 장':'세계의 크기');}
 function ui(){$('sizeInfo').innerHTML='<b>'+INFO[v][0]+'.</b> '+INFO[v][1];draw();}
 seg('#m2 .pills button',function(x){v=+x;ui();});ui();onRedraw(draw);})();

/* ── 03 DQN 개념 도식 ── */
(function(){var cv=$('dqnCv');function draw(){var H=280,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),k=Wd/520;ctx.clearRect(0,0,Wd,H);ctx.save();ctx.scale(k,1);
  function box(x,y,w,h,t,col,sub){ctx.fillStyle=rgba(col,.14);rr(ctx,x,y,w,h,8);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=C.text;ctx.font=font(12,700);ctx.textAlign='center';ctx.fillText(t,x+w/2,y+h/2+(sub?-3:4));if(sub){ctx.font=font(10);ctx.fillStyle=C.muted;ctx.fillText(sub,x+w/2,y+h/2+12);}}
  function arr(x1,y1,x2,y2,col,dash){ctx.strokeStyle=col;ctx.lineWidth=1.8;if(dash)ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);var a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-8*Math.cos(a-.4),y2-8*Math.sin(a-.4));ctx.lineTo(x2-8*Math.cos(a+.4),y2-8*Math.sin(a+.4));ctx.closePath();ctx.fill();}
  var r=ML.R(3);for(var i=0;i<12;i++)for(var j=0;j<12;j++){ctx.fillStyle=r()<.35?'#efe6d8':'#2a2520';ctx.fillRect(14+i*5,30+j*5,5,5);}ctx.fillStyle=C.muted;ctx.font=font(10.5);ctx.textAlign='center';ctx.fillText('화면 = 상태',44,104);
  box(110,26,130,64,'Q 신경망',C.gfp,'화면 → 행동별 값');arr(76,58,108,58,C.text);
  ['↑','→','↓','←'].forEach(function(s,i){var y=22+i*20;ctx.fillStyle=rgba(C.gfp,.2+.15*i);ctx.fillRect(270,y,40+i*12,14);ctx.fillStyle=C.text;ctx.font=font(10.5);ctx.textAlign='left';ctx.fillText(s+' Q',316+i*12,y+11);});arr(242,58,266,58,C.text);
  box(96,140,150,56,'경험 창고',C.amber,'(상태, 행동, 보상, 다음 상태)');arr(175,92,175,138,C.amber,1);ctx.fillStyle=C.muted;ctx.font=font(10);ctx.textAlign='left';ctx.fillText('겪은 장면을 쌓는다',180,118);
  box(330,140,150,56,'목표 네트워크',C.stain,'일정 걸음마다 복사한 사본');arr(242,52,330,150,C.stain,1);ctx.fillStyle=C.stain;ctx.textAlign='left';ctx.fillText('복사',314,116);
  arr(248,180,328,180,C.text);ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.font=font(9.5);ctx.fillText('무작위로 뽑아',288,166);ctx.fillText('복습',288,200);ctx.font=font(10);
  box(140,226,320,40,'오차 = Q − (보상 + γ × 사본의 가장 큰 값) → 신경망을 고친다',C.info);arr(405,198,360,224,C.text);arr(175,198,200,224,C.text);
  ctx.restore();stamp(ctx,Wd,'개념 도식');}draw();onRedraw(draw);})();

/* ── 04 PPO 자르기 ── */
(function(){var cv=$('ppoCv');function eps(){return +$('slP').value}
 function draw(){var H=240,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=40,r=Wd-12,tp=12,bt=H-30,e=eps();ctx.clearRect(0,0,Wd,H);
  function px(x){return l+x/2*(r-l)}function py(y){return bt-(y+2)/4*(bt-tp)}
  ctx.fillStyle=rgba(C.amber,.1);ctx.fillRect(px(1-e),tp,px(1+e)-px(1-e),bt-tp);
  ctx.strokeStyle=C.rule;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.moveTo(l,py(0));ctx.lineTo(r,py(0));ctx.stroke();
  ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='center';[0,.5,1,1.5,2].forEach(function(v){ctx.fillText(v,px(v),bt+14);});ctx.fillText('확률 비율 ρ = 새 정책 ÷ 옛 정책',(l+r)/2,H-3);
  ctx.textAlign='right';[-2,-1,0,1,2].forEach(function(v){ctx.fillText(v,l-5,py(v)+4);});
  function clip(x){return Math.max(1-e,Math.min(1+e,x))}
  [[1,C.gfp],[-1,C.eye]].forEach(function(s){var A=s[0];ctx.strokeStyle=rgba(s[1],.3);ctx.setLineDash([4,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px(0),py(0));ctx.lineTo(px(2),py(2*A));ctx.stroke();ctx.setLineDash([]);
   ctx.strokeStyle=s[1];ctx.lineWidth=3;ctx.beginPath();for(var q=0;q<=200;q++){var x=q/100,y=Math.min(x*A,clip(x)*A);q?ctx.lineTo(px(x),py(y)):ctx.moveTo(px(x),py(y));}ctx.stroke();});
  ctx.fillStyle=C.amber;ctx.textAlign='center';ctx.font=font(10.5,700);ctx.fillText('1 ± ε',px(1),tp+12);stamp(ctx,Wd,'목표 함수');}
 function ui(){var e=eps();$('slPv').textContent=fx(e,2);$('ppoInfo').innerHTML='좋았던 행동은 확률을 <b>'+fx(1+e,2)+'배</b>까지만 올려도 점수가 늘고, 그 너머는 평평하다. 나빴던 행동은 <b>'+fx(1-e,2)+'배</b>까지 내리면 더 내려도 점수가 늘지 않는다. 점선은 자르지 않았을 때다. ε가 크면 한 번에 많이 바뀌고, 작으면 느리지만 안전하다.';draw();}
 $('slP').addEventListener('input',ui);ui();onRedraw(draw);})();

/* ── 담판: 표냐 계산식이냐 ── */
function reachMap(cv,E,res,H,label){var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),n=E.n,S=Math.min(Wd/2-10,H-24),cs=S/n;ctx.clearRect(0,0,Wd,H);
  res.forEach(function(rr_,k){var ox=k*(Wd/2)+(Wd/2-S)/2,oy=4;for(var s=0;s<n*n;s++){var x=ox+(s%n)*cs,y=oy+Math.floor(s/n)*cs,v=rr_.reach[s];ctx.fillStyle=E.W[s]?C.rule:(s===E.goal?C.amber:(v?rgba(C.gfp,.75):rgba(C.eye,.45)));ctx.fillRect(x+.4,y+.4,cs-.8,cs-.8);}
   ctx.fillStyle=C.text;ctx.font=font(11,700);ctx.textAlign='center';ctx.fillText(label[k]+' · '+pct(rr_.rate,0),ox+S/2,oy+S+15);});}
Duel('d9',{title:'표냐, 계산식이냐',q:'같은 연습량으로 두 세계를 배운다. ① 5×5 지그재그 미로(60판) ② 20×20 빈 격자(40판). 연습이 끝나면 모든 빈칸에서 출발해 충전기에 닿는 비율을 잰다. 시드 3개의 평균이다.',
 fly:['Q 표','5×5엔 표면 충분해. 칸마다 값을 정확히 적으니까.'],robo:['근사 Q (DQN 방식)','표는 구식이야. 계산식이 값을 내면 처음 보는 칸도 답하지.'],roboMood:'chart',
 run:async function(p){var S=[1,2,3],A=RL3.env(5,RL3.SNAKE),B=RL3.env(20);p(.15);await wait(30);
  var at=RL3.avg(A,'t',60,S);p(.3);await wait(20);var aa=RL3.avg(A,'a',60,S);p(.5);await wait(20);var bt=RL3.avg(B,'t',40,S);p(.8);await wait(20);var ba=RL3.avg(B,'a',40,S);p(1);
  var w1=at.rate>aa.rate?'f':(at.rate<aa.rate?'r':'d'),w2=bt.rate>ba.rate?'f':(bt.rate<ba.rate?'r':'d'),w=w1===w2?w1:'d';
  return {winner:w,measure:'① 5×5 지그재그 미로에서는 초파리 쪽 Q 표가 '+pct(at.rate)+', Money-Robo 쪽 근사 Q가 '+pct(aa.rate)+'예요. ② 20×20 빈 격자에서는 Q 표가 '+pct(bt.rate)+', 근사 Q가 '+pct(ba.rate)+'예요. 기억할 숫자 수는 5×5에서 '+at.params+' 대 '+aa.params+'개, 20×20에서 '+bt.params.toLocaleString()+' 대 '+ba.params+'개였어요.',
   verdict:'둘 다 맞다. 작은 미로에서는 칸마다 값을 적는 표가 벽을 정확히 피했고, 큰 격자에서는 비슷한 칸끼리 배운 것을 나눠 쓰는 계산식이 이겼다. 이 구역은 나눠 갖는다.',key:'문제 크기가 도구를 정한다.',
   render:function(box){box.innerHTML=statGrid([[pct(at.rate),'① 미로 · Q 표','f'],[pct(aa.rate),'① 미로 · 근사 Q','r'],[pct(bt.rate),'② 20×20 · Q 표','f'],[pct(ba.rate),'② 20×20 · 근사 Q','r']])+
    '<div class="two" style="margin-top:12px"><figure style="margin:0"><canvas class="fig" id="dA" aria-label="5×5 지그재그 미로에서 각 칸이 충전기에 닿는지(초록) 못 닿는지(빨강). 왼쪽 Q 표, 오른쪽 근사 Q"></canvas><figcaption class="muted" style="font-size:13px">① 5×5 지그재그 미로 · 시드 1 (초록 = 닿음, 빨강 = 못 닿음)</figcaption></figure><figure style="margin:0"><canvas class="fig" id="dB" aria-label="20×20 빈 격자에서 각 칸이 충전기에 닿는지. 왼쪽 Q 표, 오른쪽 근사 Q"></canvas><figcaption class="muted" style="font-size:13px">② 20×20 빈 격자 · 시드 1</figcaption></figure></div>'+
    '<p class="muted" style="font-size:13.5px;margin:10px 0 0">근사 Q는 진짜 심층 신경망이 아니다. "가로 위치의 점수 + 세로 위치의 점수"로 Q를 계산하는 가장 작은 계산식이다. DQN의 핵심 생각(표 대신 계산식, 비슷한 상태끼리 배운 것을 나눠 쓰기)만 담았다. 그래서 지그재그 벽처럼 "이 줄에서만 예외"인 규칙은 표현하지 못한다.</p>';
    function dr(){reachMap($('dA'),A,[at.runs[0],aa.runs[0]],170,['Q 표','근사 Q']);reachMap($('dB'),B,[bt.runs[0],ba.runs[0]],170,['Q 표','근사 Q']);}setTimeout(dr,0);onRedraw(dr);}};},
 alts:[{label:'격자를 30×30으로 키우면?',run:async function(box){var E=RL3.env(30),t=RL3.learn(E,'t',40,1),a=RL3.learn(E,'a',40,1);
   box.innerHTML=statGrid([[pct(t.rate),'Q 표 · 30×30 · 40판','f'],[pct(a.rate),'근사 Q · 30×30 · 40판','r'],[(E.n*E.n*4).toLocaleString(),'Q 표가 기억할 숫자 수'],[a.params,'근사 Q가 기억할 숫자 수']])+say('robo','happy','봐, 세상이 커질수록 계산식 쪽이 남는 장사야. 화면 크기면 표는 아예 못 만들어.')+say('fly','coffee','인정. 칸이 900개면 한 칸씩 적어서는 끝이 없지.');}},
  {label:'Q 표에 연습을 200판 주면?',run:async function(box){var E=RL3.env(20),t=RL3.learn(E,'t',200,1),a=RL3.learn(E,'a',40,1);
   box.innerHTML=statGrid([[pct(t.rate),'Q 표 · 20×20 · 200판','f'],[pct(a.rate),'근사 Q · 20×20 · 40판','r'],[t.steps.toLocaleString(),'Q 표가 걸은 걸음 수'],[a.steps.toLocaleString(),'근사 Q가 걸은 걸음 수']])+say('fly','point','연습을 다섯 배 주니 표도 꽤 따라오잖아. 표가 틀린 게 아니라 연습이 모자랐던 거야.')+say('asst','ledger','다만 걸음 수를 보면 표가 훨씬 많이 돌아다녔어요. 칸이 늘수록 연습량도 같이 늘어야 해요.');}},
  {label:'벽 없는 5×5라면?',run:async function(box){var E=RL3.env(5),t=RL3.avg(E,'t',60,[1,2,3]),a=RL3.avg(E,'a',60,[1,2,3]);
   box.innerHTML=statGrid([[pct(t.rate),'Q 표 · 빈 5×5','f'],[pct(a.rate),'근사 Q · 빈 5×5','r']])+say('asst','ledger','벽이 없으면 둘 다 거의 다 찾아요. 근사 Q가 미로에서 진 건 작아서가 아니라, 지그재그 벽을 계산식으로 표현하지 못해서예요.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q9:[
 {q:'Q-Learning의 Q(s, a)가 뜻하는 것은?',o:[['상태 s에서 행동 a를 하면 앞으로 받을 보상의 합에 대한 추정값',1,'그래서 칸마다 가장 큰 Q의 행동을 고르면 된다.'],['행동 a를 한 횟수',0,'횟수가 아니라 앞으로 받을 보상의 추정값이다.'],['상태 s가 나올 확률',0,'확률을 배우는 것은 정책(PPO 쪽)이다.']]},
 {q:'84×84 흑백 화면을 상태로 쓰면 Q 표를 만들 수 없는 까닭은?',o:[['가능한 화면이 2의 7056제곱 가지라 칸을 만들 수도 채울 수도 없어서',1,'그래서 DQN은 표 대신 신경망이 Q를 계산하게 했다.'],['화면에는 보상이 없어서',0,'보상은 게임 점수 등으로 따로 받는다.'],['행동이 너무 많아서',0,'행동은 몇 개뿐이다. 문제는 상태 수다.']]},
 {q:'PPO가 확률 비율을 1 − ε ~ 1 + ε 범위로 자르는 까닭은?',o:[['한 번에 정책을 너무 많이 바꿔 망가지는 것을 막으려고',1,'좋았던 행동도 1 + ε배까지만 올린다. 그래서 학습이 안정적이다.'],['계산을 빠르게 하려고',0,'속도보다 안정성을 위한 장치다.'],['탐험을 없애려고',0,'정책은 여전히 확률로 행동하니 탐험이 남는다.']]},
 {q:'담판에서 Q 표와 근사 Q가 한 번씩 이긴 까닭으로 알맞은 것은?',o:[['작은 미로는 칸마다 정확히 적는 표가, 큰 격자는 비슷한 칸끼리 나눠 배우는 계산식이 유리해서',1,'문제 크기와 모양이 도구를 정한다.'],['난수가 달라서 우연히',0,'시드 3개 평균에서도 같은 방향이었다.'],['근사 Q가 진짜 심층 신경망이라서',0,'담판의 근사 Q는 가장 작은 계산식이다. DQN의 생각만 담았다.']]}]};

var PROMPTS=[
 {t:'① 내 문제에 맞는 강화학습 고르기',use:'Q-Learning, DQN, PPO 중 무엇을 쓸지 정할 때',p:'아래 문제에 Q-Learning, DQN, PPO 가운데 무엇이 알맞은지 판단해 줘.\n\n- 상태: 〔예) 창고 20×20 격자 위 로봇 위치〕\n- 행동: 〔예) 상하좌우 4개 / 또는 바퀴 속도 같은 연속값〕\n- 보상: 〔예) 물건 집으면 +10, 충돌 −1〕\n\n상태 수와 행동 종류(이산/연속)를 기준으로 각 방법의 장단점을 표로 비교하고, 가장 단순한 것부터 시도하는 순서를 제안해 줘.'},
 {t:'② 격자 미로 Q-Learning 코드',use:'수업이나 실습에서 Q 표를 직접 채워 보고 싶을 때',p:'넘파이만 써서 〔예) 6×6〕 격자 미로 Q-Learning 코드를 만들어 줘. 벽 위치는 〔예) (1,1),(1,2)〕, 출발 (0,0), 목표는 오른쪽 아래다. α, γ, ε를 바꾸며 판마다 걸음 수 곡선을 그리고, 학습이 끝난 Q 표를 화살표로 시각화해 줘. 고등학생도 읽을 수 있게 주석을 달아 줘.'},
 {t:'③ DQN의 두 장치 설명',use:'경험 재생과 목표 네트워크를 이해하고 싶을 때',p:'DQN의 경험 재생(experience replay)과 목표 네트워크(target network)가 각각 어떤 문제를 막는지, 둘 중 하나를 뺐을 때 학습이 어떻게 흔들리는지 쉬운 비유와 함께 설명해 줘. Gymnasium의 CartPole 환경으로 둘을 켜고 끈 비교 실험 코드(파이토치)도 짧게 붙여 줘.'},
 {t:'④ PPO 손잡이 정리',use:'PPO 학습이 불안정할 때',p:'PPO에서 자주 만지는 설정(clip 범위 ε, 학습률, 한 번에 모으는 걸음 수, 에폭 수, 엔트로피 계수)을 표로 정리하고, 각각을 키우거나 줄이면 학습 곡선이 어떻게 바뀌는지 알려 줘. 내 환경은 〔설명〕이다. 처음 시도할 기본값과 조정 순서도 제안해 줘.'}];
var GL=[
 ['강화학습','상태','에이전트가 지금 놓인 상황. 미로에서는 칸, 게임에서는 화면.'],['강화학습','행동','에이전트가 고를 수 있는 움직임.'],['강화학습','보상','행동 뒤에 받는 점수. 충전기 +10, 벽 −1 등.'],
 ['강화학습','Q 값','상태에서 그 행동을 하면 앞으로 받을 보상 합의 추정값.'],['강화학습','Q 표','상태 × 행동마다 Q 값을 적은 표.'],['강화학습','학습률','목표값 쪽으로 한 번에 얼마나 다가갈지(α).'],
 ['강화학습','할인율','먼 미래의 보상을 얼마나 쳐줄지(γ). 0.9면 한 걸음마다 0.9배.'],['강화학습','탐험 비율','일부러 무작위 행동을 하는 비율(ε).'],['강화학습','탐욕 정책','늘 Q 값이 가장 큰 행동만 고르는 방식.'],
 ['신경망','함수 근사','표 대신 계산식(신경망 등)으로 값을 내는 방법. 비슷한 상태끼리 배운 것을 나눠 쓴다.'],['DQN','경험 재생','겪은 장면을 쌓아 두고 무작위로 뽑아 복습하는 장치.'],['DQN','목표 네트워크','목표값을 계산하려고 일정 걸음마다 복사해 두는 신경망 사본.'],
 ['PPO','정책','상태마다 어떤 행동을 몇 % 확률로 할지 정한 규칙.'],['PPO','이득','그 행동이 평균보다 얼마나 좋았는지(A).'],['PPO','clip','확률 비율의 변화량을 정해진 범위로 자르는 것.'],
 ['미세조정','RLHF','사람의 선호 판단으로 만든 보상으로 언어 모델을 조정하는 방법. PPO가 쓰여 왔다.']];
var ANALOGY=[
 ['Q 표','동네 골목마다 "이 길로 가면 집까지 몇 분"을 적은 수첩',1,'','수첩은 가 본 골목만 적을 수 있다. 처음 가는 동네에서는 쓸모가 없다'],
 ['값이 퍼져 나감','도착점에서 거꾸로 번지는 잉크',1,'','실제로는 에이전트가 지나간 길을 따라서만 번진다. 안 가 본 칸은 0으로 남는다'],
 ['DQN','수첩 대신 "큰길 쪽으로 가면 가깝다" 같은 감을 익힌 택시 기사',2,'초파리도 냄새 하나하나를 표로 외우지 않고, 비슷한 냄새를 비슷하게 느끼는 신경 회로로 일반화한다','감은 틀릴 수 있다. 막다른 골목 같은 예외에서 크게 틀린다(담판의 지그재그 미로)'],
 ['PPO','코치가 "이번엔 이 동작을 조금만 더"라고 고쳐 주는 훈련',1,'','자르는 폭 ε가 너무 작으면 고치는 속도가 매우 느려진다']];
var REFS=[
 'Watkins, C. J. C. H., &amp; Dayan, P. (1992). Q-learning. <i>Machine Learning</i>, 8, 279–292. — Q-Learning (Watkins, 1989, 케임브리지대 박사학위논문에서 처음 제안)',
 'Mnih, V., Kavukcuoglu, K., Silver, D., et al. (2015). Human-level control through deep reinforcement learning. <i>Nature</i>, 518, 529–533. — DQN (2013년 arXiv 공개판 「Playing Atari with Deep Reinforcement Learning」)',
 'Schulman, J., Wolski, F., Dhariwal, P., Radford, A., &amp; Klimov, O. (2017). Proximal Policy Optimization Algorithms. arXiv:1707.06347. — PPO',
 'Sutton, R. S., &amp; Barto, A. G. (2018). <i>Reinforcement Learning: An Introduction</i> (2nd ed.). MIT Press. — 6장(Q-Learning)·9~11장(함수 근사)·13장(정책 경사)',
 'Ouyang, L., et al. (2022). Training language models to follow instructions with human feedback. <i>NeurIPS 2022</i>. — RLHF에 PPO를 쓴 예'];
var TIP={who:'강화학습의 기본(4-4)을 읽은 학습자',goal:'① Q-Learning의 갱신 식을 말로 설명한다 ② 상태 수가 커지면 표가 무너지는 까닭과 DQN의 해법(함수 근사, 경험 재생, 목표 네트워크)을 설명한다 ③ PPO가 값 대신 정책을, 잘라서 조금씩 고친다는 점을 구별한다',time:'읽기 15분 · 미로와 담판 10분 · Colab 10분',
 plans:[['강의형 30분','01 한 칸 고쳐 보기 5분 → 02 미로 재생을 함께 보며 "다음 판엔 어느 칸이 찰까" 맞히기 10분 → 격자 키우기 5분 → 담판 10분.'],['실무 OJT 60분','02 손잡이 실험 15분 → Colab으로 미로 크기를 바꿔 표 칸 수와 수렴 판 수 기록 25분 → 프롬프트 ①로 자기 문제에 맞는 방법 고르기 20분.'],['1:1 튜터링','담판 장부를 열기 전에 두 세계의 승자를 각각 예측하게 하고, 근사 Q가 지그재그 미로에서 진 까닭을 스스로 말하게 한다.']],
 myths:[['신경망이 표보다 늘 낫다','작은 세계에서는 표가 더 빠르고 정확하다(담판 ①)'],['DQN과 PPO는 아무 관계가 없다','둘 다 신경망을 쓰지만 DQN은 값을, PPO는 정책을 배운다. 한 계보의 다른 갈래다'],['RLHF는 곧 PPO다','PPO가 쓰여 왔지만 DPO 등 다른 방법도 많이 쓴다']]};
var CODE={title:'격자 미로 Q-Learning과 표의 한계',sub:'담판 재현 · numpy만 · CPU 몇 초',file:'rl_three_qtable',
 desc:'02장과 담판을 옮겼다. 5×5 지그재그 미로와 20×20 빈 격자에서 Q 표와 근사 Q(가로 위치 점수 + 세로 위치 점수)를 같은 연습량으로 학습시키고, 모든 빈칸에서 출발해 충전기에 닿는 비율을 잰다.',
 cap:'실행 결과 (numpy, CPU). 규칙은 브라우저와 같지만 난수 생성기가 달라 숫자는 조금 다르다. 결론(작은 미로는 표, 큰 격자는 근사 Q)은 같다.'};
