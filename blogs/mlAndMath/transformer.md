---
title: transformer
date: 2021-4-23
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - pytorch
  - dl
  - nlp
---

## 概述

transformer 是谷歌 2017 年在论文《Attention is All You Need》提出的，其模型是一个 seq2seq 架构，重点是模型中没有使用 rnn 或 lstm，而是完全用了 attention 机制，其 encoder 用了两个 sub-layer,一个是 Multi-head attention layer,还有一个是一个全连接层，对于输入的 word embedding，在进入网络之前对其进行了一个 positional encoding（用不同频率的 sine 和 cosine 函数直接计算，再与 word embedding 层相加），针对 multi-head attention，我在 nn 那篇博客中有提到一点，忘了可以去看看，对于 decoder，其基本架构与 encoder 差不多，但是多了一层 masked Multi-head attention, masked 是一个下三角矩阵，主要原因是在编码过程中，计算每个词的 attention score 的时候需要考虑该词前后的词的影响，但是解码过程中计算当前词的 attention score 只能考虑前面输出词的影响，不能将后面的词的影响也计算进去（不能预知未来），在这其中，还用了 residual connection 和 normalization。具体细节本来想详细总结一下，但是看网上已经有比较完整了讲解了，这里就不重复造轮子了，记录一下链接，忘了再去看看。

## 参考

[transformer 相关链接 1](https://zhuanlan.zhihu.com/p/42706477)  
[transformer 相关链接 2](https://blog.csdn.net/longxinchen_ml/article/details/86533005)
