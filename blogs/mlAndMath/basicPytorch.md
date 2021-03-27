---
title: pytorch 基础知识记录
date: 2021-3-27
sidebar: "auto"
categories:
  - mlAndMath
tags:
  - pytorch
  - dl
---

 - torchtext,torchvision,torchaudio分别是torch提供的分别关于自然语言处理，视觉以及语音方面的三个库，包含了一些相关的数据集，可以直接下载。
 - NLTK（Natural language toolkit）是常见的自然语言处理工具包，包含了一些分词模块，如（‘punk’）, 其中nltk_data不好下载，可以通过离线的方式进行下载然后放置对应目录。
 - torchteext采用声明式方法加载数据，需要先声明一个Field对象，这个Field对象指定你想要怎么处理某个数据,each Field has its own Vocab class。
 - - -
 
## Field相关参数如下：
> squential：数据是否为序列数据，默认为Ture。如果为False，则不能使用分词。  
use_vocab：是否使用词典，默认为True。如果为False，那么输入的数据类型必须是数值类型(即使用vocab转换后的)。  
init_token：文本的其实字符，默认为None。  
eos_token：文本的结束字符，默认为None。  
fix_length：所有样本的长度，不够则使用pad_token补全。默认为None，表示灵活长度。  
tensor_type：把数据转换成的tensor类型 默认值为torch.LongTensor。  
preprocessing：预处理pipeline， 用于分词之后、数值化之前，默认值为None。  
postprocessing：后处理pipeline，用于数值化之后、转换为tensor之前，默认为None。  
lower：是否把数据转换为小写，默认为False；  
tokenize：分词函数，默认为str.split  
include_lengths：是否返回一个已经补全的最小batch的元组和和一个包含每条数据长度的列表，默认值为False。  
batch_first：batch作为第一个维度；  
pad_token：用于补全的字符，默认为<pad>。  
unk_token：替换袋外词的字符，默认为<unk>。  
pad_first：是否从句子的开头进行补全，默认为False；  
truncate_first：是否从句子的开头截断句子，默认为False；  
stop_words：停用词；  

- Tokenize
> Field 中的参数tokenize必须是一个函数，其作用是给定一个字符串，该函数以列表的形式返回分词的结果。一般常用的可以使用nltk.tokenize中的word_tokenize。

- Vocab
> Field对象可以通过调用build_vocab（）方法来生成一个内置的Vocab对象。build的时候可以指定MAX_VOCAB_SIZE，以及预训练好的vectors，
 
 ```python
print(type(TEXT.vocab.freqs)) # freqs是一个Counter对象，包含了词表中单词的计数信息
print(TEXT.vocab.freqs['at'])
print(TEXT.vocab.itos[1]) # itos表示index to str
print(TEXT.vocab.stoi['<unk>']) # stoi表示str to index
print(TEXT.vocab.unk_index)
print(TEXT.vocab.vectors) # 词向量
```
**举个栗子**
```python
TEXT = Field(tokenize = tokenizer, include_lengths = True)
LABEL = LabelField(dtype = torch.float)
train_data, test_data = datasets.IMDB.splits(TEXT, LABEL)
train_data, valid_data = train_data.split(random_state = random.seed(SEED))


MAX_VOCAB_SIZE = 25000
TEXT.build_vocab(train_data,       
                        max_size = MAX_VOCAB_SIZE,      
                        vectors = "glove.6B.300d",    
                        unk_init = torch.Tensor.normal_)
                        LABEL.build_vocab(train_data)
                      )
```
## DataLoader
DataLoader 是 torch.utils.data下的工具包，用于方便训练或测试的时候数据迭代。
```python
transform=transforms.Compose([transforms.ToTensor(),              transforms.Normalize((0.5,0.5,0.5),0.5,0.5,0.5))]                                                     )
trainset = torchvision.datasets.CIFAR10(root='./data', train=True, 
download=True,transform=transform)
trainloader = torch.utils.data.DataLoader(trainset,batch_size=4,shuffle=True,num_workers=2)
testset = torchvision.datasets.CIFAR10(root='./data',train=False,download=True,transform=transform)
testloader = torch.utils.data.DataLoader(testset,batch_size=4,shuffle=False,num_workers=2)
```
也可以用BucketIterator代替，BucketIterator 是torch.legacy.data下的包

```python
train_iterator, vaild_iterator, test_iterator = data.BucketIterator.splits(   
                                (train_data, valid_data, test_data),   
                                batch_size = BATCH_SIZE, 
                                sort_within_batch = True,  
                                device = device
)
```

## LSTM 
```python
nn.LSTM(embedding_dim,         # embdding的维度
            hidden_dim,          
            num_layers=n_layers,   # LSTM的层数，一般不超过三层
            bidirectional=bidirectional,#是否双向LSTM ，True-> 是    
            dropout = dropout
            )
```
注意：当bidirectional为True的时候喂入数据的时候必须使用pack_padded_sequence和pad_packed_sequence，
这两个函数位于rorch.nn.utils.rnn下。其主要作用是将三维的输入数据去掉padding后变为二维，同时再加上对应的batch_size，这个batch_size是对应的数据中未填充padding的词个数。还要注意pack_padded_sequence输入的lengths必须降序排列。
这个可以在构造dataloader迭代器的时候就完成。（将batch这一维度去掉，从而拼接成二维数据，再用一个数组batch_size表示每个句子中有多少个时间步（即不考虑padding的词，这样可以减少对面padding的运算））
```python
packed_embedded = nn.utils.rnn.pack_padded_sequence(embedded, text_lengths)
packed_output, (hidden, cell) = self.rnn(packed_embedded)
output, output_lengths = nn.utils.rnn.pad_packed_sequence(packed_output)
```
注意LSTM中有一个参数叫batch_first，当它为True的时候，batch_size在第一个维度。默认为False,因此batch_size一般位于第二个维度，即常规的LSTM输入数据的维度应该是[seq_len, batch_size,input_size],其中input_size一般是输入的时候的embedding_dim，喂入数据的时候需要注意。
```python
x = torch.randn(5, 3, 10)
# 可以理解为：batch_size = false的时候， 1个batch中有3个句子，每个句子5个单词，每个单词用10维的向量表示；而句子的长度是不一样的，所以seq_len可长可短，这也是LSTM可以解决长短序列的特殊之处。只有seq_len这一参数是可变的。
```
## 一个简单的文本分类项目
 数据集用imdb数据，用nltk中tokenize进行分词。词向量用的"glove.6B.300d"  
  [github链接](https://github.com/gq15760172077/pytorch)