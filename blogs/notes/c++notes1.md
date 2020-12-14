---
title: C++lambda表达式和自定义哈希函数
date: 2020-12-14
sidebar: "auto"
categories:
  - notes
tags:
  - notes
# keys:
#  - '123456'
# publish: false

---

## 起因
&nbsp;&nbsp;今天做 leetcode 每日一题（49. 字母异位词分组）的时候，本来我是直接对字符串排序，然后存 map 的，但是官方题解给了一种绕过排序的方法，就是自己定义的哈希函数，它定义将 array<int, 26>这样一个结构计算出对应的哈希值，从而存入 map，这里不直接存字符串的原因是，如果直接计算字符串的哈希值，字母异位词的哈希值肯定是不同的，但是他们应该归为到一类，所以用 26 个小写字母的个数来存，这样就可以辨别所有的字母异位词。思路很好理解，但是看 C++代码的时候，我惊了，看半天没看懂，一个是 STL 知识还比较零散，第二个是那个 leetcode 官方题解我觉得写得真不好，完全就是语法糖嘛（故意显摆?)。这里学习记录一下。

## 官方代码

```cpp
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // 自定义对 array<int, 26> 类型的哈希函数
        auto arrayHash = [fn = hash<int>{}] (const array<int, 26>& arr) -> size_t {
            return accumulate(arr.begin(), arr.end(), 0u, [&](size_t acc, int num) {
                return (acc << 1) ^ fn(num);
            });
        };

        unordered_map<array<int, 26>, vector<string>, decltype(arrayHash)> mp(0, arrayHash);
        for (string& str: strs) {
            array<int, 26> counts{};
            int length = str.length();
            for (int i = 0; i < length; ++i) {
                counts[str[i] - 'a'] ++;
            }
            mp[counts].emplace_back(str);
        }
        vector<vector<string>> ans;
        for (auto it = mp.begin(); it != mp.end(); ++it) {
            ans.emplace_back(it->second);
        }
        return ans;
    }
```

## lambda 表达式

&nbsp;&nbsp;C++ 11 中的 Lambda 表达式用于定义并创建匿名的函数对象，以简化编程工作。
Lambda 的语法形式如下：

```cpp
[函数对象参数] (操作符重载函数参数) mutable 或 exception 声明 -> 返回值类型 {函数体}
```

我这里只大概记录说一下通用的，这个就相当于创建一个匿名类，第一个部分函数对象参数标识一个 Lambda 表达式的开始，这部分必须存在，不能省略。函数对象参数是传递给编译器自动生成的函数对象类的构造函数的。相当于你传了进去，这个匿名类内部就会有相应的值。

&nbsp;&nbsp;这个算树状数组入门吧，其实我只说了单点更新，区间查询。单点更新就是每次只更新一个点，区间查询就是每次查询的是一个区间的和，此外，还有更复杂的，区间更新，单点查询以及区间更新，区间查询。还有更为复杂的线段树，维护区间最大最小值等等。以后再写！

- 空。没有任何函数对象参数。(里面就不能用其它变量)
- =。函数体内可以使用 Lambda 所在范围内所有可见的局部变量（包括 Lambda 所在类的 this），并且是值传递方式（相
- 当于编译器自动为我们按值传递了所有局部变量）。
- &。函数体内可以使用 Lambda 所在范围内所有可见的局部变量（包括 Lambda 所在类的 this），并且是引用传递方式（相当于是编译器自动为我们按引用传递了所有局部变量）。
- this。函数体内可以使用 Lambda 所在类中的成员变量。
- a。将 a 按值进行传递。按值进行传递时，函数体内不能修改传递进来的 a 的拷贝，因为默认情况下函数是 const 的，要修改传递进来的拷贝，可以添加 mutable 修饰符。
- &a。将 a 按引用进行传递。
- a，&b。将 a 按值传递，b 按引用进行传递。
- =，&a，&b。除 a 和 b 按引用进行传递外，其他参数都按值进行传递。
- &，a，b。除 a 和 b 按值进行传递外，其他参数都按引用进行传递。  
  &nbsp;&nbsp;操作符重载函数参数，实际上就是方法所需要外部调用传来的参数。
  &nbsp;&nbsp;返回值类型，为 void 或者函数体中只有一处 return 的地方（此时编译器可以自动推断出返回值类型）的时候可以省略。
  &nbsp;&nbsp;函数体，标识函数的实现，这部分不能省略，但函数体可以为空。

## template 模板类

&nbsp;&nbsp;开始在网上搜“C++自定义哈希函数”的时候网上都是给出了用 template 关键字去定义的那种形式，虽然这个代码中没用用到，但是既然看了就记录一下吧。template 模板类就相当于 java 的泛型。

- 函数模板

```cpp
  template<typename  T> void swap(T& t1, T& t2) {
      T tmpT;
      tmpT = t1;
      t1 = t2;
      t2 = tmpT;
  }
  swap<int>(num1, num2);
```

- 类模板

```cpp
template <class T> class Stack {
    public:
        Stack();
        ~Stack();
        void push(T t);
        T pop();
        bool isEmpty();
    private:
        T *m_pT;
        int m_maxSize;
        int m_size;
};
template <class  T>  Stack<T>:: Stack(){ //类中的方法定义上也要加上template <class T>
   m_maxSize = 100;
   m_size = 0;
   m_pT = new T[m_maxSize];
}
template <class T,int maxsize>  Stack<T, maxsize>::~Stack() {
   delete [] m_pT ;
}

template <class T,int maxsize> void Stack<T, maxsize>::push(T t) {
    m_size++;
    m_pT[m_size - 1] = t;

}
template <class T,int maxsize> T Stack<T, maxsize>::pop() {
    T t = m_pT[m_size - 1];
    m_size--;
    return t;
}
template <class T,int maxsize> bool Stack<T, maxsize>::isEmpty() {
    return m_size == 0;
}

  // use
  Stack<int> intStack;
  intStack.push(1);
  intStack.push(2);
  intStack.push(3);

  while (!intStack.isEmpty()) {
    printf("num:%d\n", intStack.pop());
  }
```

## accmulate 方法

&nbsp;&nbsp;STL 中的 accmulate 方法一般用于累加求和和自定义类型数据处理

- 累加求和

```cpp
  int sum = accumulate(vec.begin() , vec.end() , 42);
  // 前两个是指定要累加元素的范围，第三个则是累加的初始值，返回累加和
```

- 自定义数据类型的处理
  &nbsp;&nbsp;先上源码

```cpp
template<class _InIt,
	class _Ty,
	class _Fn2> inline
	_Ty _Accumulate(_InIt _First, _InIt _Last, _Ty _Val, _Fn2 _Func)
	{	// return sum of _Val and all in [_First, _Last), using _Func
	  for (; _First != _Last; ++_First)
		  _Val = _Func(_Val, *_First);
	  return (_Val);
	}
```

&nbsp;&nbsp;看源码可以知道，第四个参数为一个函数，然后每次遍历的时候就用调用该函数，如果不传该函数的话，就是默认求和。注意看这个 function 的参数，第一个参数是累积的值，第二个参数是当前的值。返回累积的值

## 自定义 unordered_map 数据类型

&nbsp;&nbsp; STL 中无序容器可以自定义其数据类型，还有个常用的是 unordered_set，其定义的方式如下：

```cpp
template < class Key,class T,class Hash = hash<Key>,class Pred = equal_to<Key>, class Alloc = allocator< pair<const Key,T> > > class unordered_map;
```

&nbsp;&nbsp; 其实这个自定义挺复杂的，各参数的意义如下，

> Key 主键的类型。在类模板内部，使用其别名为 key_type 的成员类型。
> T 被映射的值的类型。在类模板内部，使用其别名为 mapped_type 的成员类型。
> Hash 一元谓词，以一个 Key 类型的对象为参数，返回一个基于该对象的 size_t 类型的唯一值。可以是函数指针（Function pointer）类型或函数对象（Function object）类型。在类模板内部，使用其别名为 hasher 的成员类型。
> Pred 二元谓词，以两个 Key 类型的对象为参数，返回一个 bool 值，如果第一个参数等价于第二个参数，该 bool 值为 true，否则为 false。默认为 std::equal_to.可以是函数指针类型（Function pointer）类型或函数对象（Function object）类型.在类模板内部，使用其别名为 key_equal 的成员类型。
> Alloc 容器内部用来管理内存分配及释放的内存分配器的类型。这个参数是可选的，它的默认值是 std::allocator，这个是一个最简单的非值依赖的（Value-independent）内存分配器。在类模板内部，使用其别名为 allocator_type 的成员类型。

&nbsp;&nbsp;大概总结一下：第五个参数一般不更改，就用默认的。然后第一个参数是 KEY,第二个参数是对应的 value，第三个是 hash 函数对象，返回一个哈希值（size_t),第四个是要定义一个判断两个对象相等的函数，它内部通过等比操作符’=='来判断两个 key 是否相等，返回值为 bool 类型。默认值是 std::equal_to<key>，这里 key 是对象，意思就是说只要这个对象内部定义了比较方法或者 STL 定义了比较方法（如最开始提到的官方代码中的 array<int,6>就重载了 == 操作符）就可以不用写这个参数。
&nbsp;&nbsp;所以真正需要写的就三个参数，最重要的是第三个，哈希函数对象。

## decltype 关键字

&nbsp;&nbsp;decltype 关键字是用于生成变量名或者表达式的类型。参考了别人的博客：

> C++11 中，decltype 的主要用于声明模板函数，此模板函数的返回值类型依赖于其参数类型。例如，看一个例子：我们需要实现一个模板函数，此模板函> 数的参数包括一个支持方括号（"[]"）索引的容器加一个 int 索引值，中间需要做一些验证操作，最后函数返回类型应该同容器索引操作的返回类型相同。
> 一个元素类型为 T 的容器，operator [\]的返回值类型应该为 T&。std::queue 容器都满足这个要求，std::vector 大部分情况下都满足（std::vector<bool>为一个例外)，operator[\]并不返回 bool&,而是一个全新的对象），因此注意这里的容器操作符 operator[]的返回值类型依赖于容器类型。
> &nbsp;&nbsp; 具体我没有深究，但是看到了一个规范，就是区分了一下函数对象和函数，针对于这两种写法，前者在调用的时候需要指定 decltype 关键字。

```cpp
方式1，（全局函数）
bool eq(const T& c1, const T& c2)
{
  …
}

全局函数方式：
std::unordered_map<T,int,decltype(&customer_hash_func)，decltype(&eq)> umap;

方式2，（函数对象）
struct equalFunc
{
  bool operator()(const T& c1,const T& c2)
  {
  …
  }
}
std::unordered_map<T,int,hashFunc，equalFunc> umap;
```

## 最后一个坑

```cpp
   unordered_map<pair<int, int>, int, decltype(hashlambda)> lam_map;
```

&nbsp;&nbsp; 如果哈希函数是 lambda 函数，那么上面的定义方式会报错。参见他人博客：

> 编译出错，提示“lambda 默认构造函数是删除的(deleted)”。为什么会这样，同样是可调用对象，为何 lambda 实现时无法通过编译呢？
> 自己一翻折腾并大牛的热心帮助下终于有所明白，简单说来，unordered_map 继承自\_Hash 类型，\_Hash 用到一个\_Uhash_compare 类来封装传入的 hash 函数，如果 unordered_map 构造函数没有显示的传入 hash 函数实例引用，则 unordered_map 默认构造函数使用第三个模板参数指定的 Hash 类型的默认构造函数，进行 hash 函数实例的默认构造。在第一种情况中，编译为函数类型合成默认构造函数也就是 hash_fun()，所以我们在定义 unordered_map 时即使不传入函数对象实例，也能通过默认构造函数生成。但是，对于 lambda 对象来说，虽然编译时会为每个 lambda 表达式产生一个匿名类，**但是这个匿名类时不含有默认构造函数(=deleted)**。因此，如果实例化 unordered_map 时，不传入 lambda 对象实例引用，默认构造函数不能为我们合成一个默认的 hash 函数实例。所以，编译时产生了上面的错误。明白了这些，自然知道如何去修改了。
> &nbsp;&nbsp; 总结一下就是，如果 unordered_map 定义的时候没有传入其初始化值，那么就会通过第三个参数的默认构造函数生成，但是 lambda 匿名类不含有默认构造函数，所以就报错了，解决方法是要么不用 lambda 表达式，直接写函数对象，那么就有了默认构造函数。要么就是用 lambda 匿名类，但是定义时就进行初始化。如下：

```cpp
  unordered_map<pair<int, int>, int, decltype(hashlambda)> lam_map(10, hashlambda);
```

&nbsp;&nbsp;我们在创建 unordered_map 对象时，手动指定了两个参数；第一参数是“桶”的数量（就是初始化时候的 map 的格子数，大小，如果没有提供初始值，默认的构造函数会生成一个空容器。），第二个就是 hash 实例引用了。在这里需要留意的是，lambda 虽然与函数类型功能相似，但在构造函数、赋值运算符、默认析构函数的限制是不同的。此外，还应该留意每个 lambda 表达都是一种类型，就是值引用、参数类型，返回值都一样，但是它们的类型是不同的。

## 总结

&nbsp;&nbsp;经过上面的基础知识补充，官方题解的代码已经能够看懂了，就是用了两个 lambda 函数，第一个 lambda 函数中传入了 STL 自己定义的哈希函数并进行初始化 hash<int>{}，然后命名为 fn，然后这个哈希函数的参数是 array<int,26>，返回值是 size_t，函数体内遍历整个数组，并且用了 accumulate 函数，这里 accumulate 函数的第四个参数又用了 lambda 匿名函数，其第一个参数是累积处理的值，第二个参数是当前的值（也就是当前字母出现的次数），然后这里是用结果移位再异或当前字母出现次数的哈希值的方式去累积处理，返回最终结果。
