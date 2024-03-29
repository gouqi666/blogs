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
  
## Interactive Path Reasoning on Graph for Conversational Recommendation [链接](https://arxiv.org/pdf/2007.00194.pdf)  
- 这是关于CRS的一篇文章，作者主要贡献有两个  
  - 率先将graph引入到crs中，将对话过程看作是沿着图中边的移动，从用户节点最终移到商品节点。  
  - 提出了一个CPR（conversational path reasoning），reason就是指有理可循，然后自己实现了一个简单simple CPR并与之前的crs对比了下。  
- 其CPR主要架构如下：   
  - graph就是知识图谱，三元组，节点类型有用户，商品，属性。这里并没有区分关系类型，就是节点之间有关系就有一条边。  
  - 推荐的过程就是从当前用户节点开始，在每一次询问属性的过程中用户给出reject或者accept，然后根据其反馈在图中进行边的移动，最终直到进行推荐商品。   
  - 当前对话是否询问属性和推荐是由RL学习的，这里RL并不是选择属性而是判断应该继续询问还是推荐商品，因此其动作空间大小缩小到2，RL使用的是DQN，其状态表示由两部分构成，一部分是对话历史，另外一部分是候选集的大小，他们认为当候选集小的时候进行推荐更精确。其奖励也分了很多部分，论文中有提到，此处不写了。
  - 选择属性询问时，并不是将所有属性作为候选集，而是将图中与当前属性直接相连的其它属性作为候选集，从而缩小了候选空间的大小。  
  - 具体实现SCPR时，其定义了属性打分函数和商品打分函数，商品打分用的是一个类似于FM的算法，考虑了用户与商品和商品和其属性之间的交互。属性打分函数用的是最大熵函数，其公式如下：  
      <img :src="$withBase('/notes/crs1.png')" alt="crs1">  
      **商品打分函数**  
  上面公式中的u,v,p都是用户，商品，属性对应的embedding，这个embedding怎么得出来的呢？ 它是用的一个叫pair-wise的方式训练的，与其相对应的是point wise，他们的区别是point wise只考虑了单个输入，计算得分并计算loss，而pair wise考虑的是两个输入，其loss通过衡量这两个输入的得分差异而得出的。这里训练的目标是让上式得分函数中有交互的商品的得分要大于没有交互过的商品，所以其很适合pair-wise，如输入的两个一个是商品与用户有过交互，另一个是商品与用户没有交互过，那么显然前一个得分应该高于后一个，如果没有高于，则需要进行梯度下降更新。  
      <img :src="$withBase('/notes/crs2.png')" alt="crs2">  
      **属性打分函数**  
  - 数据集用的是 LastFM for music artist recommendation and Yelp for business recommendation  
  - 其提出了很多方式来论证它的方法的好坏和与之前的方法的对比，crs的评价指标大致有两个，success rate 和 average turn，成功率越高和平均对话轮数越少，推荐系统质量越高。     

**总结**  
这篇文章感觉东西非常多，很多我也只停留在表面认识上，没有动手实践过，但是可以看出来它是着重于对话策略的选取和推荐部分的，其基本上没有提到传统的对话系统中的一些架构，比如 NLU,NLG等等。
  
## Interactive Recommender System via Knowledge Graph-enhanced Reinforcement Learning [链接](https://arxiv.org/pdf/2006.10389.pdf)  
IRS感觉与CRS不同的点在于CRS一般是先询问属性再进行推荐，最后的准确率是看最终推荐的商品是否准确，CRS是每一轮都推荐，然后由用户给反馈，如点击商品，广告等，然后就更新策略，继续下一轮推荐，直到达到最大交互轮数，有点类似于抖音，今日头条的感觉。  
然后这篇文章也是用了graph和RL，但是和上一篇文章有区别。  
- graph中求embedding用了GCN，GCN主要思想就是三步，发射，接收，变换，发射是指从当前节点向其相邻节点发射自身信息，接收是指将邻居节点的特征信息聚合起来（可以是简单的embedding相加），然后聚集后的信息做非线性变换，增加模型的表达能力，然后送入线性层分类。然后用这种方式得到每个item的embedding。   
- 然后每轮对话的状态的表示用的是之前的用户点击过的item embedding的聚合，这里用的GRU，也就是说它将item按照序列先后顺序输入到GRU中，最终会得到GRU的hidden states作为当前轮用户的embdding，然后作为DQN的状态输入。    
- 缩小候选集的空间，这里认为RL的候选空间比太大了，就是要推荐的商品太多了，不可能完全考虑到，因此这里就用graph缩小了动作空间，只考虑在图上与之前的item有关系的item节点。然后再送入GCN中等到候选集节点的embedding，把这个当作候选空间。  
- DQN用两种，一个是dueling dqn，一个是double dqn。 其训练是在已有数据上进行off-line 训练，user simulator是自己构建的。其reward也是由用户模拟器给出的，这部分也是user simulator预测出来的。  
**总结**   
IRS和CRS还是不一样的，然后感觉graph和RL每篇都在用，虽然用法不一定完全相同，这里的graph embedding不是通过KGE得出的而是GCN得出的，然后是用的DQN而不是policy gradient。  

## vae(variational autoencoder)    
  vae就是变分自编码器，是从ae（自编码器）上改进的，主要思想提示有下面几个：   
  1. 变分：我们能拿到的真实数据是一个一个的离散值，so其分布我们不好找，也不一定找得到。因此用一个分布来衡量数据，这里采用正态分布，就是说要从输入数据中得到数据的均值和方差，这里的均值和方差都是通过神经网络拟合出来的，然后就可以得到数据的一个分布了，然后其生成的时候不是直接用的分布，是用的从分布中采样的数据，然后通过解码器生成结果，然后与原始结果对比，这部分有一个MSE误差。  
  2. 噪声：如果单纯按照上面那样去实现，会很快发现vae退化成了ae，因为模型为了让结果拟合得更好，肯定会尽量趋近于让方差为0，而方差为0也就意味着没有随机性了，不管怎么采样都只能得到一个结果，这肯定不是生成式模型想看到的，故我们需要添加点噪声，这部分可以当作是噪声，就是我们强行让预测出来的分布向标准正态分布看齐，这样就防止了噪声为零，同时保证了模型具有生成能力，因此我们还有一部分误差是衡量两个分布差异带来的误差，衡量分布差异一般可以用KL散度去衡量，一个是网络拟合得到的分布，一个是标准正态分布。因此总的loss是两部分求和。  kl 散度loss如下图所示：  
       <img :src="$withBase('/notes/vae3.png')" alt="vae3">  
  3. 一个小技巧是重参数（Reparameterization Trick）  
    就是我们要从 p(Z|Xk) 中采样一个 Zk 出来，尽管我们知道了 p(Z|Xk) 是正态分布，但是均值方差都是靠模型算出来的，我们要靠这个过程反过来优化均值方差的模型，但是“采样”这个操作是不可导的，而采样的结果是可导的，所以利用下面的性质可以将采样转化一下，从而可以让采样的结果参与梯度下降了。
         
     <img :src="$withBase('/notes/vae1.png')" alt="vae1">  
    
  4. CVAE（条件VAE）  
    这里的条件是指一些输入控制的变量，如情感类别，时态等等，往往我们是希望能够实现控制某个变量来实现生成某一类图像。CVAE 不是一个特定的模型，而是一类模型，总之就是把标签信息融入到 VAE 中的方式有很多，目的也不一样。 一种比较简单的实现方式是将条件融入进KL散度loss，即让每一类都有一个专属的均值，这个均值可以让模型自己训练出来，然后在计算kl loss的时候用当前样本采样出来的均值减去对应样本所属类的均值，如下图所示：   
         <img :src="$withBase('/notes/vae2.png')" alt="vae2">  

## Generating Sentences From a Continuous Spaces（VAE在nlp中应用的开山之作）  
  这篇文章是vae在nlp中使用的开山之作，其动机是为了弥补在传统的RNNLM结构中缺少一些global feature（或者可以说是sentence representation），因为之前有人指出RNN由于是逐词生成，模型更容易注意词之间的关系，而容易忽略更高层的关系，如语义，主题等等高层信息，这就导致了RNN不适合generate特定的sentence。  
  - 其Loss 的组成还是和 VAE 一样。具体模型上，encoder 和 decoder 都采用单层的 LSTM，decoder 可以看做是特殊的 RNNLM，其 initial state 是这个 hidden code z（latent variable），z 采样自 Gaussian 分布 G，G 的参数由 encoder 后面加的一层 linear layer 得到。这里的 z 就是作者想要的 global latent sentence representation，被赋予了先验 diagonal Gaussians，同时 G 就是学到的后验。  
  - 模型很简单，但实际训练时有一个很严重的问题：KL 会迅速降到 0，后验失效了。原因在于，由于 RNN-based 的 decoder 有着非常强的 modeling power，直接导致即使依赖很少的 history 信息也可以让 reconstruction errors 降得很低，换句话说，decoder 不依赖 encoder 提供的这个 z 了，模型等同于退化成 RNNLM（摊手）。
    提出了两个解决办法：
    - KL cost annealing  
      作者引入一个权重 w 来控制这个 KL 项，并让 w 从 0 开始随着训练逐渐慢慢增大。作者的意思是一开始让模型学会 encode 更多信息到 z 里，然后随着 w 增大再 smooth encodings。其实从工程/代码的角度看，因为 KL 这项更容易降低，模型会优先去优化 KL，于是 KL 很快就降成 0。但如果我们乘以一开始很小的 w，模型就会选择忽视 KL（这项整体很小不用降低了），选择优先去降低 reconstruction errors。当 w 慢慢增大，模型也慢慢开始关注降低 KL 这项了。这个技巧在调参中其实也非常实用。
    - Word dropout  
      既然问题是 RNN-based 的 decoder 能力太强，那我们就来弱化它好了。具体方法是把 input 的词替换成 UNK（我可能是个假的 decoder），模型被迫只能去多多依赖z。当然保留多少 input 也需要尝试，我们把全都不保留的叫做 inputless decoder，实验表明，inputless VAE 比起 inputless RNN language model 不知道好到哪里去了。

  - 受到 GAN 的启发，作者还提出了一个 Adversarial evaluation，用一半真一半假的数据作为样本训练出一个分类器，再对比不同模型生成的句子有多少能骗过这个分类器，这个 evaluation 被用在 Imputing missing words 这个任务上，VAE 的表现同样比 RNNLM 出色。    
  
我的理解：  vae的具体应用在这篇中没有怎么提到，我感觉它主要是在做可控文本生成，如给你一句话，生成一句与它相似的话，这里的方差就可以很好的做到泛化性。它还说能够进行Imputing missing words，我看了论文中具体的那部分，但是没怎么看懂，它说vae比RNNLM在缺失词补全上效果更好，因为其有了一个global latent representation，而且它用了word dropout，即把decoder的输入一部分替换成UNK，这样更能产生一些有意义的补全结果，而不是像RNN一样产生一些无意义的结果。

## Learning Discourse-level Diversity for Neural Dialog Models using Conditional Variational Autoencoders

