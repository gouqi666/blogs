---
title: entity Embedding
date: 2021-3-30
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - pytorch
  - dl
---

## 结构化数据挖掘
- 结构化数据就是指表格数据
> 每列是一个变量，可离散也可连续。
> 结构化数据占大多数，非结构化数据可以转化为结构化数据。
- 传统的结构化数据
> 取决于业务理解
> 探索性分析是常态 
> 90%时间花费在清洗和探索性分析上
- 一些实际问题
> 高维稀疏变量（影响一个问题的因素是多维的）
> 较差的变量质量


- pandas  
set_index 也可以设置成多层索引，这个是对于行的索引，行的索引用loc或者iloc
MultiIndex 也可以设置成多层索引，这个是对于列的索引，列的索引可以直接df[][]选取
```python
df = pd.DataFrame([
     [1, 2, 3, 4],
     [5, 6, 7, 8],
     [9, 10, 11, 12]
]).set_index([1,2]).rename_axis(['a','b'])
df.columns = pd.MultiIndex.from_tuples([
   ('c', 'e'), ('c', 'f')
 ], names=['level_1', 'level_2'])
# df['c','e']
# df.iloc[2]
```

- matplotlib.pyplot  
直方图，plt.hist(data,num_bins,Density =True)  
散点图，plt.plot(x,y)  
boxplot, plt.boxplot(data1,data2))，比较两组数据media，25%,75%，以及异常值  

- Target Mean Encoding  
用这种方式编码，可以减少维度，如三分类需要增加三维数据，target-mean只需要增加一维。用对应组的目标均值来作为编码
 df.groupby([A, B])[C].agg(func)
 
- categorical encoder
pip install category_encoders,包括以下15种编码方法
> Backward Difference Coding  
> BaseN  
> BinaryCatBoost Encoder  
> HashingHelmert Coding  
> James-Stein Encoder  
> Leave One Out  
> M-estimate  
> One Hot  
> Ordinal  
> Polynomial Coding  
> Sum Coding  
> Target Encoder 
> Weight of Evidence  
```python
import category_encoders as ce
encoder = ce.BackwardDifferenceEncoder(cols=[...])
encoder = ce.BaseNEncoder(cols=[...])
encoder = ce.BinaryEncoder(cols=[...])
encoder = ce.CatBoostEncoder(cols=[...])
encoder.fit(X, y)
X_cleaned = encoder.transform(X_dirty)


df = pd.DataFrame({'ID':[1,2,3,4,5,6],
                   'RATING':['G','B','G','B','B','G']}) 
encoder = ce.BinaryEncoder(cols=['RATING']).fit(df)
# 编码数据
df_transform = encoder.transform(df)
```

##  连续变量离散化
 1. uniform
 2. quantile（分位数，先排序，再分类）
 ```python
    DataFrame.quantile(q=0.5, axis=0, numeric_only=True, interpolation=’linear’)
```
 3. 基于聚类,无监督
 kmeans, 
 4. 基于树
- entity embedding  
one hot 乘以一个矩阵的形式，一般应用于离散变量的embedding，对于连续变量，其离散化必然会丢失一些东西，但也可以通过某种方式加回来。
- 连续变量embedding的一些trick
    1.  首先对连续变量的取值范围进行分组，如1-10000分20组，numberOfBins,
    2.  计算每个组中对应的Centroid（用Ci表示），这里Ci可以是平均值或者median。
    3. 对于输入X，计算其相对于每个分组的权重$W_{i}$，$\epsilon$为一个非常小的常数，防止分母为0。  
    $$W_{i} = softmax(\frac{1}{\left | X - C_{i} \right|  + \epsilon})$$  
    4.根据对应权重乘以对应组的$E_{i}$（embedding vector）即可算出当前X的词向量。  
    $$V = \sum_{i=1}^N W_{i} * E_{i}$$  
 代码实现：[github链接](https://github.com/gq15760172077/pytorch/blob/master/Tutorials%20on%20Entity%20Embedding.ipynb)

