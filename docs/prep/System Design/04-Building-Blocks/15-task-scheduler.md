# Task Scheduler

> Executing jobs reliably at scale

---

## 📖 What is a Task Scheduler?

A **Task Scheduler** is a system that manages the execution of jobs/tasks at specified times or intervals, ensuring reliable completion even in distributed environments.

```
Types of Tasks:
├── Scheduled: Run at specific time (cron)
├── Recurring: Run periodically (every hour)
├── Delayed: Run after X time (remind in 1 hour)
└── Event-triggered: Run when event occurs
```

---

## 🎯 Why Task Scheduling?

```
Use Cases:
├── Send email digests every morning
├── Process pending payments every 5 minutes
├── Generate reports at end of day
├── Expire sessions after 30 minutes
├── Retry failed operations
├── Batch processing jobs
└── Cleanup old data

Challenges in Distributed Systems:
├── Multiple instances → duplicate execution
├── Server failure → missed jobs
├── Time zones and daylight saving
├── Job dependencies
└── Scaling under load
```

---

## 🔧 Scheduler Architecture

### Basic Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Task Scheduler                           │
│                                                              │
│   ┌─────────────┐                                           │
│   │  Job Store  │ ← Persistence (what jobs exist)           │
│   └──────┬──────┘                                           │
│          │                                                   │
│   ┌──────▼──────┐                                           │
│   │  Scheduler  │ ← Decides when to run                     │
│   │   (Timer)   │                                           │
│   └──────┬──────┘                                           │
│          │                                                   │
│   ┌──────▼──────┐                                           │
│   │   Queue     │ ← Jobs ready to execute                   │
│   └──────┬──────┘                                           │
│          │                                                   │
│   ┌──────▼──────┐                                           │
│   │   Workers   │ ← Execute the jobs                        │
│   └─────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Distributed Architecture

```
                    ┌─────────────────┐
                    │   Job Store     │
                    │   (Database)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │Scheduler 1│  │Scheduler 2│  │Scheduler 3│
       │  (Leader) │  │(Standby)  │  │(Standby)  │
       └─────┬─────┘  └───────────┘  └───────────┘
             │
             ▼
       ┌─────────────────────────────┐
       │        Task Queue           │
       │    (Redis / RabbitMQ)       │
       └──────────────┬──────────────┘
                      │
           ┌──────────┼──────────┐
           ▼          ▼          ▼
       ┌───────┐  ┌───────┐  ┌───────┐
       │Worker1│  │Worker2│  │Worker3│
       └───────┘  └───────┘  └───────┘
```

---

## 📊 Scheduling Strategies

### Cron-based

```
Standard cron expression:
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
│ │ │ │ │
* * * * *

Examples:
0 9 * * *     → Every day at 9:00 AM
*/15 * * * *  → Every 15 minutes
0 0 1 * *     → First day of every month
0 8-17 * * 1-5 → Hourly, 8AM-5PM, weekdays
```

### Fixed Delay vs Fixed Rate

```
Fixed Rate (every 5 min regardless of duration):
├── Run at: 00:00, 00:05, 00:10, 00:15
├── Even if job takes 3 minutes
└── Risk: Overlapping jobs

Timeline:
00:00 ────[job 3min]──── 00:03
00:05 ────[job 3min]──── 00:08
00:10 ────[job 3min]──── 00:13

Fixed Delay (5 min after previous completes):
├── Finish → Wait 5 min → Start
├── More predictable
└── Longer total cycle

Timeline:
00:00 ────[job 3min]──── 00:03 ──5min── 00:08 ────[job]────
```

### Priority Scheduling

```
High Priority: Process now, skip queue
Medium Priority: Normal queue
Low Priority: Run when idle

┌─────────────────────────────────────┐
│     High    │    Medium    │  Low   │
│  [───────]  │  [─────────] │  [──]  │
│   Process   │     Wait     │  Idle  │
│    first    │              │        │
└─────────────────────────────────────┘
```

---

## 🔧 Ensuring Exactly-Once Execution

### The Problem

```
Multiple scheduler instances:
├── Instance A: "Time to run job X!"
├── Instance B: "Time to run job X!"
└── Job runs twice! ❌
```

### Solution 1: Leader Election

```
Only one scheduler is active:

┌──────────────────────────────────────────┐
│           Leader Election                 │
│                                          │
│   Scheduler A ◄─── Leader (runs jobs)    │
│   Scheduler B ◄─── Follower (standby)    │
│   Scheduler C ◄─── Follower (standby)    │
│                                          │
│   If A dies → B becomes leader           │
└──────────────────────────────────────────┘

Use: ZooKeeper, etcd, Redis SETNX
```

### Solution 2: Distributed Locking

```python
# Each job acquires lock before running
import redis
import time

def run_job_with_lock(redis_client, job_id, job_func):
    lock_key = f"job_lock:{job_id}"
    lock_value = str(uuid.uuid4())
    
    # Try to acquire lock (atomic)
    acquired = redis_client.set(
        lock_key, 
        lock_value,
        nx=True,  # Only if not exists
        ex=300    # Expire in 5 minutes (safety)
    )
    
    if not acquired:
        return "Job already running"
    
    try:
        job_func()
    finally:
        # Release lock (only if we own it)
        lua_script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """
        redis_client.eval(lua_script, 1, lock_key, lock_value)
```

### Solution 3: Database-based Locking

```sql
-- Job table with lock
CREATE TABLE scheduled_jobs (
    id VARCHAR(50) PRIMARY KEY,
    next_run_at TIMESTAMP,
    locked_by VARCHAR(50) NULL,
    locked_until TIMESTAMP NULL
);

-- Worker claims job atomically
UPDATE scheduled_jobs 
SET locked_by = 'worker-1',
    locked_until = NOW() + INTERVAL '5 minutes'
WHERE id = 'job-123'
  AND (locked_by IS NULL OR locked_until < NOW())
  AND next_run_at <= NOW();
  
-- If UPDATE affected 1 row → we got the lock
-- If UPDATE affected 0 rows → someone else has it
```

---

## 📈 Job Execution Patterns

### Retry with Backoff

```
Failure handling:

Attempt 1: Run job      → Failed
Wait: 1 second
Attempt 2: Retry        → Failed
Wait: 2 seconds
Attempt 3: Retry        → Failed
Wait: 4 seconds
Attempt 4: Retry        → Failed
Wait: 8 seconds
Attempt 5: Retry        → Success ✓

Or: Max retries exceeded → Dead letter queue
```

```python
import time
from functools import wraps

def retry_with_backoff(max_retries=5, base_delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise  # Final attempt failed
                    
                    delay = base_delay * (2 ** attempt)
                    time.sleep(delay)
        return wrapper
    return decorator

@retry_with_backoff(max_retries=5)
def process_payment(order_id):
    # May fail, will be retried
    pass
```

### Job State Machine

```
         ┌─────────────────────────────────────┐
         │                                     │
         ▼                                     │
    ┌─────────┐     ┌─────────┐     ┌─────────┤
    │ PENDING │────►│ RUNNING │────►│ SUCCESS │
    └────┬────┘     └────┬────┘     └─────────┘
         │               │
         │               ▼
         │          ┌─────────┐     ┌─────────┐
         │          │ FAILED  │────►│  RETRY  │───┐
         │          └────┬────┘     └─────────┘   │
         │               │                        │
         │               ▼                        │
         │          ┌─────────┐                   │
         └─────────►│  DEAD   │◄──────────────────┘
                    │ LETTER  │   (max retries)
                    └─────────┘
```

---

## 🔧 Delayed Job Execution

### Database Polling

```
Simple but not efficient for many jobs:

SELECT * FROM jobs 
WHERE run_at <= NOW() 
  AND status = 'pending'
ORDER BY run_at
LIMIT 100;

Problem: Polling overhead, delay between polls
```

### Redis Sorted Sets

```
Score = timestamp when job should run:

ZADD delayed_jobs 1705320000 "job:123"  # Run at timestamp
ZADD delayed_jobs 1705320060 "job:124"  # Run 1 min later

Worker:
while True:
    # Get jobs ready to run
    jobs = ZRANGEBYSCORE delayed_jobs 0 NOW LIMIT 0 10
    for job in jobs:
        # Process and remove
        ZREM delayed_jobs job
        process(job)
```

### Timing Wheel

```
Efficient for many short delays:

Wheel with 60 slots (seconds):
    
     0   1   2   3   4   5   ...  59
    [●] [ ] [●] [ ] [●] [ ] ... [●]
     │       │       │           │
     └─jobs  └─jobs  └─jobs      └─jobs
     
Current pointer advances each second
Process all jobs in current slot

For longer delays: Hierarchical wheels
├── Seconds wheel (60 slots)
├── Minutes wheel (60 slots)  
└── Hours wheel (24 slots)
```

---

## 📊 Task Scheduling Technologies

### Celery (Python)

```python
from celery import Celery
from celery.schedules import crontab

app = Celery('tasks', broker='redis://localhost')

# Periodic tasks
app.conf.beat_schedule = {
    'send-report-every-morning': {
        'task': 'tasks.send_report',
        'schedule': crontab(hour=9, minute=0),
    },
    'cleanup-every-hour': {
        'task': 'tasks.cleanup',
        'schedule': crontab(minute=0),
    },
}

@app.task
def send_report():
    # Generate and send report
    pass

# Delayed task
send_email.apply_async(args=['hello'], countdown=3600)  # 1 hour
```

### Bull (Node.js)

```javascript
const Queue = require('bull');

const emailQueue = new Queue('email', 'redis://localhost');

// Add job with delay
emailQueue.add(
    { to: 'user@email.com', subject: 'Hello' },
    { delay: 3600000 }  // 1 hour in ms
);

// Recurring job
emailQueue.add(
    { type: 'daily-report' },
    { repeat: { cron: '0 9 * * *' } }
);

// Process jobs
emailQueue.process(async (job) => {
    await sendEmail(job.data);
});
```

### Comparison

| Feature | Celery | Bull | Sidekiq |
|---------|--------|------|---------|
| Language | Python | Node.js | Ruby |
| Broker | Redis/RabbitMQ | Redis | Redis |
| Cron | Yes (Beat) | Yes | Yes |
| Priorities | Yes | Yes | Yes |
| Retries | Yes | Yes | Yes |
| Dashboard | Flower | Bull Board | Web UI |

### Enterprise Options

```
AWS:
├── SQS + Lambda (serverless)
├── Step Functions (complex workflows)
├── EventBridge (scheduled events)

Google Cloud:
├── Cloud Tasks
├── Cloud Scheduler
└── Cloud Functions

Kubernetes:
├── CronJobs (built-in)
├── Argo Workflows
└── Temporal.io
```

---

## 💡 Handling Job Dependencies

### DAG (Directed Acyclic Graph)

```
Job dependencies as graph:

        ┌───────────┐
        │  Extract  │
        └─────┬─────┘
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│Transform│Transform│Transform
│   A    │   B    │   C    │
└───┬────┘└───┬───┘└───┬───┘
    │         │        │
    └────┬────┴────────┘
         ▼
    ┌─────────┐
    │  Load   │
    └─────────┘

Tools: Airflow, Dagster, Prefect
```

### Workflow Example (Airflow)

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

dag = DAG(
    'etl_pipeline',
    schedule_interval='0 2 * * *',  # 2 AM daily
    start_date=datetime(2024, 1, 1)
)

extract = PythonOperator(
    task_id='extract',
    python_callable=extract_data,
    dag=dag
)

transform = PythonOperator(
    task_id='transform',
    python_callable=transform_data,
    dag=dag
)

load = PythonOperator(
    task_id='load',
    python_callable=load_data,
    dag=dag
)

# Define dependencies
extract >> transform >> load
```

---

## 💡 In System Design Interviews

### When to Discuss

```
1. "How do you send reminder emails?"
2. "How do you handle recurring tasks?"
3. "How do you retry failed operations?"
4. "How do you process data in batches?"
```

### Key Points

```
1. Exactly-once: Leader election or distributed locks
2. Persistence: Jobs stored in database
3. Queue: For distributing work
4. Retries: Exponential backoff
5. Dead letter: For failed jobs
6. Monitoring: Job success/failure rates
7. Scaling: More workers for throughput
```

---

## ✅ Key Takeaways

1. **Job store** for persistence
2. **Leader election** or **distributed locks** for exactly-once
3. **Queue** to distribute work to workers
4. **Retry with backoff** for failures
5. **Dead letter queue** for max-retried jobs
6. **Celery/Bull** for application-level scheduling
7. **Airflow** for complex DAG workflows
8. **Kubernetes CronJobs** for container workloads
