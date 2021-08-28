---
title: 最短路算法总结（dijkstra，floyd，bellman-floyd，SPFA）
date: 2021-08-28
sidebar: "auto"
categories:
  - notes
tags:
  - 最短路径
---

## 前言
&nbsp;&nbsp;&nbsp;&nbsp;总结一下最短路径算法，包括一些算法的拓展，如floyd求最小环，bellman求有限制k步的最短路径等等     
  
## dijkstra算法   

&nbsp;&nbsp;&nbsp;&nbsp; 	dijkstra是一个非常熟悉的算法了，其用于求单源最短路径，关于其到底是贪心还是动态规划，其实个人觉得更偏向贪心算法一点，可以证明其正确性，此外它不能处理负权图，可以处理有环图（有向和无向均可）。   
&nbsp;&nbsp;&nbsp;&nbsp;关于dijkstra的时间复杂度，可以说是比较复杂的一个概念了，其复杂之处在于dijkstra有很多种写法，每种写法，其时间复杂度都有一点微妙的变化。   

- 由于图的表示方式就有两种，一种是邻接矩阵，一种是邻接表，用这两种形式，算法的时间复杂度是不一样的，邻接矩阵遍历一个结点对应的边的时候是O(V),V是顶点数。而邻接表遍历一个结点对应的边的时候是O(N),
为每个节点最大的邻居数。  
- dijkstra本身也有两种写法。一种是用集合的方式，一种是用优先队列优化的形式，这也导致了复杂度的不同，集合的方式需要遍历集合中的点，是O(V),优先队列的方式需要涉及到堆的一些复杂度，建堆的时间复杂
O(V),添加元素的时间复杂度是O(logV)。  
- 此外在图中我们一般认为 V * N ≈ E，然后在稠密图中，E ≈ V²， 在稀疏图中，E << V²，平常遇到的大多数都是稀疏图，所有能用优先队列去优化。  
- 它不能处理负权图是因为它的本质是个贪心的过程，在进行后续过程前提是必须保证当前选出的点是满足源点到当前点的最短距离，如果有边的权值有负数的话，很可能就变成了当前选的点，其路径并不是源点到当前
最短距离，后续可以通过一个正数+负数的方式找到更小的路径，由于后面不能再更新之前点的距离情况，因此会出问题。但其实我发现在优先队列的那种dijkstra的写法中，如果不用标记数组记录那些已经更新的点的
是可以做到多次进入优先队列的，即之前的点是可以被再次更新的，因此个人觉得这种方式是可以处理负权值的边的。

  基于集合的写法    
  ```python
    def dijkstra(n, edges, weights, start, end):
    	# Construct graph
    	neighbors = [[] for j in range(n)]
    	for j, edge in enumerate(edges):
    		neighbors[edge[0]].append((edge[1], weights[j]))
            neighbors[edge[1]].append((edge[0], weights[j]))

        # Initialize d
        d = [float('inf')] * n
        d[start] = 0

    	# Initialize Q
    	Q = set()
    	for j in range(n):
    		Q.add(j)

    	# Start loop
    	while Q:
    		# Extract-min from Q
    		minv = float('inf')
    		u = -1
    		for j, x in enumerate(d):
    		    if x < minv and x in Q:
    		        minv = x
    		        u = j
    		Q.remove(u)

    		# Update neighbors of u
    		for e in neighbors[u]:
    			w = e[0]
    			weight = e[1]
    			if w in Q:
    				alt = d[u] + weight
    				if alt < d[w]:
    					d[w] = alt
    	return d[end]
  ```
  时间复杂度是 O(V)+O(V²)+O(VN)∼O(V²)   

  基于优先队列的写法   

  ```python
  import heapq
  def dijkstra(n, edges, weights, start, end):
  	# Construct graph
  	neighbors = [[] for j in range(n)]
  	for j, edge in enumerate(edges):
  		neighbors[edge[0]].append((edge[1], weights[j]))
          neighbors[edge[1]].append((edge[0], weights[j]))

      # Initialize d
      d = [float('inf')] * n
      d[start] = 0

  	# Initialize Q
  	Q = []
  	for v in range(n):
  		heapq.heappush(Q, (d[v], v))
  
  	# Initialize visited
  	visited = set()
  
  	# Start loop
  	while Q:
  		u = heapq.heappop(Q)[1]
  		if u in visited:  ## 如果不用visited 数组标记，个人觉得是可以处理负权值的边的，不过时间复杂度就上升了
  			continue
  		visited.add(u)
  		for e in neighbors[u]:
  			w = e[0]
  			if w not in visited:
  				weight = e[1]
  				alt = d[u] + weight
  				if alt < d[w]:
  					d[w] = alt
  					heapq.heappush(Q, (d[w], w))
  	return d[end]
  ```
  时间复杂度是O(V) + O(VNlogV) = O(VNlogV) ≈ O(ElogV),logV 是添加元素的时间复杂度。当图为稀疏图时, E << V²,故可以优化   

## floyd算法
&nbsp;&nbsp;&nbsp;&nbsp;其思想就是三个for循环，遍历每一个点k，每次判断当其作为中间点时是否能够优化i，j的最短距离，其本质是一个动态规划的过程，时间复杂度是O(n³)，可以处理带负权值的图，因为其后续以某个点作为中间结点时一定可以更新其距离。不能处理负权环（一个环中的权重和为负数），事实上，负权环根本没有最短路径，因为可以一直绕着这个环兜圈子，距离会越来越小。  
	先上代码（注意：要将中间结点的循环放在最外面）  

```cpp
void floyd(){
    int MinCost = inf;
    for(int k=1;k<=n;k++){
        for(int i=1;i<=n;i++)
            for(int j=1;j<=n;j++)
                dis[i][j]=min(dis[i][j],dis[i][k]+dis[k][j]);      //跟新k点
    }
    if(MinCost==inf)puts("It's impossible.");
    else printf("%d\n",MinCost);
}
```  
&nbsp;&nbsp;&nbsp;&nbsp;上面是标准的floyd算法，实际上就三个for循环，利用floyd算法，我们还可以求最小环，所谓最小环是找出权重和最小的环，环最少要3个点，可以用floyd算法求，其具体思想是利用中间结点，按照序号从小到大的原则，我们可以知道，在以k为中间节点的循环中，此时的dis[i][j]是代表i到j的最短距离，但由于我们还未遍历k，所以此时的最短距离路径上还不包括k，所以此时如果dis[i][j]不等于inf的话并且mp[i][k],mp[k][j]也不等于inf的话（mp是原始距离矩阵），说明肯定存在以k为顶点的一个环。即当dis[i][j]+mp[i][k]+mp[k][j] != inf 时，说明存在环，此时记录其最小值并保存。   
&nbsp;&nbsp;&nbsp;&nbsp;那为什么每一个环都一定能被找到呢？    
&nbsp;&nbsp;&nbsp;&nbsp;因为对于每个环来说，我们可以找其序号的最大的那个顶点，当枚举到以这个顶点为中间节点的时候，一定可以通过其相邻的两个顶点把环找出来，代码只需要在标准的floyd算法上添加几行即可，时间复杂度也是O(n³)

```cpp
void floyd(){
    int MinCost = inf;
    for(int k=1;k<=n;k++){
        for(int i=1;i<k;i++)
            for(int j=i+1;j<k;j++)
                MinCost = min(MinCost,dis[i][j]+mp[i][k]+mp[k][j]);//跟新k点之前枚举ij求经过ijk的最小环
        for(int i=1;i<=n;i++)
            for(int j=1;j<=n;j++)
                dis[i][j]=min(dis[i][j],dis[i][k]+dis[k][j]);      //跟新k点
    }
    if(MinCost==inf)puts("It's impossible.");
    else printf("%d\n",MinCost);
}
```  
## bellman-floyd算法
&nbsp;&nbsp;&nbsp;&nbsp;这也是一种动态规划算法，它也是一个求单源最短路径的算法。时间复杂度是O（MN），可以处理负权值的边，也可以判断出负权环。
	首先，我们必须知道最短路径肯定一个不包含回路的简单路径，回路分为正权回路(即回路权值之和为正)和负权回路(即回路权值之和为负)。我们分别来讨论一下为什么这两种回路都不可能有。如果最短路径中包含正权回路，那么去掉这个回路，一定可以得到更短的路径。如果最短路径中包含负权回路，那么肯定没有最短路径，因为每多走一次?负权回路就可以得到更短的路径。因此，最短路径肯定是一个不包含回路的简单路径，即最多包含n-1条边，所以进行n-1轮松弛就可以了。  因此 源点到任何点的最短路径长度最多只有n-1条边。  
	先看代码  

```cpp
	for(int k=1;k<=n-1;k++)
		for(int i=1;i<=m;i++)
			if(dis[v[i]]>dis[u[i]]+w[i])
				dis[v[i]] = dis[u[i]]+w[i];
```
&nbsp;&nbsp;&nbsp;&nbsp;上边的代码外循环共循环了n - 1 次（n为顶点的个数），内循环共循环了m次（m代表边的个数）即枚举每一条边， dis 数组是的作用和dijkstra 算法一样，也是用来记录源点到其余各个顶点的最短路径，u，v，w 三个数组用来记录边的信息。例如第i条边存储在u[i]、v[i]、w[i]中，表示从顶点u[i]到顶点v[i]这条边（u[i] --> v[i]）权值为w[i]。两层for循环的意思是：看看能否通过u[i]—>v[i] （权值为w[i]）这条边，使得源点到u[i]的距离减小。    假设只有一条通路，故从0->(n-1)中最多有n-1个边，每一次循环，更新一个点，所以最多更新n-1次。   
&nbsp;&nbsp;&nbsp;&nbsp;此外，bellman-floyd还可以用来判断图中是否有负权环，因为有负权环的时候，当进行n-1次松弛后，继续松弛，还可以减小，故能判断。

```cpp
	public int minBF(int v){
		for(int j=1;j<matrix.ver_num;j++){
			for(int i=1;i<=matrix.edge_num;i++){
				int begin=matrix.edge[i].begin;
				int end=matrix.edge[i].end;
				int value=matrix.edge[i].value;
				//松弛，对于每一条边，如果当前x到源点v的距离在加上weight(x,y)之后会比当前y到源点的距离小
				//说明找到了一条更短的路径，则更新y到源点的距离
				if(minDis[begin]!=inf && minDis[begin]+value<minDis[end]){
					minDis[end]=minDis[begin]+value;
				}
			}
		}
		//判断是否有负权回路
		int flag=0;
		for(int i=1;i<=matrix.edge_num;i++){
			int begin=matrix.edge[i].begin;
			int end=matrix.edge[i].end;
			int value=matrix.edge[i].value;
			//我的理解是这样的，在进行上面的操作之后，所有距离都应该是最小的了
			//若存在负权回路，那么就总是可以找到更小的距离，以此判断
			if(minDis[begin]!=inf && minDis[begin]+value<minDis[end]){
				flag=1;			
				break;
			}
		}
		return flag;
	}
```
&nbsp;&nbsp;&nbsp;&nbsp;bellman-floyd算法 还可以用来求有限制的的最短路径问题。      
&nbsp;&nbsp;&nbsp;&nbsp;所谓有限制的最短路径问题是指在求最短路的前提下，要求路径长度不超过K等等，如果它要求在路径长度最短的情况下，经过的边（中转站）最少的路径，那么用dijkstra也是可以的。但是如果限制了在k条边以下去找最短路径就不能用dijkstra了。当限制了k步的时候，我们可以这样想，bellman-floyd的最初想法是“简单路径最多进行n-1次松弛，即理想情况下每次选择一条边，最多选择n次”，现在限制了k条边，是不是按照那种思想只需要松弛k步即可呢，答案是可以的。实际上这正是bellman-floyd算法的核心，但要注意一点不同的是，在标准的floyd算法中，我们虽然进行了n-1次松弛，但是某些点的距离实际上在前面的步骤中就已经是最优的了。由于边遍历顺序的未知性，我们如果直接进行k次松弛，有可能会出现大于k条边的路径，因此我们需要先对dist进行备份。具体原因如下：      
> 在遍历所有的“点对/边”进行松弛操作前，需要先对 dist 进行备份，否则会出现「本次松弛操作所使用到的边，也是在同一次迭代所更新的」，从而不满足边数限制的要求。
		举个 🌰，例如本次松弛操作使用了从 a 到 b 的当前最短距离来更新 dist[b]，直接使用 dist[a] 的话，不能确保 dist[a] 不是在同一次迭代中所更新，如果 dist[a] 是同一次迭代		所更新的话，那么使用的边数将会大于 k 条。
		因此在每次迭代开始前，我们都应该对 dist进行备份，在迭代时使用备份来进行松弛操作  

&nbsp;&nbsp;&nbsp;&nbsp;这个例题可以参考[leetcode 787. K 站中转内最便宜的航班](https://leetcode-cn.com/problems/cheapest-flights-within-k-stops/)  

```python
	def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
	    dist = [float('inf') for _ in range(n)]
	    dist[src] = 0
	    for i in range(k+1):
	        pre_dist = dist.copy()
	        for u,v,w in flights:
	            if dist[v] > pre_dist[u] + w:
	                dist[v] = pre_dist[u] + w
	    return -1 if dist[dst] == float('inf') else dist[dst] 
```
&nbsp;&nbsp;&nbsp;&nbsp;其实就是一个动态规划的过程，可以想象成一个二维dp数组，dp[k][i],k表示第k步，i表示目标城市，dp[k][i]表示最多k步走到第i个城市的最短路径。其状态转移方程为f[t][i]= min{f[t−1][j]+cost(j,i)}, (j,i)∈flights,因此其实上面的bellman-floyd算法就是从二维优化到一维而已，但是由于边的遍历是没有顺序可言的，就是说你不能保证遍历顺序是从离源点近的边遍历到离源点远的边。因为你只能用上一次松弛的值不能用这一次松弛更新后的值(会导致变数>k),因此我们每次必须copy之前的旧数组。



## SPFA
&nbsp;&nbsp;&nbsp;&nbsp;SPFA 算法是 Bellman-Ford算法 的队列优化算法的别称，通常用于求含负权边的单源最短路径，以及判负权环。SPFA 最坏情况下复杂度和朴素 Bellman-Ford 相同，为 O(VE)。  
	用邻接表储存图，此外，SPFA算法还可以判断图中是否有负权环，即一个点入队次数超过N。

```cpp
void SPFA(int s){
	 fill(dist, dist + n+1, inf);
	 fill(visited, visited + n + 1, false);
	 visited[s] = true;
	 dist[s] = 0;
	 queue<int>q;
	 q.push(s);
	 int cur;
	 while(!q.empty()){
	     cur = q.front(); q.pop();
	     visited[cur] = false;
	     for(int i = 0; i < edges[cur].size(); i++){
	         if(dist[edges[cur][i].end] > dist[cur] + edges[cur][i].w){
	             dist[edges[cur][i].end] = dist[cur] + edges[cur][i].w;
	             if(!visited[edges[cur][i].end]){
	                 visited[edges[cur][i].end] = true;
	                 q.push(edges[cur][i].end);
	            }//endif
	        }//endif
	    }//endfor
	}//endwhile
}
```

	

