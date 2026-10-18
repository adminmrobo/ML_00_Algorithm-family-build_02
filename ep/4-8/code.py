# ===============================================================
# 인공지능 알고리즘 패밀리 4-8 · 군집 다섯과 차원 축소 둘
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 데이터 세 모양 × 군집 다섯의 정답 겹침 표, 초승달 담판, 소용돌이 롤 PCA vs t-SNE
# ===============================================================
import numpy as np
from sklearn.datasets import make_blobs, make_moons, make_swiss_roll
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.mixture import GaussianMixture
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

# ---------------------------------------------------------------
# 1) 데이터 세 모양 (정답 y는 채점에만 쓴다)
#    [내 데이터로 바꾸려면] X만 있으면 된다. 정답이 없으면 채점 줄을 지운다
rng = np.random.default_rng(0)
blobs = make_blobs(150, centers=[[0, 0], [1.6, .15], [.8, 1.35]], cluster_std=.26, random_state=84)
moons = make_moons(150, noise=.08, random_state=82)
Xv = np.vstack([rng.normal([0, .3], .5, (100, 2)), rng.normal([1.25, 1.0], .1, (25, 2)), rng.normal([1.3, -.3], .1, (25, 2))])
varied = (Xv, np.repeat([0, 1, 2], [100, 25, 25]))
SETS = {"둥근 무리": (blobs, 3, .3), "초승달": (moons, 2, .27), "크기가 다른 무리": (varied, 3, .3)}

# ---------------------------------------------------------------
# 2) K-Medoids: scikit-learn 기본 설치에 없어 numpy로 짧게 만든다
def kmedoids(X, k, seed=3, iters=20):
    r = np.random.default_rng(seed)
    M = r.choice(len(X), k, replace=False)
    D = np.linalg.norm(X[:, None] - X[None], axis=2)
    for _ in range(iters):
        a = D[:, M].argmin(1)
        newM = np.array([np.where(a == j)[0][D[np.ix_(a == j, a == j)].sum(1).argmin()] for j in range(k)])
        if (newM == M).all():
            break
        M = newM
    return D[:, M].argmin(1)

# 정답 겹침: 무리와 정답을 큰 것부터 일대일로 짝지어 맞은 점의 몫 (잡음 −1은 틀림)
def match(a, t, K):
    pairs = sorted(((np.sum((a == c) & (t == v)), c, v) for c in set(a) - {-1} for v in set(t)), reverse=True)
    uc, ut, s = set(), set(), 0
    for n, c, v in pairs:
        if c in uc or v in ut:
            continue
        uc.add(c); ut.add(v); s += n
        if len(ut) == K:
            break
    return s / len(a)

def algos(k, eps):
    return {
        "K-Means": lambda X: KMeans(k, n_init=10, random_state=3).fit_predict(X),
        "K-Medoids": lambda X: kmedoids(X, k),
        "DBSCAN": lambda X: DBSCAN(eps=eps, min_samples=5).fit_predict(X),
        "계층적(단일)": lambda X: AgglomerativeClustering(k, linkage="single").fit_predict(X),
        "GMM": lambda X: GaussianMixture(k, covariance_type="diag", random_state=3).fit_predict(X),
    }

# ---------------------------------------------------------------
# 3) 정답 겹침 표
print(f"{'데이터':10s}" + "".join(f"{n:>12s}" for n in algos(2, .3)))
for name, ((X, y), k, eps) in SETS.items():
    row = [match(f(X), y, k) for f in algos(k, eps).values()]
    print(f"{name:10s}" + "".join(f"{v:12.3f}" for v in row))

# ---------------------------------------------------------------
# 4) 담판: 초승달에서 K-Means(k=2) vs DBSCAN
(X, y), k, eps = SETS["초승달"]
km, db = KMeans(2, n_init=10, random_state=3).fit_predict(X), DBSCAN(eps=eps, min_samples=5).fit_predict(X)
print(f"\n담판 · Money-Robo K-Means 겹침 {match(km, y, 2):.3f}")
print(f"담판 · 초파리 DBSCAN 겹침 {match(db, y, 2):.3f} (무리 {len(set(db) - {-1})}개, 잡음 {np.sum(db == -1)}개)")
small = DBSCAN(eps=.12, min_samples=5).fit_predict(X)
print(f"ε=0.12로 줄이면: 무리 {len(set(small) - {-1})}개, 잡음 {np.sum(small == -1)}개, 겹침 {match(small, y, 2):.3f}")

# ---------------------------------------------------------------
# 5) 소용돌이 롤: PCA vs t-SNE. 종이 위 위치 t의 순서가 지도에서 얼마나 지켜지나 (이웃 10개 중 원래 이웃 비율)
R, t = make_swiss_roll(300, noise=.3, random_state=7)
R[:, 1] *= .6
R = (R - R.mean(0)) / R.std(0)
def keep(Z, k=10):
    def nb(A):
        D = np.linalg.norm(A[:, None] - A[None], axis=2)
        return np.argsort(D, 1)[:, 1:k + 1]
    T = np.c_[t, R[:, 1]]                     # 펼친 종이 위 좌표
    a, b = nb(T), nb(Z)
    return np.mean([len(set(a[i]) & set(b[i])) / k for i in range(len(Z))])
pca = PCA(2).fit(R)
P2, T2 = pca.transform(R), TSNE(2, perplexity=30, init="pca", random_state=0).fit_transform(R)
print(f"\n소용돌이 롤 · PCA 설명 분산 {pca.explained_variance_ratio_.sum():.2f}, 종이 위 이웃 유지 {keep(P2):.2f}")
print(f"소용돌이 롤 · t-SNE 종이 위 이웃 유지 {keep(T2):.2f}")
