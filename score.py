from sklearn.decomposition import PCA
import pandas as pd
import numpy as np
from sklearn.datasets import *
from sklearn.cluster import *
from sklearn.preprocessing import StandardScaler
from sklearn.utils.testing import ignore_warnings
import matplotlib.pyplot as plt
import pickle

import json
import requests
import os
import sys

sys.path.append(os.pardir)  # 현재 경로 폴더 추가
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))  # 상위 폴더 path추가
from bs4 import BeautifulSoup

def Troll_score():
    with open('trollData.pkl', 'rb') as f:
        trollp = pickle.load(f)
        # print("p shape :", trollp.shape)
    with open('data.pkl', 'rb') as f:
        params = pickle.load(f)
        # print("p shape :", params.shape)

    data_len = len(params)
    troll_len = len(trollp)
    total_len = data_len + troll_len

    # print("a" , trollp.shape)
    # print("b" , params.shape)
    T_len = len(params)
    X_troll = trollp
    tmp = np.concatenate([params, X_troll], axis=0)
    tmp1 = tmp[0:, :9]
    tmp2 = tmp[0:, 9::2]
    tmp2 = tmp2[0:, :2]
    X = np.hstack((tmp1, tmp2))

    pls_troll = False
    pls_troll2 = False

    if trollp[0][9] < 20.0 and trollp[0][10] > 20:
        pls_troll = True
    if trollp[0][11] < 20.0 and trollp[0][12] > 20:
        pls_troll2 = True

    feature_num = len(X[0]) - 1  # feature 갯수
    # list to pandas, list to pandas series
    # print(panda_X)

    # print("X dataShape : ", X.shape)
    # print("Troll dataShape : ", X_troll.shape)
    data = StandardScaler().fit_transform(X)  # normalize 기능
    # print("DataShape : ", data.shape)
    n_samples, n_features = data.shape
    # print("n_sample :", n_samples, end=" / ")
    # print("n_features :", n_features)

    pca = PCA(n_components=feature_num)
    pca.fit(X)
    # print("singular value :", pca.singular_values_)
    # print("eigen_value :", pca.explained_variance_)
    # print("explained variance ratio :", pca.explained_variance_ratio_)
    pca = PCA(n_components=0.990)
    X_reduced = pca.fit_transform(X)
    # print("X_redu Shape : ", X_reduced.shape)
    # print("explained variance ratio :", pca.explained_variance_ratio_)
    # print("선택한 차원수 :",pca.n_components_)
    # print(X_reduced.shape)

    plt.figure(figsize=(9, 8))
    n_clusters = 8  # 클러스터 수

    X_reduced = StandardScaler().fit_transform(X_reduced)
    X = StandardScaler().fit_transform(X)
    two_means = MiniBatchKMeans(n_clusters=n_clusters)
    dbscan = DBSCAN(eps=0.6)  # 밀도 기반 클러스터링
    spectral = SpectralClustering(n_clusters=n_clusters, affinity="nearest_neighbors")
    ward = AgglomerativeClustering(n_clusters=n_clusters)
    affinity_propagation = AffinityPropagation(damping=0.9, preference=-200)  # 매우 느림
    clustering_algorithms = (
        # ('K-Means', two_means),
        # ('DBSCAN', dbscan),
        ('Hierarchical Clustering', ward),
        # ('Spectral Clustering', spectral),
        # ('Affinity Propagation', affinity_propagation),
    )

    plot_num = 1
    X_len = T_len
    # print("X_len : ", X_len)

    T_score = 0.0

    for j, (name, algorithm) in enumerate(clustering_algorithms):
        with ignore_warnings(category=UserWarning):
            algorithm.fit(X_reduced)
        if hasattr(algorithm, 'labels_'):
            y_pred = algorithm.labels_.astype(np.int)
        else:
            y_pred = algorithm.predict(X_reduced)
        y_pred += 1
        plt.subplot(len(clustering_algorithms), 2, plot_num)
        y_max = np.max(y_pred)
        # print("maxnum :", np.max(y_pred))
        colors = plt.cm.tab10(np.arange(20, dtype=int))
        # print("color : ", colors.shape)
        # s 포인트 크기, color 배열
        y_reduced = y_pred[:X_len]
        y_troll = []
        for i in range(0, len(X_troll)):
            y_troll.append(0)

        # print(y_pred[data_len:])

        for i in range(data_len, total_len):
            if y_pred[i] == 4:
                T_score += 100.0 / float(troll_len)
            elif y_pred[i] == 1:
                T_score += 80.0 / float(troll_len)
            elif y_pred[i] == 8:
                T_score += 75.0 / float(troll_len)
            elif y_pred[i] == 5:
                T_score += 0

        plt.scatter(X_reduced[:X_len, 0], X_reduced[:X_len, 1], s=2, color=colors[y_reduced])
        plt.scatter(X_reduced[X_len:, 0], X_reduced[X_len:, 1], s=2, color=colors[y_troll])
        plt.xticks(())
        plt.yticks(())
        plot_num += 1

    if pls_troll == True:
        T_score += 50
    elif pls_troll2 == True:
        T_score += 40
    print(T_score)
# 소환사 이름으로 op.gg에서 crawling
def Trim(summonerName):
    summonerName = summonerName
    source = requests.get("https://www.op.gg/summoner/userName=" + summonerName).text
    soup = BeautifulSoup(source, "html.parser")
    keywords = soup.select("div.MostChampionContent")

    keywords = [str(each_line.get_text().strip()) for each_line in keywords]
    if (len(keywords) == 0): return np.zeros(7 * 2).reshape(7, 2)
    keywords = keywords[1].split('\n')

    tmp = []
    # replace("찾을값", "바꿀값", [바꿀횟수])
    for i in range(len(keywords)):
        keywords[i] = keywords[i].replace('\t', '').replace('\n', '')
        if (len(keywords[i]) > 0):
            tmp.append(keywords[i])
    keywords = tmp
    tmp = []
    tmp2 = []
    cnt = 0
    for i in range(len(keywords)):
        tmp.append(keywords[i])
        cnt += 1
        if (cnt % 11 == 0 and i != 0):
            tmp2.append(tmp)
            tmp = []
            cnt = 0
    keywords = tmp2

    winRate = []
    for i in range(len(keywords)):
        tmp = []
        tmp.append(keywords[i][0])  # op.gg champ명
        tmp.append(keywords[i][9])  # 해당 챔피언 승률
        tmp.append(keywords[i][10])  # 해당 챔피언 플레이 판 수
        winRate.append(tmp)

    # 0번째 인덱스 : 승률
    # 1번째 인덱스 : 판 수
    most7PicksWinRate = []
    for i in range(len(winRate)):
        most7PicksWinRate.append([float(winRate[i][1].split("%")[0]), float(winRate[i][2].split(" ")[0])])
    if (len(winRate) < 7):
        for i in range(0, 7 - len(winRate)): most7PicksWinRate.append([0., 0.])
    return most7PicksWinRate


def foo(TROLL_NAME):
    API_HOST = 'http://52.78.119.98:4000'
    most7PicksWinRate = Trim(TROLL_NAME)
    N = 30  # 게임 갯수
    M = 9  # feature 갯수

    accountId = \
    json.loads(requests.get(API_HOST + '/api/user/riotSummoner', params={'summonerName': TROLL_NAME}).json())[
        'accountId']
    gameIndex = {'accountId': accountId, 'queue': '420', 'season': '13', 'beginIndex': '0', 'endIndex': str(N)}

    matches = json.loads(requests.get(API_HOST + '/api/user/riotMatchlist', params=gameIndex).json())['matches']

    ret = np.zeros(N * M).reshape(N, M)

    i = 0
    j = 0

    for row in matches:
        j = 0
        match = json.loads(requests.get(API_HOST + '/api/match/riotMatches', params={'gameId': row['gameId']}).json())

        ret[i][j] = match['gameDuration']
        j += 1

        # 몇 번째 인원인지
        idx = 0
        for p in match['participantIdentities']:
            if p['player']['accountId'] == accountId: break
            idx += 1

        stats = match['participants'][idx]['stats']

        ret[i][j] = int(stats['win'])
        j += 1

        ret[i][j] = int(match['teams'][int(idx >= 5)]['firstBaron'])
        j += 1

        # goldEarned, championLevel, teamKillAssists
        start = 0 if idx < 5 else 5
        teamGold = teamLevel = teamKillAssists = 0
        for k in range(start, start + 5):
            teamGold += int(match['participants'][k]['stats']['goldEarned'])
            teamLevel += int(match['participants'][k]['stats']['champLevel'])
            teamKillAssists += int(match['participants'][k]['stats']['kills'])

        ret[i][j] = int(stats['goldEarned']) - (teamGold / 5.0)
        j += 1

        ret[i][j] = int(stats['champLevel']) - (teamLevel / 5.0)
        j += 1

        ret[i][j] = int(stats['kills'])
        j += 1

        ret[i][j] = int(stats['assists'])
        j += 1

        ret[i][j] = int(stats['deaths'])
        j += 1

        ret[i][j] = (int(stats['kills']) + int(stats['assists'])) / max(1, teamKillAssists)
        j += 1

        i += 1

    tmp = np.zeros(N * 14).reshape(N, 14)
    for i in range(N):
        idx = 0
        for k in range(0, 7):
            for j in range(0, 2):
                tmp[i][idx] = most7PicksWinRate[k][j]
                idx += 1
    addedArray = np.hstack((ret, tmp))

    boolisWin = np.array([(ret[i][1] == 0) for i in range(0, N)])
    addedArray = addedArray[boolisWin]
    with open('trollData.pkl', 'wb') as f:
        pickle.dump(addedArray, f)

if __name__ == '__main__':
    argument = sys.argv
    foo(argument[1])
    Troll_score()

# plt.tight_layout()
# plt.show()

# kmeans 에서 k 값 설정하는 코드
# ks = range(1, 10)
# inertias = []
#
# for k in ks:
#     model = KMeans(n_clusters=k)
#     model.fit(X_reduced)
#     inertias.append(model.inertia_)
#
# plt.plot(ks, inertias, '-o')
# plt.xlabel('number of clusters, k')
# plt.ylabel('inertia')
# plt.xticks(ks)
# plt.show()
