# ===============================================================
# 인공지능 알고리즘 패밀리 4-6 · 회귀파 일곱, 같은 집값에 세우기
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 같은 데이터에 회귀 일곱 모델을 바꿔 끼우고 검증 MAE를 비교
# ===============================================================
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error as mae

# ---------------------------------------------------------------
# 1) 데이터: 아파트 면적(㎡) → 매매가(억 원). curved=True면 넓을수록 가파르게 오른다
#    [내 데이터로 바꾸려면] X(특징 표)와 y(숫자 정답)를 내 데이터로 바꾼다
def make(curved, seed=61, n=120):
    rng = np.random.default_rng(seed)
    a = rng.uniform(20, 120, n)
    p = 1.6 + 0.0012 * a**2 if curved else 0.6 + 0.13 * a
    y = p + rng.normal(0, 0.6, n)
    return train_test_split(a.reshape(-1, 1), y, test_size=40, random_state=5)

# 규제 3형제는 면적을 1~8제곱 특징으로 늘린 뒤 규제한다 (페이지의 신상 파일과 같은 방식)
poly = lambda: PolynomialFeatures(8, include_bias=False)
MODELS = {
    "선형 회귀":       make_pipeline(LinearRegression()),
    "Ridge":           make_pipeline(StandardScaler(), poly(), StandardScaler(), Ridge(alpha=1.0)),
    "Lasso":           make_pipeline(StandardScaler(), poly(), StandardScaler(), Lasso(alpha=0.01, max_iter=50000)),
    "Elastic Net":     make_pipeline(StandardScaler(), poly(), StandardScaler(), ElasticNet(alpha=0.01, l1_ratio=0.5, max_iter=50000)),
    "SVR (RBF)":       make_pipeline(StandardScaler(), SVR(C=30, epsilon=0.5, gamma=1.0)),
    "결정 트리 회귀":   DecisionTreeRegressor(max_depth=4, min_samples_leaf=3, random_state=0),
    "GBM 회귀":        GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=2, random_state=0),
}

# ---------------------------------------------------------------
# 2) 같은 데이터에 일곱을 차례로 세운다 (휜 데이터 / 거의 직선)
for curved in (True, False):
    X_tr, X_va, y_tr, y_va = make(curved)
    print(f"--- {'휜 데이터' if curved else '거의 직선'} · 기준선(늘 평균) 검증 MAE {mae(y_va, np.full_like(y_va, y_tr.mean())):.2f}억 ---")
    for name, m in MODELS.items():
        m.fit(X_tr, y_tr)
        print(f"{name:12s} 훈련 MAE {mae(y_tr, m.predict(X_tr)):5.2f}  검증 MAE {mae(y_va, m.predict(X_va)):5.2f}")

# ---------------------------------------------------------------
# 3) 담판: 선형 회귀(초파리) vs GBM 회귀(Money-Robo), 그리고 훈련 범위 밖
X_tr, X_va, y_tr, y_va = make(True)
lin = LinearRegression().fit(X_tr, y_tr)
gbm = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=2, random_state=0).fit(X_tr, y_tr)
print(f"담판 · 검증 MAE  선형 {mae(y_va, lin.predict(X_va)):.2f}억  GBM {mae(y_va, gbm.predict(X_va)):.2f}억")
far = np.array([[130], [140], [150]])
print("범위 밖 150㎡ · 진짜", round(1.6 + 0.0012 * 150**2, 1), "선형", lin.predict(far)[-1].round(1), "GBM", gbm.predict(far)[-1].round(1))

# ---------------------------------------------------------------
# 4) Lasso의 특징 고르기: 특징 10개 중 잡음 5개가 0이 되는가
rng = np.random.default_rng(62)
n = 80
area, floor, dist, age = rng.uniform(20, 120, n), rng.integers(1, 26, n), rng.uniform(0, 2, n), rng.uniform(0, 30, n)
rooms = np.maximum(1, np.round(area / 30 + rng.normal(0, 0.4, n)))
X = np.column_stack([area, floor, dist, age, rooms, rng.normal(size=(n, 5))])
y = 0.5 + 0.11 * area + 0.04 * floor - 0.9 * dist - 0.05 * age + rng.normal(0, 0.8, n)
names = ["면적", "층", "역까지 거리", "건물 나이", "방 수"] + [f"잡음{i}" for i in range(1, 6)]
for alpha in (0.05, 0.2, 0.5):
    las = make_pipeline(StandardScaler(), Lasso(alpha=alpha)).fit(X, y)
    w = las[-1].coef_
    print(f"Lasso λ={alpha}: 0이 된 특징 →", [nm for nm, v in zip(names, w) if abs(v) < 1e-9])
