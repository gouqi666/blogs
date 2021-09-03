---
title: HMM and CRF
date: 2021-09-03
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - ml
---

## 前言
&nbsp;&nbsp;最近自学了一下HMM 和CRF，由于太菜了自己也不是很懂，但是还是记了一些笔记，怕以后搞忘了，就在这里记录下来。 
## HMM
- 初识HMM
<img :src="$withBase('/notes/HMM1.jpg')" alt="HMM">    
<img :src="$withBase('/notes/HMM2.jpg')" alt="HMM">   
- HMM 三个基本问题   
<img :src="$withBase('/notes/HMM3.jpg')" alt="HMM">    
<img :src="$withBase('/notes/HMM4.jpg')" alt="HMM">    
<img :src="$withBase('/notes/HMM5.jpg')" alt="HMM">    
- HMM 相关博客  
  [hmm参考链接1](https://blog.csdn.net/xueyingxue001/article/details/52396494)   
  [hmm参考链接2](https://www.jianshu.com/p/c80ca0aa4213)

## CRF
- 初识CRF
<img :src="$withBase('/notes/CRF1.jpg')" alt="CRF">    
<img :src="$withBase('/notes/CRF2.jpg')" alt="CRF">    
<img :src="$withBase('/notes/CRF3.jpg')" alt="CRF">    
<img :src="$withBase('/notes/CRF4.jpg')" alt="CRF">    
<img :src="$withBase('/notes/CRF5.jpg')" alt="CRF">    
<img :src="$withBase('/notes/CRF6.jpg')" alt="CRF">  
- BiLstm 解析（注意求Z(x)的过程）  
 [BiLstm参考链接](https://blog.csdn.net/xiaofalu/article/details/104277734)
 - BiLstm源码

 ```python 
    import torch
    import torch.autograd as autograd
    import torch.nn as nn
    import torch.optim as optim

    torch.manual_seed(1)

    #  定义一些转换函数
    def argmax(vec):
        # return the argmax as a python int
        _, idx = torch.max(vec, 1)
        return idx.item()


    def prepare_sequence(seq, to_ix):
        idxs = [to_ix[w] for w in seq]
        return torch.tensor(idxs, dtype=torch.long) 


    # Compute log sum exp in a numerically stable way for the forward algorithm
    def log_sum_exp(vec):
        max_score = vec[0, argmax(vec)]
        max_score_broadcast = max_score.view(1, -1).expand(1, vec.size()[1])
        return max_score + \
            torch.log(torch.sum(torch.exp(vec - max_score_broadcast)))

    import pdb
    class BiLSTM_CRF(nn.Module):

        def __init__(self, vocab_size, tag_to_ix, embedding, hidden_dim):
            super(BiLSTM_CRF, self).__init__()
            self.embedding_dim = len(embedding[0])
            self.hidden_dim = hidden_dim
            self.vocab_size = vocab_size
            self.tag_to_ix = tag_to_ix
            self.tagset_size = len(tag_to_ix)
            self.word_embeds = nn.Embedding.from_pretrained(embedding)
            self.lstm = nn.LSTM(self.embedding_dim, hidden_dim // 2,
                                num_layers=1, bidirectional=True,batch_first = True)

            # Maps the output of the LSTM into tag space.
            self.hidden2tag = nn.Linear(hidden_dim, self.tagset_size)

            # Matrix of transition parameters.  Entry i,j is the score of
            # transitioning *to* i *from* j.
            self.transitions = nn.Parameter(
                torch.randn(self.tagset_size, self.tagset_size))

            # These two statements enforce the constraint that we never transfer
            # to the start tag and we never transfer from the stop tag
            self.transitions.data[tag_to_ix[START_TAG], :] = -10000   # 其它tag 到 START_TAG
            self.transitions.data[:, tag_to_ix[STOP_TAG]] = -10000    # STOP_TAG 到其它tag

            self.hidden = self.init_hidden()

        def init_hidden(self):
            return (torch.randn(2, 1, self.hidden_dim // 2),
                    torch.randn(2, 1, self.hidden_dim // 2))

        def _forward_alg(self, feats):
            # Do the forward algorithm to compute the partition function
            init_alphas = torch.full((1, self.tagset_size), -10000.)
            # START_TAG has all of the score.
            init_alphas[0][self.tag_to_ix[START_TAG]] = 0.

            # Wrap in a variable so that we will get automatic backprop
            forward_var = init_alphas

            # Iterate through the sentence
            for feat in feats:
                alphas_t = []  # The forward tensors at this timestep
                for next_tag in range(self.tagset_size):
                    # broadcast the emission score: it is the same regardless of
                    # the previous tag
                    emit_score = feat[next_tag].view(
                        1, -1).expand(1, self.tagset_size)
                    # the ith entry of trans_score is the score of transitioning to
                    # next_tag from i
                    trans_score = self.transitions[next_tag].view(1, -1)
                    # The ith entry of next_tag_var is the value for the
                    # edge (i -> next_tag) before we do log-sum-exp
                    next_tag_var = forward_var + trans_score + emit_score
                    # The forward variable for this tag is log-sum-exp of all the
                    # scores.
                    alphas_t.append(log_sum_exp(next_tag_var).view(1))
                forward_var = torch.cat(alphas_t).view(1, -1)
            terminal_var = forward_var + self.transitions[self.tag_to_ix[STOP_TAG]]
            alpha = log_sum_exp(terminal_var)
            return alpha

        def _get_lstm_features(self, sentence):
            self.hidden = self.init_hidden()
            embeds = self.word_embeds(sentence)
            lstm_out, self.hidden = self.lstm(embeds)
            lstm_feats = self.hidden2tag(lstm_out)
            return lstm_feats

        def _score_sentence(self, feats, tags):
            # Gives the score of a provided tag sequence
            score = torch.zeros(1)
            tags = torch.cat([torch.tensor([self.tag_to_ix[START_TAG]], dtype=torch.long), tags])
            for i, feat in enumerate(feats):
                score = score + \
                    self.transitions[tags[i + 1], tags[i]] + feat[tags[i + 1]]
            score = score + self.transitions[self.tag_to_ix[STOP_TAG], tags[-1]]
            return score

        def _viterbi_decode(self, feats):
            backpointers = []

            # Initialize the viterbi variables in log space
            init_vvars = torch.full((1, self.tagset_size), -10000.)
            init_vvars[0][self.tag_to_ix[START_TAG]] = 0

            # forward_var at step i holds the viterbi variables for step i-1
            forward_var = init_vvars
            for feat in feats:
                bptrs_t = []  # holds the backpointers for this step
                viterbivars_t = []  # holds the viterbi variables for this step

                for next_tag in range(self.tagset_size):
                    # next_tag_var[i] holds the viterbi variable for tag i at the
                    # previous step, plus the score of transitioning
                    # from tag i to next_tag.
                    # We don't include the emission scores here because the max
                    # does not depend on them (we add them in below)
                    next_tag_var = forward_var + self.transitions[next_tag]
                    best_tag_id = argmax(next_tag_var)
                    bptrs_t.append(best_tag_id)
                    viterbivars_t.append(next_tag_var[0][best_tag_id].view(1))
                # Now add in the emission scores, and assign forward_var to the set
                # of viterbi variables we just computed
                forward_var = (torch.cat(viterbivars_t) + feat).view(1, -1)
                backpointers.append(bptrs_t)

            # Transition to STOP_TAG
            terminal_var = forward_var + self.transitions[self.tag_to_ix[STOP_TAG]]
            best_tag_id = argmax(terminal_var)
            path_score = terminal_var[0][best_tag_id]

            # Follow the back pointers to decode the best path.
            best_path = [best_tag_id]
            for bptrs_t in reversed(backpointers):
                best_tag_id = bptrs_t[best_tag_id]
                best_path.append(best_tag_id)
            # Pop off the start tag (we dont want to return that to the caller)
            start = best_path.pop()
            assert start == self.tag_to_ix[START_TAG]  # Sanity check
            best_path.reverse()
            return path_score, best_path

        def neg_log_likelihood(self,inputs_ids,label,text_lengths,mask):
            batch_feats = self._get_lstm_features(inputs_ids)
            total_score = torch.zeros(1)
            batch_size = list(inputs_ids.size())[0]
            for feats,lab,text_len in zip(batch_feats,label,text_lengths):
                feats = feats[:text_len]
                tags = lab[:text_len]
                forward_score = self._forward_alg(feats)
                gold_score = self._score_sentence(feats, tags)
                total_score += forward_score - gold_score
            return total_score / batch_size

        def forward(self,inputs_ids,label,text_lengths,mask):  # dont confuse this with _forward_alg above.
            # Get the emission scores from the BiLSTM
            batch_feats = self._get_lstm_features(input_ids)
            batch_score = torch.tensor([])
            batch_tags = []
            for feats,text_len in zip(batch_feats,text_lengths):
            # Find the best path, given the features.
                feats = feats[:text_len]
                score, tag_seq = self._viterbi_decode(feats)
                batch_score = torch.cat((batch_score,score.unsqueeze(0)),0)
                batch_tags.append(tag_seq)
            return batch_score, batch_tags
## 训练部分，具体需要自己修改一下，此处只是放了之前的项目代码片段
global_step = 0
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu') # 
model.to(device)
print(device)
model.train()
for epoch in range(epoches):
    for batch in train_dataloader:
        input_ids,label,text_lengths,mask = batch
        optimizer.zero_grad()
        loss = model.neg_log_likelihood(input_ids,label,text_lengths,mask)
        print(loss)
        loss.backward()
        optimizer.step()
        scheduler.step()
        global_step += 1
        if global_step != 0 and global_step % 20 == 0:
            print('epoch:%d,global_step: %d, loss:%.5f' % (epoch,global_step,loss))
            batch_score,batch_tags = model.forward(input_ids,label,text_lengths,mask)
            print('orgin-tag:',label[0][:text_lengths[0]])
            print('predict-tag:',batch_tags[0])
 ```