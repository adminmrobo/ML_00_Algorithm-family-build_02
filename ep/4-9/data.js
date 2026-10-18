/* ══ 4-9 데이터 (격자 미로, 난수 고정) ══ */
var RL3=(function(){
var DX=[0,1,0,-1],DY=[-1,0,1,0];
/* 격자 세계: 충전기(목표)는 오른쪽 아래 칸. 한 걸음 −0.1, 벽·바깥에 부딪히면 −1, 충전기 +10 */
function env(n,walls){var W={};(walls||[]).forEach(function(w){W[w]=1});var goal=n*n-1;
  function move(s,a){var x=s%n,y=Math.floor(s/n),nx=x+DX[a],ny=y+DY[a];if(nx<0||ny<0||nx>=n||ny>=n||W[ny*n+nx])return [s,-1];var ns=ny*n+nx;return [ns,ns===goal?10:-0.1];}
  return {n:n,goal:goal,move:move,W:W};}
/* 지그재그 미로 (5×5): 2행과 4행에 벽, 한쪽 끝만 열려 있다 */
var SNAKE=[6,7,8,9,15,16,17,18];
/* 탐욕 정책으로 모든 빈칸에서 출발해 충전기에 닿는 비율 */
function success(E,qf){var ok=0,tot=0,reach=[];for(var s=0;s<E.n*E.n;s++){if(s===E.goal||E.W[s]){reach.push(null);continue;}tot++;var c=s,st=0;
  while(c!==E.goal&&st<E.n*E.n){var q=qf(c),a=0;for(var i=1;i<4;i++)if(q[i]>q[a])a=i;c=E.move(c,a)[0];st++;}var ok1=c===E.goal;if(ok1)ok++;reach.push(ok1);}
  return {rate:ok/tot,reach:reach};}
/* 학습: kind 't' = Q 표(칸마다 값 4개), 'a' = 근사 Q(가로 위치 점수 + 세로 위치 점수) */
function learn(E,kind,budget,seed){var n=E.n,r=ML.R(seed),q,upd,params;
  if(kind==='t'){var Q=[];for(var s=0;s<n*n;s++)Q.push([0,0,0,0]);q=function(s){return Q[s]};upd=function(s,a,g){Q[s][a]-=0.5*g;};params=n*n*4;}
  else{var W=[0,1,2,3].map(function(){return new Array(2*n).fill(0)});q=function(s){var x=s%n,y=Math.floor(s/n);return W.map(function(w){return w[x]+w[n+y]})};
    upd=function(s,a,g){var x=s%n,y=Math.floor(s/n);W[a][x]-=0.05*g;W[a][n+y]-=0.05*g;};params=2*n*4;}
  var free=[];for(var s2=0;s2<n*n-1;s2++)if(!E.W[s2])free.push(s2);var steps=0,t0=Date.now();
  for(var e=0;e<budget;e++){var s=free[Math.floor(r()*free.length)],k=0;
    while(s!==E.goal&&k<n*n*2){var QQ=q(s),a;if(r()<.2)a=Math.floor(r()*4);else{var m=Math.max.apply(null,QQ),c=[];QQ.forEach(function(v,i){if(v===m)c.push(i)});a=c[Math.floor(r()*c.length)];}
      var o=E.move(s,a),ns=o[0],tg=o[1]+(ns===E.goal?0:0.9*Math.max.apply(null,q(ns)));upd(s,a,QQ[a]-tg);s=ns;k++;steps++;}}
  var sc=success(E,q);return {rate:sc.rate,reach:sc.reach,q:q,params:params,steps:steps,ms:Date.now()-t0};}
/* 여러 시드 평균 */
function avg(E,kind,budget,seeds){var o={rate:0,steps:0,ms:0,runs:[]};seeds.forEach(function(sd){var x=learn(E,kind,budget,sd);o.rate+=x.rate/seeds.length;o.steps+=x.steps/seeds.length;o.ms+=x.ms;o.runs.push(x);});o.params=o.runs[0].params;return o;}
return {env:env,SNAKE:SNAKE,success:success,learn:learn,avg:avg,DX:DX,DY:DY};})();
