# Encode and Decode Strings

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 271 | Length-Prefix Encoding |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design an algorithm to encode a list of strings into a single string and decode it back to the original list.

### Constraints & Clarifying Questions
1. **Can strings contain any characters?** Yes, including delimiters, digits, special chars.
2. **Can strings be empty?** Yes, empty strings are valid.
3. **What is the maximum string length?** Up to 200 characters each.
4. **What is the maximum number of strings?** Up to 200 strings.
5. **Does the solution need to be stateless?** Yes, decode should work independently.

### Edge Cases
1. **Empty list:** `[]` → Encode to some marker, decode back to `[]`
2. **List with empty strings:** `["", "", ""]` → Must preserve count
3. **Strings containing digits/delimiters:** `["4#abc", "##"]` → Naive delimiters fail

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Special Delimiter)
Join with a rare delimiter like `|||`. Fails if strings contain the delimiter.
- **Time:** O(N) encode, O(N) decode
- **Space:** O(N)
- **Problem:** Not universally safe

### Option 2: Optimal (Length Prefix)
Encode as `length#string` for each string. Length tells us exactly how many characters to read, making any content safe.

**Core Insight:** By prefixing each string with its length, we create unambiguous boundaries that work regardless of string content.

### Why Optimal?
Length-prefix encoding is delimiter-agnostic; the length tells us exactly where each string ends, handling any characters including our own markers.

---

## Phase 3: Python Code

```python
class Codec:
    """
    Stateless encoder/decoder for list of strings.
    Uses length-prefix encoding: "4#text" means next 4 chars are the string.
    """
    
    def encode(self, strings: list[str]) -> str:
        """
        Encode list of strings into single string.
        
        Args:
            strings: List of strings to encode
        
        Returns:
            Single encoded string
        """
        encoded_parts = []
        
        for string in strings:  # O(N) strings
            # Format: length + delimiter + content
            encoded_parts.append(f"{len(string)}#{string}")  # O(K) per string
        
        return ''.join(encoded_parts)  # O(total characters)
    
    def decode(self, encoded_string: str) -> list[str]:
        """
        Decode single string back to list of strings.
        
        Args:
            encoded_string: Previously encoded string
        
        Returns:
            Original list of strings
        """
        decoded_strings = []
        current_position = 0
        
        while current_position < len(encoded_string):  # O(total length)
            # Find the '#' delimiter to extract length
            delimiter_position = encoded_string.find('#', current_position)  # O(K)
            
            # Parse the length prefix
            string_length = int(encoded_string[current_position:delimiter_position])
            
            # Extract the string content
            content_start = delimiter_position + 1
            content_end = content_start + string_length
            decoded_strings.append(encoded_string[content_start:content_end])
            
            # Move to next encoded segment
            current_position = content_end
        
        return decoded_strings


def encode_alternative(strings: list[str]) -> str:
    """
    Alternative: Use fixed-width length encoding (4 bytes).
    Avoids variable delimiter position scanning.
    """
    result = []
    for string in strings:
        # 4-digit zero-padded length (max 9999 chars)
        result.append(f"{len(string):04d}{string}")
    return ''.join(result)


def decode_alternative(encoded: str) -> list[str]:
    """Decode fixed-width encoding."""
    result = []
    i = 0
    while i < len(encoded):
        length = int(encoded[i:i+4])
        result.append(encoded[i+4:i+4+length])
        i += 4 + length
    return result
```

---

## Phase 4: Dry Run

**Input:** `strings = ["hello", "world", "4#test"]`

**Encode:**

| String | Length | Encoded Form |
|--------|--------|--------------|
| "hello" | 5 | "5#hello" |
| "world" | 5 | "5#world" |
| "4#test" | 6 | "6#4#test" |

**Encoded Result:** `"5#hello5#world6#4#test"`

**Decode:**

| Position | Find '#' | Length | Content Range | Extracted | Next Position |
|----------|----------|--------|---------------|-----------|---------------|
| 0 | 1 | 5 | [2:7] | "hello" | 7 |
| 7 | 8 | 5 | [9:14] | "world" | 14 |
| 14 | 15 | 6 | [16:22] | "4#test" | 22 |

**Decoded Result:** `["hello", "world", "4#test"]`

**Correctness:** Original list recovered exactly, including string with embedded `#` ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Encode: O(total characters across all strings)
- Decode: O(length of encoded string)
- Both linear in total content size.

### Space Complexity: O(N)
- Encode: Creates new string of size O(N + overhead)
- Decode: Creates list storing all original strings
- Overhead is O(number of strings) for length prefixes.

---

## Phase 6: Follow-Up Questions

1. **"What if we need to encode binary data, not just strings?"**
   → Length-prefix works for binary too; use bytes and struct.pack for length encoding.

2. **"How would you make this work for network transmission with potential corruption?"**
   → Add checksum/CRC after each segment; include magic bytes for synchronization recovery.

3. **"What if individual strings could be extremely long (gigabytes)?"**
   → Stream encoding: emit length, then stream content in chunks; decoder reads length first, then pulls exact bytes.
