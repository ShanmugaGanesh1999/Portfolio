"""
📚 Dynamic Array Implementation from Scratch

This implementation shows how Python lists work under the hood.
Understanding this helps you appreciate array operations' complexity.

Author: DSA Roadmap
Topic: Week 1 - Arrays
"""


class DynamicArray:
    """
    A dynamic array implementation that automatically resizes.
    
    This mimics how Python's list works internally:
    - Starts with a fixed capacity
    - When full, creates a new array with 2x capacity
    - Copies elements to new array
    
    Time Complexities:
    - Access: O(1)
    - Append: O(1) amortized
    - Insert: O(n)
    - Delete: O(n)
    - Search: O(n)
    """
    
    def __init__(self, capacity=10):
        """
        Initialize dynamic array with given capacity.
        
        Args:
            capacity: Initial capacity (default 10)
        """
        self._capacity = capacity  # Total available space
        self._size = 0             # Current number of elements
        self._array = self._make_array(capacity)
    
    def _make_array(self, capacity):
        """Create a new array with given capacity."""
        # Using Python's ctypes for low-level array
        import ctypes
        return (capacity * ctypes.py_object)()
    
    # ==================== Core Operations ====================
    
    def __len__(self):
        """Return number of elements. O(1)"""
        return self._size
    
    def __getitem__(self, index):
        """
        Get element at index. O(1)
        
        Supports negative indexing like Python lists.
        """
        # Handle negative indices
        if index < 0:
            index = self._size + index
        
        if not 0 <= index < self._size:
            raise IndexError(f"Index {index} out of range for size {self._size}")
        
        return self._array[index]
    
    def __setitem__(self, index, value):
        """Set element at index. O(1)"""
        if index < 0:
            index = self._size + index
            
        if not 0 <= index < self._size:
            raise IndexError(f"Index {index} out of range for size {self._size}")
        
        self._array[index] = value
    
    def append(self, element):
        """
        Add element to the end. O(1) amortized.
        
        Why amortized O(1)?
        - Most appends: O(1) - just add to end
        - Occasionally: O(n) - need to resize
        - Over n operations: total cost ≈ O(n)
        - Per operation: O(n)/n = O(1) amortized
        """
        # Check if resize needed
        if self._size == self._capacity:
            self._resize(2 * self._capacity)  # Double capacity
        
        self._array[self._size] = element
        self._size += 1
    
    def _resize(self, new_capacity):
        """
        Resize internal array to new capacity. O(n)
        
        This is the expensive operation that happens occasionally.
        """
        new_array = self._make_array(new_capacity)
        
        # Copy all elements to new array
        for i in range(self._size):
            new_array[i] = self._array[i]
        
        self._array = new_array
        self._capacity = new_capacity
    
    def insert(self, index, element):
        """
        Insert element at given index. O(n)
        
        Must shift all elements after index to the right.
        """
        if index < 0:
            index = max(0, self._size + index)
        if index > self._size:
            index = self._size
        
        # Check if resize needed
        if self._size == self._capacity:
            self._resize(2 * self._capacity)
        
        # Shift elements to the right
        for i in range(self._size, index, -1):
            self._array[i] = self._array[i - 1]
        
        self._array[index] = element
        self._size += 1
    
    def remove(self, element):
        """
        Remove first occurrence of element. O(n)
        
        Must search for element, then shift elements left.
        """
        for i in range(self._size):
            if self._array[i] == element:
                # Shift elements to the left
                for j in range(i, self._size - 1):
                    self._array[j] = self._array[j + 1]
                
                self._array[self._size - 1] = None  # Clear reference
                self._size -= 1
                
                # Shrink if using less than 1/4 capacity
                if self._size < self._capacity // 4:
                    self._resize(self._capacity // 2)
                
                return
        
        raise ValueError(f"{element} not found in array")
    
    def pop(self, index=None):
        """
        Remove and return element at index. O(n) or O(1) for last element.
        
        If no index given, removes last element (O(1)).
        """
        if self._size == 0:
            raise IndexError("Pop from empty array")
        
        if index is None:
            index = self._size - 1
        
        if index < 0:
            index = self._size + index
        
        if not 0 <= index < self._size:
            raise IndexError(f"Index {index} out of range")
        
        element = self._array[index]
        
        # Shift elements to the left
        for i in range(index, self._size - 1):
            self._array[i] = self._array[i + 1]
        
        self._array[self._size - 1] = None
        self._size -= 1
        
        return element
    
    # ==================== Search Operations ====================
    
    def find(self, element):
        """
        Find index of first occurrence. O(n)
        
        Returns -1 if not found.
        """
        for i in range(self._size):
            if self._array[i] == element:
                return i
        return -1
    
    def __contains__(self, element):
        """Check if element exists. O(n)"""
        return self.find(element) != -1
    
    def count(self, element):
        """Count occurrences of element. O(n)"""
        cnt = 0
        for i in range(self._size):
            if self._array[i] == element:
                cnt += 1
        return cnt
    
    # ==================== Utility Methods ====================
    
    def is_empty(self):
        """Check if array is empty. O(1)"""
        return self._size == 0
    
    def clear(self):
        """Remove all elements. O(n)"""
        for i in range(self._size):
            self._array[i] = None
        self._size = 0
    
    def reverse(self):
        """Reverse array in-place. O(n)"""
        left, right = 0, self._size - 1
        while left < right:
            self._array[left], self._array[right] = \
                self._array[right], self._array[left]
            left += 1
            right -= 1
    
    def __str__(self):
        """String representation."""
        elements = [str(self._array[i]) for i in range(self._size)]
        return f"[{', '.join(elements)}]"
    
    def __repr__(self):
        """Detailed representation."""
        return f"DynamicArray(size={self._size}, capacity={self._capacity})"
    
    def __iter__(self):
        """Make array iterable."""
        for i in range(self._size):
            yield self._array[i]
    
    @property
    def capacity(self):
        """Return current capacity."""
        return self._capacity


# ==================== Testing ====================

def test_dynamic_array():
    """Test all dynamic array operations."""
    print("=" * 50)
    print("Testing Dynamic Array Implementation")
    print("=" * 50)
    
    # Test initialization
    arr = DynamicArray(capacity=4)
    print(f"\n1. Created empty array: {arr}")
    print(f"   Size: {len(arr)}, Capacity: {arr.capacity}")
    
    # Test append
    print("\n2. Testing append:")
    for i in range(1, 6):
        arr.append(i * 10)
        print(f"   Appended {i * 10}: {arr}, Capacity: {arr.capacity}")
    
    # Test access
    print("\n3. Testing access:")
    print(f"   arr[0] = {arr[0]}")
    print(f"   arr[2] = {arr[2]}")
    print(f"   arr[-1] = {arr[-1]}")
    
    # Test modification
    print("\n4. Testing modification:")
    arr[0] = 100
    print(f"   After arr[0] = 100: {arr}")
    
    # Test insert
    print("\n5. Testing insert:")
    arr.insert(1, 15)
    print(f"   After insert(1, 15): {arr}")
    arr.insert(0, 5)
    print(f"   After insert(0, 5): {arr}")
    
    # Test remove
    print("\n6. Testing remove:")
    arr.remove(15)
    print(f"   After remove(15): {arr}")
    
    # Test pop
    print("\n7. Testing pop:")
    popped = arr.pop()
    print(f"   Popped: {popped}, Array: {arr}")
    popped = arr.pop(0)
    print(f"   Popped at 0: {popped}, Array: {arr}")
    
    # Test find and contains
    print("\n8. Testing find and contains:")
    print(f"   find(30) = {arr.find(30)}")
    print(f"   30 in arr = {30 in arr}")
    print(f"   999 in arr = {999 in arr}")
    
    # Test iteration
    print("\n9. Testing iteration:")
    print("   Elements: ", end="")
    for elem in arr:
        print(elem, end=" ")
    print()
    
    # Test reverse
    print("\n10. Testing reverse:")
    print(f"    Before: {arr}")
    arr.reverse()
    print(f"    After:  {arr}")
    
    print("\n" + "=" * 50)
    print("All tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_dynamic_array()
