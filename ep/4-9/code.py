# ===============================================================
# 인공지능 알고리즘 패밀리 4-9 · 격자 미로 Q-Learning과 표의 한계
#  - 라이브러리: numpy (Colab 기본 설치)
#  - 하는 일: 5×5 지그재그 미로와 20×20 빈 격자에서
#             Q 표 vs 근사 Q(가로 위치 점수 + 세로 위치 점수) 비교
# ===============================================================
import time
import numpy as np

DX, DY = [0, 1, 0, -1], [-1, 0, 1, 0]   # 행동: 위, 오른쪽, 아래, 왼쪽

# ---------------------------------------------------------------
# 1) 격자 세계: 충전기(목표)는 오른쪽 아래. 한 걸음 -0.1, 벽 -1, 충전기 +10
#    [내 미로로 바꾸려면] n과 walls(칸 번호 = 행*n + 열)를 바꾼다
def make_env(n, walls=()):
    W, goal = set(walls), n * n - 1
    def move(s, a):
        x, y = s % n + DX[a], s // n + DY[a]
        if x < 0 or y < 0 or x >= n or y >= n or y * n + x in W:
            return s, -1.0
        ns = y * n + x
        return ns, (10.0 if ns == goal else -0.1)
    return n, W, goal, move

# ---------------------------------------------------------------
# 2) 학습: kind='table'(칸마다 값 4개) 또는 'approx'(가로 점수 + 세로 점수)
def learn(env, kind, episodes, seed, eps=0.2, gamma=0.9):
    n, W, goal, move = env
    rng = np.random.default_rng(seed)
    if kind == "table":
        Q = np.zeros((n * n, 4))
        q = lambda s: Q[s]
        def upd(s, a, err): Q[s, a] -= 0.5 * err
        params = Q.size
    else:
        Wx, Wy = np.zeros((n, 4)), np.zeros((n, 4))
        q = lambda s: Wx[s % n] + Wy[s // n]
        def upd(s, a, err):
            Wx[s % n, a] -= 0.05 * err
            Wy[s // n, a] -= 0.05 * err
        params = Wx.size + Wy.size
    free = [s for s in range(n * n - 1) if s not in W]
    for _ in range(episodes):
        s, k = free[rng.integers(len(free))], 0
        while s != goal and k < n * n * 2:
            qs = q(s)
            a = rng.integers(4) if rng.random() < eps else rng.choice(np.flatnonzero(qs == qs.max()))
            ns, r = move(s, a)
            target = r + (0 if ns == goal else gamma * q(ns).max())
            upd(s, a, qs[a] - target)
            s, k = ns, k + 1
    # 평가: 모든 빈칸에서 탐욕 정책으로 출발해 충전기에 닿는 비율
    ok = 0
    for s0 in free:
        s, k = s0, 0
        while s != goal and k < n * n:
            s, _ = move(s, int(np.argmax(q(s))))
            k += 1
        ok += s == goal
    return ok / len(free), params

# ---------------------------------------------------------------
# 3) 담판: ① 5×5 지그재그 미로 60판 ② 20×20 빈 격자 40판 (시드 3개 평균)
SNAKE = [6, 7, 8, 9, 15, 16, 17, 18]
for name, env, eps_n in (("① 5×5 지그재그 미로", make_env(5, SNAKE), 60), ("② 20×20 빈 격자", make_env(20), 40)):
    for kind, who in (("table", "초파리 · Q 표"), ("approx", "Money-Robo · 근사 Q")):
        t0 = time.time()
        res = [learn(env, kind, eps_n, sd) for sd in (1, 2, 3)]
        rate = np.mean([r for r, _ in res])
        print(f"{name:14s} {who:18s} 도달 비율 {rate:.3f}  기억할 숫자 {res[0][1]:5d}개  {time.time()-t0:.1f}초")

# ---------------------------------------------------------------
# 4) 표의 칸 수: 격자가 커지면
for n in (5, 20, 84):
    print(f"{n}×{n} 격자: Q 표 {n*n*4:,}칸")
print("84×84 흑백 화면을 상태로 쓰면: 가능한 화면 2^7056 가지 (약 10^%.0f)" % (7056 * np.log10(2)))
