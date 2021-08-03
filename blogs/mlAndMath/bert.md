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
  双向训练，与双向lstm的双向不同，lstm的双向交互其实在最后面的正向结果和反向结果交互，而bert的双向是在训练过程中就交互了，通过mask，然后让其前面的词和后面的词都参与预测，这才是bert的双向  
  两个任务，一个预测被mask的词，还有一个是NSR，分句，就是区分不同的句子。  
  输入有三个 input_ids,token_type_ids,position_ids。  
  给出一个demo，使用bertModel，然后用的数据集是IMDB数据集。[github链接](https://github.com/gq15760172077/pytorch/blob/master/bert-imdb.ipynb)


