---
title: 史上最全leetcode股票问题合集（dp从三维到二维到一维，小白都能看懂）
date: 2020-11-10
sidebar: 'auto'
categories:
 - algorithm
tags:
 - leetcode
 - dp
 - 股票
 - 小白
 - 最全
# keys:
#  - '123456'
# publish: false
---

## 预览
<img :src="$withBase('/leetcodeImages/lcStocks.png')" alt="Lc股票问题预览">  

::: tip
**可以看到，一共有8道（剑指offer63与lc121是相同的题）与股票相关的问题。可以大概进行分下类，lc121,lc122是一类问题，lc123,lc188,lc309，lc714可以归为一类，lc901与lc502分别单独为一类。**  
:::

## lc121 && lc122

<img :src="$withBase('/leetcodeImages/lc121&&lc122.png')" alt="Lc121&&lc122问题"> 

::: tip  分析
**大家一读题就知道为啥把这两个题放在一起了，很明显，这两个题要简单一点，然后思路也很清晰，大概就是贪心的思想!**  


**lc121这题就是遍历，然后找出在当前价格之前价格最低的价格（可以用变量暂存）然后计算利润，最后才保存一个最大利润即可。lc122这题由于没有限制交易次数，很明显就是贪心了，大概就是遇到价格比自己高的就卖出，价格低的就买入。但是代码如何组织简单一点呢？ 这里我依然维护了一个minP来保存当前天数下能买入的最小价格，注意是能买入的价格而不是历史最低，与lc121区分开来，然后遇到价格比minP高的就卖出并且修改minP为当前价格，遇到价格低于minP的就替换为minP来作为下一次买入的候选价格。（详情见代码）**
:::
## lc121代码
```cpp
    int maxProfit(vector<int>& prices) {
        if (prices.size() == 0) {
            return 0;
        }
        int minP = prices[0];
        int ans = 0;
        for (int i = 0;i < prices.size();i++){
            ans = max(ans,prices[i] - minP);
            minP = min(prices[i],minP);
        }
        return ans;
    }
```
## lc122代码
```cpp
    int maxProfit(vector<int>& prices) {
        int ans = 0;
        if(prices.size() == 0){
            return ans;
        }
        int minP = prices[0];
        for(int i=0;i<prices.size();i++){
            if(prices[i]>minP){
                ans+=prices[i]-minP;
            }
            minP=prices[i];
        }
        return ans;
    }
```

## lc123 && lc188 && lc309 && lc714

<img :src="$withBase('/leetcodeImages/lc123&&lc188&&lc309&&lc714.png')" alt="lc123 && lc188 && lc309 && lc714"> 

:::tip 分析
**相对于前两个题而言，这四个题都限制了交易次数，其中lc123和lc188都很直接规定了交易次数，后面两个题虽然没有直接限制交易次数，但每次交易都有一些附加条件，这其实无形中也限制了交易次数，因为你不可能再向lc122一样，遇到高的价格就卖出，遇到低的价格就买入。**   
  **其中这里以lc188为典型，这一个会了剩余三个就都会了！**
  - - -
- **还能不能用贪心？**  
 **很明显不能，因为你不能确定当前交易下就是最优的，后续可能还有最优。**
- **很明显dp了**  
 **其实这个问题比较难思考，对比一下背包问题。背包问题不愧为dp中典型的典型，我们来想一下状态的划分，无非就是在第i个循环中判断装不装入第i个商品，此时有两种选择，装或不装，不装则其价值是前i-1个商品在当前容量下的最大价值。但这个题比背包问题更难，难在三个地方。这三个地方看懂了问题也就解决了** 
 :::danger
 1. 状态更多（流转更复杂）  
背包问题只有两个状态（装or不装），股票问题每个阶段有三个基本状态，买入，卖出，不买入也不卖出。而且其状态流转更为复杂。背包问题中你可以连续装入两个物品，股票问题中明确限制了在买入前必须要将自己手中的股票先卖出，意思说不能连续买入和卖出。这时候先不看交易次数的问题，可以大致想一下，在某一天买入该股票的状态是不是必须得在之前卖出的状态下去更改。所以这里dp的初步定义就出来了，就是dp[n][3]。再想一下，我们前面说了不能连续买入和卖出，那是不是相当于我第i天买入了第i+1天就不能卖出了，所以第i+1天只有卖出和不买也不卖的状态，因此每天相当于依然只有两个状态。所以这里可以简化为dp[n][2]。其中dp[n][0]表示当前状态下卖出，dp[n][1]表示当前状态下买入.所以其状态流转图就可以画出来，如下:

<img :src="$withBase('/leetcodeImages/lc_stocks_1.png')" alt="lc_stocks_1" style="width: 60%">    

可以看出来在没限制次数的时候，也就是lc122题的状态转移方程已经出来了，也就说是lc122贪心和dp都可以解决。    

 2. 限制了交易次数  
 背包问题中没有限制装入物品的次数，只要能够容纳下物品都可以装进去，这个却不行，明确限制了交易次数。这个就比较困难了，意思说前面的状态流转图不对，哪里不对呢？你还需要考虑当前是否超了交易次数啊，这个确实比较难想，看一下lc123，当只能交易两次的时候是不是相当于我第二次交易是在第一次交易的基础上交易的，这样当能进行第三次交易的时候也在第一次交易的基础上进行更改，相当于还是进行了两次交易。因此这里需要再维护一个维度，就是交易次数。由于交易又分买入和卖出，因此交易了两次相当于4次交易。因此这里新的dp定义方式出来了,dp[n][k*2][2]。k为交易次数，如：dp[i][1][0]表示前i天下第二次交易下的卖出状态下的最大利润。
 所以自然该题的状态转移图就可以画出来：

 <img :src="$withBase('/leetcodeImages/lc_stocks_2.png')" alt="lc_stocks_2" style="width: 60%"> 


 3. 初始条件以及边界  
 &emsp;&emsp;这里其实我弱化了边界的处理，因为涉及到了数组边界，我建议背包问题都这样干，否则就会在程序里加if判断，这样做不好而且容易出错，因此我将背包的前两维的下标都加1，第三维由于是表示状态则不用。这样我就定义了一个dp[n+1][k*2+1][2]的数组，这样dp[i][j][0]就表示前i天第j笔交易卖出状态下的最大利润。这样dp[0][0][0]和dp[0][0][1]就是最开始的边界条件。  
 其状态转移方程为：    
&emsp;&emsp;dp[i][j][0]=max(dp[i-1][j-1][1]+prices[i-1],dp[i-1][j][0]);  
&emsp;&emsp;dp[i][j][1]=max(dp[i-1][j-1][0]-prices[i-1],dp[i-1][j][1]);  
&emsp;&emsp;想一下背包问题初始条件其实就是0，本题全部初始化为0可以吗。假设dp[0][0][0]=dp[0][0][1]=0.考虑第一个状态dp[1][1][0],该状态是在第一天的时候进行第一笔交易并且是卖出状态下的最大利润，如果按照上面的状态状态转移图，应该是max(dp[0][0][1]+prices[i-1],dp[0][0][0]),那这样的话，结果就是dp[1][1][0]=prices[i-1],但是这个状态是第一天交易一笔卖出状态下所得的最大利润，意思就是说我第一天就能卖出了，这显然是有错误的，然后会影响后续的状态。所以这里dp[1][1][0]应该为0才合理，所以这里将dp[0][0][1]应该置为最小值（INT_MIN)，问题到这里就解决了。  

**lc188(lc123将换成2即可)**
```cpp
    int maxProfit(int k, vector<int>& prices) {
      int n=prices.size();
        // dp[i][j][0]是 截至第i+1天为止，第j笔交易（买入，卖出分别算一笔交易）卖出（0卖出，1买入）所产生的最大利润。
        //dp[i][j][1]是 截至第i+1天为止，第j笔交易买入所产生的最大利润
        //最终结果是max(dp[n-1][0][0],dp[n-1][1][0],dp[n-1][2][0],dp[n-1][3][0])
        int dp[n+1][k*2+1][2];
        int ans=0;
        memset(dp,0,sizeof(dp));
        for(int i=1;i<2*k;i+=2){
            dp[0][i][1]=INT_MIN;
        }
        for(int i=1;i<n+1;i++){
            for(int j=1;j<k*2+1;j++){
                dp[i][j][1]=max(dp[i-1][j-1][0]-prices[i-1],dp[i-1][j][1]);
                dp[i][j][0]=max(dp[i-1][j-1][1]+prices[i-1],dp[i-1][j][0]);
                if(i==n&&j%2==0){
                    ans=max(ans,dp[i][j][0]);
                }
            }
            // for(int t=0;t<2;t++){
            //     for(int s=0;s<4;s++){
            //         cout<<dp[i][s][t]<<" ";
            //     }
            //     cout<<endl;
            // }
            // cout<<"\n\n"<<endl;
        }
        return ans;
    }
```
4. 能否优化？  
&emsp;&emsp;如果你完整的读了下来，你就会发现其实上面的dp定义很别扭，存在很多无用状态，如dp[1][1][0]第一天第一笔交易卖出状态下的最大利润，实际上第一天第一笔交易根本不能卖出，只能买入，所以这个状态是无效的。而且我第几笔交易就已经限定了买入还是卖出状态，如，第奇数笔交易肯定是买入，第偶数笔交易肯定是卖出，最终获得的最大利润肯定是在卖出状态下！所以这里可以简化成二维，dp[n+1][k*2+1]，dp[i][j]表示前i天第j笔交易下的最大利润（根据j的奇偶去判断买入还是卖出）。  
所以状态转移方程可以更新为：  
&emsp;&emsp;dp[i][j]=max(dp[i-1][j-1]-prices[i-1],dp[i-1][j]); (j为奇数)  
&emsp;&emsp;dp[i][j]=max(dp[i-1][j-1]+prices[i-1],dp[i-1][j]); (j为偶数)  
对应的代码为：  
```cpp
    int maxProfit(int k,vector<int>&prices){
        int n=prices.size();
        int dp[n+1][k*2+1];
        int ans=0;
        memset(dp,0,sizeof(dp));
        //init
        for(int i=1;i<k*2+1;i+=2){
            dp[0][i]=INT_MIN;
        }
        for(int i=1;i<n+1;i++){
            for(int j=1;j<k*2+1;j++){
                if(j%2==1){//奇数买入
                    dp[i][j]=max(dp[i-1][j],dp[i-1][j-1]-prices[i-1]);
                }
                else{
                    dp[i][j]=max(dp[i-1][j],dp[i-1][j-1]+prices[i-1]);
                    if(i==n){
                        ans=max(ans,dp[i][j]);
                    }
                }
            }
            // for(int s=1;s<5;s++){
            //     cout<<dp[i][s]<<" ";
            // }
            // cout<<endl;
        }
        return ans;
    }
```
5. 还可以优化吗？  
&emsp;&emsp;属性背包问题的都知道，可以将2维转化为1维，其根本原因是后面的状态只会用到前面的状态，因此可以用后面的状态覆盖前面的状态，这里没看懂可以画出哪个dp表（参加我程序里的注释代码部分），然后就可以看出来其实简化成一维也是不影响的，只不过需要注意其遍历的顺序，不能太早覆盖之前的状态。  
状态转移方程为：  
&emsp;&emsp;dp[i]=max(dp[i],dp[i-1]-prices[i-1]) (j为奇数)  
&emsp;&emsp;dp[i]=max(dp[i],dp[i-1]-prices[i-1]) (j为偶数)  
对应的代码：  
```cpp
int maxProfit(int k,vector<int>&prices){
        int n=prices.size();
        int dp[k*2+1];
        int ans=0;
        memset(dp,0,sizeof(dp));
        //init
        dp[1]=INT_MIN;
        dp[3]=INT_MIN;
        for(int i=1;i<n+1;i++){
            for(int j=k*2;j>0;j--){  //一维，倒序遍历就行
                if(j%2==1){
                    dp[j]=max(dp[j],dp[j-1]-prices[i-1]);
                }
                else{
                    dp[j]=max(dp[j],dp[j-1]+prices[i-1]);
                    if(i==n){
                        ans=max(ans,dp[j]);
                    }
                }
            }
        }
        return ans;
    }
```
这应该是最简洁的了,执行结果如下：  

 <img :src="$withBase('/leetcodeImages/lc_stocks_3.png')" alt="lc_stocks_3" style="width: 60%"> 

6. 剩下两个题  
&emsp;&emsp;理解了这个题，剩下两个题就很简单了。lc309是含有冷冻期，也就是卖出之后不能马上买入，那么也就是说我当前买入的最大利润是在前两天卖出的最大利润上-当前价格，这样改动即可，注意一下第一天买入没有这个限制，也就是说第一天可以直接买入。  
对应的状态转移方程如下：      
&emsp;&emsp;dp[i][1]=max(dp[i-1][1],dp[i-2][0]-prices[i-1]); i!=1  
&emsp;&emsp;dp[i][1]=max(dp[i-1][1],dp[i-1][0]-prices[i-1]); i==1  
&emsp;&emsp;dp[i][0]=max(dp[i-1][0],dp[i-1][1]+prices[i-1]);  
对应的代码如下：  
```cpp
    int maxProfit(vector<int>& prices) {
        int n=prices.size();
        int dp[n+1][3];
        //init
        memset(dp,0,sizeof(dp));
        dp[0][1]=INT_MIN;
        int ans=0;
        for(int i=1;i<n+1;i++){
            if(i==1){
            dp[i][1]=max(dp[i-1][1],dp[i-1][0]-prices[i-1]);//1为买入
            }
            else{
                dp[i][1]=max(dp[i-1][1],dp[i-2][0]-prices[i-1]);
            }
            dp[i][0]=max(dp[i-1][0],dp[i-1][1]+prices[i-1]);//0为卖出
            ans=max(ans,dp[i][0]);
        }
        return ans;
    }
```

&emsp;&emsp;lc714是含手续费，这样直接在卖出时减去对应的手续费即可。  
状态转移方程为：  
&emsp;&emsp;dp[i][1]=max(dp[i-1][1],dp[i-1][0]-prices[i-1]);  
&emsp;&emsp;dp[i][0]=max(dp[i-1][0],dp[i-1][1]+prices[i-1]-fee);   
&emsp;&emsp;一个小细节：如果直接这样写会报错，原因是溢出了，因为我最开始dp[0][1]设置的为INT_MIN，这样当fee>prices[0]的时候会溢出，所以需要加if判断一下        
代码如下：   
```cpp
    int maxProfit(vector<int>& prices, int fee) {
        int n=prices.size();
        int dp[n+1][3];
        //init
        memset(dp,0,sizeof(dp));
        dp[0][1]=INT_MIN;
        int ans=0;
        for(int i=1;i<n+1;i++){
            dp[i][1]=max(dp[i-1][1],dp[i-1][0]-prices[i-1]);//1为买入
            if(i==1){
                dp[i][0]=0;//0为卖出
            }
            else{
               dp[i][0]=max(dp[i-1][0],dp[i-1][1]+prices[i-1]-fee);//这里如果不改会溢出
            }
            ans=max(ans,dp[i][0]);
        }
        return ans;
    }
```
7. dfs or bfs?  
&emsp;&emsp;偶然发现有人用dfs做，我知道dp都能用dfs解决，但我看到这个题的时候还是没有dfs的想法，但是仔细想还是可以想出来的，将上面的二维转为dfs的参数即可，哈哈哈，暴力果然是万能的。此处代码省略。  
  
:::

## lc502  
 <img :src="$withBase('/leetcodeImages/lc_502.png')" alt="lc_502" style="width: 60%">     

&emsp;&emsp;这个问题其实解决它很容易，因为直接每次遍历所有项目，然后找出当前资本下的项目中利润最大的哪个项目，加上其利润，然后标记其visit，然后再这样循环即可。但是这样很容易超时，因为当数据多了以后每次都要遍历所有项目。  
&emsp;&emsp;一个解决办法是用一个优先队列priority_queue<pair<int,int>,vector<pair<int,int> >,greater<pair<int,int> >>Queue;//first存资本，second存利润。
这样的话可以先对资本排序，然后依次从队首开始循环，这里要将小于W的项目全部找出来，再从其中找一个利润最大的，但是其它的也不能扔掉，因为后续可能还会计算进去，所以这里又用了一个优先队列（保存利润，每次弹出最大利润）。其实不用这个队列也行，每次去遍历n个项目，找出当前W下的项目中利润最大的项目，然后再更改W，但是这样的话会超时，用一个优先队列，相当于排序后，记录一个index，下一次就不用遍历所有的项目了，只需要接着index向后遍历就行，所以用vector<pair<int,int> >也可以。  
代码如下:  
```cpp
    int findMaximizedCapital(int k, int W, vector<int>& Profits, vector<int>& Capital) {

 
        priority_queue<pair<int,int>,vector<pair<int,int> >,greater<pair<int,int> >>Queue;//first存资本，second存利润
        priority_queue<int>Profits_queue;
        //
        int n=Profits.size();
        bool visit[n];
        //init
        fill(visit,visit+n,false);
        for(int i=0;i<n;i++){
            Queue.push(make_pair(Capital[i],Profits[i]));//将资本排序，但是由于这里一开始给的数据中利润和资本是index相对应的，所以这里排序也要相对应
        }
        for(int i=0;i<k;i++){
            int maxP=0;
            while(!Queue.empty()&&Queue.top().first<=W){//
                Profits_queue.push(Queue.top().second);
                Queue.pop();
            }
            if(Profits_queue.empty()){
                break;
            }
            W+=Profits_queue.top();//根据题目意思，这里不减去项目启动资本
            Profits_queue.pop();
        }
        return W;
    }
```
## lc901 
 <img :src="$withBase('/leetcodeImages/lc_901.png')" alt="lc_901" style="width: 60%">  

&emsp;&emsp;这个题注意题目说的是今天之前的连续小于或等于今天价格的最大连续日数。最基本的想法是将之前天的价格存入，然后遍历，但是这样复杂度太高了。可以复用之前的状态，记录每一天的价格和其之前连续小于或等于其价格的天数，这样后续计算的时候就可以复用了。这里我们用一个栈存之前的数据，栈中存一个pair<int,int>来保存价格和状态，这样每新来一个价格，比这个价格低的就直接返回（因为栈顶的是最近的数据），比它小就说明不连续了。如果比这个价格高，那么可以出栈，边出边加其栈顶对应的状态天数，直到栈为空或者栈顶价格大于它，再将其入栈并返回其状态天数即可，因为之前比它小的都可以算进去，并且将最新的加入栈里，后续又可复用。  

代码如下:  
```cpp
class StockSpanner {
public:
    //pair<int,int>myPair;  //first存值，second存之前有多少连续小于等于它first的()的
    stack<pair<int,int> >myStack;
    StockSpanner() {

    }
    
    int next(int price) {
        if(myStack.empty()){
            myStack.push(make_pair(price,1));
            return 1;
        }
        else{
            int ans=1;
            while(!myStack.empty()&&(myStack.top().first)<=price){
                ans+=myStack.top().second;
                myStack.pop();
            }
            myStack.push(make_pair(price,ans));
            return ans;
        }
    }
};
```

## 总结
&emsp;&emsp;多多理解背包问题，可以从背包问题中总结很多，自己想了一个背包问题的改版，那就是加上其限制装入的个数，那这样就和lc188很像了，其状态转移方程也比较容易写出来！

  