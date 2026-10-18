# ===============================================================
# 인공지능 알고리즘 패밀리 4-7 · 데이터 모양 × 분류파 여덟
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 세 가지 데이터 모양에 분류기 여덟 개를 돌려 검증 정확도 비교
# ===============================================================
import time
import numpy as np
from sklearn.datasets import make_moons, make_circles
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,
                              HistGradientBoostingClassifier)

# ---------------------------------------------------------------
# 1) 데이터 세 모양 (점 300개 → 훈련 200 · 검증 100)
#    [내 데이터로 바꾸려면] SHAPES에 (X, y)를 하나 더 넣는다
rng = np.random.default_rng(71)
X_lin = rng.uniform(-1, 1, (300, 2))
y_lin = (X_lin[:, 1] > 0.45 * X_lin[:, 0] - 0.05 + rng.normal(0, 0.12, 300)).astype(int)
SHAPES = {
    "직선으로 나뉨": (X_lin, y_lin),
    "띠 모양": make_moons(300, noise=0.12, random_state=72),
    "동심원": make_circles(300, noise=0.08, factor=0.45, random_state=73),
}

# ---------------------------------------------------------------
# 2) 분류파 여덟 (거리를 쓰는 모델은 표준화와 함께)
def scaled(m):
    return make_pipeline(StandardScaler(), m)

MODELS = {
    "로지스틱 회귀": lambda: scaled(LogisticRegression()),
    "SVM (RBF)": lambda: scaled(SVC(kernel="rbf")),
    "KNN (k=7)": lambda: scaled(KNeighborsClassifier(7)),
    "나이브 베이즈": lambda: GaussianNB(),
    "결정 트리 (깊이 4)": lambda: DecisionTreeClassifier(max_depth=4, random_state=0),
    "랜덤 포레스트": lambda: RandomForestClassifier(25, random_state=0),
    "GBM": lambda: GradientBoostingClassifier(random_state=0),
    "XGBoost형 (HistGB)": lambda: HistGradientBoostingClassifier(random_state=0),
}

# ---------------------------------------------------------------
# 3) 모양 × 조직원 검증 정확도 표
names = list(SHAPES)
print(f"{'조직원':20s}" + "".join(f"{n:>10s}" for n in names))
for mname, make in MODELS.items():
    row = []
    for n in names:
        X, y = SHAPES[n]
        X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=100, random_state=5)
        row.append(make().fit(X_tr, y_tr).score(X_va, y_va))
    print(f"{mname:20s}" + "".join(f"{v:10.3f}" for v in row))

# ---------------------------------------------------------------
# 4) 담판: 동심원에서 로지스틱 회귀(초파리) vs 랜덤 포레스트(Money-Robo)
X, y = SHAPES["동심원"]
X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=100, random_state=5)
for who, make in (("초파리 · 로지스틱", MODELS["로지스틱 회귀"]), ("Money-Robo · 숲", MODELS["랜덤 포레스트"])):
    t0 = time.perf_counter()
    m = make().fit(X_tr, y_tr)
    print(f"담판 {who:16s} 검증 {m.score(X_va, y_va):.3f}  학습 {1000*(time.perf_counter()-t0):.1f} ms")

# 조건 바꾸기: 반지름 특징을 손으로 넣으면 로지스틱도 원을 가른다
r_tr = np.c_[X_tr, (X_tr ** 2).sum(1)]
r_va = np.c_[X_va, (X_va ** 2).sum(1)]
print("로지스틱 + 반지름 특징 검증", round(MODELS["로지스틱 회귀"]().fit(r_tr, y_tr).score(r_va, y_va), 3))
