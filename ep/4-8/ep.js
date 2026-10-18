/* ══ 4-8 비지도 아홉 ══════════════════════════════════════════════ */
var S9=UNS9.SETS,ALG={km:'K-Means',kmed:'K-Medoids',db:'DBSCAN',ag:'계층적 군집',gmm:'GMM'};
function kcol(i){var C=cols();return [C.info,C.orange,C.gfp,C.stain,C.amber,'#7d6bb8','#c0794a','#4f9b9b'][((i%8)+8)%8];}
/* 데이터 범위 → 화면 좌표 */
function frame(set,Wd,H,pad){var P=S9[set].D.map(function(d){return d.x}),x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;P.forEach(function(p){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);});
  pad=pad==null?14:pad;var sx=(Wd-2*pad)/(x1-x0),sy=(H-2*pad)/(y1-y0),s=Math.min(sx,sy),ox=(Wd-(x1-x0)*s)/2,oy=(H-(y1-y0)*s)/2;
  return {s:s,X:function(x){return ox+(x-x0)*s},Y:function(y){return H-oy-(y-y0)*s}};}
function plotSet(cv,set,a,H,opt){opt=opt||{};var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),F=frame(set,Wd,H,opt.pad);ctx.clearRect(0,0,Wd,H);
  if(opt.pre)opt.pre(ctx,F,C);
  S9[set].D.forEach(function(d,i){var px=F.X(d.x[0]),py=F.Y(d.x[1]),l=a?a[i]:-3;
    if(l===-1){ctx.strokeStyle=C.muted;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(px-3,py-3);ctx.lineTo(px+3,py+3);ctx.moveTo(px+3,py-3);ctx.lineTo(px-3,py+3);ctx.stroke();}
    else circ(ctx,px,py,opt.r||3.2,opt.fill?opt.fill(i):(l===-3?C.muted:kcol(l)));});
  if(opt.post)opt.post(ctx,F,C);return {ctx:ctx,F:F,W:Wd};}

/* ── 히어로 ── */
heroStage($('heroCv'),{bg:'sc_moons',bgY:1,fly:'point',robo:'coin',motif:function(ctx,t,W,H){var C=cols();
  ctx.fillStyle='rgba(13,12,28,.78)';rr(ctx,230,26,640,250,16);ctx.fill();
  var cs=['#82b8ff','#f0604d','#5ee39c'];ctx.font=font(13,700);ctx.textAlign='center';
  /* 둥근 무리 */
  S9.blobs.D.forEach(function(d){ctx.fillStyle=cs[d.y];ctx.fillRect(Math.round(255+(d.x[0]+.7)*58)-2,Math.round(225-(d.x[1]+.7)*58)-2,5,5);});ctx.fillStyle='#eceaf3';ctx.fillText('둥근 무리',350,52);
  /* 초승달: 색이 한쪽에서 번져 간다 */
  var k=(Math.sin(t*.8)+1)/2;S9.moons.D.forEach(function(d){var reach=(d.x[0]+1.2)/3.4<k+.15;ctx.fillStyle=reach?cs[d.y]:'rgba(236,234,243,.45)';ctx.fillRect(Math.round(455+(d.x[0]+1.2)*56)-2,Math.round(205-(d.x[1]+.6)*56)-2,5,5);});ctx.fillStyle='#eceaf3';ctx.fillText('초승달',550,52);
  /* 소용돌이 롤이 펼쳐진다 */
  var u=(Math.sin(t*.6)+1)/2;for(var i=0;i<ROLL.X.length;i+=2){var p=ROLL.X[i],tt=ROLL.t[i],ax=p[0]/12,ay=p[2]/12,ux=(tt-4.7)/9.5*2-1,uy=p[1]/14;
    var x=ax*(1-u)+ux*u,y=ay*(1-u)+uy*u;ctx.fillStyle=rollCol(tt);ctx.fillRect(Math.round(760+x*70)-2,Math.round(160-y*70)-2,4,4);}
  ctx.fillStyle='#eceaf3';ctx.fillText('소용돌이 롤',760,52);}});

/* 롤 색: 종이 위 위치 t (금 → 와인 → 파랑) */
function mix(a,b,f){var A=[parseInt(a.slice(1,3),16),parseInt(a.slice(3,5),16),parseInt(a.slice(5,7),16)],B=[parseInt(b.slice(1,3),16),parseInt(b.slice(3,5),16),parseInt(b.slice(5,7),16)];return 'rgb('+A.map(function(v,i){return Math.round(v+(B[i]-v)*f)}).join(',')+')';}
var TMIN=Math.min.apply(null,ROLL.t),TMAX=Math.max.apply(null,ROLL.t);
function rollCol(t){var f=(t-TMIN)/(TMAX-TMIN);return f<.5?mix('#d4a54a','#b56a8a',f*2):mix('#b56a8a','#5b8fd0',(f-.5)*2);}

/* ── 01 신상 파일 ── */
var FILES={
 km:{one:'빠르고 단순하며 둥근 무리에 강하다',basis:'중심까지 거리. 무리 안 오차 제곱합을 가장 작게',k:'필요 (k)',when:'무리가 둥글고 크기가 비슷할 때, 데이터가 많아 빨리 돌려야 할 때',weak:'무리가 둥글지 않거나 크기가 크게 다르면 엉뚱한 곳을 자른다. 시작점에 따라 결과가 달라진다',diff:'중심이 데이터 점이 아니라 평균 위치(허공)일 수 있다',eq:'무리 안 (점 − 중심)² 의 합을 줄인다'},
 kmed:{one:'튀는 값에 덜 흔들린다',basis:'실제 데이터 점 하나를 대표(메도이드)로',k:'필요 (k)',when:'튀는 값이 섞였을 때, 중심이 실제 사례여야 설명하기 좋을 때',weak:'K-Means보다 느리다. 둥근 무리를 가정하는 건 같다',diff:'K-Means의 평균 대신 "무리 안 다른 점까지 거리의 합이 가장 작은 실제 점"을 고른다',eq:'무리 안 |점 − 대표 점| 의 합을 줄인다'},
 db:{one:'모양이 자유롭고 잡음 점을 따로 골라낸다',basis:'밀도. 반지름 ε 안에 이웃이 충분하면 같은 무리로 이어 붙인다',k:'불필요 (ε와 최소 이웃 수를 정한다)',when:'무리 모양이 제멋대로일 때, 튀는 점을 걸러 내고 싶을 때',weak:'밀도가 무리마다 다르면 ε 하나로 맞추기 어렵다. ε에 민감하다',diff:'무리 수를 미리 정하지 않는 유일한 형제. 어느 무리에도 안 드는 점은 잡음(−1)으로 남긴다',eq:'반지름 ε 안 이웃 수 ≥ 최소 이웃 수 → 핵심 점'},
 ag:{one:'나무 그림(덴드로그램)이 나온다',basis:'가까운 것끼리 차례로 합친다(병합). 무리 사이 거리를 재는 법(연결)을 고른다',k:'나중에 자른다',when:'무리가 몇 개인지 모를 때, 무리 속 작은 무리까지 보고 싶을 때',weak:'점이 많으면 느리다(점 수의 제곱 이상). 한 번 합친 것은 되돌리지 않는다',diff:'결과가 한 장의 나무다. 어느 높이에서 자르느냐로 무리 수가 정해진다',eq:'단일 연결: 두 무리에서 가장 가까운 두 점의 거리'},
 gmm:{one:'"어느 무리일 확률"로 답한다 (소프트 군집)',basis:'정규분포(종 모양) 여러 개를 겹친 모양이 데이터를 만들었다고 본다',k:'필요 (k)',when:'무리 크기·퍼짐이 다를 때, 경계의 애매한 점을 확률로 다루고 싶을 때',weak:'분포가 종 모양이 아니면(초승달 등) 맞지 않는다. 시작점에 따라 달라진다',diff:'K-Means의 "부드러운" 판. 무리마다 퍼진 정도도 함께 배운다',eq:'EM: 무리 확률 계산(E) ↔ 평균·분산 고치기(M) 반복'}};
(function(){var sel='km',list=$('m1List');
 Object.keys(ALG).forEach(function(k){var b=document.createElement('button');b.className='dcard';b.setAttribute('data-v',k);b.setAttribute('aria-pressed',k===sel?'true':'false');b.style.flexDirection='row';b.style.alignItems='center';b.style.minHeight='64px';b.style.gap='12px';
   b.appendChild(NPC.el('token',3,null,'#7aa063'));var s=document.createElement('span');s.innerHTML='<b style="font-size:15px">'+ALG[k]+'</b><br><span class="muted" style="font-size:13px">'+FILES[k].one+'</span>';b.appendChild(s);list.appendChild(b);});
 var minis=['blobs','moons','varied'].map(function(s){var f=document.createElement('figure');f.style.margin='0';f.innerHTML='<canvas class="fig" aria-label="'+S9[s].n+' 데이터에서의 결과"></canvas><figcaption class="muted" style="font-size:12.5px;text-align:center"></figcaption>';$('m1Mini').appendChild(f);return {s:s,cv:f.querySelector('canvas'),cap:f.querySelector('figcaption')};});
 function draw(){minis.forEach(function(m){var o=UNS9.run(m.s,sel);plotSet(m.cv,m.s,o.a,150,{r:2.3,pad:8});m.cap.innerHTML=S9[m.s].n+' · 겹침 <b>'+pct(o.score,0)+'</b>';});}
 function ui(){var f=FILES[sel];list.querySelectorAll('.dcard').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===sel?'true':'false');});
  $('m1File').innerHTML='<span class="tag">신상 파일 · 비지도 가문 군집파</span><h3 style="margin:4px 0 8px">'+ALG[sel]+'</h3><p style="margin:0 0 8px"><b>특기.</b> '+f.one+'</p><div class="eq" style="margin:0 0 10px">'+f.eq+'</div>'+
   '<div class="tw"><table class="tb"><tbody><tr><th>묶는 기준</th><td>'+f.basis+'</td></tr><tr><th>무리 수 지정</th><td>'+f.k+'</td></tr><tr><th>언제 쓰나</th><td>'+f.when+'</td></tr><tr><th>약점</th><td>'+f.weak+'</td></tr><tr><th>형제와 차이</th><td>'+f.diff+'</td></tr></tbody></table></div>';
  var sc=['blobs','moons','varied'].map(function(s){return UNS9.run(s,sel).score}),best=Math.max.apply(null,sc),bi=sc.indexOf(Math.min.apply(null,sc));
  $('m1Cap').innerHTML='<b>'+ALG[sel]+'</b>의 정답 겹침: 둥근 무리 '+pct(sc[0],0)+' · 초승달 '+pct(sc[1],0)+' · 크기가 다른 무리 '+pct(sc[2],0)+'. '+(sc[bi]<.95?'가장 약한 곳은 <b>'+['둥근 무리','초승달','크기가 다른 무리'][bi]+'</b>다. 그 데이터 모양이 이 조직원의 가정과 맞지 않기 때문이다.':'세 데이터 모두에서 정답과 거의 같다.');draw();}
 list.addEventListener('click',function(e){var b=e.target.closest('.dcard');if(!b)return;sel=b.getAttribute('data-v');ui();});ui();onRedraw(draw);})();

/* ── 02 군집 실험 ── */
(function(){var set='blobs',alg='km',cv=$('labCv'),step=-1,eps=null,link='single',cutK=null,play=false,acc=0;
 function opt(){return alg==='db'?{eps:eps}:alg==='ag'?{link:link,k:cutK}:{};}
 function draw(){var H=300,o=UNS9.run(set,alg,opt()),C=cols();
  if(alg==='km'){var st=o.steps,i=step<0?st.length-1:Math.min(step,st.length-1),s=st[i];
   plotSet(cv,set,s.a,H,{post:function(ctx,F){s.C.forEach(function(c,j){if(i>0){var p=st[i-1].C[j];ctx.strokeStyle=C.text;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(F.X(p[0]),F.Y(p[1]));ctx.lineTo(F.X(c[0]),F.Y(c[1]));ctx.stroke();ctx.setLineDash([]);}
     ctx.fillStyle=kcol(j);ctx.strokeStyle=C.text;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(F.X(c[0]),F.Y(c[1])-9);ctx.lineTo(F.X(c[0])+8,F.Y(c[1])+6);ctx.lineTo(F.X(c[0])-8,F.Y(c[1])+6);ctx.closePath();ctx.fill();ctx.stroke();});
     ctx.font=font(12,700);ctx.fillStyle=C.text;ctx.textAlign='left';ctx.fillText('단계 '+(i+1)+' / '+st.length,10,18);}});}
  else if(alg==='kmed')plotSet(cv,set,o.a,H,{post:function(ctx,F){o.C.forEach(function(c,j){ctx.strokeStyle=C.text;ctx.lineWidth=2.5;ctx.strokeRect(F.X(c[0])-7,F.Y(c[1])-7,14,14);});}});
  else if(alg==='db')plotSet(cv,set,o.a,H,{pre:function(ctx,F){var e=(eps||S9[set].eps)*F.s;S9[set].D.forEach(function(d,i){if(i%9)return;ctx.strokeStyle=rgba(C.muted,.35);ctx.lineWidth=1;ctx.beginPath();ctx.arc(F.X(d.x[0]),F.Y(d.x[1]),e,0,7);ctx.stroke();});}});
  else if(alg==='ag')plotSet(cv,set,o.a,H);
  else if(alg==='gmm'){var R=o.R;plotSet(cv,set,null,H,{fill:function(i){var best=0;R[i].forEach(function(v,j){if(v>R[i][best])best=j;});return rgba(kcol(best),.2+.8*Math.max(0,(R[i][best]-.5)*2));},
    pre:function(ctx,F){o.mu.forEach(function(m,j){ctx.strokeStyle=kcol(j);ctx.lineWidth=1.6;[1,2].forEach(function(z){ctx.beginPath();ctx.ellipse(F.X(m[0]),F.Y(m[1]),z*Math.sqrt(o.va[j][0])*F.s,z*Math.sqrt(o.va[j][1])*F.s,0,0,7);ctx.globalAlpha=z===1?.8:.4;ctx.stroke();ctx.globalAlpha=1;});});}});}
  var ctx=cv.getContext('2d');stamp(ctx,fit(cv,H),'예시 데이터 · '+S9[set].n);
  var k=alg==='db'?o.k:new Set(o.a).size,noise=o.a.filter(function(v){return v<0}).length;
  $('labStat').innerHTML=statGrid([[pct(o.score,1),'정답 겹침'],[k+'개','찾은 무리 수 (정답 '+S9[set].k+'개)'],[noise+'개','잡음으로 남긴 점']]);
  if(alg==='ag')drawDend(o);}
 function drawDend(o){var cvd=$('dendCv'),H=170,Wd=fit(cvd,H),ctx=cvd.getContext('2d'),C=cols(),M=o.ag.merges,n=S9[set].D.length,ord=[],ch={};ctx.clearRect(0,0,Wd,H);
  M.forEach(function(m){ch[m[3]]=[m[0],m[1],m[2]];});(function walk(id){if(id<n){ord.push(id);return;}walk(ch[id][0]);walk(ch[id][1]);})(M[M.length-1][3]);
  var pos={},hmax=M[M.length-1][2],l=8,r=Wd-8,bt=H-14,tp=10;ord.forEach(function(id,i){pos[id]=[l+(i+.5)/n*(r-l),bt];});
  function py(h){return bt-Math.sqrt(h/hmax)*(bt-tp)}
  var k=cutK||S9[set].k,cutH=M[n-k-1]?M[n-k-1][2]:0,cutH2=M[n-k]?M[n-k][2]:hmax;
  M.forEach(function(m){var a=pos[m[0]],b=pos[m[1]],y=py(m[2]);ctx.strokeStyle=m[2]>cutH?rgba(C.muted,.5):C.text;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0],y);ctx.lineTo(b[0],y);ctx.lineTo(b[0],b[1]);ctx.stroke();pos[m[3]]=[(a[0]+b[0])/2,y];});
  var yc=(py(cutH)+py(cutH2))/2;ctx.strokeStyle=C.eye;ctx.setLineDash([5,4]);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(l,yc);ctx.lineTo(r,yc);ctx.stroke();ctx.setLineDash([]);
  ctx.font=font(11,700);ctx.fillStyle=C.eye;ctx.textAlign='right';ctx.fillText('여기서 자르면 무리 '+k+'개',r,yc-5);ctx.fillStyle=C.muted;ctx.textAlign='left';ctx.fillText('높이 = 합칠 때의 거리 (제곱근 눈금)',l,H-2);}
 function ctl(){var h='',c=$('labCtl');$('dendWrap').hidden=alg!=='ag';
  if(alg==='km')h='<div class="ctrls"><button class="btn go" id="kmPlay">▶ 재생</button><button class="btn" id="kmStep">한 단계</button><button class="btn" id="kmEnd">끝으로</button></div>';
  else if(alg==='db')h='<label for="epsSl" style="display:block;font-size:14px;color:var(--muted)">반지름 ε: <b id="epsVal" class="num" style="color:var(--text)"></b> · 최소 이웃 수 5</label><input type="range" id="epsSl" min="0.06" max="0.6" step="0.01">';
  else if(alg==='ag')h='<div class="pills" id="lkPick" role="group" aria-label="연결 방법"><button data-v="single" aria-pressed="'+(link==='single')+'">단일 연결 (가장 가까운 두 점)</button><button data-v="avg" aria-pressed="'+(link==='avg')+'">평균 연결</button></div><label for="cutSl" style="display:block;font-size:14px;color:var(--muted);margin-top:8px">자를 무리 수: <b id="cutVal" class="num" style="color:var(--text)"></b></label><input type="range" id="cutSl" min="1" max="8" step="1">';
  c.innerHTML=h;
  if(alg==='km'){$('kmPlay').addEventListener('click',function(){play=!play;if(play&&(step<0||step>=UNS9.run(set,'km').steps.length-1))step=0;this.textContent=play?'❚❚ 멈춤':'▶ 재생';draw();});
   $('kmStep').addEventListener('click',function(){play=false;$('kmPlay').textContent='▶ 재생';var n=UNS9.run(set,'km').steps.length;step=step<0||step>=n-1?0:step+1;draw();cap();});
   $('kmEnd').addEventListener('click',function(){play=false;$('kmPlay').textContent='▶ 재생';step=-1;draw();cap();});}
  if(alg==='db'){var sl=$('epsSl');sl.value=eps||S9[set].eps;$('epsVal').textContent=(+sl.value).toFixed(2);sl.addEventListener('input',function(){eps=+this.value;$('epsVal').textContent=eps.toFixed(2);draw();cap();});}
  if(alg==='ag'){var cs=$('cutSl');cs.value=cutK||S9[set].k;$('cutVal').textContent=cs.value;cs.addEventListener('input',function(){cutK=+this.value;$('cutVal').textContent=cutK;draw();cap();});
   seg('#lkPick button',function(v){link=v;draw();cap();});}}
 function cap(){var o=UNS9.run(set,alg,opt()),t='';
  if(alg==='km')t='삼각형이 중심이다. 점마다 가장 가까운 중심의 색을 받고, 중심은 자기 색 점들의 평균으로 옮겨 간다. 이 두 걸음을 중심이 멈출 때까지 되풀이한다.'+(set==='moons'?' 초승달에서는 중심 둘이 각 초승달의 가운데가 아니라 허공에 자리 잡아, 두 초승달을 가로로 자른다.':set==='varied'?' 큰 무리의 가장자리 점이 작은 무리의 중심에 더 가까워 빼앗긴다.':'');
  else if(alg==='kmed')t='네모가 대표 점(메도이드)이다. 대표가 실제 데이터 점이라는 것만 K-Means와 다르다. 둥근 무리를 가정하는 건 같아서 초승달은 여전히 어렵다.';
  else if(alg==='db')t='회색 원은 반지름 ε다(일부 점만 표시). 원 안에 이웃이 5개 이상이면 핵심 점이고, 핵심 점끼리 이어지면 한 무리다. ×는 어느 무리에도 못 낀 잡음 점이다. 지금 무리 '+o.k+'개, 잡음 '+o.noise+'개.'+(set==='varied'?' 빽빽한 작은 무리와 듬성한 큰 무리를 ε 하나로 맞추기 어렵다.':'');
  else if(alg==='ag')t='아래 나무 그림이 덴드로그램이다. 가까운 점끼리 먼저 합쳐 위로 올라간다. 빨간 점선 높이에서 자르면 그 아래 가지 수만큼 무리가 생긴다. '+(link==='single'?'단일 연결은 가장 가까운 두 점으로 무리 사이 거리를 재서, 길게 이어진 초승달을 잘 따라간다.':'평균 연결은 두 무리 모든 점 사이 거리의 평균을 써서, 둥근 무리를 좋아한다.');
  else t='점이 진할수록 그 무리일 확률이 높고, 흐릴수록 두 무리 사이에서 애매하다. 타원은 무리마다 배운 퍼짐(1배·2배 표준편차)이다. 무리마다 크기와 퍼짐을 따로 배우기 때문에 크기가 다른 무리에 강하다.';
  $('labCap').innerHTML=t;}
 function all(){step=-1;eps=null;cutK=null;ctl();draw();cap();}
 seg('#labSet button',function(v){set=v;play=false;all();});seg('#labAlg button',function(v){alg=v;play=false;all();});
 onTick(cv,function(dt){if(!play||alg!=='km')return;acc+=dt;if(acc>.7){acc=0;var n=UNS9.run(set,'km').steps.length;step++;if(step>=n-1){step=n-1;play=false;var b=$('kmPlay');if(b)b.textContent='▶ 재생';}draw();cap();}});
 all();onRedraw(draw);
 /* 한눈에 표 */
 setTimeout(function(){var sets=['blobs','moons','varied'],h='<table class="tb"><thead><tr><th>데이터 / 조직원</th>'+Object.keys(ALG).map(function(a){return '<th>'+ALG[a]+'</th>'}).join('')+'</tr></thead><tbody>';
  sets.forEach(function(s){var sc=Object.keys(ALG).map(function(a){return UNS9.run(s,a).score}),mx=Math.max.apply(null,sc);h+='<tr><td>'+S9[s].n+'</td>'+sc.map(function(v){return '<td>'+(v===mx?'<b>'+pct(v,0)+'</b>':pct(v,0))+'</td>'}).join('')+'</tr>';});
  $('labTable').innerHTML=h+'</tbody></table>';},50);})();

/* ── 담판: 초승달 ── */
Duel('d8',{title:'초승달 두 개, 누가 제대로 묶을까',q:'초승달 두 개가 맞물린 점 150개. 정답(어느 초승달인지)은 금고에 숨겨 두고, 묶은 결과가 정답과 얼마나 겹치는지 잰다.',
 fly:['DBSCAN (ε 0.27, 최소 이웃 5)','무리 모양이 둥글지 않은데? 빽빽하게 이어진 것끼리 묶어야지.'],robo:['K-Means, k = 2','무리가 두 개인 것까지 맞혔으니 끝. 빠르고 싸다.'],roboMood:'coin',
 run:async function(p){p(.3);await wait(150);var a=UNS9.run('moons','db'),b=UNS9.run('moons','km');p(1);
  return {winner:a.score>b.score?'f':(a.score<b.score?'r':'d'),big:false,
   measure:'금고를 열어 정답과 맞춰 봤어요. 초파리 쪽 DBSCAN은 무리 '+a.k+'개를 찾았고 정답 겹침 '+pct(a.score)+'(잡음 '+a.noise+'개). Money-Robo 쪽 K-Means는 겹침 '+pct(b.score)+'예요. K-Means는 초승달 두 개를 가운데에서 가로로 잘랐어요.',
   verdict:'K-Means는 무리가 둥글다고 가정한다. 가정이 틀리면 무리 수를 맞혀도 진다. 이 구역은 초파리 쪽이다.',key:'알고리즘을 고르기 전에 무리 모양을 먼저 본다.',
   render:function(box){box.innerHTML=statGrid([[pct(a.score),'초파리 · DBSCAN 정답 겹침','f'],[a.k+'개 / '+a.noise+'개','DBSCAN 무리 / 잡음','f'],[pct(b.score),'Money-Robo · K-Means 정답 겹침','r'],['2개 (지정)','K-Means 무리','r']])+
    '<div class="two" style="margin-top:12px"><figure style="margin:0"><canvas class="fig" id="dA" aria-label="DBSCAN이 두 초승달을 각각 하나의 무리로 찾은 그림"></canvas><figcaption class="muted" style="font-size:13px">초파리 · DBSCAN</figcaption></figure><figure style="margin:0"><canvas class="fig" id="dB" aria-label="K-Means가 두 초승달을 가운데에서 가로로 자른 그림"></canvas><figcaption class="muted" style="font-size:13px">Money-Robo · K-Means</figcaption></figure></div>';
    function dr(){plotSet($('dA'),'moons',a.a,200);plotSet($('dB'),'moons',b.a,200,{post:function(ctx,F){b.C.forEach(function(c,j){circ(ctx,F.X(c[0]),F.Y(c[1]),7,kcol(j),cols().text,2);});}});}setTimeout(dr,0);onRedraw(dr);}};},
 alts:[{label:'무리가 둥글다면?',run:async function(box){var a=UNS9.run('blobs','db'),b=UNS9.run('blobs','km');
   box.innerHTML=statGrid([[pct(a.score),'DBSCAN · 둥근 무리','f'],[pct(b.score),'K-Means · 둥근 무리','r']])+'<div class="cwrap" style="margin-top:10px"><canvas class="fig" id="altC" aria-label="둥근 무리 세 개를 K-Means가 묶은 그림"></canvas></div>'+
    say('robo','happy','봐, 둥근 무리에선 K-Means가 '+pct(b.score)+'. 무리 수만 주면 끝이고 계산도 제일 빠르지.')+say('fly','coffee','인정. 가정이 맞으면 단순한 쪽이 낫지. 문제는 모양을 안 보고 고르는 거야.');
   setTimeout(function(){plotSet($('altC'),'blobs',b.a,200);},0);}},
  {label:'ε를 너무 작게 잡으면?',run:async function(box){var a=UNS9.run('moons','db',{eps:.12});
   box.innerHTML=statGrid([[a.k+'개','ε 0.12일 때 찾은 무리','f'],[a.noise+'개','잡음으로 남긴 점','f'],[pct(a.score),'정답 겹침','f']])+'<div class="cwrap" style="margin-top:10px"><canvas class="fig" id="altD" aria-label="ε를 작게 잡은 DBSCAN이 초승달을 여러 조각과 잡음으로 쪼갠 그림"></canvas></div>'+
    say('robo','wow','어라, 초승달이 '+a.k+'조각으로 쪼개지고 '+a.noise+'개는 잡음이 됐네? 무리 수 안 정해도 된다더니 ε는 정해야 하잖아.')+say('asst','ledger','맞아요. DBSCAN은 무리 수 대신 ε에 민감해요. 02장에서 ε 슬라이더를 움직여 보면 0.2 아래로 내려가면 무너지기 시작해요.');
   setTimeout(function(){plotSet($('altD'),'moons',a.a,200);},0);}}]});

/* ── 03 차원축소 4형제 ── */
(function(){var R=[['PCA','가장 큰 퍼짐(분산)','선형','축을 돌려 중요한 방향만 남긴다','휘어진 구조는 펴지 못하고 겹쳐 버린다','빠르고 결과가 늘 같다. 새 점도 같은 식으로 바로 옮길 수 있다'],
  ['t-SNE','가까운 이웃 관계(지역 구조)','비선형','시각화용. 무리가 또렷이 갈라져 보인다','무리 사이 거리와 무리 크기는 믿기 어렵다. 느리고 실행마다 모양이 달라진다','이웃 확률을 맞추도록 점을 옮긴다(펄플렉시티로 이웃 범위 조절)'],
  ['UMAP','지역 구조 + 전체 구조 일부','비선형','t-SNE보다 빠르고 전체 배치도 어느 정도 지킨다','설정(이웃 수, 최소 거리)에 따라 모양이 꽤 바뀐다','이웃 그래프를 만든 뒤 저차원에서 그 그래프를 닮게 배치'],
  ['오토인코더','다시 복원할 수 있는 압축','비선형 (신경망)','좁은 병목에 요점만 남긴다','학습이 필요하고 설정이 많다. 축의 뜻을 해석하기 어렵다','입력 → 좁은 병목 → 다시 입력을 맞히도록 학습. 병목 값이 축소 결과']];
 $('m3Cards').innerHTML=R.map(function(r){return '<div class="card" style="margin:0"><div style="display:flex;gap:10px;align-items:center"><span class="tokhost"></span><h3 style="margin:0">'+r[0]+'</h3><span class="muted" style="font-size:13px">'+r[2]+'</span></div><p style="margin:8px 0 6px"><b>특기.</b> '+r[3]+'</p>'+
   '<div class="tw"><table class="tb"><tbody><tr><th>지키려는 것</th><td>'+r[1]+'</td></tr><tr><th>어떻게</th><td>'+r[5]+'</td></tr><tr><th>약점</th><td>'+r[4]+'</td></tr></tbody></table></div></div>';}).join('');
 $('m3Cards').querySelectorAll('.tokhost').forEach(function(h){h.appendChild(NPC.el('token',3,null,'#7aa063'));});})();

/* ── 04 소용돌이 롤 ── */
var PCA2=(function(){var P=ROLL.X,mu=[0,1,2].map(function(j){return ML.mean(P.map(function(p){return p[j]}))}),sd=[0,1,2].map(function(j){return Math.sqrt(ML.mean(P.map(function(p){return (p[j]-mu[j])*(p[j]-mu[j])})))});
  var Z=P.map(function(p){return p.map(function(v,j){return (v-mu[j])/sd[j]})}),o=ML.pca(Z,2),mx=0;o.proj.forEach(function(q){mx=Math.max(mx,Math.abs(q[0]),Math.abs(q[1]));});return {pts:o.proj.map(function(q){return [q[0]/mx,q[1]/mx]}),ratio:o.ratio};})();
(function(){var cv=$('rollCv'),spin=true,ang=0.6;
 function draw(){var H=280,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols();ctx.clearRect(0,0,Wd,H);var ca=Math.cos(ang),sa=Math.sin(ang),s=Math.min(Wd,H)/30;
  var aa=Math.sin(ang)*.75,c2=Math.cos(aa),s2=Math.sin(aa),pts=ROLL.X.map(function(p,i){var yc=p[1]-6.3,X=p[0]*c2+yc*s2,D=-p[0]*s2+yc*c2;return {x:Wd/2+X*s*.95,y:H/2-(p[2]-1.5)*s*.95+D*s*.18,z:D,c:rollCol(ROLL.t[i])};}).sort(function(a,b){return b.z-a.z});
  pts.forEach(function(q){circ(ctx,q.x,q.y,2.6,q.c);});stamp(ctx,Wd,'예시 데이터 · 점 300개');}
 $('rollSpin').addEventListener('click',function(){spin=!spin;this.textContent=spin?'❚❚ 멈춤':'▶ 돌리기';});
 onTick(cv,function(dt){if(!spin||REDUCE)return;ang+=dt*.4;draw();});draw();onRedraw(draw);})();
(function(){var cv=$('mapCv'),cur='pca',from=null,k=1;
 var MAPS={pca:PCA2.pts,tsne:ROLL.tsne,umap:ROLL.umap,ae:ROLL.ae};
 var CAP={pca:function(){return '<b>PCA</b> (브라우저에서 직접 계산). 롤을 가장 넓게 퍼진 두 방향에서 비춘 그림자다. 첫 두 축이 퍼짐의 '+pct(PCA2.ratio[0]+PCA2.ratio[1],0)+'를 담지만, 말린 종이를 펴지 못해 금색과 파란색이 겹친다. 직선으로 돌리기만 하는 PCA의 한계다.';},
  tsne:function(){return '<b>t-SNE</b> (미리 계산한 결과). 가까운 점끼리는 가깝게 지켰지만, 종이 한 장이 여러 조각으로 갈라져 흩어졌다. 조각 사이 거리와 조각 크기에는 뜻이 거의 없다. 이웃 관계만 믿고 읽는다.';},
  umap:function(){return '<b>UMAP</b> (미리 계산한 결과). 가까운 점끼리 촘촘히 붙여 가는 줄 몇 가닥을 만들었다. 줄을 따라가면 색이 이어지는 구간이 많지만, 종이 한 장의 넓은 면은 펴지 못하고 줄이 꺾이고 갈라졌다. 이웃 수(n_neighbors)와 최소 거리 설정을 바꾸면 모양이 크게 달라진다.';},
  ae:function(){return '<b>오토인코더</b> (미리 계산한 결과). 3 → 32 → <b>2</b> → 32 → 3 신경망이 원래 점을 다시 맞히도록 배운 뒤, 가운데 병목 두 칸의 값을 지도로 썼다. 복원 오차(표준화 단위 평균 제곱 오차)는 '+fx(ROLL.aeErr,3)+'다. 축의 뜻은 정해져 있지 않다.';}};
 function draw(){var H=280,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),s=Math.min(Wd,H)/2-16,e=ease(Math.min(1,k));ctx.clearRect(0,0,Wd,H);
  var A=from||MAPS[cur],B=MAPS[cur];A.forEach(function(a,i){var b=B[i],x=a[0]+(b[0]-a[0])*e,y=a[1]+(b[1]-a[1])*e;circ(ctx,Wd/2+x*s,H/2-y*s,2.6,rollCol(ROLL.t[i]));});
  stamp(ctx,Wd,cur==='pca'?'브라우저에서 계산':'미리 계산한 결과');}
 seg('#redPick button',function(v){from=MAPS[cur];cur=v;k=REDUCE?1:0;$('mapCap').innerHTML=CAP[cur]();draw();});
 onTick(cv,function(dt){if(k>=1)return;k+=dt*1.4;if(k>=1){k=1;from=null;}draw();});
 $('mapCap').innerHTML=CAP.pca();draw();onRedraw(draw);
 $('preNote').innerHTML='미리 계산한 결과의 설정: scikit-learn <code>make_swiss_roll</code>(점 300개, 잡음 0.3, random_state=7, 높이 축 0.6배) → 표준화. t-SNE: perplexity 30, init="pca", random_state=0. UMAP(umap-learn 0.5): n_neighbors 15, min_dist 0.1, random_state 0. 오토인코더: scikit-learn MLPRegressor, 은닉층 (32, 2, 32), tanh, random_state 0, 병목 2칸의 값. 지도는 모두 가운데로 옮기고 가장 큰 절댓값으로 나눠 크기만 맞췄다.';})();

/* ══ 확인 문제 ══ */
var QUIZ={q8a:[
 {q:'초승달 두 개에서 K-Means(k = 2)가 지는 까닭은?',o:[['무리가 둥글다고 가정하고 중심까지 거리로만 나눠서',1,'중심 둘 사이의 직선 경계로 자르니 초승달을 가로로 자른다. 무리 수(2)를 맞힌 것과는 별개다.'],['무리 수를 잘못 줘서',0,'정답과 같은 2를 주었다. 그래도 진다.'],['데이터가 너무 적어서',0,'점 수를 늘려도 둥근 가정은 그대로다.']]},
 {q:'DBSCAN이 다른 넷과 가장 크게 다른 점은?',o:[['무리 수를 미리 정하지 않고, 어디에도 안 드는 점은 잡음으로 남긴다',1,'대신 반지름 ε와 최소 이웃 수를 정해야 하고, ε에 민감하다(담판의 조건 바꾸기).'],['확률로 답한다',0,'확률로 답하는 건 GMM이다.'],['중심이 실제 데이터 점이다',0,'그건 K-Medoids다.']]},
 {q:'크기와 퍼짐이 크게 다른 무리 세 개에 가장 잘 맞는 조직원은?',o:[['GMM',1,'무리마다 평균뿐 아니라 퍼짐(분산)도 따로 배운다. 02장 표에서 크기가 다른 무리의 겹침이 가장 높다.'],['K-Means',0,'큰 무리의 가장자리 점을 작은 무리에 빼앗긴다.'],['DBSCAN (ε 하나)',0,'빽빽한 무리와 듬성한 무리를 ε 하나로 함께 맞추기 어렵다.']]}],
 q8b:[
 {q:'소용돌이 롤에서 PCA가 금색과 파란색을 겹치게 그리는 까닭은?',o:[['축을 돌려 비추기만 하는 선형 방법이라 말린 종이를 펴지 못해서',1,'PCA는 가장 넓게 퍼진 방향을 고를 뿐 공간을 구부리지 않는다.'],['점이 300개뿐이라서',0,'점을 늘려도 그림자는 겹친다.'],['색을 잘못 칠해서',0,'색은 종이 위 위치 그대로다.']]},
 {q:'t-SNE 그림을 읽을 때 가장 믿을 만한 것은?',o:[['서로 가까이 붙은 점들은 원래도 가깝다',1,'t-SNE는 이웃 관계를 지키도록 만든 방법이다. 무리 사이 거리와 무리 크기는 믿기 어렵다(4-13).'],['두 무리 사이 거리가 멀면 원래도 멀다',0,'무리 사이 간격은 설정에 따라 크게 달라진다.'],['큰 무리는 원래도 많이 퍼져 있다',0,'t-SNE는 무리 크기를 고르게 만드는 경향이 있다.']]}]};

var PROMPTS=[
 {t:'① 내 데이터에 군집 다섯 돌려 보기',use:'어떤 군집 알고리즘이 맞을지 모를 때',p:'아래 Colab 코드는 같은 데이터에 K-Means, K-Medoids, DBSCAN, 계층적 군집, GMM을 차례로 돌려 비교한다. 이 구조를 내 데이터에 맞게 바꿔 줘.\n\n- 내 데이터: 〔예) customers.csv, 숫자 열 4개〕\n- 정답 열은 없음 (있으면 채점용으로만 쓰기)\n\n표준화를 먼저 하고, 무리 수 후보 2~6에 대해 실루엣 점수를 계산해 줘. DBSCAN은 k-거리 그래프로 ε 후보를 고르는 방법도 넣어 줘. 결과를 2차원(PCA)으로 그려서 알고리즘별로 나란히 보여 줘.'},
 {t:'② 무리 모양 먼저 보기',use:'K-Means를 쓰기 전에 가정이 맞는지 확인할 때',p:'K-Means가 가정하는 것(둥근 무리, 비슷한 크기와 퍼짐)을 내 데이터가 만족하는지 확인하는 절차를 짜 줘. 1) 쌍별 산점도와 PCA 그림 2) 무리별 크기·분산 비교 3) 가정이 깨질 때 대안(DBSCAN, GMM, 계층적 군집)과 고르는 기준. 내 데이터는 〔설명〕이다.'},
 {t:'③ t-SNE·UMAP 그림 바르게 읽기',use:'발표 자료에 t-SNE나 UMAP 그림을 넣을 때',p:'t-SNE와 UMAP 그림을 해석할 때 흔한 오해를 정리해 줘. 무리 사이 거리, 무리 크기, 펄플렉시티(또는 n_neighbors)에 따른 변화, 실행마다 달라지는 모양. 내 그림 설명 문장 〔예) "A군과 B군은 멀리 떨어져 있어 매우 다르다"〕이 맞는지 검토하고, 고쳐 쓴 문장과 함께 설정을 바꿔 여러 번 그려 보는 코드를 줘.'},
 {t:'④ 수업용 "가정 깨기" 활동',use:'학생에게 알고리즘의 가정을 체감시키고 싶을 때',p:'고등학생 대상 20분 활동을 기획해 줘. 1) 종이에 초승달과 둥근 무리를 그리고 손으로 묶어 보기 2) Colab에서 K-Means와 DBSCAN 결과 비교 3) "무리 수를 맞혔는데 왜 틀렸을까?" 토론 질문 세 개와 예상 답.'}];
var GL=[
 ['파','군집','정답 없이 비슷한 것끼리 묶는 일.'],['파','차원 축소','특징(축)의 수를 줄여 요약하거나 그림으로 보는 일.'],
 ['군집','중심','무리의 대표 위치. K-Means에서는 무리 점들의 평균.'],['군집','메도이드','무리 안 다른 점까지 거리의 합이 가장 작은 실제 데이터 점.'],
 ['군집','밀도','일정 반지름 안에 점이 얼마나 많은가.'],['군집','잡음 점','DBSCAN에서 어느 무리에도 들지 못한 점. 번호 −1.'],
 ['군집','ε (엡실론)','DBSCAN이 이웃을 찾는 반지름.'],['군집','덴드로그램','계층적 군집이 합친 순서와 거리를 나무 모양으로 그린 그림.'],
 ['군집','연결','계층적 군집에서 두 무리 사이 거리를 재는 방법. 단일·평균·완전 연결 등.'],['군집','소프트 군집','점마다 "어느 무리일 확률"을 주는 군집. GMM.'],
 ['군집','EM 알고리즘','숨은 무리 확률 계산(E)과 분포 고치기(M)를 번갈아 되풀이하는 방법.'],['평가','정답 겹침','이 페이지의 채점 방식. 찾은 무리와 숨긴 정답을 일대일로 짝지어 맞은 점의 몫.'],
 ['축소','분산','값이 퍼진 정도. PCA는 분산이 큰 방향을 남긴다.'],['축소','지역 구조','가까운 이웃끼리의 관계. t-SNE가 지키려는 것.'],
 ['축소','펄플렉시티','t-SNE에서 "이웃을 몇 개쯤 볼지"를 정하는 설정.'],['축소','병목','오토인코더 가운데의 좁은 층. 여기의 값이 압축 결과.']];
var ANALOGY=[
 ['K-Means','교실 책상을 모둠 수만큼 칠판 앞에 모으기',1,'','모둠이 길게 늘어선 줄 모양이면 가운데 기준으로 엉뚱하게 나뉜다'],
 ['DBSCAN','손잡고 이어진 사람들끼리 한 무리',1,'','손 닿는 거리(ε)를 너무 짧게 잡으면 한 줄이 여러 무리로 끊긴다'],
 ['GMM','뿌옇게 번진 잉크 얼룩 여러 개',1,'','실제 무리가 얼룩(종 모양)처럼 생기지 않으면 맞지 않는다'],
 ['차원 축소','지구본을 평면 지도로 펴기',2,'초파리 버섯체는 냄새 정보를 오히려 넓은 차원으로 펼쳐 구별한다','지도는 넓이나 거리 중 무엇을 지킬지 고르는 것처럼, 축소 방법마다 지키는 것이 다르다']];
var REFS=[
 'Ester, M., Kriegel, H.-P., Sander, J., &amp; Xu, X. (1996). A density-based algorithm for discovering clusters in large spatial databases with noise. <i>Proceedings of KDD-96</i>, 226–231. — DBSCAN',
 'Kaufman, L., &amp; Rousseeuw, P. J. (1990). <i>Finding Groups in Data: An Introduction to Cluster Analysis</i>. Wiley. — K-Medoids(PAM), 계층적 군집',
 'Dempster, A. P., Laird, N. M., &amp; Rubin, D. B. (1977). Maximum likelihood from incomplete data via the EM algorithm. <i>Journal of the Royal Statistical Society: Series B</i>, 39(1), 1–38. — GMM 학습',
 'van der Maaten, L., &amp; Hinton, G. (2008). Visualizing data using t-SNE. <i>Journal of Machine Learning Research</i>, 9, 2579–2605.',
 'McInnes, L., Healy, J., &amp; Melville, J. (2018). UMAP: Uniform Manifold Approximation and Projection for dimension reduction. <i>arXiv:1802.03426</i>.',
 'Hinton, G. E., &amp; Salakhutdinov, R. R. (2006). Reducing the dimensionality of data with neural networks. <i>Science</i>, 313(5786), 504–507. — 오토인코더',
 'Pawar, P. <i>Machine Learning Algorithm Family Tree</i> (인포그래픽). — 비지도 칸의 구성'];
var TIP={who:'4-3 비지도 가문을 읽은 학습자. K-평균과 주성분 분석을 한 번 본 사람',goal:'① 군집 다섯의 묶는 기준과 가정을 말한다 ② 데이터 모양을 보고 알맞은 군집 알고리즘을 고른다 ③ 차원 축소 넷이 각각 무엇을 지키는지 설명하고 t-SNE 그림을 조심해서 읽는다',time:'읽기 15분 · 실험과 담판 15분 · Colab 10분',
 plans:[['강의형 40분','01장 신상 파일 10분 → 02장 데이터 세 모양을 바꾸며 "어느 조직원이 이길까" 예측 게임 15분 → 담판 5분 → 04장 롤 펼치기 10분.'],['실무 OJT 60분','02장 15분 → 사내 데이터로 프롬프트 ①을 돌려 군집 다섯 비교 30분 → t-SNE 그림 읽기 주의점(프롬프트 ③) 15분.'],['1:1 튜터링','담판을 열기 전에 K-Means가 초승달을 어떻게 자를지 종이에 그려 보게 하고, 결과와 비교한다.']],
 myths:[['무리 수를 맞히면 군집이 맞은 것이다','무리 모양이 가정과 다르면 수를 맞혀도 엉뚱하게 나뉜다(담판)'],['DBSCAN은 설정이 필요 없다','무리 수 대신 ε와 최소 이웃 수를 정해야 하고, ε에 민감하다'],['t-SNE 그림에서 먼 무리는 정말 다르다','t-SNE는 이웃 관계만 지킨다. 무리 사이 거리는 믿기 어렵다(4-13)']]};
var CODE={title:'군집 다섯과 차원 축소 둘',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'unsupervised_nine',
 desc:'02장과 담판을 옮겼다. 둥근 무리·초승달·크기가 다른 무리에 K-Means, K-Medoids(numpy로 직접 구현), DBSCAN, 계층적 군집, GMM을 돌려 정답 겹침 표를 만든다. 이어서 소용돌이 롤을 PCA와 t-SNE로 줄여 비교한다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 비슷하지만 난수 생성기와 구현이 달라 숫자는 조금 다르다. 결론(초승달에서 DBSCAN이 K-Means를 이긴다)은 같다.'};
