# 📝 String Fundamentals in Python

## 🎯 Introduction

Strings are one of the most commonly asked topics in coding interviews. Understanding string operations and their complexities is crucial.

---

## 🧠 Key Properties of Python Strings

### 1. Immutability

```python
# Strings are IMMUTABLE - cannot be changed in place
s = "hello"
# s[0] = 'H'  # ❌ TypeError!

# Must create a new string
s = 'H' + s[1:]  # "Hello"
```

**Why does this matter?**
- String concatenation in a loop is O(n²) 
- Use `''.join()` for O(n) concatenation

### 2. String Creation

```python
# Different ways to create strings
s1 = "Hello"
s2 = 'World'
s3 = """Multi
line
string"""
s4 = str(123)  # "123"
s5 = 'a' * 5   # "aaaaa"
```

---

## 🔧 Essential String Operations

### Accessing Characters

```python
s = "Python"

# Indexing (0-based)
s[0]      # 'P' (first)
s[-1]     # 'n' (last)
s[-2]     # 'o' (second to last)

# Slicing [start:end:step]
s[0:3]    # "Pyt"
s[:3]     # "Pyt"
s[3:]     # "hon"
s[::2]    # "Pto" (every 2nd)
s[::-1]   # "nohtyP" (reversed)
```

### String Methods

```python
s = "  Hello World  "

# Case methods
s.upper()       # "  HELLO WORLD  "
s.lower()       # "  hello world  "
s.capitalize()  # "  hello world  "
s.title()       # "  Hello World  "
s.swapcase()    # "  hELLO wORLD  "

# Whitespace
s.strip()       # "Hello World"
s.lstrip()      # "Hello World  "
s.rstrip()      # "  Hello World"

# Finding
s.find('o')         # 4 (first occurrence)
s.rfind('o')        # 7 (last occurrence)
s.find('x')         # -1 (not found)
s.index('o')        # 4 (raises error if not found)
s.count('l')        # 3

# Checking
s.startswith('  He')  # True
s.endswith('  ')      # True
s.isalpha()           # False (has spaces)
s.isdigit()           # False
s.isalnum()           # False
```

### String Modification

```python
s = "hello world"

# Replace
s.replace('l', 'L')      # "heLLo worLd"
s.replace('l', 'L', 1)   # "heLlo world" (only first)

# Split and Join
s.split()                # ['hello', 'world']
s.split('o')             # ['hell', ' w', 'rld']
'-'.join(['a', 'b', 'c']) # "a-b-c"

# Padding
"42".zfill(5)            # "00042"
"hi".ljust(5, '-')       # "hi---"
"hi".rjust(5, '-')       # "---hi"
"hi".center(6, '-')      # "--hi--"
```

---

## ⚡ Time Complexities

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Access by index | O(1) | |
| Slicing | O(k) | k = slice length |
| Concatenation (+) | O(n+m) | Creates new string |
| `in` check | O(n) | Linear search |
| `find()`/`index()` | O(n*m) | n = string, m = pattern |
| `join()` | O(n) | n = total characters |
| `split()` | O(n) | |
| `replace()` | O(n) | |
| Comparison | O(n) | |

---

## ⚠️ Common Pitfalls

### 1. String Concatenation in Loops

```python
# ❌ BAD: O(n²) - creates new string each iteration
result = ""
for char in "hello":
    result += char  # New string created each time!

# ✅ GOOD: O(n) - use list and join
chars = []
for char in "hello":
    chars.append(char)
result = ''.join(chars)

# ✅ BETTER: List comprehension
result = ''.join([char for char in "hello"])
```

### 2. Reversing Strings

```python
# Simple reversal
s = "hello"
reversed_s = s[::-1]  # "olleh"

# Using join and reversed()
reversed_s = ''.join(reversed(s))
```

### 3. Checking Palindrome

```python
def is_palindrome(s: str) -> bool:
    """Check if string is palindrome."""
    # Clean the string: lowercase, alphanumeric only
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

# Two pointer approach (more efficient for early exit)
def is_palindrome_two_pointer(s: str) -> bool:
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

---

## 🔢 ASCII & Character Operations

```python
# Character to ASCII
ord('A')  # 65
ord('a')  # 97
ord('0')  # 48

# ASCII to character
chr(65)   # 'A'
chr(97)   # 'a'

# Character arithmetic
chr(ord('a') + 1)  # 'b'
chr(ord('A') + 25) # 'Z'

# Check character type
'a'.isalpha()   # True
'1'.isdigit()   # True
'a'.islower()   # True
'A'.isupper()   # True
```

### Character Frequency with Array

```python
def char_frequency(s: str) -> list:
    """
    Count frequency using array (faster than dict for lowercase letters).
    """
    freq = [0] * 26
    for char in s:
        if char.isalpha():
            freq[ord(char.lower()) - ord('a')] += 1
    return freq

# Example
s = "aabbbc"
freq = char_frequency(s)
# freq[0] = 2 (a), freq[1] = 3 (b), freq[2] = 1 (c)
```

---

## 🧩 String Building Pattern

For building strings character by character:

```python
def build_string_example(words: list) -> str:
    """
    Efficient string building pattern.
    """
    result = []
    
    for word in words:
        # Process word
        processed = word.lower()
        result.append(processed)
    
    return ' '.join(result)
```

---

## 📚 Important String Algorithms

### 1. KMP Pattern Matching (Advanced)

For finding pattern in text efficiently.

```python
def kmp_search(text: str, pattern: str) -> int:
    """
    KMP string matching algorithm.
    Time: O(n + m)
    """
    if not pattern:
        return 0
    
    # Build failure function
    def build_lps(pattern):
        lps = [0] * len(pattern)
        length = 0
        i = 1
        
        while i < len(pattern):
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps
    
    lps = build_lps(pattern)
    i = j = 0
    
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == len(pattern):
            return i - j  # Found at index
        
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return -1  # Not found
```

### 2. Rabin-Karp (Hash-based matching)

```python
def rabin_karp(text: str, pattern: str) -> int:
    """
    Rabin-Karp using rolling hash.
    Average: O(n + m), Worst: O(nm)
    """
    if not pattern:
        return 0
    
    n, m = len(text), len(pattern)
    if m > n:
        return -1
    
    base = 26
    mod = 10**9 + 7
    
    # Calculate hash of pattern and first window
    pattern_hash = 0
    window_hash = 0
    base_power = 1
    
    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        window_hash = (window_hash * base + ord(text[i])) % mod
        if i < m - 1:
            base_power = (base_power * base) % mod
    
    # Slide window
    for i in range(n - m + 1):
        if pattern_hash == window_hash:
            if text[i:i+m] == pattern:
                return i
        
        # Calculate next window hash
        if i < n - m:
            window_hash = ((window_hash - ord(text[i]) * base_power) * base 
                          + ord(text[i + m])) % mod
    
    return -1
```

---

## 📝 Key Takeaways

1. **Strings are immutable** - use `''.join()` for efficient concatenation
2. **Know your string methods** - `split()`, `join()`, `find()`, `replace()`
3. **Use ASCII values** for character math and counting
4. **Two pointers** work great for palindrome and comparison problems
5. **Character frequency** can use array (26 letters) or hash map

---

## ➡️ Next: [HashMap Implementation](../02-HashMap-Implementation/hashmap_explained.md)
