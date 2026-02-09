# Network Abstractions: Remote Procedure Calls

> Understanding how distributed systems communicate

---

## 📖 What is RPC?

**Remote Procedure Call (RPC)** is a protocol that allows a program to execute a procedure on a remote server as if it were a local function call.

```
Local Call:           result = calculateSum(a, b)
Remote Call (RPC):    result = remoteService.calculateSum(a, b)  # Looks the same!
```

---

## 🎯 Why RPC Matters

### The Problem
In distributed systems, components run on different machines and need to communicate. Raw network programming is complex:

```
Without RPC:
1. Serialize data to bytes
2. Establish network connection
3. Handle connection errors
4. Send request bytes
5. Wait for response
6. Handle timeouts
7. Deserialize response
8. Handle parsing errors
```

### The Solution
RPC abstracts all of this:

```
With RPC:
result = service.method(params)
```

---

## 🔧 How RPC Works

### The RPC Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                           CLIENT                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐   │
│  │ Client Code │───▶│ Client Stub │───▶│ Network Transport   │   │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘   │
└────────────────────────────────────────────────────┼─────────────┘
                                                     │
                                            Network (TCP/UDP)
                                                     │
┌────────────────────────────────────────────────────┼─────────────┐
│                           SERVER                    ▼             │
│  ┌─────────────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │ Network Transport   │───▶│ Server Stub │───▶│ Server Code │   │
│  └─────────────────────┘    └─────────────┘    └─────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Step by Step

1. **Client calls stub** - Looks like a local function
2. **Stub marshals parameters** - Serializes to wire format
3. **Network transport** - Sends over TCP/UDP
4. **Server stub unmarshals** - Deserializes parameters
5. **Server executes** - Runs the actual function
6. **Response travels back** - Same path in reverse

---

## 📊 RPC vs REST vs GraphQL

| Aspect | RPC (gRPC) | REST | GraphQL |
|--------|------------|------|---------|
| **Protocol** | HTTP/2, Protocol Buffers | HTTP, JSON | HTTP, JSON |
| **Contract** | Strict (proto files) | Loose (OpenAPI optional) | Schema-based |
| **Performance** | High (binary) | Medium (text) | Medium (text) |
| **Streaming** | Bidirectional | SSE, WebSocket | Subscriptions |
| **Learning Curve** | Higher | Lower | Medium |
| **Use Case** | Internal services | Public APIs | Flexible queries |

---

## 🛠️ Popular RPC Frameworks

### 1. gRPC (Google)

**Best for**: Microservices, high-performance systems

```protobuf
// user.proto - Define the contract
service UserService {
    rpc GetUser (UserRequest) returns (UserResponse);
    rpc ListUsers (ListRequest) returns (stream UserResponse);
}

message UserRequest {
    string user_id = 1;
}

message UserResponse {
    string id = 1;
    string name = 2;
    string email = 3;
}
```

**Features**:
- Protocol Buffers (binary, compact)
- HTTP/2 (multiplexing, streaming)
- Bidirectional streaming
- Code generation for multiple languages

### 2. Apache Thrift (Facebook)

**Best for**: Cross-language services

```thrift
service UserService {
    User getUser(1: string userId)
    list<User> listUsers(1: i32 limit)
}

struct User {
    1: string id
    2: string name
    3: string email
}
```

### 3. JSON-RPC

**Best for**: Simple, human-readable RPC

```json
// Request
{
    "jsonrpc": "2.0",
    "method": "getUser",
    "params": {"userId": "123"},
    "id": 1
}

// Response
{
    "jsonrpc": "2.0",
    "result": {"id": "123", "name": "John"},
    "id": 1
}
```

---

## ⚡ Synchronous vs Asynchronous RPC

### Synchronous RPC
```
Client ──request──▶ Server
Client ◀──wait──┐
Client ◀──response──┘

- Client blocks until response
- Simpler programming model
- Can cause cascading timeouts
```

### Asynchronous RPC
```
Client ──request──▶ Server
Client ──continues──▶
Client ◀──callback/response──

- Client continues processing
- Better resource utilization
- More complex error handling
```

---

## 🚨 RPC Challenges

### 1. Network Failures

**Problem**: Network is unreliable

**Solutions**:
- Timeouts with retries
- Circuit breakers
- Fallback responses

```python
# Retry with exponential backoff
for attempt in range(max_retries):
    try:
        return service.call(request)
    except NetworkError:
        wait_time = base_delay * (2 ** attempt)
        sleep(wait_time)
```

### 2. Partial Failures

**Problem**: Request might succeed but response lost

```
Client ──request──▶ Server (succeeds)
Client ◀──X──(response lost)──┘
Client ──retry──▶ Server (duplicate!)
```

**Solution**: Idempotency

```python
# Add unique request ID
request_id = generate_uuid()
result = service.call(request, idempotency_key=request_id)
# Server deduplicates based on request_id
```

### 3. Latency

**Problem**: Network adds delay

**Solutions**:
- Connection pooling
- Request batching
- Caching
- Geographic distribution

### 4. Versioning

**Problem**: Server updates, clients break

**Solutions**:
- Backward compatible changes
- Version in URL/header
- Feature flags

```protobuf
// Adding fields is backward compatible
message UserResponse {
    string id = 1;
    string name = 2;
    string email = 3;
    string phone = 4;  // New field - old clients ignore
}
```

---

## 📐 RPC Best Practices

### 1. Define Clear Contracts
```protobuf
// Good: Explicit types and validation
message CreateUserRequest {
    string email = 1 [(validate.rules).string.email = true];
    string name = 2 [(validate.rules).string.min_len = 1];
}
```

### 2. Use Timeouts
```python
# Always set timeouts
response = stub.GetUser(
    request, 
    timeout=5.0  # seconds
)
```

### 3. Handle Errors Gracefully
```python
try:
    user = user_service.get_user(user_id)
except NotFoundError:
    return default_user()
except TimeoutError:
    return cached_user(user_id)
except ServiceUnavailableError:
    return fallback_response()
```

### 4. Monitor and Trace
```python
# Add distributed tracing
with tracer.start_span("get_user") as span:
    span.set_attribute("user_id", user_id)
    result = service.get_user(user_id)
    span.set_attribute("success", True)
```

---

## 🎨 Choosing Communication Pattern

| Scenario | Pattern | Example |
|----------|---------|---------|
| Real-time updates | Bidirectional streaming | Chat, gaming |
| Large data transfer | Server streaming | File download |
| Quick request-response | Unary RPC | User lookup |
| Loose coupling | Message queue | Order processing |
| External API | REST | Public API |
| Flexible queries | GraphQL | Dashboard data |

---

## 💡 RPC in System Design Interviews

### When to Use RPC
- Internal microservice communication
- High-performance requirements
- Strict contract needed between services
- Language-agnostic service mesh

### When to Avoid
- Public-facing APIs (use REST)
- Simple CRUD operations
- Browser-based clients (limited gRPC support)
- Need human-readable requests (debugging)

### Common Interview Points
1. **Latency**: RPC adds network latency
2. **Coupling**: Services become coupled by contract
3. **Failures**: Network failures need handling
4. **Versioning**: API evolution is challenging

---

## ✅ Key Takeaways

1. **RPC abstracts network** - Makes remote calls feel local
2. **Choose the right tool** - gRPC for performance, REST for simplicity
3. **Handle failures** - Timeouts, retries, circuit breakers
4. **Design for idempotency** - Retries shouldn't cause problems
5. **Monitor everything** - Distributed tracing is essential
