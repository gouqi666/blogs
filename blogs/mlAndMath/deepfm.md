---
title: fm系列
date: 2021-4-26
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - pytorch
  - dl
---

## FM

FM（Factorization Machine）主要是为了解决数据稀疏的情况下，特征怎样组合的问题。在 LR 的基础上，考虑二阶组合特征，但这样会出现一个问题，由于对类别特征进行 one-hot 编码后，当类别特征变量比较多的情况下，编码后会产生高维特征，这导致我们很难找到一组 xi,xj,使得 xi _ xj 不为 0，因为对于 xi _ xj 为 0 的项，在梯度更新期间梯度为 0，因此也无法进行梯度更新来求解参数。而 FM(因子分解机)的工作就是将 Wij 替换为两个向量的乘积 Vi,Vj ，进而缓解了稀疏特征对模型求解的困难。具体的公式推导见[链接](https://zhuanlan.zhihu.com/p/89639306)

## FFM

FFM(Field-aware Factorization Machines),是在 FM 的基础上引入的 field 的概念，每一维特征（feature）都归属于一个特定和 field，field 和 feature 是一对多的关系。在 FM 算法中，不同的特征会被认为是相同的影响，会使用相同参数的点积来计算。FFM 模型认为 Vi 不仅跟 Xi 有关系，还跟与 Xi 相乘的 Xj 所属的 Field 有关系，即 Vi 成了一个二维向量 V(f\*k)，K 是隐向量长度，f 是 Field 的总个数。设样本一共有 n 个特征, f 个 field，那么 FFM 的二次项有 nf 个隐向量。而在 FM 模型中，每一维特征的隐向量只有一个。FM 可以看作 FFM 的特例，是把所有特征都归属到一个 field 时的 FFM 模型。   
 [FFM 相关链接 1](https://blog.csdn.net/baymax_007/article/details/83931698)

## DeepFM

DeepFM 是结合的低维特征和高维特征的，其中其低维特征用的是 FM layer，高维特征用 DNN 提取。这里最主要的是对数据降维，因为输入的 one-hot 编码维度很高而且稀疏，这里要分而治之，对每个 field 进行降维再 concat。
[DeepFM 参考](https://www.jianshu.com/p/6f1c2643d31b)

## XDeepFM

还是和 deepFM 基本架构一致，右侧是 DNN，不过左侧改成了 CIN（Combination with Implicit Networks），其具体方式参加下面链接，非常详细了可以说是，图文并茂，也可参见原论文。

[XDeepFM 参考](https://www.jianshu.com/p/645b83a46182)
