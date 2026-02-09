# Distributed Search

> Finding needles in haystacks at scale

---

## 📖 What is Distributed Search?

A **Distributed Search** system indexes and searches large volumes of data across multiple nodes, providing fast full-text search capabilities.

```
Traditional Database Query:
SELECT * FROM products WHERE name LIKE '%laptop%'
└── Scans every row, very slow on large data

Distributed Search:
POST /products/_search { "query": "laptop" }
└── Uses inverted index, sub-second response
```

---

## 🎯 When to Use

```
Use Distributed Search when:
├── Full-text search needed
├── Complex search queries (fuzzy, phrase, proximity)
├── Need relevance ranking
├── Search across multiple fields
├── Auto-complete/typeahead
└── Log analysis (ELK stack)

Don't use when:
├── Simple exact match queries
├── Primary key lookups
└── Transactional requirements
```

---

## 🔧 Core Concepts

### Inverted Index

```
The magic behind fast search:

Documents:
1: "The quick brown fox"
2: "The quick brown dog"  
3: "The lazy dog"

Inverted Index:
┌────────────┬────────────┐
│   Term     │  Document  │
├────────────┼────────────┤
│   the      │  1, 2, 3   │
│   quick    │  1, 2      │
│   brown    │  1, 2      │
│   fox      │  1         │
│   dog      │  2, 3      │
│   lazy     │  3         │
└────────────┴────────────┘

Search "quick dog":
├── quick → [1, 2]
├── dog → [2, 3]
└── Intersection or Union → [2]
```

### Tokenization

```
Text: "The Quick-Brown Fox!"
         │
         ▼ (Tokenize)
Tokens: ["The", "Quick-Brown", "Fox"]
         │
         ▼ (Lowercase)
        ["the", "quick-brown", "fox"]
         │
         ▼ (Split on special chars)
        ["the", "quick", "brown", "fox"]
         │
         ▼ (Remove stop words)
        ["quick", "brown", "fox"]
         │
         ▼ (Stemming)
        ["quick", "brown", "fox"]

Analyzers control this pipeline
```

### Relevance Scoring (TF-IDF / BM25)

```
TF (Term Frequency): 
├── How often term appears in document
└── More frequent = more relevant

IDF (Inverse Document Frequency):
├── How rare is term across all documents
└── Rare terms = more relevant

Score = TF × IDF

Example:
├── "the" appears everywhere → low IDF → low score
├── "elasticsearch" is rare → high IDF → high score
```

---

## 📊 Architecture

### Single Node

```
┌────────────────────────────────────────┐
│              Elasticsearch              │
│                                        │
│   Index: products                      │
│   ┌────────────────────────────────┐   │
│   │  Shard 0 (Primary)             │   │
│   │  ┌────────────────────────┐    │   │
│   │  │   Inverted Index       │    │   │
│   │  │   Stored Documents     │    │   │
│   │  └────────────────────────┘    │   │
│   └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Distributed Cluster

```
                   ┌─────────────────┐
    Query ────────►│   Coordinator   │
                   │     Node        │
                   └────────┬────────┘
                            │
           ┌────────────────┼────────────────┐
           ▼                ▼                ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐
    │  Node 1    │   │  Node 2    │   │  Node 3    │
    │            │   │            │   │            │
    │ Shard 0 P  │   │ Shard 1 P  │   │ Shard 2 P  │
    │ Shard 1 R  │   │ Shard 2 R  │   │ Shard 0 R  │
    └────────────┘   └────────────┘   └────────────┘
    
P = Primary shard
R = Replica shard
```

### Sharding Strategy

```
Index → Multiple Shards → Multiple Nodes

Why shard?
├── Distribute data across nodes
├── Parallel query execution
├── Horizontal scaling

Document → Shard mapping:
shard_id = hash(document_id) % num_shards

Note: Number of shards fixed at index creation!
      Plan for growth, but not too many shards
```

---

## 🔧 Search Operations

### Basic Search

```python
# Elasticsearch DSL example

# Simple match query
{
    "query": {
        "match": {
            "title": "laptop computer"
        }
    }
}

# Bool query (complex conditions)
{
    "query": {
        "bool": {
            "must": [
                {"match": {"title": "laptop"}}
            ],
            "filter": [
                {"range": {"price": {"lte": 1000}}},
                {"term": {"in_stock": True}}
            ],
            "should": [
                {"match": {"brand": "apple"}}  # Boost if matches
            ],
            "must_not": [
                {"term": {"status": "discontinued"}}
            ]
        }
    }
}
```

### Query Types

```
Match: Full-text search, analyzed
{"match": {"title": "quick fox"}}
→ Finds: "The quick brown fox"

Term: Exact match, not analyzed
{"term": {"status": "published"}}
→ Finds exact "published" only

Phrase: Words in order
{"match_phrase": {"title": "quick brown fox"}}
→ Words must appear together in order

Fuzzy: Typo tolerance
{"fuzzy": {"title": {"value": "laptpo", "fuzziness": 2}}}
→ Finds "laptop" (edit distance 2)

Prefix: Starts with
{"prefix": {"title": "lap"}}
→ Finds "laptop", "laparoscopy"

Wildcard: Pattern match
{"wildcard": {"title": "lap*top"}}
→ Slower, avoid if possible
```

### Aggregations

```python
# Faceted search / analytics
{
    "aggs": {
        "brands": {
            "terms": {"field": "brand.keyword"}
        },
        "price_ranges": {
            "range": {
                "field": "price",
                "ranges": [
                    {"to": 100},
                    {"from": 100, "to": 500},
                    {"from": 500}
                ]
            }
        },
        "avg_price": {
            "avg": {"field": "price"}
        }
    }
}

# Returns:
# brands: [{"key": "Apple", "count": 50}, {"key": "Dell", "count": 30}]
# price_ranges: [{"key": "<100", "count": 20}, ...]
# avg_price: 450.00
```

---

## 📈 Search Technologies

### Elasticsearch

```
Most popular full-text search engine

Features:
├── RESTful API (JSON)
├── Near real-time search
├── Distributed, scalable
├── Rich query DSL
├── Aggregations
├── Geo-spatial search
└── Machine learning (X-Pack)

Use cases:
├── Product search
├── Log analytics (ELK)
├── Metrics
└── Security analytics
```

### Apache Solr

```
Older, mature search platform

Features:
├── Built on Lucene (like ES)
├── XML/JSON APIs
├── SolrCloud for distribution
├── Advanced faceting
└── More configuration flexibility

Use cases:
├── Enterprise search
├── E-commerce
└── Document search
```

### Comparison

| Feature | Elasticsearch | Solr |
|---------|--------------|------|
| API | RESTful JSON | XML/JSON |
| Real-time | Near real-time | Soft commit |
| Scaling | Easier | More complex |
| Analytics | Strong | Good |
| Community | Larger | Mature |
| Learning curve | Lower | Higher |

### Other Options

```
Meilisearch: Fast, easy to use, typo-tolerant
Typesense: Similar to Meilisearch, simple
Algolia: Managed, excellent but expensive
OpenSearch: AWS fork of Elasticsearch
```

---

## 🔧 Indexing Strategies

### Real-time vs Batch

```
Real-time Indexing:
├── Index on write
├── Milliseconds delay
├── Higher load
└── Use: E-commerce, social

Batch Indexing:
├── Periodic bulk updates
├── Lower load
├── Some delay
└── Use: Analytics, logs
```

### Index Design

```python
# Define mapping (schema)
{
    "mappings": {
        "properties": {
            "title": {
                "type": "text",          # Full-text, analyzed
                "analyzer": "english"
            },
            "brand": {
                "type": "text",
                "fields": {
                    "keyword": {         # Also store as keyword
                        "type": "keyword" # For exact match/aggregations
                    }
                }
            },
            "price": {"type": "float"},
            "created_at": {"type": "date"},
            "tags": {"type": "keyword"},  # Array of keywords
            "location": {"type": "geo_point"}
        }
    }
}
```

### Keeping Index in Sync

```
Source of Truth: Database
Search Index: Derived, eventually consistent

Sync strategies:

1. Dual Write:
   App → Write to DB + Write to Search
   Problem: Not atomic, can get out of sync

2. Change Data Capture (CDC):
   DB → Debezium → Kafka → Search
   Better: Single source of truth

3. Application Events:
   App → Event → Consumer → Search
   Good: Decoupled

4. Periodic Sync:
   Batch job compares and syncs
   Good for: Low-frequency updates
```

```
┌─────────┐     ┌─────────┐     ┌────────────────┐
│   App   │────►│   DB    │────►│  CDC (Debezium)│
└─────────┘     └─────────┘     └───────┬────────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │    Kafka    │
                                 └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │Elasticsearch│
                                 └─────────────┘
```

---

## 💡 Performance Optimization

### Query Optimization

```
1. Use filters over queries when possible:
   Filters: Cacheable, no scoring
   Queries: Scoring overhead

2. Avoid wildcards at start:
   Bad:  "*laptop"  (scans everything)
   Good: "laptop*"  (uses index)

3. Limit result size:
   Use pagination, don't fetch 10,000 results

4. Avoid deep pagination:
   "from": 10000 is expensive
   Use "search_after" for deep scrolling

5. Cache expensive aggregations
```

### Index Optimization

```
1. Right number of shards:
   ├── Too few: Can't scale
   ├── Too many: Overhead per shard
   └── Rule: 10-50GB per shard

2. Use aliases for zero-downtime reindexing:
   products_v1 → alias: products
   products_v2 → switch alias

3. Force merge old indices:
   Reduces segments, faster search

4. Use index templates for consistent mappings
```

---

## 💡 Common Patterns

### Autocomplete

```
Use edge n-grams:

"laptop" → ["l", "la", "lap", "lapt", "lapto", "laptop"]

Mapping:
{
    "title": {
        "type": "text",
        "fields": {
            "autocomplete": {
                "type": "text",
                "analyzer": "autocomplete_analyzer"
            }
        }
    }
}

Query as user types: "lap" → matches "laptop"
```

### Fuzzy Search

```
Handle typos:

"laptpo" → finds "laptop"

{
    "query": {
        "match": {
            "title": {
                "query": "laptpo",
                "fuzziness": "AUTO"  # 0-2 based on term length
            }
        }
    }
}
```

### Highlighting

```
Show matching terms in results:

{
    "highlight": {
        "fields": {
            "description": {}
        }
    }
}

Returns:
"highlight": {
    "description": ["Great <em>laptop</em> for work"]
}
```

---

## 💡 In System Design Interviews

### When to Introduce

```
1. "How do users search for products?"
2. "Need fast text search"
3. "Auto-complete feature"
4. "Search logs/events"
5. "Faceted navigation (filter by category, price)"
```

### Key Discussion Points

```
1. What fields to index?
2. Real-time vs batch indexing?
3. How to keep in sync with database?
4. Sharding strategy (how many shards)?
5. How to handle relevance ranking?
6. Autocomplete implementation?
```

---

## ✅ Key Takeaways

1. **Inverted index** is the secret sauce
2. **Shards for scaling** - plan ahead, can't change later
3. **Primary + Replica** for availability
4. **Filters are cacheable** - use them for exact matches
5. **Separate from DB** - search is eventually consistent
6. **CDC for sync** - keeps search updated reliably
7. **Elasticsearch** is the go-to for most use cases
