---
title: 简单认识Bert
date: 2021-05-11
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - pytorch
  - dl
---

## 深度迁移学习
- 目的 
   - 解决word Embedding的不足， word Embedding最大的不足是无法解决不同词在不同的语境中编码一致的问题  
   - 充分利用无标注数据 （希望不需要人去标注）  
   - 使用较深的模型 （之前NLP的网络不会太深）  
   - 训练的时候用更少的数据（从其它任务迁移出一部分特征作为预训练）  
- ELMo  
  大致是先经过character embedding，再经过convolution，最终输入到一个双向LSTM中，其用法主要是拿出LSTM中的隐藏层，然后与word embedding去作拼接或求和等再输入到原本需要用到word embedding的位置  
  解决了前面三个目的（除了不能使用较深的模型）。  
- BERT
  


