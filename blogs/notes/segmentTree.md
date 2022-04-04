---
title: 线段树入门
date: 2022-04-04
sidebar: "auto"
categories:
  - notes
tags:
  - 线段树
# keys:
#  - '123456'
# publish: false
---

## 线段树是什么？

&nbsp;&nbsp;线段树就是一棵树，但是一般我们用数组的形式表示它（堆式表示），它可以用于（单点更新，区间查询），（区间更新，区间查询），其中可以查询区间的最大值，最小值及区间和等等。比树状数组功能更强大。

## 单点更新，区间查询
- 参考 leetcode 307. 区域和检索 - 数组可修改


```cpp
    vector<int> nums;  // 原数组
    vector<int>segmentTree;//对应树状数组

void build(int node,int l,int r){ // 初始化树,node节点中保存[l,r]的和
        if(l == r){
            segmentTree[node] = nums[l];
            return;
        }
        int mid = l + (r - l) / 2;
        build(node*2+1,l,mid);
        build(node*2+2,mid+1,r);
        segmentTree[node] = segmentTree[node*2+1] + segmentTree[node*2+2];
    }
    void change(int index,int node,int l, int r,int x){ // l,r是node表示的范围，index位置上的元素变成x
        if(l == r){
            segmentTree[node] = x;
            return;
        }
        int mid = l + (r - l) / 2;
        if(index > mid){
            change(index,node*2+2,mid+1,r,x);
        }else{
            change(index,node*2+1,l,mid,x);
        }
        segmentTree[node] = segmentTree[node*2+1] + segmentTree[node*2+2];
    }
    int range(int node,int l,int r,int s,int e){     // [s,e]表示要求和的区间，[l,r]表示node对应的区间
        if(l >= s and r <= e){
            return segmentTree[node];
        }
        int mid = l + (r - l) / 2;
        if(s > mid){
            return range(node*2+2,mid+1,r,s,e);
        } else if(e <= mid){
            return range(node*2+1,l,mid,s,e);
        } else{
            return range(node*2+1,l,mid,s,e) + range(node*2+2,mid+1,r,s,e);//
        }
    }

    void update(int index, int val) {
        change(index,0,0,nums.size()-1,val);
    }

    int sumRange(int left, int right) {
        return range(0,0,nums.size()-1,left,right);
    }

```
## 区间更新，区间查询
- 这个要借助一个lazy tag，表示当前节点的修改还没有传递到其孩子节点。
- 待定！补充

