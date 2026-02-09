# Accounts Merge

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 721 | Union-Find / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Merge accounts with common emails. Same person may have multiple accounts.

### Constraints & Clarifying Questions
1. **Account format?** [name, email1, email2, ...]
2. **Same name = same person?** No, only if share email.
3. **Output format?** [name, email1, email2, ...] sorted.
4. **Email uniqueness across people?** Yes, identifies person.

### Edge Cases
1. **No common emails:** No merging
2. **Chain merge:** A shares with B, B shares with C → all merge
3. **Same name, different people:** Keep separate

---

## Phase 2: High-Level Approach

### Approach: Union-Find on Emails
Union emails from same account. Group by root; map to name.

**Core Insight:** Email uniquely identifies; name is just label.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict


def solve(accounts: List[List[str]]) -> List[List[str]]:
    """
    Merge accounts with common emails.
    
    Args:
        accounts: List of [name, email1, email2, ...]
    
    Returns:
        Merged accounts with sorted emails
    """
    parent = {}
    
    def find(x: str) -> str:
        if parent.get(x, x) != x:
            parent[x] = find(parent[x])
        return parent.get(x, x)
    
    def union(x: str, y: str):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    # Union emails in same account
    email_to_name = {}
    
    for account in accounts:
        name = account[0]
        first_email = account[1]
        
        for email in account[1:]:
            email_to_name[email] = name
            union(email, first_email)
    
    # Group emails by root
    groups = defaultdict(list)
    
    for email in email_to_name:
        root = find(email)
        groups[root].append(email)
    
    # Build result
    result = []
    for root, emails in groups.items():
        name = email_to_name[root]
        result.append([name] + sorted(emails))
    
    return result


def solve_dfs(accounts: List[List[str]]) -> List[List[str]]:
    """
    DFS approach with email graph.
    """
    # Build graph: email -> [connected emails]
    graph = defaultdict(set)
    email_to_name = {}
    
    for account in accounts:
        name = account[0]
        emails = account[1:]
        
        for email in emails:
            email_to_name[email] = name
        
        # Connect all emails in account
        for i in range(len(emails)):
            for j in range(i + 1, len(emails)):
                graph[emails[i]].add(emails[j])
                graph[emails[j]].add(emails[i])
    
    # DFS to find components
    visited = set()
    result = []
    
    def dfs(email, component):
        visited.add(email)
        component.append(email)
        for neighbor in graph[email]:
            if neighbor not in visited:
                dfs(neighbor, component)
    
    for email in email_to_name:
        if email not in visited:
            component = []
            dfs(email, component)
            name = email_to_name[email]
            result.append([name] + sorted(component))
    
    return result
```

---

## Phase 4: Dry Run

**Input:**
```
[["John", "j1@mail.com", "j2@mail.com"],
 ["John", "j3@mail.com"],
 ["John", "j1@mail.com", "j4@mail.com"],
 ["Mary", "m@mail.com"]]
```

**Union-Find:**
- Account 1: union(j2, j1)
- Account 2: j3 alone
- Account 3: union(j4, j1), union(j1, j1) - already
- Account 4: m alone

**Groups:**
- Root j1: [j1, j2, j4]
- Root j3: [j3]
- Root m: [m]

**Result:**
```
[["John", "j1@mail.com", "j2@mail.com", "j4@mail.com"],
 ["John", "j3@mail.com"],
 ["Mary", "m@mail.com"]]
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × K × α(N×K) + sort)
N accounts, K emails each.

### Space Complexity: O(N × K)
Parent map and groups.

---

## Phase 6: Follow-Up Questions

1. **"Stream of accounts?"**
   → Maintain Union-Find incrementally.

2. **"Find person by email?"**
   → Map email to root; root to person.

3. **"Delete account?"**
   → More complex; need rebuild or lazy deletion.
