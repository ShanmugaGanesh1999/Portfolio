# 🗂️ Hash Map Explained

## 🎯 What is a Hash Map?

A **Hash Map** (or Hash Table, Dictionary) is a data structure that stores key-value pairs and provides **O(1) average** time for insert, delete, and lookup operations.

---

## 🧠 How Does It Work?

### The Core Idea

```
Key → Hash Function → Index → Store Value at Index

Example:
"apple" → hash("apple") → 42 → buckets[42] = value
```

### Components

1. **Hash Function**: Converts key to array index
2. **Buckets**: Array to store values
3. **Collision Handling**: When two keys hash to same index

---

## 📊 Visual Representation

```
Hash Table with Chaining:

Index   Buckets
  0  →  [("cat", 5)]
  1  →  []
  2  →  [("dog", 3) → ("fog", 8)]  ← Collision!
  3  →  []
  4  →  [("bird", 2)]
  ...
```

---

## 🐍 Python's Dictionary (dict)

Python's `dict` is a highly optimized hash map implementation.

### Basic Operations

```python
# Creating dictionaries
d = {}                      # Empty dict
d = {'a': 1, 'b': 2}       # With initial values
d = dict(a=1, b=2)         # Using dict()
d = dict([('a', 1), ('b', 2)])  # From list of tuples

# Access
d['a']              # 1 (raises KeyError if not found)
d.get('a')          # 1 (returns None if not found)
d.get('c', 0)       # 0 (returns default if not found)

# Modification
d['c'] = 3          # Add or update
d.update({'d': 4})  # Update with another dict

# Deletion
del d['a']          # Remove key
value = d.pop('b')  # Remove and return value
d.pop('z', None)    # Remove with default (no error)
d.clear()           # Remove all
```

### Iteration

```python
d = {'a': 1, 'b': 2, 'c': 3}

# Keys
for key in d:
    print(key)

for key in d.keys():
    print(key)

# Values
for value in d.values():
    print(value)

# Key-Value pairs
for key, value in d.items():
    print(f"{key}: {value}")
```

### Useful Methods

```python
d = {'a': 1, 'b': 2}

# Check existence
'a' in d           # True
'z' in d           # False

# Get with default
d.setdefault('c', 3)  # Returns 3, adds if not present

# Merge (Python 3.9+)
d1 = {'a': 1}
d2 = {'b': 2}
merged = d1 | d2   # {'a': 1, 'b': 2}
```

---

## 📦 collections.Counter

`Counter` is a specialized dict for counting hashable objects.

```python
from collections import Counter

# Creating Counter
c = Counter("aabbbc")         # Counter({'b': 3, 'a': 2, 'c': 1})
c = Counter(['a', 'a', 'b'])  # Counter({'a': 2, 'b': 1})
c = Counter({'a': 2, 'b': 1}) # From dict

# Operations
c['a']                # 2
c['z']                # 0 (doesn't raise error!)
c.most_common(2)      # [('b', 3), ('a', 2)]

# Arithmetic
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
c1 + c2               # Counter({'a': 4, 'b': 3})
c1 - c2               # Counter({'a': 2})
c1 & c2               # Intersection: Counter({'a': 1, 'b': 1})
c1 | c2               # Union: Counter({'a': 3, 'b': 2})
```

---

## 📦 collections.defaultdict

`defaultdict` provides a default value for missing keys.

```python
from collections import defaultdict

# Default int (0)
d = defaultdict(int)
d['a'] += 1  # No KeyError! d['a'] = 1

# Default list
d = defaultdict(list)
d['group1'].append('item1')  # Automatically creates list

# Default set
d = defaultdict(set)
d['category'].add('item')

# Custom default
d = defaultdict(lambda: 'unknown')
d['missing']  # 'unknown'
```

---

## ⚡ Time Complexities

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Search | O(1) | O(n) |
| Get all keys | O(n) | O(n) |

**Note:** Worst case O(n) happens with many collisions (rare with good hash function).

---

## 🧩 Common Hash Map Patterns

### 1. Frequency Counter

```python
def count_frequency(arr):
    """Count frequency of each element."""
    freq = {}
    for item in arr:
        freq[item] = freq.get(item, 0) + 1
    return freq

# Or use Counter
from collections import Counter
freq = Counter(arr)
```

### 2. Two Sum Pattern

```python
def two_sum(nums, target):
    """Find indices of two numbers that add to target."""
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

### 3. Grouping Pattern

```python
from collections import defaultdict

def group_by_key(items, key_func):
    """Group items by a key function."""
    groups = defaultdict(list)
    for item in items:
        key = key_func(item)
        groups[key].append(item)
    return dict(groups)

# Example: Group words by length
words = ["a", "bb", "ccc", "dd", "e"]
grouped = group_by_key(words, len)
# {1: ['a', 'e'], 2: ['bb', 'dd'], 3: ['ccc']}
```

### 4. Prefix Sum with Hash Map

```python
def subarray_sum(nums, k):
    """Count subarrays with sum equal to k."""
    count = 0
    prefix_sum = 0
    prefix_count = {0: 1}
    
    for num in nums:
        prefix_sum += num
        if prefix_sum - k in prefix_count:
            count += prefix_count[prefix_sum - k]
        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
    
    return count
```

---

## 🎯 Common Interview Problems

| Problem | Pattern |
|---------|---------|
| Two Sum | Hash map for complement |
| Valid Anagram | Character frequency |
| Group Anagrams | Sorted string as key |
| First Unique Character | Frequency count |
| Longest Substring Without Repeating | Hash map + sliding window |
| Contains Duplicate | Hash set |
| Isomorphic Strings | Character mapping |
| Word Pattern | Bijective mapping |

---

## 📝 Key Takeaways

1. **Hash maps provide O(1) average** for basic operations
2. **Use Counter** for counting problems
3. **Use defaultdict** to avoid KeyError
4. **Common patterns**: frequency counting, complement finding, grouping
5. **Keys must be hashable** (immutable): strings, numbers, tuples

---

## ➡️ Next: [HashMap Implementation from Scratch](./hashmap.py)
