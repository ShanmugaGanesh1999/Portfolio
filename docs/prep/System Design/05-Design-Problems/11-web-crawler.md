# Design Web Crawler

> Distributed system to crawl and index the web

---

## 📋 Problem Statement

Design a web crawler that systematically browses the web to collect pages for a search engine, similar to Googlebot.

---

## R - Requirements

### Functional Requirements

```
1. Crawl billions of web pages
2. Handle various content types (HTML, PDF, images)
3. Respect robots.txt and crawl politeness
4. Detect and avoid duplicate content
5. Handle dynamic/JavaScript content
6. Prioritize important pages
```

### Non-Functional Requirements

```
1. Scalable to crawl entire web
2. Efficient (minimize redundant crawls)
3. Polite (don't overwhelm servers)
4. Fresh (re-crawl frequently updated pages)
5. Robust (handle failures gracefully)
```

---

## E - Estimation

```
Scale:
├── 1 billion pages to crawl
├── Average page size: 100KB (HTML + assets)
├── Re-crawl every 2 weeks on average
├── Total crawl rate: 1B / 14 days = 850 pages/sec

Storage:
├── Raw pages: 1B × 100KB = 100TB
├── Processed data: ~50TB
├── URL frontier: 10B URLs × 100 bytes = 1TB

Bandwidth:
├── 850 pages/sec × 100KB = 85 MB/sec
├── ~7 TB/day download
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  URL Frontier                        │   │
│   │              (Priority Queue + Politeness)           │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │                  Crawler Workers                     │   │
│   │   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐          │   │
│   │   │Worker1│ │Worker2│ │Worker3│ │WorkerN│          │   │
│   │   └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘          │   │
│   │       │         │         │         │                │   │
│   │       └────────┬┴─────────┴─────────┘                │   │
│   └────────────────┼────────────────────────────────────┘   │
│                    │                                         │
│                    ▼                                         │
│   ┌────────────────────────────────────────┐                │
│   │           Content Processor             │                │
│   │  ┌──────────────────────────────────┐  │                │
│   │  │ Parse HTML → Extract URLs → Store │  │                │
│   │  └──────────────────────────────────┘  │                │
│   └────────────────┬───────────────────────┘                │
│                    │                                         │
│        ┌───────────┼───────────┐                            │
│        ▼           ▼           ▼                            │
│   ┌─────────┐ ┌─────────┐ ┌──────────┐                      │
│   │  URL    │ │ Content │ │ Search   │                      │
│   │ Filter  │ │  Store  │ │  Index   │                      │
│   │(Dedup)  │ │  (S3)   │ │  (ES)    │                      │
│   └─────────┘ └─────────┘ └──────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### URL Frontier

```
┌─────────────────────────────────────────────────────────────┐
│              URL Frontier                                    │
│                                                              │
│   Two main concerns:                                         │
│   1. Prioritization: Which URLs to crawl first             │
│   2. Politeness: Don't overwhelm any single server         │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               Priority Queues                        │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│   │  │  High   │ │ Medium  │ │   Low   │ │  Retry  │   │   │
│   │  │Priority │ │Priority │ │Priority │ │  Queue  │   │   │
│   │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │   │
│   │       └───────────┼───────────┼───────────┘         │   │
│   │                   ▼                                  │   │
│   │            Queue Selector                            │   │
│   │        (Weighted random selection)                   │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │             Per-Host Queues (Politeness)             │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐               │   │
│   │  │ host1   │ │ host2   │ │ host3   │ ...           │   │
│   │  │.com     │ │.org     │ │.net     │               │   │
│   │  └─────────┘ └─────────┘ └─────────┘               │   │
│   │                                                      │   │
│   │  Rate limiter: 1 request per host every 1-2 seconds │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Priority Calculation

```
┌─────────────────────────────────────────────────────────────┐
│              URL Priority                                    │
│                                                              │
│   Factors:                                                   │
│   1. PageRank of linking pages                              │
│   2. Freshness (when last crawled)                         │
│   3. Update frequency (how often it changes)               │
│   4. Depth from seed URLs                                  │
│                                                              │
│   Priority = w1 × pagerank +                                │
│              w2 × freshness_score +                         │
│              w3 × update_frequency +                        │
│              w4 × (1 / depth)                               │
│                                                              │
│   Examples:                                                  │
│   - cnn.com homepage → High priority (changes often)       │
│   - Personal blog from 2015 → Low priority                 │
│   - Linked from many pages → Higher priority               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Crawler Worker

```python
class CrawlerWorker:
    def __init__(self):
        self.session = aiohttp.ClientSession()
        self.robots_cache = {}
    
    async def crawl(self, url):
        # 1. Check robots.txt
        if not await self.is_allowed(url):
            return None
        
        # 2. Fetch page
        try:
            async with self.session.get(url, timeout=10) as resp:
                if resp.status != 200:
                    return None
                content = await resp.text()
                content_type = resp.headers.get('Content-Type')
        except Exception as e:
            # Add to retry queue
            return None
        
        # 3. Parse and extract
        result = {
            'url': url,
            'content': content,
            'content_type': content_type,
            'links': self.extract_links(content, url),
            'crawled_at': time.time()
        }
        
        return result
    
    async def is_allowed(self, url):
        host = urlparse(url).netloc
        if host not in self.robots_cache:
            robots_url = f"https://{host}/robots.txt"
            # Fetch and parse robots.txt
            self.robots_cache[host] = await self.fetch_robots(robots_url)
        
        return self.robots_cache[host].is_allowed(url)
    
    def extract_links(self, html, base_url):
        soup = BeautifulSoup(html, 'html.parser')
        links = []
        for a in soup.find_all('a', href=True):
            absolute_url = urljoin(base_url, a['href'])
            links.append(absolute_url)
        return links
```

### URL Deduplication

```
┌─────────────────────────────────────────────────────────────┐
│              Deduplication                                   │
│                                                              │
│   Problem: Avoid re-crawling same URL / same content        │
│                                                              │
│   1. URL-level dedup:                                       │
│      ├── Normalize URLs (lowercase, remove fragments)      │
│      ├── Store URL hash in Bloom filter                    │
│      └── Check before adding to frontier                   │
│                                                              │
│   Bloom Filter:                                              │
│   ├── Space-efficient probabilistic set                    │
│   ├── 10B URLs in ~10GB with 1% false positive            │
│   ├── Check: O(k) hash lookups                             │
│   └── False positives OK (skip some URLs)                  │
│                                                              │
│   2. Content-level dedup:                                   │
│      ├── Compute content hash (SimHash for fuzzy)          │
│      ├── Detect near-duplicate pages                       │
│      └── Store canonical URL                               │
│                                                              │
│   SimHash:                                                   │
│   ├── Content → 64-bit fingerprint                         │
│   ├── Similar pages have similar hashes                    │
│   ├── Compare Hamming distance                             │
│   └── Distance < 3 = likely duplicate                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Robots.txt Handling

```
┌─────────────────────────────────────────────────────────────┐
│              Robots.txt                                      │
│                                                              │
│   Example robots.txt:                                        │
│   User-agent: *                                              │
│   Disallow: /private/                                        │
│   Disallow: /temp/                                           │
│   Crawl-delay: 2                                             │
│                                                              │
│   User-agent: Googlebot                                      │
│   Allow: /                                                   │
│                                                              │
│   Sitemap: https://example.com/sitemap.xml                  │
│                                                              │
│   Implementation:                                            │
│   1. Fetch robots.txt before crawling domain               │
│   2. Cache for 24 hours                                    │
│   3. Parse rules for our user-agent                        │
│   4. Check each URL against rules                          │
│   5. Respect Crawl-delay                                   │
│                                                              │
│   Politeness beyond robots.txt:                             │
│   ├── Limit concurrent requests per domain: 1              │
│   ├── Add delay between requests: 1-2 seconds              │
│   ├── Reduce during peak hours                             │
│   └── Monitor 429/503 responses                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Content Processing Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│              Processing Pipeline                             │
│                                                              │
│   Raw Page                                                   │
│       │                                                      │
│       ▼                                                      │
│   ┌───────────────────┐                                     │
│   │  Content Parser   │ ← HTML, PDF, JS rendering          │
│   └─────────┬─────────┘                                     │
│             │                                                │
│       ┌─────┴─────┐                                         │
│       ▼           ▼                                         │
│   ┌───────┐   ┌────────┐                                    │
│   │ Links │   │  Text  │                                    │
│   └───┬───┘   └───┬────┘                                    │
│       │           │                                          │
│       ▼           ▼                                          │
│   ┌───────┐   ┌────────────┐                                │
│   │ URL   │   │  Content   │                                │
│   │Filter │   │  Analysis  │                                │
│   └───┬───┘   └─────┬──────┘                                │
│       │             │                                        │
│       ▼             ▼                                        │
│   ┌───────┐   ┌────────────┐                                │
│   │Add to │   │ Store in   │                                │
│   │Frontier│  │  Index     │                                │
│   └───────┘   └────────────┘                                │
│                                                              │
│   Content analysis:                                          │
│   ├── Language detection                                    │
│   ├── Spam/quality scoring                                 │
│   ├── Entity extraction                                    │
│   └── Category classification                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Handling JavaScript

```
┌─────────────────────────────────────────────────────────────┐
│              JavaScript Rendering                            │
│                                                              │
│   Problem: Many sites use JavaScript to render content       │
│                                                              │
│   Solution: Headless browser rendering                       │
│                                                              │
│   Architecture:                                              │
│   ┌─────────────────────────────────────┐                   │
│   │        Rendering Service            │                   │
│   │  ┌─────────────────────────────┐    │                   │
│   │  │   Headless Chrome Pool      │    │                   │
│   │  │  ┌────┐ ┌────┐ ┌────┐      │    │                   │
│   │  │  │Tab1│ │Tab2│ │Tab3│ ...  │    │                   │
│   │  │  └────┘ └────┘ └────┘      │    │                   │
│   │  └─────────────────────────────┘    │                   │
│   └─────────────────────────────────────┘                   │
│                                                              │
│   Process:                                                   │
│   1. Load URL in headless Chrome                            │
│   2. Wait for page load + JavaScript execution              │
│   3. Extract rendered HTML                                  │
│   4. Much slower (seconds vs milliseconds)                  │
│                                                              │
│   Strategy:                                                  │
│   ├── Try simple fetch first                               │
│   ├── Detect if JS-rendered (empty body, frameworks)       │
│   ├── Use rendering service only when needed               │
│   └── Cache rendered results                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary

```
Key Components:
├── URL Frontier: Priority + politeness queues
├── Crawler Workers: Async HTTP fetchers
├── Deduplication: Bloom filter + SimHash
├── Content Processor: Parse, extract, store

Key Decisions:
├── Per-host queues for politeness
├── Bloom filter for URL dedup (space-efficient)
├── Priority based on PageRank + freshness
├── Headless rendering for JS sites

Scale:
├── 1000+ pages/second
├── Billions of URLs tracked
├── Petabytes of content stored
├── Distributed across data centers
```

---

## 📖 Next Steps

→ Continue to [Design Google Docs](./12-google-docs.md)
