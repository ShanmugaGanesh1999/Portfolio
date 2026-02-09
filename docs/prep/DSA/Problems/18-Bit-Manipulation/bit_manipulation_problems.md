# 🔧 Bit Manipulation - Complete Problem Set

## Problem 1: Single Number (Easy)
**LeetCode 136**

### Problem
Every element appears twice except one. Find it.

### Intuition
XOR all numbers. Duplicates cancel out (a ⊕ a = 0).

### Solution
```python
def singleNumber(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    result = 0
    for num in nums:
        result ^= num
    return result
```

---

## Problem 2: Number of 1 Bits (Easy)
**LeetCode 191**

### Problem
Count number of '1' bits in integer.

### Intuition
n & (n-1) removes rightmost 1 bit.

### Solution
```python
def hammingWeight(n: int) -> int:
    """
    Time: O(1) - max 32 iterations
    Space: O(1)
    """
    count = 0
    while n:
        n &= (n - 1)  # Remove rightmost 1
        count += 1
    return count

# Alternative using bin()
def hammingWeight_alt(n: int) -> int:
    return bin(n).count('1')
```

---

## Problem 3: Counting Bits (Easy)
**LeetCode 338**

### Problem
For each i in [0, n], count 1 bits.

### Intuition
dp[i] = dp[i >> 1] + (i & 1). Number has same bits as i/2, plus last bit.

### Solution
```python
def countBits(n: int) -> list[int]:
    """
    Time: O(n)
    Space: O(n)
    """
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp

# Alternative: dp[i] = dp[i & (i-1)] + 1
def countBits_alt(n: int) -> list[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i & (i - 1)] + 1
    return dp
```

---

## Problem 4: Reverse Bits (Easy)
**LeetCode 190**

### Problem
Reverse bits of 32-bit unsigned integer.

### Intuition
Extract each bit from right, add to result from left.

### Solution
```python
def reverseBits(n: int) -> int:
    """
    Time: O(1) - 32 iterations
    Space: O(1)
    """
    result = 0
    
    for i in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    
    return result
```

---

## Problem 5: Missing Number (Easy)
**LeetCode 268**

### Problem
Array contains n distinct numbers from [0, n]. Find missing.

### Intuition
XOR all indices and values. Result is missing number.

### Solution
```python
def missingNumber(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    result = len(nums)
    
    for i, num in enumerate(nums):
        result ^= i ^ num
    
    return result

# Alternative: Math approach
def missingNumber_math(nums: list[int]) -> int:
    n = len(nums)
    expected = n * (n + 1) // 2
    return expected - sum(nums)
```

---

## Problem 6: Sum of Two Integers (Medium)
**LeetCode 371**

### Problem
Add two integers without + or -.

### Intuition
a ^ b gives sum without carry. (a & b) << 1 gives carry.

### Solution
```python
def getSum(a: int, b: int) -> int:
    """
    Time: O(1) - max 32 iterations
    Space: O(1)
    """
    # Python has arbitrary precision, need mask
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    
    while b != 0:
        carry = ((a & b) << 1) & MASK
        a = (a ^ b) & MASK
        b = carry
    
    # Handle negative numbers
    return a if a <= MAX_INT else ~(a ^ MASK)
```

---

## Problem 7: Reverse Integer (Medium)
**LeetCode 7**

### Problem
Reverse digits of integer, return 0 if overflow.

### Intuition
Extract digits from right, build reversed number.

### Solution
```python
def reverse(x: int) -> int:
    """
    Time: O(log x)
    Space: O(1)
    """
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    
    sign = 1 if x >= 0 else -1
    x = abs(x)
    
    result = 0
    while x:
        digit = x % 10
        x //= 10
        
        # Check overflow before adding
        if result > (INT_MAX - digit) // 10:
            return 0
        
        result = result * 10 + digit
    
    result *= sign
    
    if result < INT_MIN or result > INT_MAX:
        return 0
    
    return result
```

---

## Problem 8: Single Number II (Medium)
**LeetCode 137**

### Problem
Every element appears three times except one. Find it.

### Intuition
Count bits at each position mod 3.

### Solution
```python
def singleNumber(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    ones = twos = 0
    
    for num in nums:
        # ones holds bits appearing once (mod 3)
        # twos holds bits appearing twice (mod 3)
        ones = (ones ^ num) & ~twos
        twos = (twos ^ num) & ~ones
    
    return ones

# Alternative: Bit counting
def singleNumber_count(nums: list[int]) -> int:
    result = 0
    for i in range(32):
        bit_sum = sum((num >> i) & 1 for num in nums)
        if bit_sum % 3:
            result |= (1 << i)
    
    # Handle negative numbers
    if result >= 2**31:
        result -= 2**32
    return result
```

---

## Problem 9: Single Number III (Medium)
**LeetCode 260**

### Problem
Two elements appear once, others twice. Find both.

### Intuition
XOR all gives a^b. Find differing bit to separate groups.

### Solution
```python
def singleNumber(nums: list[int]) -> list[int]:
    """
    Time: O(n)
    Space: O(1)
    """
    # XOR of both single numbers
    xor = 0
    for num in nums:
        xor ^= num
    
    # Find rightmost different bit
    diff_bit = xor & (-xor)
    
    # Separate into two groups
    a = b = 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

---

## Problem 10: Bitwise AND of Numbers Range (Medium)
**LeetCode 201**

### Problem
Find bitwise AND of all numbers in [left, right].

### Intuition
Find common prefix of left and right.

### Solution
```python
def rangeBitwiseAnd(left: int, right: int) -> int:
    """
    Time: O(1) - max 32 iterations
    Space: O(1)
    """
    shift = 0
    
    # Find common prefix
    while left < right:
        left >>= 1
        right >>= 1
        shift += 1
    
    return left << shift
```

---

## 📊 Bit Manipulation Summary

| Problem | Key Technique |
|---------|---------------|
| Single Number | XOR all (a⊕a=0) |
| Number of 1 Bits | n & (n-1) removes rightmost 1 |
| Counting Bits | dp[i] = dp[i>>1] + (i&1) |
| Reverse Bits | Extract right, build left |
| Missing Number | XOR indices with values |
| Sum of Two Integers | XOR for sum, AND+shift for carry |
| Reverse Integer | Extract digits, check overflow |
| Single Number II | Ones/twos tracking (mod 3) |
| Single Number III | Find diff bit, separate groups |
| Range Bitwise AND | Find common prefix |

---

## 🧠 Bit Manipulation Cheat Sheet

### Essential Operations

```python
# Get i-th bit (0-indexed from right)
(n >> i) & 1

# Set i-th bit to 1
n | (1 << i)

# Clear i-th bit (set to 0)
n & ~(1 << i)

# Toggle i-th bit
n ^ (1 << i)

# Check if power of 2
n > 0 and (n & (n - 1)) == 0

# Get rightmost 1 bit
n & (-n)

# Remove rightmost 1 bit
n & (n - 1)

# Count 1 bits
bin(n).count('1')

# Check if odd
n & 1 == 1

# Multiply by 2
n << 1

# Divide by 2
n >> 1

# Swap without temp
a ^= b; b ^= a; a ^= b
```

### XOR Properties
```python
a ^ 0 = a        # Identity
a ^ a = 0        # Self-inverse
a ^ b = b ^ a    # Commutative
(a ^ b) ^ c = a ^ (b ^ c)  # Associative
```

### Common Patterns

**1. Find Single Element (others appear twice):**
```python
result = 0
for num in nums:
    result ^= num
```

**2. Find Missing Number (0 to n):**
```python
result = n
for i, num in enumerate(nums):
    result ^= i ^ num
```

**3. Detect Power of 2:**
```python
is_power_of_2 = n > 0 and (n & (n - 1)) == 0
```

**4. Get All Subsets:**
```python
n = len(nums)
for mask in range(1 << n):
    subset = [nums[i] for i in range(n) if mask & (1 << i)]
```

**5. Two's Complement (negative numbers):**
```python
# -n = ~n + 1
# Rightmost 1 bit: n & (-n)
```

### Bit Masks for 32-bit Integers
```python
MASK = 0xFFFFFFFF      # All 1s (32 bits)
MAX_INT = 0x7FFFFFFF   # 2^31 - 1
MIN_INT = 0x80000000   # -2^31

# Handle negative in Python
if result > MAX_INT:
    result = ~(result ^ MASK)
```

### Useful Built-in Functions
```python
bin(n)          # Binary string: '0b1010'
int('1010', 2)  # Binary to int: 10
n.bit_length()  # Number of bits needed
n.bit_count()   # Count of 1 bits (Python 3.10+)
```
