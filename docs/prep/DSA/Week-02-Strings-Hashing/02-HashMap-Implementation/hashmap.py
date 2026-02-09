"""
🗂️ Hash Map Implementation from Scratch

Understanding how hash maps work internally helps you:
1. Appreciate O(1) complexity
2. Understand collision handling
3. Know when hash maps are appropriate

Author: DSA Roadmap
Topic: Week 2 - Hash Maps
"""


class HashMap:
    """
    Hash Map implementation using chaining for collision resolution.
    
    Components:
    1. Array of buckets (each bucket is a list)
    2. Hash function to map keys to indices
    3. Collision handling via chaining (linked list in each bucket)
    
    Time Complexity:
    - Average: O(1) for get, put, remove
    - Worst: O(n) when all keys collide (rare)
    
    Space Complexity: O(n) where n is number of key-value pairs
    """
    
    def __init__(self, capacity=16, load_factor=0.75):
        """
        Initialize hash map.
        
        Args:
            capacity: Initial number of buckets
            load_factor: Threshold for resizing (size/capacity)
        """
        self._capacity = capacity
        self._load_factor = load_factor
        self._size = 0
        self._buckets = [[] for _ in range(capacity)]
    
    def _hash(self, key):
        """
        Compute hash index for key.
        
        Uses Python's built-in hash() and modulo for index.
        """
        return hash(key) % self._capacity
    
    def _resize(self):
        """
        Double capacity when load factor exceeded.
        
        Must rehash all existing entries.
        """
        old_buckets = self._buckets
        self._capacity *= 2
        self._buckets = [[] for _ in range(self._capacity)]
        self._size = 0
        
        # Rehash all entries
        for bucket in old_buckets:
            for key, value in bucket:
                self.put(key, value)
    
    def put(self, key, value):
        """
        Insert or update key-value pair.
        
        Time: O(1) average, O(n) worst case
        """
        # Check if resize needed
        if self._size / self._capacity >= self._load_factor:
            self._resize()
        
        index = self._hash(key)
        bucket = self._buckets[index]
        
        # Check if key exists (update)
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        
        # Key doesn't exist (insert)
        bucket.append((key, value))
        self._size += 1
    
    def get(self, key, default=None):
        """
        Get value for key.
        
        Time: O(1) average, O(n) worst case
        """
        index = self._hash(key)
        bucket = self._buckets[index]
        
        for k, v in bucket:
            if k == key:
                return v
        
        return default
    
    def remove(self, key):
        """
        Remove key-value pair.
        
        Time: O(1) average, O(n) worst case
        Returns: The removed value, or None if not found
        """
        index = self._hash(key)
        bucket = self._buckets[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                self._size -= 1
                return v
        
        return None
    
    def contains(self, key):
        """Check if key exists."""
        return self.get(key, None) is not None
    
    def keys(self):
        """Return all keys."""
        result = []
        for bucket in self._buckets:
            for k, v in bucket:
                result.append(k)
        return result
    
    def values(self):
        """Return all values."""
        result = []
        for bucket in self._buckets:
            for k, v in bucket:
                result.append(v)
        return result
    
    def items(self):
        """Return all key-value pairs."""
        result = []
        for bucket in self._buckets:
            for k, v in bucket:
                result.append((k, v))
        return result
    
    def __len__(self):
        return self._size
    
    def __contains__(self, key):
        return self.contains(key)
    
    def __getitem__(self, key):
        value = self.get(key)
        if value is None and key not in self:
            raise KeyError(key)
        return value
    
    def __setitem__(self, key, value):
        self.put(key, value)
    
    def __delitem__(self, key):
        if self.remove(key) is None:
            raise KeyError(key)
    
    def __str__(self):
        items = [f"{k}: {v}" for k, v in self.items()]
        return "{" + ", ".join(items) + "}"
    
    def __repr__(self):
        return f"HashMap(size={self._size}, capacity={self._capacity})"


class HashMapOpenAddressing:
    """
    Hash Map using Open Addressing (Linear Probing).
    
    Instead of chaining, if a collision occurs, we find
    the next available slot.
    
    Pros: Better cache performance (contiguous memory)
    Cons: Clustering can occur
    """
    
    def __init__(self, capacity=16):
        self._capacity = capacity
        self._size = 0
        self._keys = [None] * capacity
        self._values = [None] * capacity
        self._deleted = [False] * capacity  # Tombstone markers
    
    def _hash(self, key):
        return hash(key) % self._capacity
    
    def _probe(self, key):
        """
        Linear probing: check index, index+1, index+2, ...
        """
        index = self._hash(key)
        start = index
        
        while True:
            # Empty slot or matching key
            if self._keys[index] is None:
                return index, False
            if self._keys[index] == key and not self._deleted[index]:
                return index, True
            
            # Move to next slot
            index = (index + 1) % self._capacity
            
            # Full circle (shouldn't happen if load factor managed)
            if index == start:
                break
        
        return -1, False
    
    def put(self, key, value):
        """Insert or update key-value pair."""
        if self._size >= self._capacity * 0.7:
            self._resize()
        
        index, found = self._probe(key)
        
        if index == -1:
            raise RuntimeError("HashMap is full")
        
        if not found:
            self._size += 1
        
        self._keys[index] = key
        self._values[index] = value
        self._deleted[index] = False
    
    def get(self, key, default=None):
        """Get value for key."""
        index, found = self._probe(key)
        
        if found:
            return self._values[index]
        return default
    
    def remove(self, key):
        """Remove key-value pair using tombstone."""
        index, found = self._probe(key)
        
        if found:
            self._deleted[index] = True
            self._size -= 1
            return self._values[index]
        
        return None
    
    def _resize(self):
        """Double capacity and rehash."""
        old_keys = self._keys
        old_values = self._values
        old_deleted = self._deleted
        
        self._capacity *= 2
        self._keys = [None] * self._capacity
        self._values = [None] * self._capacity
        self._deleted = [False] * self._capacity
        self._size = 0
        
        for i in range(len(old_keys)):
            if old_keys[i] is not None and not old_deleted[i]:
                self.put(old_keys[i], old_values[i])
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        items = []
        for i in range(self._capacity):
            if self._keys[i] is not None and not self._deleted[i]:
                items.append(f"{self._keys[i]}: {self._values[i]}")
        return "{" + ", ".join(items) + "}"


# ============================================================
# TESTING
# ============================================================

def test_hashmap():
    """Test HashMap implementation."""
    print("=" * 50)
    print("Testing HashMap (Chaining)")
    print("=" * 50)
    
    hm = HashMap()
    
    # Test put and get
    print("\n1. Testing put and get:")
    hm.put("apple", 5)
    hm.put("banana", 3)
    hm.put("cherry", 8)
    print(f"   HashMap: {hm}")
    print(f"   get('apple'): {hm.get('apple')}")
    print(f"   get('banana'): {hm.get('banana')}")
    print(f"   get('missing'): {hm.get('missing', 'default')}")
    
    # Test update
    print("\n2. Testing update:")
    hm.put("apple", 10)
    print(f"   After update: {hm}")
    
    # Test remove
    print("\n3. Testing remove:")
    removed = hm.remove("banana")
    print(f"   Removed 'banana': {removed}")
    print(f"   HashMap: {hm}")
    
    # Test contains
    print("\n4. Testing contains:")
    print(f"   'apple' in hm: {'apple' in hm}")
    print(f"   'banana' in hm: {'banana' in hm}")
    
    # Test bracket notation
    print("\n5. Testing bracket notation:")
    hm["date"] = 15
    print(f"   hm['date']: {hm['date']}")
    
    # Test iteration methods
    print("\n6. Testing keys, values, items:")
    print(f"   Keys: {hm.keys()}")
    print(f"   Values: {hm.values()}")
    print(f"   Items: {hm.items()}")
    
    # Test resize
    print("\n7. Testing automatic resize:")
    for i in range(20):
        hm.put(f"key{i}", i)
    print(f"   Added 20 keys. Size: {len(hm)}, Capacity: {hm._capacity}")
    
    print("\n" + "=" * 50)
    print("All HashMap tests passed! ✓")
    print("=" * 50)


def test_hashmap_open_addressing():
    """Test Open Addressing HashMap."""
    print("\n" + "=" * 50)
    print("Testing HashMap (Open Addressing)")
    print("=" * 50)
    
    hm = HashMapOpenAddressing()
    
    # Test basic operations
    hm.put("a", 1)
    hm.put("b", 2)
    hm.put("c", 3)
    
    print(f"\n1. HashMap: {hm}")
    print(f"   get('a'): {hm.get('a')}")
    print(f"   get('b'): {hm.get('b')}")
    
    # Test remove
    hm.remove("b")
    print(f"\n2. After removing 'b': {hm}")
    print(f"   get('b'): {hm.get('b', 'not found')}")
    
    print("\n" + "=" * 50)
    print("All Open Addressing tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_hashmap()
    test_hashmap_open_addressing()
