/* ══ 4-6 데이터 (규칙으로 만든 예시, 난수 고정) ══ */
var REG=(function(){
/* 아파트 면적(㎡) → 매매가(억 원). curved=1: 넓을수록 값이 가파르게 오른다, 0: 거의 직선 */
function apt(curved,n,seed){var r=ML.R(seed||61),D=[];n=n||120;
  for(var i=0;i<n;i++){var a=20+r()*100,p=curved?1.6+0.0012*a*a:0.6+0.13*a;D.push({a:a,p:p+ML.N(r)*0.6});}
  var s=ML.split(D,2/3,5);return {tr:s[0],va:s[1],all:D};}
function truth(curved,a){return curved?1.6+0.0012*a*a:0.6+0.13*a;}
/* 특징 10개짜리 아파트 표 (규제 3형제용): 진짜로 쓰이는 특징은 4개, 방 수는 면적과 겹치고, 잡음 특징 5개 */
var FEATS=['면적','층','역까지 거리','건물 나이','방 수','잡음 ①','잡음 ②','잡음 ③','잡음 ④','잡음 ⑤'];
function table(seed){var r=ML.R(seed||62),D=[];for(var i=0;i<80;i++){var a=20+r()*100,fl=1+Math.floor(r()*25),di=r()*2,ag=r()*30,rm=Math.max(1,Math.round(a/30+ML.N(r)*0.4)),x=[a,fl,di,ag,rm];
  for(var k=0;k<5;k++)x.push(ML.N(r));var p=0.5+0.11*a+0.04*fl-0.9*di-0.05*ag+ML.N(r)*0.8;D.push({x:x,y:p});}
  var s=ML.split(D,0.6,9);return {tr:s[0],va:s[1]};}
/* 면적 하나를 1~8제곱 특징으로 늘린다(0~1로 줄인 뒤) — 규제가 곡선을 얼마나 눌러 주는지 보기 위해 */
function poly(a,deg){var u=(a-20)/100,o=[];for(var k=1;k<=deg;k++)o.push(Math.pow(u,k));return o;}
function maeOf(f,D){var s=0;D.forEach(function(d){s+=Math.abs(f(d.a)-d.p)});return s/D.length;}
/* 조직원 일곱을 같은 데이터에 세운다 */
function fitMember(k,S){var A=S.tr.map(function(d){return [d.a]}),Y=S.tr.map(function(d){return d.p}),f;
  if(k==='lin'){var m=ML.enet(A,Y,0,0);f=function(a){return m.predict([a])};}
  else if(k==='ridge'||k==='lasso'||k==='enet'){var P=S.tr.map(function(d){return poly(d.a,8)}),lam={ridge:0.02,lasso:0.01,enet:0.01}[k],al={ridge:0,lasso:1,enet:0.5}[k];
    var m2=ML.enet(P,Y,lam,al,3000);f=function(a){return m2.predict(poly(a,8))};f.w=m2.w;}
  else if(k==='svr'){var phi=ML.rff(1,80,4,7),m3=ML.svr(A.map(function(x){return [(x[0]-70)/30]}),Y,0.5,0.0005,1500,0.5,phi);f=function(a){return m3.predict([(a-70)/30])};f.eps=0.5;}
  else if(k==='tree'){var t=ML.regTree(A,Y,4,3);f=function(a){return t.predict([a])};f.leaves=t.leaves;}
  else if(k==='gbm'){var g=ML.gbmReg(A,Y,100,0.1,2);f=function(a){return g.predict([a])};f.g=g;}
  return {f:f,tr:maeOf(f,S.tr),va:maeOf(f,S.va)};}
/* 규제 세기 λ에 따른 계수 (특징 10개 표) */
function shrink(T,kind,lam){var X=T.tr.map(function(d){return d.x}),Y=T.tr.map(function(d){return d.y}),al={ridge:0,lasso:1,enet:0.5}[kind],m=ML.enet(X,Y,lam,al,2000);
  var va=0;T.va.forEach(function(d){va+=Math.abs(m.predict(d.x)-d.y)});return {w:m.w,zeros:m.w.filter(function(v){return Math.abs(v)<1e-6}).length,va:va/T.va.length};}
/* 담판: 선형 회귀 vs GBM 회귀 */
function duel(S,M){M=M||100;var A=S.tr.map(function(d){return [d.a]}),Y=S.tr.map(function(d){return d.p});
  var l=ML.enet(A,Y,0,0),g=ML.gbmReg(A,Y,M,0.1,2),fl=function(a){return l.predict([a])},fg=function(a){return g.predict([a])};
  return {lin:{f:fl,tr:maeOf(fl,S.tr),va:maeOf(fl,S.va),w:l.coef[0],b:l.b-l.coef[0]*l.sc.mu[0]},gbm:{f:fg,tr:maeOf(fg,S.tr),va:maeOf(fg,S.va)}};}
return {apt:apt,truth:truth,FEATS:FEATS,table:table,poly:poly,maeOf:maeOf,fitMember:fitMember,shrink:shrink,duel:duel};})();
