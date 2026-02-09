# Design Twitter

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 355 | Heap / Design |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design simplified Twitter: postTweet, getNewsFeed (10 most recent from followed + self), follow, unfollow.

### Constraints & Clarifying Questions
1. **News feed limit?** 10 most recent.
2. **Include own tweets?** Yes.
3. **Follow self automatically?** Can assume yes.
4. **Time ordering?** Most recent first.

### Edge Cases
1. **No tweets:** Empty feed
2. **Unfollow self:** Handle gracefully
3. **User doesn't exist:** Handle dynamically

---

## Phase 2: High-Level Approach

### Approach: HashMap + Heap
- Store tweets per user with timestamp
- For feed: merge k sorted lists (followed users' tweets) using heap

**Core Insight:** News feed is k-way merge problem.

---

## Phase 3: Python Code

```python
import heapq
from collections import defaultdict
from typing import List


class Twitter:
    """
    Simplified Twitter with news feed.
    """
    
    def __init__(self):
        """Initialize data structures."""
        self.time = 0
        self.tweets = defaultdict(list)  # userId -> [(time, tweetId)]
        self.following = defaultdict(set)  # userId -> set of followed userIds
    
    def postTweet(self, userId: int, tweetId: int) -> None:
        """
        Post a new tweet. O(1)
        """
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1
    
    def getNewsFeed(self, userId: int) -> List[int]:
        """
        Get 10 most recent tweets from user and followees. O(k log k)
        """
        # Include self in feed
        users = self.following[userId] | {userId}
        
        # Max heap: (-time, tweetId, userId, index)
        heap = []
        
        for uid in users:
            if self.tweets[uid]:
                idx = len(self.tweets[uid]) - 1
                time, tweetId = self.tweets[uid][idx]
                heapq.heappush(heap, (-time, tweetId, uid, idx))
        
        result = []
        
        while heap and len(result) < 10:
            _, tweetId, uid, idx = heapq.heappop(heap)
            result.append(tweetId)
            
            # Add previous tweet from same user
            if idx > 0:
                prev_time, prev_id = self.tweets[uid][idx - 1]
                heapq.heappush(heap, (-prev_time, prev_id, uid, idx - 1))
        
        return result
    
    def follow(self, followerId: int, followeeId: int) -> None:
        """
        Follower follows followee. O(1)
        """
        if followerId != followeeId:  # Can't follow self (or allow it)
            self.following[followerId].add(followeeId)
    
    def unfollow(self, followerId: int, followeeId: int) -> None:
        """
        Follower unfollows followee. O(1)
        """
        self.following[followerId].discard(followeeId)
```

---

## Phase 4: Dry Run

**Operations:**
```
twitter = Twitter()
twitter.postTweet(1, 5)  # User 1 posts tweet 5
twitter.getNewsFeed(1)   # [5]
twitter.follow(1, 2)     # User 1 follows 2
twitter.postTweet(2, 6)  # User 2 posts tweet 6
twitter.getNewsFeed(1)   # [6, 5]
twitter.unfollow(1, 2)
twitter.getNewsFeed(1)   # [5]
```

| State | tweets | following |
|-------|--------|-----------|
| postTweet(1,5) | {1: [(0,5)]} | {} |
| follow(1,2) | same | {1: {2}} |
| postTweet(2,6) | {1: [(0,5)], 2: [(1,6)]} | same |
| getFeed(1) | merge user 1,2 | [6, 5] |
| unfollow(1,2) | same | {1: {}} |
| getFeed(1) | only user 1 | [5] |

---

## Phase 5: Complexity Analysis

### postTweet: O(1)
### follow/unfollow: O(1)
### getNewsFeed: O(k log k)
Where k = number of followed users × 10 (at most 10 per user considered).

### Space: O(users × tweets + users × following)

---

## Phase 6: Follow-Up Questions

1. **"Scale to millions of users?"**
   → Fan-out on write vs fan-out on read; caching; sharding.

2. **"Add likes/retweets?"**
   → Additional data structures; potentially change ranking.

3. **"Delete tweets?"**
   → Mark as deleted or remove; update indices.
