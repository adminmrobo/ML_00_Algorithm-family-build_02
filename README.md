# 인공지능 알고리즘 패밀리 조직도 — 2부 · 조직원 명부 (나무 보기)

이름만 수십 개인 머신러닝 알고리즘을 네 가문의 가계도로 정리하고, 버튼을 눌러 직접 돌려 보며 배우는 교육용 웹 페이지 3부작 가운데 **2부 · 조직원 명부** 묶음입니다. 질문: *조직원(알고리즘) 하나하나의 특기는 무엇인가?*

- **글:** 안상선 ((주)M-Robo 대표)
- **라이선스:** CC BY-NC 4.0 — [LICENSE.md](LICENSE.md)
- **시작:** [4-6_regression_seven.html](4-6_regression_seven.html) · 전체 목차 [index.html](index.html)

## 편 목록

| 편 | 파일 | 제목 | 담판 |
|---|---|---|---|
| 4-6 | [4-6_regression_seven.html](4-6_regression_seven.html) | 회귀파 일곱 — 직선 하나에서 나무 숲까지 | Money-Robo 쪽 |
| 4-7 | [4-7_classification_eight.html](4-7_classification_eight.html) | 분류파 여덟 — 경계를 긋는 여덟 가지 방법 | Money-Robo 쪽 |
| 4-8 | [4-8_unsupervised_nine.html](4-8_unsupervised_nine.html) | 비지도 아홉 — 묶는 다섯, 줄이는 넷 | 초파리 쪽 |
| 4-9 | [4-9_rl_three.html](4-9_rl_three.html) | 강화 삼대 — 표에서 신경망으로, 값에서 정책으로 | 나눠 가짐 |
| 4-10 | [4-10_ensemble_lineage.html](4-10_ensemble_lineage.html) | 앙상블 계보 — 다양한 의견의 평균, 오답 노트의 연쇄 | Money-Robo 쪽 |

HTML 하나하나에 그림과 스크립트가 모두 들어 있어서, 파일만 있으면 오프라인에서도 열린다.

## 이 묶음만 따로 올릴 때

목차(`index.html`, `4-0_index.html`)와 각 편의 위쪽 편 목록·이전/다음 링크는 1·2·3부 열다섯 편이 **같은 폴더**에 있다고 보고 걸려 있다. 다른 부의 HTML을 같은 저장소에 함께 올리면 모든 링크가 이어진다. 이 부만 올리면 다른 부로 가는 링크는 열리지 않는다.

## 폴더

```
├── index.html, 4-0_index.html, 4-6 ~ 4-10 .html   배포용 페이지
├── ep/          편별 조각 (본문, 아웃트로, 데이터, 그림 스크립트, Colab 코드)
├── src/         공용 조각 (테마, 담판 엔진, 작은 학습 엔진, 목차 틀)
├── assets/      이 부와 목차가 쓰는 압축 그림
├── build.py     다시 만들기: python3 build.py → out/
├── 대부_컨셉_설정.md, 캐릭터_설정.md   설정 문서
├── LICENSE.md
└── .nojekyll
```

## 다시 만들기

`python3 build.py`를 돌리면 `out/`에 이 부의 다섯 편과 목차가 다시 만들어진다(Python 3, numpy, scikit-learn 필요 — 편마다 `ep/4-n/code.py`를 실행해 결과를 페이지에 넣는다). 한 편만은 `python3 build.py 4-6`처럼 한다. 데이터는 규칙으로 만든 예시이며 실제 기록이 아니다(난수 고정).
