# ===============================================================
# 인공지능 알고리즘 패밀리 4-10 · 배깅 vs 부스팅, 잡음별로
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 대출 상환 표 데이터(특징 8개)에서 앙상블 조직원들의 검증 정확도 비교
# ===============================================================
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (RandomForestClassifier, ExtraTreesClassifier,
                              GradientBoostingClassifier, HistGradientBoostingClassifier)

# ---------------------------------------------------------------
# 1) 데이터: 상환 점수 = 1.2·x0 − x1 + 0.8·x2·x3 + (x4>0.3 이면 1, 아니면 −0.5) + 0.5·sin(2·x5)
#    점수 > 0 이면 상환(1). 정답을 noise 비율만큼 일부러 뒤집는다
#    [내 데이터로 바꾸려면] X(특징 표)와 y(0/1 정답)를 내 데이터로 바꾼다
def make(seed, noise, n=600):
    rng = np.random.default_rng(seed)
    X = rng.normal(size=(n, 8))
    s = 1.2*X[:, 0] - X[:, 1] + 0.8*X[:, 2]*X[:, 3] + np.where(X[:, 4] > 0.3, 1, -0.5) + 0.5*np.sin(2*X[:, 5])
    y = (s > 0).astype(int)
    flip = rng.uniform(size=n) < noise
    y[flip] = 1 - y[flip]
    return train_test_split(X, y, test_size=200, random_state=seed)

# ---------------------------------------------------------------
# 2) 조직원들 (브라우저와 비슷한 설정)
def members(seed):
    return {
        "트리 1그루":        DecisionTreeClassifier(max_depth=8, random_state=seed),
        "랜덤 포레스트":     RandomForestClassifier(n_estimators=25, max_depth=8, max_features=3, random_state=seed),
        "Extra Trees":       ExtraTreesClassifier(n_estimators=25, max_depth=8, random_state=seed),
        "GBM":               GradientBoostingClassifier(n_estimators=60, learning_rate=0.1, max_depth=3, random_state=seed),
        "히스토그램 GBM":    HistGradientBoostingClassifier(max_iter=60, learning_rate=0.1, max_depth=3, random_state=seed),
    }

# ---------------------------------------------------------------
# 3) 잡음별 검증 정확도 (데이터 세 벌 평균)
noises = (0.0, 0.02, 0.10, 0.25)
names = list(members(0).keys())
print("잡음  " + "  ".join(f"{n:>10s}" for n in names))
for noise in noises:
    acc = {n: [] for n in names}
    for seed in (1, 2, 3):
        X_tr, X_va, y_tr, y_va = make(seed, noise)
        for n, m in members(seed).items():
            acc[n].append(m.fit(X_tr, y_tr).score(X_va, y_va))
    print(f"{int(noise*100):3d}%  " + "  ".join(f"{np.mean(acc[n]):10.3f}" for n in names))

# ---------------------------------------------------------------
# 4) 담판: 잡음 2%에서 랜덤 포레스트(초파리) vs GBM(Money-Robo)
rf, gb = [], []
for seed in (1, 2, 3):
    X_tr, X_va, y_tr, y_va = make(seed, 0.02)
    m = members(seed)
    rf.append(m["랜덤 포레스트"].fit(X_tr, y_tr).score(X_va, y_va))
    gb.append(m["GBM"].fit(X_tr, y_tr).score(X_va, y_va))
print(f"\n담판 · 랜덤 포레스트 {np.mean(rf):.3f}  vs  GBM {np.mean(gb):.3f}")
