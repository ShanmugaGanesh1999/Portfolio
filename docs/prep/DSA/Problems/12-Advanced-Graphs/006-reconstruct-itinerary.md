# Reconstruct Itinerary

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 332 | Eulerian Path + DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find lexicographically smallest itinerary using all tickets starting from "JFK".

### Constraints & Clarifying Questions
1. **Use all tickets?** Yes, exactly once.
2. **Multiple tickets same route?** Yes, use all.
3. **Start always JFK?** Yes.
4. **Valid itinerary exists?** Guaranteed.

### Edge Cases
1. **Single ticket:** [JFK, destination]
2. **Circular route:** Must return to use all tickets
3. **Multiple same destinations:** Lexicographic order

---

## Phase 2: High-Level Approach

### Approach: Hierholzer's Algorithm
Build adjacency list sorted lexicographically. DFS with postorder for Eulerian path.

**Core Insight:** Eulerian path visits every edge exactly once; postorder gives correct order.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict
import heapq


def solve(tickets: List[List[str]]) -> List[str]:
    """
    Reconstruct itinerary using all tickets.
    
    Args:
        tickets: List of [from, to] tickets
    
    Returns:
        Lexicographically smallest itinerary
    """
    # Build adjacency list with min-heap for lexicographic order
    graph = defaultdict(list)
    for src, dst in tickets:
        heapq.heappush(graph[src], dst)
    
    itinerary = []
    
    def dfs(airport: str):
        while graph[airport]:
            next_airport = heapq.heappop(graph[airport])
            dfs(next_airport)
        itinerary.append(airport)
    
    dfs("JFK")
    
    return itinerary[::-1]


def solve_with_stack(tickets: List[List[str]]) -> List[str]:
    """
    Iterative version using stack.
    """
    graph = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        graph[src].append(dst)
    
    stack = ["JFK"]
    itinerary = []
    
    while stack:
        while graph[stack[-1]]:
            stack.append(graph[stack[-1]].pop())
        itinerary.append(stack.pop())
    
    return itinerary[::-1]


def solve_backtracking(tickets: List[List[str]]) -> List[str]:
    """
    Backtracking approach (less efficient but intuitive).
    """
    graph = defaultdict(list)
    for src, dst in tickets:
        graph[src].append(dst)
    
    # Sort for lexicographic order
    for src in graph:
        graph[src].sort()
    
    itinerary = ["JFK"]
    
    def backtrack():
        if len(itinerary) == len(tickets) + 1:
            return True
        
        airport = itinerary[-1]
        
        for i, next_airport in enumerate(graph[airport]):
            # Use this ticket
            graph[airport].pop(i)
            itinerary.append(next_airport)
            
            if backtrack():
                return True
            
            # Backtrack
            itinerary.pop()
            graph[airport].insert(i, next_airport)
        
        return False
    
    backtrack()
    return itinerary
```

---

## Phase 4: Dry Run

**Input:** `[["MU","LHR"],["JFK","MU"],["SFO","SJC"],["LHR","SFO"]]`

**Graph:**
```
JFK → [MU]
MU → [LHR]
LHR → [SFO]
SFO → [SJC]
SJC → []
```

**DFS from JFK:**
- JFK → MU (pop) → LHR (pop) → SFO (pop) → SJC (pop)
- SJC has no more → append "SJC"
- SFO has no more → append "SFO"
- LHR has no more → append "LHR"
- MU has no more → append "MU"
- JFK has no more → append "JFK"

**Itinerary (reversed):** ["JFK", "MU", "LHR", "SFO", "SJC"]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(E log E)
E = number of tickets. Sorting/heap operations.

### Space Complexity: O(E)
Graph storage + recursion stack.

---

## Phase 6: Follow-Up Questions

1. **"Multiple valid itineraries?"**
   → Enumerate all by trying different edges.

2. **"No valid itinerary?"**
   → Check Eulerian path conditions: at most 2 odd-degree nodes.

3. **"Minimize total distance?"**
   → Different problem; weighted Eulerian path.
