/* ══ 4-10 데이터 (규칙으로 만든 예시, 난수 고정) ══ */
var LIN=(function(){
function XY(A){return [A.map(function(d){return d.x}),A.map(function(d){return d.y})];}

/* ── 02 배깅 vs 단일 트리: 띠 모양 경계 + 잡음 10% ── */
function band(){var r=ML.R(107),D=[];for(var i=0;i<240;i++){var x=r()*2-1,y=r()*2-1,c=Math.abs(y-0.45*Math.sin(2.4*x))<0.35?1:0;if(r()<.1)c=1-c;D.push({x:[x,y],y:c});}return D;}
var BAND=band();
/* 훈련 데이터를 다시 뽑고(부트스트랩) 깊은 트리 1그루와 포레스트 25그루를 키운다 */
function draw(seed){var t=XY(BAND),r=ML.R(seed),bx=[],by=[];for(var i=0;i<t[0].length;i++){var j=Math.floor(r()*t[0].length);bx.push(t[0][j]);by.push(t[1][j]);}
  return {one:ML.tree(bx,by,30,1),f:ML.forest(bx,by,25,30,seed*7+1,1)};}
/* 격자 40×40 칸의 예측 (흔들림 재기용) */
var G=40;function grid(m){var o=[];for(var a=0;a<G;a++)for(var b=0;b<G;b++)o.push(m.predict([-1+(a+.5)*2/G,1-(b+.5)*2/G]));return o;}
function changed(A,B){var c=0;for(var i=0;i<A.length;i++)if(A[i]!==B[i])c++;return c/A.length;}

/* ── 03 부스팅 단계: 아파트 면적 → 매매가 (억 원), 약간 휜 곡선 ── */
function apt(){var r=ML.R(61),D=[];for(var i=0;i<60;i++){var a=20+r()*100,p=1.2+0.00035*a*a+0.6*Math.sin(a/14)+ML.N(r)*0.25;D.push({a:a,p:p});}return D;}
var APT=apt(),AX=APT.map(function(d){return [d.a]}),AY=APT.map(function(d){return d.p});
var BOOST=ML.gbmReg(AX,AY,10,0.5,2);
function truth(a){return 1.2+0.00035*a*a+0.6*Math.sin(a/14);}

/* ── 담판: 대출 상환 표 데이터 (특징 8개). 상환 점수 규칙에 잡음 noise만큼 정답 뒤집기 ── */
function loan(seed,noise,n){var r=ML.R(seed),D=[];for(var i=0;i<n;i++){var x=[];for(var j=0;j<8;j++)x.push(ML.N(r));
  var s=1.2*x[0]-1.0*x[1]+0.8*x[2]*x[3]+(x[4]>0.3?1:-0.5)+0.5*Math.sin(2*x[5]);var y=s>0?1:0;if(r()<noise)y=1-y;D.push({x:x,y:y});}return D;}
/* 데이터 seeds벌을 만들어 랜덤 포레스트(25그루) vs GBM(60단계)을 재고 평균한다 */
async function duel(noise,seeds,p){var a=0,b=0,c=0,rows=[];for(var k=0;k<seeds.length;k++){var s=seeds[k],D=loan(100+s,noise,600),sp=ML.split(D,2/3,5+s),t=XY(sp[0]),v=XY(sp[1]);
    var rf=ML.forest(t[0],t[1],25,8,3+s,3),gb=ML.gbmClf(t[0],t[1],60,0.1,3),one=ML.tree(t[0],t[1],8,1);
    var ra=ML.acc(rf,v[0],v[1]),ga=ML.acc(gb,v[0],v[1]),oa=ML.acc(one,v[0],v[1]);a+=ra;b+=ga;c+=oa;rows.push([s,oa,ra,ga]);if(p)p((k+1)/seeds.length);await wait(10);}
  var n=seeds.length;return {one:c/n,rf:a/n,gb:b/n,rows:rows};}
return {BAND:BAND,draw:draw,grid:grid,changed:changed,G:G,APT:APT,AX:AX,AY:AY,BOOST:BOOST,truth:truth,duel:duel};})();
