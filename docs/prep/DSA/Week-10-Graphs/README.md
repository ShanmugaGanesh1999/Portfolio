# 📅 Week 10: Graphs

## 🎯 Overview

Graphs are ubiquitous in FAANG interviews. This week covers graph representations, traversals, and essential algorithms.

---

## 📚 Topics Covered

### 1. Graph Fundamentals
- Graph terminology
- Representations (Adjacency List, Matrix)
- Directed vs Undirected

### 2. Graph Traversals
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Applications of each

### 3. Essential Algorithms
- Cycle Detection
- Topological Sort
- Connected Components
- Shortest Path (BFS, Dijkstra)
- Union Find

---

## 📁 Folder Structure

```
Week-10-Graphs/
├── README.md
├── 01-Graph-Fundamentals/
│   └── graphs_explained.md
└── 03-Algorithms/
    ├── topological_sort.md
    └── union_find.md
```

> 📝 **Note:** Practice problems for Graphs can be found in the main [Problems/11-Graphs/](../Problems/11-Graphs/) and [Problems/12-Advanced-Graphs/](../Problems/12-Advanced-Graphs/) folders.

---

## 🎯 Learning Goals

By the end of this week, you should be able to:

1. ✅ Implement graph representations
2. ✅ Master DFS and BFS traversals
3. ✅ Detect cycles in directed/undirected graphs
4. ✅ Implement topological sort
5. ✅ Use Union Find for connectivity

---

## 📊 Key Concepts

### Graph Representation
```python
# Adjacency List (most common)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

# Adjacency Matrix
#     A  B  C  D
# A  [0, 1, 1, 0]
# B  [1, 0, 0, 1]
# C  [1, 0, 0, 1]
# D  [0, 1, 1, 0]
```

### DFS vs BFS

| Aspect | DFS | BFS |
|--------|-----|-----|
| Data Structure | Stack | Queue |
| Memory | O(H) | O(W) |
| Use Case | Paths, cycles | Shortest path |
| Traversal | Deep first | Level by level |

---

## 🔥 FAANG Interview Questions

| Problem | Difficulty | Company | Pattern |
|---------|------------|---------|---------|
| Number of Islands | Medium | Amazon, Google | DFS/BFS |
| Clone Graph | Medium | Meta, Amazon | DFS/BFS |
| Course Schedule | Medium | Meta, Google | Topological Sort |
| Course Schedule II | Medium | Amazon | Topological Sort |
| Word Ladder | Hard | Meta, Amazon | BFS |
| Pacific Atlantic | Medium | Google | DFS |
| Rotting Oranges | Medium | Amazon | BFS |
| Accounts Merge | Medium | Meta | Union Find |
| Graph Valid Tree | Medium | Google | Union Find |

---

## ⏰ Time Commitment

- **Graph Fundamentals**: 2-3 hours
- **DFS/BFS Mastery**: 4-5 hours
- **Algorithms**: 4-5 hours
- **Problem Solving**: 6-7 hours
- **Total**: ~17 hours

---

## ✅ Progress Tracker

- [ ] Implement adjacency list and matrix
- [ ] Master DFS (recursive & iterative)
- [ ] Master BFS
- [ ] Learn topological sort
- [ ] Implement Union Find
- [ ] Complete 12+ graph problems

---

## ➡️ Next Week
[Week 11: Dynamic Programming](../Week-11-Dynamic-Programming/)
