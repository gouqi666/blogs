---
title: python Pandas常用api总结
date: 2020-12-23
sidebar: "auto"
categories:
  - notes
tags:
  - python
  - pandas
---

## 写在前面

&nbsp;&nbsp; Pandas 常用 api 总结！//转载自https://www.jianshu.com/p/c51a21503c0c，侵删
&nbsp;&nbsp;pandas 作为 python 在数据科学领域关键包之一，熟练其 API 是必备的.  
我们使用如下缩写：  
&nbsp;&nbsp;df：任意的 Pandas DataFrame 对象     
&nbsp;&nbsp;s：任意的 Pandas Series 对象   
同时我们需要做如下的引入：    
&nbsp;&nbsp;import pandas as pd    
&nbsp;&nbsp;import numpy as np  

## Series对象
&nbsp;&nbsp;Series是Pandas中最基本的对象，基于NumPy的数组对象来的，和NumPy的数组不同的是，Series能为数据自定义标签，就是索引（index），然后通过索引来访问数组中的数据。   
**1、创建Series对象并省略索引**
&nbsp;&nbsp;sel = Series([1,2,3,4]) 

**2、自己创建索引**
sel = Series(data = [1,2,3,4],index=['a','b','c','d'])  
sel = Series(data = [1,2,3,4],index=list('abcd'))  

**3、获取索引**
sel.index  

**4、获取value值**
sel.values  

**5、获取索引和值,类型键值对（字典）**  
list(sel.iteritems())  

**6、将字典转为Series**  
Series(dict)  

**7、Series对象同时支持位置和索引两种方式获取数据**  
"索引小标：",sel['c']  
"位置小标：",sel[2]

**8、获取不连续的数据**  
"位置小标：",sel[['a','c']]  
"索引小标：",sel[[1,3]]  

**9、可以使用切片获取数据**  
'位置切片：','\n',sel[1:3] 左闭右开  
'索引切片：','\n',sel['b':'d'] 左右都包含  

**10、重新赋值索引的值**
reindex重新定义索引，会返回一个新的Series（调用reindex将会重新排序，缺失的值则用Nan填补）      
sel.reindex(['d','a','c','d','e'])    
并且随着缺失值nan的填值，value将会变成float类型，因为nan是float类型    

**11、Drop丢掉指定轴上的项（删除）**    
sel4.drop([2,3]) 删除了索引是2,3的值    

**12、处理NaN空值，过滤缺失数据**    
dropna()：将NaN数据过滤掉，只要包含NaN就都过滤掉  
notnull()：布尔类型bool，缺失的数据显示的是False  
isnull()：布尔类型bool，缺失数据False    
**13、Series 进行算数运算操作**  
```python
1.series1 = pd.Series([1,2,3,4],['Londn','HongKong','Humbai','lagos'])
2.series2 = pd.Series([1,3,6,4],['Londn','Accra','lagos','Delhi'])
3.print(series1 - series2)
4.print(series1 + series2)
5.print(series1 * series2)  
```
如果pandas在两个Series中找不到相同的index，对应位置就返回一个空值NaN  

同样也支持Numpy的数组运算  
```python
sel = Series(data = [1,6,3,5],index=list('abcd'))
print(sel[sel>3]) #输出大于3的值，布尔数组过滤
print(sel*2)  #给所有数据乘以2
print(np.square(sel))  #value的平方值
```
## 导入数据
&nbsp;&nbsp;pd.read_csv(filename)：从CSV文件导入数据   
&nbsp;&nbsp;pd.read_table(filename)：从限定分隔符的文本文件导入数据   
&nbsp;&nbsp;pd.read_excel(filename)：从Excel文件导入数据  
&nbsp;&nbsp;pd.read_sql(query, connection_object)：从SQL表/库导入数据  
&nbsp;&nbsp;pd.read_json(json_string)：从JSON格式的字符串导入数据   
&nbsp;&nbsp;pd.read_html(url)：解析URL、字符串或者HTML文件，抽取其中的tables表格  
&nbsp;&nbsp;pd.read_clipboard()：从你的粘贴板获取内容，并传给read_table()  
&nbsp;&nbsp;pd.DataFrame(dict)：从字典对象导入数据，Key是列名，Value是数据  

## 导出数据 
&nbsp;&nbsp;df.to_csv(filename)：导出数据到CSV文件  
&nbsp;&nbsp;df.to_excel(filename)：导出数据到Excel文件  
&nbsp;&nbsp;df.to_sql(table_name, connection_object)：导出数据到SQL表  
&nbsp;&nbsp;df.to_json(filename)：以Json格式导出数据到文本文件  

## 创建测试对象
&nbsp;&nbsp;pd.DataFrame(np.random.rand(20,5))：创建20行5列的随机数组成的DataFrame对象  
&nbsp;&nbsp;pd.Series(my_list)：从可迭代对象my_list创建一个Series对象  
&nbsp;&nbsp;df.index = pd.date_range('1900/1/30', periods=df.shape[0])：增加一个日期索引  

## 查看、检查数据   
&nbsp;&nbsp;df.head(n)：查看DataFrame对象的前n行  
&nbsp;&nbsp;df.tail(n)：查看DataFrame对象的最后n行  
&nbsp;&nbsp;df.shape[0],    df.shape[1]：分别查看行数和列数  
&nbsp;&nbsp;df.info()：查看索引、数据类型和内存信息  
&nbsp;&nbsp;df.describe()：查看数值型列的汇总统计  
&nbsp;&nbsp;s.value_counts(dropna=False)：查看Series对象的唯一值和计数  
&nbsp;&nbsp;s.count() ：非空值数量  
&nbsp;&nbsp;df.apply(pd.Series.value_counts)：查看DataFrame对象中每一列的唯一值和计数  
##  数据选取   
&nbsp;&nbsp;df[col]：根据列名，并以Series的形式返回列

&nbsp;&nbsp;df[[col1, col2]]：以DataFrame形式返回多列

&nbsp;&nbsp;s.iloc[0]：按位置选取数据

&nbsp;&nbsp;s.loc['index_one']：按索引选取数据

&nbsp;&nbsp;df.iloc[0,:]：返回第一行

&nbsp;&nbsp;df.iloc[0,0]：返回第一列的第一个元素

##  数据清理
&nbsp;&nbsp;df.columns = ['a','b','c']：重命名列名
&nbsp;&nbsp;
&nbsp;&nbsp;pd.isnull()：检查DataFrame对象中的空值，并返回一个Boolean数组
&nbsp;&nbsp;
&nbsp;&nbsp;pd.notnull()：检查DataFrame对象中的非空值，并返回一个Boolean数组
&nbsp;&nbsp;
&nbsp;&nbsp;df.dropna()：删除所有包含空值的行
&nbsp;&nbsp;
&nbsp;&nbsp;df.dropna(axis=1)：删除所有包含空值的列
&nbsp;&nbsp;
&nbsp;&nbsp;df.dropna(axis=1,thresh=n)：删除所有小于n个非空值的行
&nbsp;&nbsp;
&nbsp;&nbsp;df.fillna(x)：用x替换DataFrame对象中所有的空值
&nbsp;&nbsp;
&nbsp;&nbsp;s.astype(float)：将Series中的数据类型更改为float类型
&nbsp;&nbsp;
&nbsp;&nbsp;s.replace(1,'one')：用‘one’代替所有等于1的值
&nbsp;&nbsp;
&nbsp;&nbsp;s.replace([1,3],['one','three'])：用'one'代替1，用'three'代替3
&nbsp;&nbsp;
&nbsp;&nbsp;df.rename(columns=lambda x: x + 1)：批量更改列名
&nbsp;&nbsp;
&nbsp;&nbsp;df.rename(columns={'old_name': 'new_ name'})：选择性更改列名
&nbsp;&nbsp;
&nbsp;&nbsp;df.set_index('column_one')：更改索引列
&nbsp;&nbsp;
&nbsp;&nbsp;df.rename(index=lambda x: x + 1)：批量重命名索引

## 数据处理：Filter、Sort和GroupBy
&nbsp;&nbsp;df[df[col] > 0.5]：选择col列的值大于0.5的行
&nbsp;&nbsp;
&nbsp;&nbsp;df.sort_values(col1)：按照列col1排序数据，默认升序排列
&nbsp;&nbsp;
&nbsp;&nbsp;df.sort_values(col2, ascending=False)：按照列col1降序排列数据
&nbsp;&nbsp;
&nbsp;&nbsp;df.sort_values([col1,col2], ascending=[True,False])：先按列col1升序排列，后按col2降序排列数据
&nbsp;&nbsp;
&nbsp;&nbsp;df.groupby(col)：返回一个按列col进行分组的Groupby对象
&nbsp;&nbsp;
&nbsp;&nbsp;df.groupby([col1,col2])：返回一个按多列进行分组的Groupby对象
&nbsp;&nbsp;
&nbsp;&nbsp;df.groupby(col1)[col2]：返回按列col1进行分组后，列col2的均值
&nbsp;&nbsp;
&nbsp;&nbsp;df.pivot_table(index=col1, values=[col2,col3], aggfunc=max)：创建一个按列col1进行分组，并计算col2和col3的最大值的数据透视表
&nbsp;&nbsp;
&nbsp;&nbsp;df.groupby(col1).agg(np.mean)：返回按列col1分组的所有列的均值
&nbsp;&nbsp;
&nbsp;&nbsp;data.apply(np.mean)：对DataFrame中的每一列应用函数np.mean
&nbsp;&nbsp;
&nbsp;&nbsp;data.apply(np.max,axis=1)：对DataFrame中的每一行应用函数np.max
&nbsp;&nbsp;
&nbsp;&nbsp;df.get_dummies() ：one-hot编码
&nbsp;&nbsp;
&nbsp;&nbsp;s.map() , df.applymap()：映射

##  数据合并
&nbsp;&nbsp;df1.append(df2)：将df2中的行添加到df1的尾部
&nbsp;&nbsp;
&nbsp;&nbsp;df.concat([df1, df2],axis=1)：将df2中的列添加到df1的尾部
&nbsp;&nbsp;
&nbsp;&nbsp;df1.join(df2,on=col1,how='inner')：对df1的列和df2的列执行SQL形式的join

## 数据统计
&nbsp;&nbsp;df.describe()：查看数据值列的汇总统计
&nbsp;&nbsp;
&nbsp;&nbsp;df.mean()：返回所有列的均值
&nbsp;&nbsp;
&nbsp;&nbsp;df.corr()：返回列与列之间的相关系数
&nbsp;&nbsp;
&nbsp;&nbsp;df.count()：返回每一列中的非空值的个数
&nbsp;&nbsp;
&nbsp;&nbsp;df.max()：返回每一列的最大值
&nbsp;&nbsp;
&nbsp;&nbsp;df.min()：返回每一列的最小值
&nbsp;&nbsp;
&nbsp;&nbsp;df.median()：返回每一列的中位数
&nbsp;&nbsp;
&nbsp;&nbsp;df.std()：返回每一列的标准差



