# 📅 Week 11: Dynamic Programming

## 🎯 Overview

Dynamic Programming (DP) is one of the most important and challenging topics in FAANG interviews. This week covers core DP patterns that appear repeatedly.

---

## 📚 Topics Covered

### 1. DP Fundamentals
- What is DP? (Optimal substructure + Overlapping subproblems)
- Top-down (Memoization) vs Bottom-up (Tabulation)
- State design and transitions

### 2. Classic DP Patterns
- **1D DP**: Fibonacci, Climbing Stairs, House Robber
- **2D DP**: Grid paths, Edit Distance
- **Knapsack**: 0/1 Knapsack, Unbounded, Subset Sum
- **String DP**: LCS, LPS, Edit Distance
- **Interval DP**: Matrix Chain, Burst Balloons

---

## 📁 Folder Structure

```
Week-11-Dynamic-Programming/
├── README.md
├── 01-DP-Fundamentals/
│   └── dp_explained.md
├── 04-Knapsack-Pattern/
│   └── knapsack_explained.md
└── 05-String-DP/
    └── string_dp.md
```

> 📝 **Note:** Practice problems for Dynamic Programming can be found in the main [Problems/13-1D-DP/](../Problems/13-1D-DP/) and [Problems/14-2D-DP/](../Problems/14-2D-DP/) folders.

---

## 🎯 Learning Goals

By the end of this week, you should be able to:

1. ✅ Identify when to use DP
2. ✅ Design states and transitions
3. ✅ Convert between top-down and bottom-up
4. ✅ Recognize knapsack pattern variations
5. ✅ Solve string DP problems

---

## 📊 DP Problem-Solving Framework

### Step 1: Identify it's a DP problem
- Can be broken into overlapping subproblems
- Has optimal substructure

### Step 2: Define the state
- What variables define a subproblem?
- `dp[i]` = answer for first i elements

### Step 3: Write the recurrence relation
- How do subproblems relate?
- `dp[i] = f(dp[i-1], dp[i-2], ...)`

### Step 4: Identify base cases
- What are the smallest subproblems?
- `dp[0] = ?, dp[1] = ?`

### Step 5: Determine computation order
- Bottom-up: smaller to larger
- Top-down: recursive with memo

---

## 🔥 FAANG Interview Questions

| Problem | Difficulty | Company | Pattern |
|---------|------------|---------|---------|
| Climbing Stairs | Easy | All | 1D DP |
| House Robber | Medium | Google, Amazon | 1D DP |
| Coin Change | Medium | Meta, Amazon | Unbounded Knapsack |
| Longest Increasing Subsequence | Medium | Google, Microsoft | 1D DP |
| Unique Paths | Medium | Google, Meta | 2D Grid DP |
| Edit Distance | Medium | Google, Amazon | String DP |
| Longest Common Subsequence | Medium | Amazon, Google | String DP |
| Word Break | Medium | Meta, Amazon | 1D DP |
| Decode Ways | Medium | Meta, Google | 1D DP |
| Partition Equal Subset Sum | Medium | Meta | 0/1 Knapsack |

---

## ⏰ Time Commitment

- **DP Fundamentals**: 3-4 hours
- **1D & 2D DP**: 4-5 hours
- **Knapsack Patterns**: 3-4 hours
- **String DP**: 3-4 hours
- **Problem Solving**: 8-10 hours
- **Total**: ~22 hours

---

## ✅ Progress Tracker

- [ ] Understand memoization vs tabulation
- [ ] Master state design
- [ ] Complete 1D DP problems
- [ ] Complete 2D DP problems
- [ ] Master knapsack pattern
- [ ] Solve string DP problems
- [ ] Complete 15+ DP problems

---

## ➡️ Next Week
[Week 12: Advanced Patterns & Revision](../Week-12-Advanced-Revision/)
