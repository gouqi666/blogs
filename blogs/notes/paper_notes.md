---
title: 论文阅读笔记
date: 2021-11-22
sidebar: "auto"
categories:
  - notes
tags:
  - paper
---

## 此处记录一些我的个人论文阅读笔记

## Towards Deep Conversational Recommendations [链接](https://arxiv.org/pdf/1812.07617.pdf)
CRS的基础入门论文    
这篇论文提出了一个数据集和一个比较早期的会话推荐的基本框架。主要包含四个模块。    
- 第一个是当前对话的语义表示信息，用的Bi-gru来编码。  
- 第二个是情感分析模块，这部分主要是用于预测对话中出现的所有电影对应的评分（分为三个部分，seen,like,suggest)，用于构建后面的rating矩阵。  
- 第三个是推荐部分的自编码器，用第二部分的结果也是情感分析的结果去自编码rating矩阵，rating矩阵是由M(用户数)*V（电影数）构成，R（i)表示第i个用户对电影的评分。然后这里是个自编码过程，就是说用h(r(u)，seta)去预测r(u)，这里相当于原始的r(u)是不完全观测序列，也就是说用户不可能对所有电影都有评分，只有一部分，最后模型出来的结果是所有电影都有值。这里更新梯度也只对用户评价过的电影进行梯度更新，然后算所有用户的均方loss之和，还要加正则项，最后就得到了rating矩阵。也就是模型的预测输出。  
- 第四个是一个解码器，这里解码器用了两部分输入，一个是第三步中的rating矩阵，还有一部分是utterance的语义表示，然后解码的时候用了pointer network，就是说一部分生成，一部分复制电影名之类的。 
文章里面没有显式提到控制对话状态的模块，就是说它控制对话的走向完全是看rating矩阵。   

## Deep Reinforcement Learning for Dialogue Generation [链接](https://arxiv.org/pdf/1606.01541.pdf) 
这是比较早期的一篇文章，是一篇针对闲聊对话系统的。   
其主要目的是想要改善传统的seq2seq模型存在的两个问题： 
  1. 对话长度短，很容易陷入死循环。 
  2. 其输出的话语容易是些无意义的话语，如“呵呵”，“好”之类的无意义的话语。  
**其主要思想是将RL建模到对话系统中去，用reward去优化对话长度和内容。**
- Action  
  这里的action是指生成的reply，action空间是无限大的，因为可以reply可以是任意长度的文本序列。
- State  
  这里的state是指[pi,qi]，即上一轮两个人的对话表示。
- Policy  
  policy是指给定state之后各个action的概率分布。可以表示为：pRL(pi+1|pi, qi)
- Reward  
  reward表示每个action获得的回报，本文自定义了三种reward。最终reward由三部分加权所得。**此处reward是直接给出的，可以通过话语直接计算得到**,这里仅记录，具体公式可以查原论文。
  - Ease of Answering  
    生成的reply一定是容易被回答的。
  - Information Flow  
    生成的reply尽量和之前的不要重复。
  - Semantic Coherence  
    这个指标是用来衡量生成reply是否grammatical和coherent。如果只有前两个指标，很有可能会得到更高的reward，但是生成的句子并不连贯或者说不成一个自然句子。  

**训练**    
- 监督学习  
  将数据中的每轮对话当做target，将之前的两句对话当做source进行seq2seq训练得到模型，这一步的结果作为第二步的初值。  
- 强化学习（policy gradient）  
  - Mutual Information 模型训练部分  
    先在训练集训练seq2seq模型（with attention）。然后用训练完成的seq2seq模型参数初始化policy model，给定输入的state，生成一组候选回复，对于每一个候选回复，通过与训练的模型和计算其互信息（MMI）得分。所以reward的期望为：
    <img :src="$withBase('/notes/reward1.jpg')" alt="reward">

    **The mutual information score will be obtained from p(a|pi, qi) 和 p(qi|a) (两个seq2seq模型)**   
  - 仿真交互对话  
        <img :src="$withBase('/notes/reward2.png')" alt="reward2">

**结果**  
  在对话轮数和内容上相比baseline有很大提示，但还是会出现一些bad case（一直重复）  
**总结**    
本文提出了通过RL+SEQ2SEQ的模型来捕获未来性的reward和全局的信息，保证对话不会陷入循环或者无意义的回复，从而保持良好的可持续的交谈。创新性地提出了三种评估对话生成reward，并通过policy gradient的方法来训练policy model。

## SeqGAN: Sequence Generative Adversarial Nets with Policy Gradient [链接](https://arxiv.org/pdf/1609.05473.pdf) 
- 组会同学分享的一篇  
- 这篇模型结构看起来比较复杂，用了GAN和RL，RL用的是policy gradient。其具体模型是seq2seq的一个encoder。其大致思想是用强化学习生成sequence，动作空间是整个词表，然后这个是作为GAN的生成式模型。其reward是判别式模型给出的，判别式模型是一个CNN。其每次打分是针对一个序列打的分，当当前生成的序列没有结尾时，其会使用蒙特卡洛树搜索去填补后面的词直到序列结尾，这时候才开始进行打分，将得到的reward进行回传，然后用policy gradient 更新。  

    <img :src="$withBase('/notes/rl_gan1.png')" alt="rl_gan1">  
  