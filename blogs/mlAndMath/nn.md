---
title: 神经网络基础总结
date: 2021-04-06
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - nn
  - dl
---
当网络过深的时候，会出现训练集上精度反而下降的情况，其原因是后向传播的时候出了问题，一些变量的信息在传递中丢失了，解决这个问题出现了下面两种方式
## Residual Connection
  来源于ResNet, 将当前层网络输出和原始信息加起来，以便防止原始信息丢失，X2=H(x1) + x1。
## Dense Connection
  来源于DenseNet拼接当层网络输出和原始输入，以便防止原始信息丢失，X2=[H(x1),x1]。
Residual Connection可以保证维度，还可以加入门控机制，Dense Connection会增加维度，如何加有很多方式，需要去尝试。
## Network in Network 
 多个不同size的卷积核去提取不同维度的特征，最后进行拼接，一般与AutoMl（在某个层中尝试一些Network in Network,大的网络架构不变）结合，较为耗时
## gate
 一般用sigmoid函数作为门控机制，来控制输入，输出，记忆等等。
## attention
   通俗来说，attention机制就是，给定一组向量集合values，以及一个向量query，attention机制是一种根据该query计算values的加权求和的机制。google新定义的attention机制中定义Query,Key,Value,也就是通过计算query与各个key的内积，然后再进行softmax的方式来得到query和key对应的value的相似度，然后加权求和，key-value是一一对应的。比如query跟key的运算方式不一定是点乘（还可以是拼接后再内积一个参数向量），甚至权重都不一定要归一化，等等。attention的重点就是这个集合values中的每个value的“权值”的计算方法。  
   - seq2seq中的attenion机制  
    在encoder的过程中保留每个RNN单元的隐藏状态（hidden state）得到（h1……hN），然后对于decoder的每一个timestep，因为有此时decoder的输入和上一步的隐藏状态输出，所以我们可以得到当前步的隐藏状态。假设第t步的（根据上一步隐藏状态输出与当前输入得到的）隐藏状态为St，在每个第t步利用St和hi进行dot点积得到attention score（ai），也称为“相似度“或者“影响度”，或者“匹配得分”，然后这里(a1,a2,....an)再做一个softmax转化成概率分布，就是对应的attention分布。  
   - Multi-Head Attention  
     这个是Google提出的新概念，是Attention机制的完善。不过从形式上看，它其实就再简单不过了，就是把Q,K,V通过参数矩阵映射一下，然后再做Attention，把这个过程重复做hh次，结果拼接起来就行了，可谓“大道至简”了。具体来说就是最开始Q,K,V我们都不知道，但是可以用预测，即给定一个输入A，Q=Wq * A,K = Wk * A, V = Wv * A。headi=Attention(Q* Wqi,K* Wki,V* Wvi),     MultiHead(Q,K,V)=Concat(head1,...,headh) ，最后得到一个n × hd的序列。所谓“多头”（Multi-Head），就是只多做几次同样的事情（参数不共享），然后把结果拼接。所谓“多头”（Multi-Head），就是只多做几次同样的事情（参数不共享），然后把结果拼接。  
   - self attention  
   到目前为止，对Attention层的描述都是一般化的，我们可以落实一些应用。比如，如果做阅读理解的话，Q可以是篇章的向量序列，取K=V为问题的向量序列，那么输出就是所谓的Aligned Question Embedding。所谓Self Attention，其实就是Attention(X,X,X)，X就是前面说的输入序列。也就是说，在序列内部做Attention，寻找序列内部的联系。  
    思想：Self attention也叫做intra-attention在没有任何额外信息的情况下，我们仍然可以通过允许句子使用 self attention机制来处理自己，从句子中提取关注信息。
   - Position Embedding   
    只要稍微思考一下就会发现，这样的模型并不能捕捉序列的顺序！换句话说，如果将K,V按行打乱顺序（相当于句子中的词序打乱），那么Attention的结果还是一样的。这就表明了，到目前为止，Attention模型顶多是一个非常精妙的“词袋模型”而已。这问题就比较严重了，大家知道，对于时间序列来说，尤其是对于NLP中的任务来说，顺序是很重要的信息，它代表着局部甚至是全局的结构，学习不到顺序信息，那么效果将会大打折扣（比如机器翻译中，有可能只把每个词都翻译出来了，但是不能组织成合理的句子）。于是Google再祭出了一招——Position Embedding，也就是“位置向量”，将每个位置编号，然后每个编号对应一个向量，通过结合位置向量和词向量，就给每个词都引入了一定的位置信息，这样Attention就可以分辨出不同位置的词了。
## Memory
  。。。。memory
## activation
  常见的sigmoid，tanh，relu  
  比较新的有swish，mish，gelu  
  当出现梯度爆炸的时候，用Gradient clipping 可能有用，修剪梯度。在torch当中可以直接调在loss.backward()和optimizer.step()之间调用torch.nn.clip_grad_value(),常见的思想是根据值做clip，这个值需要自己尝试（如梯度大于5强行改成5，小于-5强行改成-5等等），还有一种是根据所谓的norm去修剪梯度，不建议用norm去修剪，因为可能某些层出现了梯度爆炸，但有些层没有出现梯度爆炸，结果修剪梯度过后可能导致那部分梯度失效了。    
## Batch Normalization
   当我们用relu函数的时候，最希望算出来的结果值在0附近，这样的话激活函数效果更好，但是往往有偏差，在层数多了以后就会有很大的偏差，因此需要Batch Normalization，因此应该假设两个参数，是真实分布的均值和标准差，因为真实的均值和方差我们是不知道的，因此只能当作参数去训练，因此它是一个可学习、有参数的网络层。
   训练：  
1.计算样本均值。  
2.计算样本方差。  
3.样本数据标准化处理（利用前面的均值和方差来变换输入X，得到下文中BN层的输入Xk）。  
4.进行平移和缩放处理。引入了这个可学习重构参数γ、β，（Y= Xk* γ + β）让我们的网络可以学习恢复出原始网络所要学习的特征分布。  
5. 在反向传播时也会优化γ、β等参数  
  测试：  
   测试的时候BN层直接使用训练好的参数γ、β，然后直接进行变化Y= X* γ + β即可。这里γ相当于训练数据的全局标准差、β相当于训练数据的全局均值，因此当网络有BN层和dropout层时，在测试时，必须调用model.eval()，这样才会使用固定的参数，dropout同理就不会抛弃神经元。  

   1. 根据Batch Normalization的初衷，BN层要放在激活函数前，但是后来发现放在激活函数后效果更好，一般现在都放在激活函数后。  
   2. 一般来说，dropout会将一部分神经元抛弃，这样对于我们计算BN层均值和标准差是有很大的影响的，所以现在一般BN层放在dropout前。也不一定，也有说BN和dropout一起用可能影响网络精度，具体需要尝试。   
## 其它normalization
   - layer normalization  
      由于batch一般较小，其均值和方差误差较大，因此有一种Layer Normalization认为同一层的神经元可能有相同的均值和方差。
   - Group Normalization  
      认为可能神经元某些维度上的均值方差不一样，因此只对某特定的维度做BN。
          
## 初始化
  大类有根据常数的初始化和随机初始化，常数初始化通常效果不佳，太固定了。随机初始化一般是均匀分布和正态分布。  
   - Xavier初始化和Kaiming 初始化  
       大体思想是认为神经网络的每一层方差大致不变，因此如果某一层神经元个数偏少，则有可能方偏小，则需要在初始化进行弥补。    
   
   自定义初始化可以定义一个函数，举个栗子：  
   ```python
   my_mlp = MLP() #实例化一个MLP
   def weights_init_uniform(m):
      classname = m.__class__.__name__
      if classname.find('Linear') != -1 :#比如只对线性层初始化
           m.weight.data.uniform_(0.0,1.0)
           m.bias.data.fill_(0)
   my_mlp.apply(weights_init_uniform)
   ```
## 学习率
 - 常见trick：
  1. 首先寻找ok的学习率，然后再调整其它参数
  2. 不同层采用不同的学习率(上下层训练程度不一样就采用不同学习率)
  3. 在最终阶段降低学习率，或者Babysit（要去观测整个训练，当发现网络在验证集上的精度已经不再提升了就开始逐步降低学习率）
 - 常见的学习率  
   Finetune: 1e-5,2e-5,5e-5  
   重新训练，没有公认的介定，一般从0.01开始尝试
 - warm up  
   由于刚开始训练的时候学习率太大会导致不稳定，但是有最新论文提出刚开始如果学习率太小也会不稳定，因此使用一个折中的办法warm up。warm up是学习率从小到大再到小。  
   学习率设定的栗子：
   
   ```python
     optimizer = optim.Adam([{'params':mlp.first_layer.parameters(),'lr':1e-2},
                                      'params':mlp.second_layer.parameters(),'lr':1e-3],lr = 2e-2)  # adm optimizer当中也是有信息的，如果需要连续训练，则也需要保存再读取，但是读取厚还是需要重新设置一下学习率
      torch.save(optimizer.state_dict(), 'optimizer.pt')
      optimizer2 = optim.Adam([{'params':mlp.first_layer.parameters(),'lr':1e-2},
                                      'params':mlp.second_layer.parameters(),'lr':1e-3],lr = 2e-2) 
      optimizer2.load_state_dict(torch.load('optimizer.pt'))          
      optimizer2.__dict__
   ```
 warm up的栗子：
          
   ```python
   optimizer = optim.Adam(params = mlp.parameters(),lr = 0)
   ......
   n_epoch = 3
   global_steps = 0
   warm_up_steps = 1000
   max_learninig_rate = 0.01
   for epoch in range(n_epoch):
        for batch in dataloader:
        global_steps += 1
        optimizer.zero_grad()
        x, y = batch
        predictions = mlp(x).squeeze()
        loss = criterion(predictions, y)
        loss.backward()
        optimizer.step()
        if global_steps < 1000:
            optimizer.param_groups[0]['lr'] = global_steps* max_learning_rate/warm_up_steps
       else:
            optimizer.param_groups[0]['lr'] = max_learning_rate# 这里大于1000步不变，实际也可以使学习率再降低
   ```
 ## 梯度累积
   当显存不够时，不能用较大的batchsize。  
   总结来说：梯度累加就是，每次获取1个batch的数据，计算1次梯度，梯度不清空，不断累加，累加一定次数后，根据累加的梯度更新网络参数，然后清空梯度，进行下一次循环。一定条件下，batchsize越大训练效果越好，梯度累加则实现了batchsize的变相扩大，如果accumulation_steps为8，则batchsize '变相' 扩大了8倍，是我们这种乞丐实验室解决显存受限的一个不错的trick，使用时需要注意，学习率也要适当放大。  
 ## 分布式训练
   多卡，传输数据
 ## 半精度训练
   float16
      