---
title: C++lambda 表达式和自定义哈希函数
date: 2020-12-14
sidebar: "auto"
categories:
  - notes
tags:
  - c++
---

## 写在前面

&nbsp;&nbsp;最近实习没啥工作，趁这段时间复习一下 python，之前学的 python 都断断续续的，而且中间夹杂了很多框架的 api，对 python 原生以及一些基础库不是很熟悉，还有一部分原因是写 python 的时候比较少，大多数时候是写项目的时候会用一点，如果能尝试用 python 刷题的话，那肯定熟悉得更快（试过，很痛苦...）。这里主要记录下与数据分析相关的基础模块，就是 Numpy, Pandas, Matplotlib。其中借鉴了网上很多博客，本篇先来Numpy！

## Numpy

&nbsp;&nbsp;Numpy 是科学计算库,是一个强大的 N 维数组对象 ndarray，是广播功能函数。其整合 C/C++.fortran 代码的工具 ，更是 Scipy、Pandas 等的基础。  
**ndarray 基本属性**

- .ndim ：维度
  -.shape ：各维度的尺度 （2，5）
- .size ：元素的个数 10
- .dtype ：元素的类型 dtype(‘int32’)
- .itemsize ：每个元素的大小，以字节为单位 ，每个元素占 4 个字节

**ndarray 数组的创建**

- np.arange(n); 元素从 0 到 n-1 ndarray 类型
- np.arange(start,end,step);
- np.ones(shape);生成 shape 类型的全 1 数组
- np.zeros(shape,dtype = np.int32); int32 型的全 0
- np.full(shape,val); 全为 val
- np.eye(n); 单位矩阵
- np.ones_like(a); 按数组 a 的形状（维度）生成全为 1 的数组
- np.zeros_like(a); 同理
- np.full_like (a, val); 同理
- np.linspace(start,end,num,endpoint...);根据起止数据等间距地生成数组,endpoint 表示 end 是否作为生成的元素。
  eg..  
  np.linspace（1,10,4） [1,4,7,10]  
  np.linspace（1,10,4, endpoint = False）[1. 3.25 5.5 7.75]
- np.concatenate(arrays... , axis):拼接数组，axis=0 时按列拼接（列不变，行增加），axis=1 时按行拼接（行不变，列增加）

**ndarray 数组的维度变换**

- .reshape(shape) : 不改变当前数组，依 shape 生成
- .resize(shape) : 改变当前数组，依 shape 生成
- .swapaxes(ax1, ax2) : 将两个维度调换  
  ax1 与 ax2 代表两个维度，从 0 开始。
  如一个二维数组，a.swapaxes(0,1)相当于转置，a.T 或者 a.transpose()
- .transpose(axis...)：不带参数时相当于转置，带了参数相当于各个维度对应的转换，如一个三维数组 a，a.transpose(2,1,0)，相当于第二个维度转为第 0 个维度，第一个维度不变，第 0 个维度转化为第二个维度
- .flatten() : 对数组进行降维，返回折叠后的一位数组

**数组的类型变换**

- 数据类型的转换 ：a.astype(new_type) : eg, a.astype (np.float)
- 数组向列表的转换： a.tolist()
- 数组的索引和切片
  > 一维数组切片： a[起始编号：终止编号（不含）： 步长]  
  > 多维数组索引: a[1, 2, 3] 表示 3 个维度上的编号， 各个维度的编号用逗号分隔。  
  > 多维数组切片: a [：，：，：：2 ] 缺省时，表示从第 0 个元素开始，到最后一个元素

**数组的运算**

- np.abs(a) np.fabs(a) : 取各元素的绝对值
- np.sqrt(a) : 计算各元素的平方根
- np.square(a): 计算各元素的平方
- np.log(a) np.log10(a) np.log2(a) : 计算各元素的自然对数、10、2 为底的对数
- np.ceil(a) np.floor(a) : 计算各元素的 ceiling 值， floor 值（ceiling 向上取整，floor 向下取整）
- np.rint(a) :返回与其最近的哪一个整数，也是四舍五入，注意，0.5 的时候会有问题， 4.5 的结果是 4
- np.round(a):各元素 四舍五入，注意，0.5 的时候会有问题， 4.5 的结果是 4
- np.modf(a) : 将数组各元素的小数和整数部分以两个独立数组形式返回，将每个元素的小数和整数分开，5.6 会拆成 5. 和 .6
- np.exp(a) : 计算各元素的指数值
- np.sign(a) : 计算各元素的符号值 1（+），0，-1（-）
- np.maximum(a, b) np.fmax() : 比较（或者计算）元素级的最大值
- np.minimum(a, b) np.fmin() : 取最小值
- np.mod(a, b) : a 中所有元素对 b 取模
- np.copysign(a, b) : 将 b 中各元素的符号赋值给数组 a 的对应元素

**数据的 CSV 文件存取**（CSV (Comma-Separated Value,逗号分隔值) 只能存储一维和二维数组）

- np.savetxt(frame, array, fmt=’% .18e’, delimiter = None): frame 是文件、字符串等，可以是.gz .bz2 的压缩文件； array 表示存入的数组； fmt 表示元素的格式 eg： %d % .2f % .18e ; delimiter： 分割字符串，默认是空格
  eg： np.savetxt(‘a.csv’, a, fmt=%d, delimiter = ‘,’ )
- np.loadtxt(frame, dtype=np.float, delimiter = None, unpack = False) : frame 是文件、字符串等，可以是.gz .bz2 的压缩文件； dtype：数据类型，读取的数据以此类型存储； delimiter: 分割字符串，默认是空格; unpack: 如果为 True， 读入属性将分别写入不同变量。  
  **多维数据的存取**
- a.tofile(frame, sep=’’, format=’%s’ ) : frame: 文件、字符串； sep: 数据分割字符串，如果是空串，写入文件为二进制 ； format: 写入数据的格式
  eg: a = np.arange(100).reshape(5, 10, 2)
  a.tofile(“b.dat”, sep=”,”, format=’%d’)
- np.fromfile(frame, dtype = float, count=-1, sep=’’)： frame： 文件、字符串 ； dtype： 读取的数据以此类型存储； count：读入元素个数， -1 表示读入整个文件； sep: 数据分割字符串，如果是空串，写入文件为二进制  
  PS: a.tofile() 和 np.fromfile（）要配合使用，要知道数据的类型和维度。因为它存的时候都会将数据降维，你取出来就是一个一维数组，你需要再 reshape 相应的维度，而且取数的时候还要指定数据类型
- np.save(frame, array) : frame: 文件名，以.npy 为扩展名，压缩扩展名为.npz ； array 为数组变量
- np.load(fname) : frame: 文件名，以.npy 为扩展名  
  np.save() 和 np.load() 使用时，不用自己考虑数据类型和维度。

**numpy 随机数函数**  
&nbsp;&nbsp; &nbsp;&nbsp; numpy.random

- rand(d0, d1, …,dn) : 各元素是[0, 1）的浮点数，服从均匀分布
- randn(d0, d1, …,dn)：标准正态分布
- randint(low， high,（ shape）): 依 shape 创建随机整数或整数数组，范围是[ low, high）
- seed(s) ： 随机数种子
- shuffle(a) : 根据数组 a 的第一轴（维度）进行随机排列，改变数组 a
- permutation(a) : 根据数组 a 的第一轴（维度）进行随机排列， 但是不改变原数组，将生成新数组
- choice(a[, size, replace, p]) : 从一维数组 a 中以概率 p 抽取元素， 形成 size 形状新数组，replace 表示是否可以重用元素，默认为 False。
- uniform(low, high, size) : 产生均匀分布的数组，起始值为 low，high 为结束值，size 为形状
- normal(loc, scale, size) : 产生正态分布的数组， loc 为均值，scale 为标准差，size 为形状
- poisson(lam, size) : 产生泊松分布的数组， lam 随机事件发生概率，size 为形状

**numpy 的统计函数**

- sum(a, axis = None) : 依给定轴 axis 计算数组 a 相关元素之和，axis 为整数或者元组,axis 表示第几个维度，如 axis=0，表示对行求和，就是所有行中的对应元素求和。
- mean(a, axis = None) : 同理，计算平均值
- average(a, axis =None, weights=None) : 依给定轴 axis 计算数组 a 相关元素的加权平均值
- std（a, axis = None） ：同理，计算标准差
- var（a, axis = None）: 计算方差
- min(a) max(a) : 计算数组 a 的最小值和最大值
- argmin(a) argmax(a) : 计算数组 a 的最小、最大值的下标（注：是一维的下标）
- unravel_index(index, shape) : 根据 shape 将一维下标 index 转成多维下标
  PS：在一个多维数组中找一个最大值下标的方法：  
  eg：a = [  
   [15, 14, 13],  
   [12, 11, 10]  
   ]  
   np.argmax(a) –> 0  
   np.unravel_index( np.argmax(a), a.shape) –> (0,0)
- ptp(a) : 计算数组 a 最大值和最小值的差
- median(a) : 计算数组 a 中元素的中位数（中值）

**numpy的梯度函数**
- np.gradient(a) ： 计算数组a中元素的梯度，a为多维时，返回每个维度的梯度  ，这里是离散梯度
&nbsp;&nbsp;离散梯度： xy坐标轴连续三个x轴坐标对应的y轴值：a, b, c 其中b的梯度是（c-a）/2 
而c的梯度是： (c-b)/1  
&nbsp;&nbsp;当为二维数组时，np.gradient(a) 得出两个数组，第一个数组对应最外层维度的梯度，第二个数组对应第二层维度的梯度。 就是一个是从行取计算离散梯度，一个是从列计算梯度。

**图像的表示和变换**  
PIL,python image library 库   
from PIL import Image &nbsp;&nbsp;Image是PIL库中代表一个图像的类（对象）

- im = np.array(Image.open(“.jpg”)) #读取

- im = Image.fromarray(b.astype(‘uint8’)) # 生成 

- im.save(“路径.jpg”) # 保存

- im = np.array(Image.open(“.jpg”).convert(‘L’)) # convert(‘L’)表示转为灰度图

