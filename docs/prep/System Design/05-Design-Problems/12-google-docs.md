# Design Google Docs

> Real-time collaborative document editing

---

## 📋 Problem Statement

Design a collaborative document editing system like Google Docs where multiple users can edit the same document simultaneously.

---

## R - Requirements

### Functional Requirements

```
1. Create, edit, and delete documents
2. Real-time collaboration (multiple editors)
3. See other users' cursors and selections
4. Version history and rollback
5. Comments and suggestions
6. Offline editing with sync
7. Rich text formatting
```

### Non-Functional Requirements

```
1. Real-time sync (<100ms for local edits)
2. Eventual consistency across all clients
3. No data loss (even with conflicts)
4. Handle 100+ concurrent editors
5. Works offline, syncs when online
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│   │  User A  │  │  User B  │  │  User C  │                 │
│   │ (Editor) │  │ (Editor) │  │ (Viewer) │                 │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘                 │
│        │WebSocket    │WebSocket    │WebSocket              │
│        └─────────────┼─────────────┘                        │
│                      ▼                                       │
│   ┌──────────────────────────────────────────────────┐      │
│   │              WebSocket Gateway                    │      │
│   │         (Sticky sessions per document)           │      │
│   └──────────────────────┬───────────────────────────┘      │
│                          │                                   │
│   ┌──────────────────────▼───────────────────────────┐      │
│   │           Collaboration Service                   │      │
│   │  ┌────────────────────────────────────────────┐  │      │
│   │  │   OT/CRDT Engine (Conflict Resolution)     │  │      │
│   │  └────────────────────────────────────────────┘  │      │
│   └──────────────────────┬───────────────────────────┘      │
│                          │                                   │
│        ┌─────────────────┼─────────────────┐                │
│        ▼                 ▼                 ▼                │
│   ┌─────────┐      ┌──────────┐     ┌───────────┐          │
│   │  Redis  │      │PostgreSQL│     │   Blob    │          │
│   │(Pub/Sub)│      │(Metadata)│     │  Storage  │          │
│   └─────────┘      └──────────┘     └───────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### The Core Challenge: Conflict Resolution

```
┌─────────────────────────────────────────────────────────────┐
│              The Concurrency Problem                         │
│                                                              │
│   Document: "Hello"                                          │
│                                                              │
│   User A: Insert "!" at position 5 → "Hello!"               │
│   User B: Insert " World" at position 5 → "Hello World"     │
│                                                              │
│   Both happen simultaneously. What's the result?            │
│                                                              │
│   Without coordination:                                      │
│   - User A sees: "Hello!"                                   │
│   - User B sees: "Hello World"                              │
│   - They diverge forever!                                   │
│                                                              │
│   Solutions:                                                 │
│   1. Operational Transformation (OT)                        │
│   2. Conflict-free Replicated Data Types (CRDTs)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Operational Transformation (OT)

```
┌─────────────────────────────────────────────────────────────┐
│              Operational Transformation                      │
│                                                              │
│   Used by: Google Docs                                       │
│                                                              │
│   Idea: Transform operations against each other             │
│                                                              │
│   Document: "Hello"                                          │
│   Op A: insert("!", 5)                                       │
│   Op B: insert(" World", 5)                                  │
│                                                              │
│   If B arrives after A is applied:                          │
│   - Transform B: insert(" World", 5) → insert(" World", 6)  │
│   - Because A inserted at position 5, shift B's position    │
│                                                              │
│   Result: "Hello! World" (deterministic)                    │
│                                                              │
│   Transform function: OT(op1, op2) → (op1', op2')           │
│   - After applying op1 then op2'  = same result            │
│   - After applying op2 then op1'  = same result            │
│                                                              │
│   Pros:                                                      │
│   ├── Works well with central server                       │
│   ├── Intention-preserving                                 │
│   └── Well-understood algorithms                           │
│                                                              │
│   Cons:                                                      │
│   ├── Requires central server                              │
│   ├── Complex transformation logic                         │
│   └── Hard to get right                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### CRDT (Alternative Approach)

```
┌─────────────────────────────────────────────────────────────┐
│              CRDT (Conflict-free Replicated Data Type)       │
│                                                              │
│   Used by: Figma, Apple Notes, many P2P apps                │
│                                                              │
│   Idea: Data structure that automatically merges            │
│                                                              │
│   Example: RGA (Replicated Growable Array)                  │
│                                                              │
│   Each character has unique ID: (timestamp, node_id)        │
│                                                              │
│   "Hello" = [                                                │
│     {id: (1, A), char: 'H'},                                │
│     {id: (2, A), char: 'e'},                                │
│     {id: (3, A), char: 'l'},                                │
│     {id: (4, A), char: 'l'},                                │
│     {id: (5, A), char: 'o'}                                 │
│   ]                                                          │
│                                                              │
│   Insert "!" after 'o':                                      │
│   - Create: {id: (6, B), char: '!', after: (5, A)}         │
│                                                              │
│   Merge: Sort by (after, id) → deterministic order          │
│                                                              │
│   Pros:                                                      │
│   ├── No central server needed                             │
│   ├── Works offline perfectly                              │
│   └── Merge is automatic                                   │
│                                                              │
│   Cons:                                                      │
│   ├── More memory overhead (IDs per character)             │
│   └── Tombstones for deletions                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Deep Dive

```
┌─────────────────────────────────────────────────────────────┐
│              Server-Side Architecture                        │
│                                                              │
│   Document Session Manager:                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Session for doc_123                                │   │
│   │  ├── Connected clients: [A, B, C]                  │   │
│   │  ├── Current version: 42                           │   │
│   │  ├── Pending operations: [...]                     │   │
│   │  └── Document state: CRDT or OT buffer            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Operation Flow:                                            │
│   1. Client sends operation with version number             │
│   2. Server transforms against concurrent ops              │
│   3. Server applies to document                            │
│   4. Server broadcasts to other clients                    │
│   5. Server acknowledges to sender                         │
│                                                              │
│   Message format:                                            │
│   {                                                          │
│     "type": "insert",                                       │
│     "position": 5,                                          │
│     "content": "!",                                         │
│     "version": 41,  // base version                        │
│     "client_id": "user_A"                                   │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Presence System

```
┌─────────────────────────────────────────────────────────────┐
│              User Presence                                   │
│                                                              │
│   Show other users' cursors and selections                  │
│                                                              │
│   Client sends:                                              │
│   {                                                          │
│     "type": "cursor",                                       │
│     "user_id": "user_A",                                    │
│     "position": 42,                                         │
│     "selection": {"start": 42, "end": 50},                  │
│     "color": "#FF5733"                                      │
│   }                                                          │
│                                                              │
│   Server broadcasts to all other clients                    │
│                                                              │
│   Optimizations:                                             │
│   ├── Throttle cursor updates (every 50ms)                 │
│   ├── Only send if position changed                        │
│   ├── Use separate WebSocket channel                       │
│   └── Don't persist cursor positions                       │
│                                                              │
│   Rendering:                                                 │
│   - Show colored cursor for each user                      │
│   - Show name label above cursor                           │
│   - Highlight selections with user's color                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Version History

```
┌─────────────────────────────────────────────────────────────┐
│              Version History                                 │
│                                                              │
│   Storage approach:                                          │
│                                                              │
│   Option 1: Store all operations                            │
│   ├── Every insert, delete, format                         │
│   ├── Replay to reconstruct any version                    │
│   ├── Pro: Full granular history                           │
│   └── Con: Slow for old versions (lots of replay)          │
│                                                              │
│   Option 2: Periodic snapshots + operations                 │
│   ├── Full snapshot every N operations or M minutes        │
│   ├── Store ops between snapshots                          │
│   ├── Find nearest snapshot, replay ops                    │
│   └── Good balance                                         │
│                                                              │
│   Snapshot storage:                                          │
│   {                                                          │
│     "doc_id": "doc_123",                                    │
│     "version": 1000,                                        │
│     "content": {...full document state...},                │
│     "created_at": "2024-01-15T10:30:00Z"                   │
│   }                                                          │
│                                                              │
│   Named versions (checkpoints):                             │
│   ├── User can name a version                              │
│   ├── "Version before major rewrite"                       │
│   └── Linked to specific snapshot                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Offline Support

```
┌─────────────────────────────────────────────────────────────┐
│              Offline Editing                                 │
│                                                              │
│   1. Cache document locally (IndexedDB)                     │
│   2. Queue operations while offline                         │
│   3. On reconnect:                                          │
│      a. Send queued operations                              │
│      b. Receive missed operations                           │
│      c. Transform/merge as needed                           │
│      d. Resolve any conflicts                               │
│                                                              │
│   Client state:                                              │
│   {                                                          │
│     "doc_id": "doc_123",                                    │
│     "local_version": 45,                                    │
│     "server_version": 42,  // last synced                  │
│     "pending_ops": [                                        │
│       {"type": "insert", ...},                              │
│       {"type": "delete", ...}                               │
│     ],                                                       │
│     "content": {...}                                        │
│   }                                                          │
│                                                              │
│   Sync algorithm:                                            │
│   1. Send pending_ops with base server_version             │
│   2. Server transforms against ops since server_version    │
│   3. Server sends back transformed ops + missed ops        │
│   4. Client applies to reach consistent state              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 API Design

```
# WebSocket messages

# Join document
→ {"action": "join", "doc_id": "doc_123"}
← {"action": "joined", "version": 42, "content": {...}}

# Send operation
→ {"action": "op", "op": {"type": "insert", ...}, "version": 42}
← {"action": "ack", "version": 43}

# Receive operation from others
← {"action": "remote_op", "op": {...}, "version": 43, "user": "B"}

# Cursor updates
→ {"action": "cursor", "position": 100}
← {"action": "cursor", "user": "B", "position": 50}

# REST endpoints

# Create document
POST /v1/documents
→ {"title": "My Doc"}
← {"id": "doc_123", "title": "My Doc"}

# Get version history
GET /v1/documents/{id}/history

# Restore version
POST /v1/documents/{id}/restore
→ {"version": 35}
```

---

## 📊 Summary

```
Key Components:
├── WebSocket Gateway: Real-time bidirectional communication
├── OT/CRDT Engine: Conflict-free concurrent editing
├── Presence System: Show other users' cursors
├── Version Store: Snapshots + operation log

Key Decisions:
├── OT for server-centric (Google Docs) vs CRDT for P2P
├── Periodic snapshots for efficient history
├── WebSocket for real-time updates
├── IndexedDB for offline support

Challenges:
├── Transformation correctness
├── Handling network partitions
├── Cursor position mapping after transforms
├── Large document performance
```
