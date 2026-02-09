# 🔢 Math & Geometry - Complete Problem Set

## Problem 1: Happy Number (Easy)
**LeetCode 202**

### Problem
Determine if number eventually reaches 1 by summing squares of digits.

### Intuition
Floyd's cycle detection. If cycle without 1, not happy.

### Solution
```python
def isHappy(n: int) -> bool:
    """
    Time: O(log n)
    Space: O(1)
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = fast = n
    
    while True:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
        
        if fast == 1:
            return True
        if slow == fast:
            return False
```

---

## Problem 2: Plus One (Easy)
**LeetCode 66**

### Problem
Add one to number represented as array of digits.

### Intuition
Handle carry from right to left.

### Solution
```python
def plusOne(digits: list[int]) -> list[int]:
    """
    Time: O(n)
    Space: O(1) or O(n) if new digit needed
    """
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    
    return [1] + digits
```

---

## Problem 3: Pow(x, n) (Medium)
**LeetCode 50**

### Problem
Implement pow(x, n).

### Intuition
Fast exponentiation: x^n = (x^2)^(n/2)

### Solution
```python
def myPow(x: float, n: int) -> float:
    """
    Time: O(log n)
    Space: O(1)
    """
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1
    
    while n > 0:
        if n % 2 == 1:
            result *= x
        x *= x
        n //= 2
    
    return result
```

---

## Problem 4: Multiply Strings (Medium)
**LeetCode 43**

### Problem
Multiply two non-negative integers represented as strings.

### Intuition
Grade school multiplication. Product of digits at i and j goes to position i+j and i+j+1.

### Solution
```python
def multiply(num1: str, num2: str) -> str:
    """
    Time: O(m * n)
    Space: O(m + n)
    """
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    result = [0] * (m + n)
    
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            product = int(num1[i]) * int(num2[j])
            p1, p2 = i + j, i + j + 1
            
            total = product + result[p2]
            result[p2] = total % 10
            result[p1] += total // 10
    
    # Remove leading zeros
    start = 0
    while start < len(result) - 1 and result[start] == 0:
        start += 1
    
    return ''.join(map(str, result[start:]))
```

---

## Problem 5: Detect Squares (Medium)
**LeetCode 2013**

### Problem
Design data structure to count axis-aligned squares given a query point.

### Intuition
For query point, find diagonal points and check if other two corners exist.

### Solution
```python
from collections import defaultdict

class DetectSquares:
    """
    add: O(1)
    count: O(n)
    """
    def __init__(self):
        self.points = defaultdict(int)
        self.x_coords = defaultdict(list)
    
    def add(self, point: list[int]) -> None:
        x, y = point
        self.points[(x, y)] += 1
        self.x_coords[x].append(y)
    
    def count(self, point: list[int]) -> int:
        x1, y1 = point
        total = 0
        
        # Find all points with same x coordinate
        for y2 in self.x_coords[x1]:
            if y2 == y1:
                continue
            
            side = abs(y2 - y1)
            
            # Check squares to the left and right
            for x2 in [x1 - side, x1 + side]:
                # Need points at (x2, y1) and (x2, y2)
                total += self.points[(x2, y1)] * self.points[(x2, y2)]
        
        return total
```

---

## Problem 6: Rotate Image (Medium)
**LeetCode 48**

### Problem
Rotate image 90 degrees clockwise.

### Intuition
Transpose then reverse each row.

### Solution
```python
def rotate(matrix: list[list[int]]) -> None:
    """
    Time: O(n²)
    Space: O(1)
    """
    n = len(matrix)
    
    # Transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for row in matrix:
        row.reverse()
```

---

## Problem 7: Spiral Matrix (Medium)
**LeetCode 54**

### Problem
Return all elements in spiral order.

### Intuition
Track boundaries (top, bottom, left, right) and shrink.

### Solution
```python
def spiralOrder(matrix: list[list[int]]) -> list[int]:
    """
    Time: O(m * n)
    Space: O(1) excluding output
    """
    if not matrix:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Right
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Down
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        # Left
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Up
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result
```

---

## Problem 8: Set Matrix Zeroes (Medium)
**LeetCode 73**

### Problem
If element is 0, set entire row and column to 0.

### Intuition
Use first row/column as markers.

### Solution
```python
def setZeroes(matrix: list[list[int]]) -> None:
    """
    Time: O(m * n)
    Space: O(1)
    """
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Use first row/col as markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Set zeros based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first row/col
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

## Problem 9: Spiral Matrix II (Medium)
**LeetCode 59**

### Problem
Generate n×n matrix filled with elements 1 to n² in spiral order.

### Intuition
Same boundary approach, fill instead of read.

### Solution
```python
def generateMatrix(n: int) -> list[list[int]]:
    """
    Time: O(n²)
    Space: O(n²)
    """
    matrix = [[0] * n for _ in range(n)]
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        # Right
        for col in range(left, right + 1):
            matrix[top][col] = num
            num += 1
        top += 1
        
        # Down
        for row in range(top, bottom + 1):
            matrix[row][right] = num
            num += 1
        right -= 1
        
        # Left
        for col in range(right, left - 1, -1):
            matrix[bottom][col] = num
            num += 1
        bottom -= 1
        
        # Up
        for row in range(bottom, top - 1, -1):
            matrix[row][left] = num
            num += 1
        left += 1
    
    return matrix
```

---

## Problem 10: Robot Bounded In Circle (Medium)
**LeetCode 1041**

### Problem
Check if robot returns to origin or faces different direction after instructions.

### Intuition
After one cycle, if not at origin AND facing north, will never return.

### Solution
```python
def isRobotBounded(instructions: str) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    # Directions: N, E, S, W
    dx = [0, 1, 0, -1]
    dy = [1, 0, -1, 0]
    
    x, y = 0, 0
    direction = 0  # North
    
    for cmd in instructions:
        if cmd == 'G':
            x += dx[direction]
            y += dy[direction]
        elif cmd == 'L':
            direction = (direction + 3) % 4
        else:  # R
            direction = (direction + 1) % 4
    
    # Returns if at origin OR not facing north
    return (x == 0 and y == 0) or direction != 0
```

---

## Problem 11: Max Points on a Line (Hard)
**LeetCode 149**

### Problem
Find maximum points on same line.

### Intuition
For each point, count slopes to other points.

### Solution
```python
from collections import defaultdict
from math import gcd

def maxPoints(points: list[list[int]]) -> int:
    """
    Time: O(n²)
    Space: O(n)
    """
    if len(points) <= 2:
        return len(points)
    
    def get_slope(p1, p2):
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        
        if dx == 0:
            return (0, 1)  # Vertical line
        if dy == 0:
            return (1, 0)  # Horizontal line
        
        # Normalize slope
        g = gcd(abs(dx), abs(dy))
        dx, dy = dx // g, dy // g
        
        if dx < 0:
            dx, dy = -dx, -dy
        
        return (dy, dx)
    
    max_points = 1
    
    for i in range(len(points)):
        slopes = defaultdict(int)
        same = 1
        
        for j in range(i + 1, len(points)):
            if points[i] == points[j]:
                same += 1
            else:
                slope = get_slope(points[i], points[j])
                slopes[slope] += 1
        
        if slopes:
            max_points = max(max_points, max(slopes.values()) + same)
        else:
            max_points = max(max_points, same)
    
    return max_points
```

---

## Problem 12: Pascal's Triangle (Easy)
**LeetCode 118**

### Problem
Generate first numRows of Pascal's triangle.

### Intuition
Each element is sum of two elements above.

### Solution
```python
def generate(numRows: int) -> list[list[int]]:
    """
    Time: O(n²)
    Space: O(n²)
    """
    triangle = []
    
    for i in range(numRows):
        row = [1] * (i + 1)
        
        for j in range(1, i):
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        
        triangle.append(row)
    
    return triangle
```

---

## Problem 13: Count Primes (Medium)
**LeetCode 204**

### Problem
Count primes less than n.

### Intuition
Sieve of Eratosthenes.

### Solution
```python
def countPrimes(n: int) -> int:
    """
    Time: O(n log log n)
    Space: O(n)
    """
    if n < 2:
        return 0
    
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n, i):
                is_prime[j] = False
    
    return sum(is_prime)
```

---

## Problem 14: Factorial Trailing Zeroes (Medium)
**LeetCode 172**

### Problem
Count trailing zeroes in n!

### Intuition
Count factors of 5 (there are more 2s than 5s).

### Solution
```python
def trailingZeroes(n: int) -> int:
    """
    Time: O(log n)
    Space: O(1)
    """
    count = 0
    
    while n >= 5:
        n //= 5
        count += n
    
    return count
```

---

## 📊 Math & Geometry Summary

| Problem | Category | Key Technique |
|---------|----------|---------------|
| Happy Number | Number Theory | Floyd's cycle detection |
| Plus One | Arithmetic | Handle carry |
| Pow(x,n) | Exponentiation | Fast power (binary) |
| Multiply Strings | Arithmetic | Grade school method |
| Detect Squares | Geometry | Diagonal + check corners |
| Rotate Image | Matrix | Transpose + reverse |
| Spiral Matrix | Matrix | Boundary tracking |
| Set Matrix Zeroes | Matrix | Use first row/col as markers |
| Robot Bounded | Simulation | Check direction after cycle |
| Max Points Line | Geometry | Slope counting |
| Pascal's Triangle | Combinatorics | Row generation |
| Count Primes | Number Theory | Sieve of Eratosthenes |
| Trailing Zeroes | Number Theory | Count factor of 5 |

### Common Math Formulas:

**GCD (Greatest Common Divisor):**
```python
from math import gcd
# Or Euclidean: gcd(a, b) = gcd(b, a % b)
```

**LCM (Least Common Multiple):**
```python
lcm = a * b // gcd(a, b)
```

**Fast Power:**
```python
def power(x, n):
    result = 1
    while n > 0:
        if n % 2: result *= x
        x *= x
        n //= 2
    return result
```

**Matrix Rotation:**
```python
# 90° clockwise: transpose + reverse rows
# 90° counter-clockwise: transpose + reverse columns
# 180°: reverse rows + reverse each row
```

### Geometry Tips:
- **Slope**: Use (dy/gcd, dx/gcd) to avoid floating point
- **Distance**: Manhattan |x1-x2| + |y1-y2| or Euclidean √((x1-x2)² + (y1-y2)²)
- **Collinear check**: Cross product = 0
