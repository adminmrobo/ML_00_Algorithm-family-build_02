/* ══ 4-7 데이터와 분류파 여덟 (규칙으로 만든 예시, 난수 고정) ══ */
var CLS=(function(){
var DOM=1.25;
/* 데이터 모양 세 가지. 모두 점 300개 → 훈련 200 · 검증 100 */
function mk(shape){var r=ML.R({lin:71,band:72,circ:73}[shape]),D=[];
  for(var i=0;i<300;i++){var x,y,c;
    if(shape==='lin'){x=r()*2-1;y=r()*2-1;c=y>0.45*x-0.05+ML.N(r)*0.12?1:0;}
    else if(shape==='band'){c=i%2;var t=r()*Math.PI,u=c?1-Math.cos(t):Math.cos(t),v=c?0.5-Math.sin(t):Math.sin(t);x=(u-0.5)/1.45+ML.N(r)*0.08;y=(v-0.25)/0.85+ML.N(r)*0.08;}
    else{var a=r()*2*Math.PI;c=r()<.5?1:0;var rad=(c?0.35:0.8)+ML.N(r)*0.1;x=rad*Math.cos(a);y=rad*Math.sin(a);}
    D.push({x:[x,y],y:c});}
  var s=ML.split(D,2/3,5);return {tr:s[0],va:s[1],X:s[0].map(function(d){return d.x}),Y:s[0].map(function(d){return d.y}),Xv:s[1].map(function(d){return d.x}),Yv:s[1].map(function(d){return d.y})};}
var SH={lin:mk('lin'),band:mk('band'),circ:mk('circ')};
var SHN={lin:'직선으로 나뉨',band:'띠 모양',circ:'동심원'};

/* 히스토그램 GBM 흉내: 특징을 32칸으로 나눈 뒤 GBM (XGBoost·LightGBM이 빨라지는 핵심 요령 중 하나) */
function histGbm(X,Y,M,lr,depth){var d=X[0].length,cuts=[];
  for(var j=0;j<d;j++){var v=X.map(function(x){return x[j]}).sort(function(a,b){return a-b}),c=[];for(var q=1;q<32;q++)c.push(v[Math.floor(q*v.length/32)]);cuts.push(c);}
  function bin(x){return x.map(function(v,j){var c=cuts[j],k=0;while(k<c.length&&v>c[k])k++;return k;});}
  var g=ML.gbmClf(X.map(bin),Y,M,lr,depth);
  return {prob:function(x){return g.prob(bin(x))},predict:function(x){return g.predict(bin(x))}};}

/* 조직원 여덟의 신상 파일 */
var MEM=[
 {id:'log',n:'로지스틱 회귀',s:'확률로 답한다',why:'점수 wᵀx+b를 시그모이드 σ에 넣어 0~1 확률로 바꾼다',shape:'직선',when:'경계가 거의 직선일 때, 확률과 "어느 특징이 얼마나 중요한지"를 함께 알고 싶을 때',weak:'곡선 경계를 못 긋는다. 특징을 손으로 만들어 주지 않으면 동그라미는 못 가른다',vs:'SVM과 같은 직선이지만, 모든 점의 확률을 보고 선을 고른다',k:'선형'},
 {id:'svm',n:'SVM',s:'가장 넓은 길을 낸다',why:'두 무리 사이 여백(margin)이 가장 넓은 경계를 고른다. 경계 가까운 점(서포트 벡터)만 경계를 정한다',shape:'직선 · 커널을 쓰면 곡선',when:'특징이 많고 데이터가 많지 않을 때. 커널로 곡선 경계도 그린다',weak:'데이터가 아주 많으면 느리다. 커널과 규제 세기를 잘 골라야 한다',vs:'로지스틱은 확률, SVM은 여백. 커널 요령으로 곡선까지 간다',k:'선형'},
 {id:'knn',n:'KNN',s:'배우지 않고 외운다',why:'새 점과 가장 가까운 이웃 k개의 다수결',shape:'들쭉날쭉',when:'데이터가 적당히 작고, 가까우면 비슷하다는 가정이 맞을 때',weak:'예측할 때마다 모든 점과 거리를 재서 느리다. 특징 단위(크기)에 민감하다',vs:'다른 형제는 규칙을 배워 두지만, KNN은 데이터를 통째로 들고 다닌다',k:'이웃'},
 {id:'nb',n:'나이브 베이즈',s:'특징이 서로 독립이라고 가정한다',why:'베이즈 정리 P(C|X) ∝ P(C)·P(X|C). 특징마다 따로 확률을 구해 곱한다',shape:'단순한 곡선 (타원·포물선)',when:'글자·단어처럼 특징이 아주 많을 때, 빠르게 기준선을 세울 때',weak:'특징끼리 얽혀 있으면 가정이 틀린다. 확률 값 자체는 과장되기 쉽다',vs:'KNN처럼 이웃을 보지 않고, 무리마다 "어떻게 생겼나"를 분포로 요약한다',k:'확률'},
 {id:'tree',n:'결정 트리',s:'사람이 읽을 수 있다',why:'"x가 0.3보다 큰가?" 같은 예/아니오 질문을 이어 붙인다',shape:'가로·세로 계단',when:'왜 그렇게 판정했는지 설명해야 할 때',weak:'깊게 키우면 잡음까지 외운다(4-2). 데이터가 조금 바뀌어도 모양이 크게 흔들린다',vs:'랜덤 포레스트·GBM의 재료. 혼자서는 흔들리고, 여럿이 모이면 튼튼해진다',k:'트리'},
 {id:'rf',n:'랜덤 포레스트',s:'여러 나무의 투표',why:'데이터를 다시 뽑아 트리 25그루를 따로 키우고 다수결',shape:'부드러운 계단',when:'표 데이터에서 손이 덜 가는 튼튼한 기본 선택',weak:'한 그루보다 읽기 어렵고 무겁다',vs:'배깅의 대표. 흔들림을 줄인다(4-5, 4-10)',k:'트리'},
 {id:'gbm',n:'GBM',s:'틀린 곳을 고치는 나무의 연쇄',why:'앞 나무가 틀린 만큼(잔차)을 다음 나무가 배워 더한다',shape:'정교한 계단',when:'표 데이터에서 정확도를 끝까지 끌어올리고 싶을 때',weak:'나무 수와 학습률을 잘못 고르면 잡음까지 외운다. 순서대로 키워 느리다',vs:'부스팅의 대표. 랜덤 포레스트는 동시에, GBM은 차례로 키운다',k:'트리'},
 {id:'xgb',n:'XGBoost · LightGBM · CatBoost',s:'GBM의 빠르고 튼튼한 구현',why:'원리는 GBM과 같다. 값을 구간(히스토그램)으로 묶어 빨리 자르고, 규제와 결측값 처리, 범주형 특징 처리를 더했다',shape:'정교한 계단',when:'표 데이터 대회와 실무의 단골',weak:'설정할 값이 많다. 작은 데이터에서는 GBM과 큰 차이가 없다',vs:'GBM의 후손 셋. XGBoost는 규제와 병렬 계산, LightGBM은 잎 단위 성장으로 속도, CatBoost는 범주형 특징에 강하다',k:'트리',sim:1}];

/* 모델 키우기. o = {k, kernel, depth} */
var cache={};
function fit(id,sh,o){o=o||{};var key=id+'|'+sh+'|'+(id==='knn'?o.k:id==='svm'?o.kernel:id==='tree'?o.depth:'');if(cache[key])return cache[key];
  var S=SH[sh],X=S.X,Y=S.Y,m,t0=(typeof performance!=='undefined'?performance.now():Date.now());
  if(id==='log')m=ML.logfit(X.map(function(x){return [x[0]*2,x[1]*2]}),Y,1500,1),m={inner:m,prob:function(x){return this.inner.prob([x[0]*2,x[1]*2])},predict:function(x){return this.prob(x)>=.5?1:0}};
  else if(id==='svm')m=o.kernel==='rbf'?ML.svm(X,Y,0.01,30,1,ML.rff(2,120,2.5,4)):ML.svm(X,Y,0.01,30,1);
  else if(id==='knn')m=ML.knn(X,Y,o.k||7);
  else if(id==='nb')m=ML.gnb(X,Y);
  else if(id==='tree')m=ML.tree(X,Y,o.depth||4,1);
  else if(id==='rf')m=ML.forest(X,Y,25,6,3,1);
  else if(id==='gbm')m=ML.gbmClf(X,Y,40,0.1,3);
  else m=histGbm(X,Y,60,0.1,3);
  var ms=(typeof performance!=='undefined'?performance.now():Date.now())-t0;
  var out={m:m,tr:ML.acc(m,X,Y),va:ML.acc(m,S.Xv,S.Yv),ms:ms};cache[key]=out;return out;}
/* 모델 크기(외워 두는 숫자 개수) */
function nodes(n){return n.leaf?1:1+nodes(n.l)+nodes(n.r)}
function size(id,f){if(id==='log')return 3;if(id==='rf')return f.m.trees.reduce(function(s,t){return s+nodes(t.root)},0);return null;}
return {DOM:DOM,SH:SH,SHN:SHN,MEM:MEM,fit:fit,size:size,nodes:nodes};})();
