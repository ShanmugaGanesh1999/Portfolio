# 💥 System Failures & Post-Mortems - Interview Guide

> **Interview Duration**: 45 minutes  
> **Difficulty**: Hard  
> **Type**: Failure Analysis & Prevention

---

## 1️⃣ Why Study System Failures? (5 min)

### Interview Context
- **"Tell me about a system failure you've dealt with"**
- **"How would you prevent X from happening?"**
- **"What's your incident response process?"**

### What Interviewers Look For
1. **Technical Depth**: Understanding failure modes
2. **Prevention Mindset**: How to avoid recurrence
3. **Communication**: Clear post-mortem writing
4. **Learning Culture**: Blameless analysis

---

## 2️⃣ Case Study 1: AWS S3 Outage (2017)

### The Incident

```
┌─────────────────────────────────────────────────────────────────┐
│              AWS S3 US-EAST-1 OUTAGE                            │
├─────────────────────────────────────────────────────────────────┤
│  Date: February 28, 2017                                        │
│  Duration: ~4 hours                                             │
│  Impact: Major internet disruption                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WHAT HAPPENED:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. Engineer runs playbook to debug billing issue       │    │
│  │  2. Typo in command removes MORE servers than intended │    │
│  │  3. S3 index subsystem (metadata) goes down             │    │
│  │  4. S3 placement subsystem follows                      │    │
│  │  5. Recovery takes hours (cold start is SLOW)           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  THE TYPO:                                                      │
│  Intended: Remove small subset of servers                       │
│  Actual: Removed large set including critical index servers     │
│                                                                  │
│  CASCADING FAILURE:                                             │
│  S3 → CloudFront → Lambda → Many websites → Internet chaos     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Root Cause Analysis

```python
# Simplified representation of what went wrong

class S3Operations:
    """Example of dangerous operation without safeguards"""
    
    def remove_servers(self, server_pattern: str, count: int):
        """
        DANGEROUS: What the tool allowed
        """
        # No validation on count
        # No confirmation for large operations
        # No rate limiting
        
        servers = self.match_servers(server_pattern)
        for server in servers[:count]:  # Typo here: wrong count
            self.terminate_server(server)
    
    def remove_servers_safe(self, server_pattern: str, count: int):
        """
        SAFE: What should have been implemented
        """
        servers = self.match_servers(server_pattern)
        
        # Validation 1: Sanity check on count
        if count > 100:
            raise ValueError(f"Count {count} exceeds safe limit")
        
        # Validation 2: Check critical server protection
        critical = [s for s in servers if s.is_critical]
        if critical:
            raise ValueError(f"Cannot remove critical servers: {critical}")
        
        # Validation 3: Rate limit removals
        MAX_PER_MINUTE = 10
        for i, server in enumerate(servers[:count]):
            if i > 0 and i % MAX_PER_MINUTE == 0:
                time.sleep(60)
            self.terminate_server(server)
        
        # Validation 4: Require confirmation for production
        if self.environment == "production":
            confirm = input(f"Remove {count} servers? Type 'yes' to confirm: ")
            if confirm != "yes":
                return
```

### Prevention Measures

| Prevention | Implementation |
|------------|----------------|
| Input Validation | Limit max servers removable in one command |
| Blast Radius | Critical systems protected from mass removal |
| Rate Limiting | Slow down dangerous operations |
| Confirmation | Require explicit confirmation for production |
| Canary | Remove one server, wait, check health |

---

## 3️⃣ Case Study 2: Cloudflare Outage (2019)

### The Incident

```
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE REGEX OUTAGE                            │
├─────────────────────────────────────────────────────────────────┤
│  Date: July 2, 2019                                             │
│  Duration: 27 minutes                                           │
│  Impact: 15M+ websites unreachable                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  THE BAD REGEX:                                                 │
│  (?:(?:\"|'|\]|\}|\\|\d|(?:nan|infinity|true|false|null|       │
│  undefined|symbol|math)|\`|\-|\+)+[)]*;?((?:\s|-|~|!|{}|        │
│  \|\||\+)*.*(?:.*=.*)))                                         │
│                                                                  │
│  WHAT HAPPENED:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. WAF rule deployed with new regex                    │    │
│  │  2. Regex had catastrophic backtracking                 │    │
│  │  3. CPU usage hit 100% on ALL edge servers             │    │
│  │  4. Global outage in < 1 minute                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  WHY SO FAST?                                                   │
│  • Rules deployed globally simultaneously                       │
│  • No staged rollout                                            │
│  • No CPU usage circuit breaker                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Regex Problem

```python
import re
import time

class RegexSafetyChecker:
    """Prevent catastrophic regex backtracking"""
    
    def analyze_regex(self, pattern: str) -> dict:
        """Analyze regex for potential issues"""
        
        issues = []
        
        # Check 1: Nested quantifiers (catastrophic backtracking)
        if re.search(r'\([^)]*[+*][^)]*\)[+*]', pattern):
            issues.append({
                "type": "nested_quantifiers",
                "severity": "critical",
                "example": "(a+)+ causes exponential backtracking"
            })
        
        # Check 2: Overlapping alternatives
        if re.search(r'\([^|)]+\|[^)]+\)[+*]', pattern):
            issues.append({
                "type": "overlapping_alternatives",
                "severity": "high",
                "example": "(a|a)+ causes exponential paths"
            })
        
        # Check 3: Unbounded repetition with dot
        if re.search(r'\.\*.*\.\*', pattern):
            issues.append({
                "type": "multiple_unbounded",
                "severity": "medium",
                "example": ".*foo.* can be slow"
            })
        
        return {
            "pattern": pattern,
            "issues": issues,
            "safe": len(issues) == 0
        }
    
    def test_performance(self, pattern: str, 
                         test_cases: list, timeout_ms: float = 100) -> dict:
        """Test regex performance with timeout"""
        
        regex = re.compile(pattern)
        results = []
        
        for test in test_cases:
            start = time.time()
            try:
                # Run with timeout
                match = regex.search(test)
                elapsed_ms = (time.time() - start) * 1000
                
                if elapsed_ms > timeout_ms:
                    return {
                        "safe": False,
                        "error": f"Regex took {elapsed_ms:.0f}ms on input length {len(test)}"
                    }
                
                results.append({
                    "input_length": len(test),
                    "time_ms": elapsed_ms,
                    "matched": match is not None
                })
            except Exception as e:
                return {"safe": False, "error": str(e)}
        
        return {"safe": True, "results": results}


class SafeDeploymentPipeline:
    """Staged deployment with circuit breakers"""
    
    async def deploy_waf_rule(self, rule: dict):
        """Deploy WAF rule with safety measures"""
        
        # Step 1: Static analysis
        analysis = self.regex_checker.analyze_regex(rule["pattern"])
        if not analysis["safe"]:
            raise ValueError(f"Unsafe regex: {analysis['issues']}")
        
        # Step 2: Performance testing
        perf = self.regex_checker.test_performance(
            rule["pattern"],
            self.get_test_corpus(),
            timeout_ms=10  # Very strict for WAF
        )
        if not perf["safe"]:
            raise ValueError(f"Regex too slow: {perf['error']}")
        
        # Step 3: Canary deployment (1% of edge)
        canary_result = await self.deploy_to_canary(rule)
        await asyncio.sleep(300)  # Wait 5 minutes
        
        if not self.check_canary_health():
            await self.rollback_canary(rule)
            raise ValueError("Canary deployment failed health check")
        
        # Step 4: Gradual rollout
        for percentage in [10, 25, 50, 100]:
            await self.deploy_to_percentage(rule, percentage)
            await asyncio.sleep(600)  # 10 minutes between stages
            
            if not self.check_health():
                await self.rollback(rule)
                raise ValueError(f"Rollout failed at {percentage}%")
        
        return {"status": "deployed", "rule_id": rule["id"]}
```

---

## 4️⃣ Case Study 3: Knight Capital (2012)

### The Incident

```
┌─────────────────────────────────────────────────────────────────┐
│              KNIGHT CAPITAL TRADING DISASTER                    │
├─────────────────────────────────────────────────────────────────┤
│  Date: August 1, 2012                                           │
│  Duration: 45 minutes                                           │
│  Impact: $440 MILLION LOSS                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WHAT HAPPENED:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. Deploying new trading software to 8 servers        │    │
│  │  2. Technician forgot to deploy to 1 of 8 servers      │    │
│  │  3. That server had OLD CODE with dormant bug          │    │
│  │  4. Old code started making insane trades              │    │
│  │  5. 45 minutes later: $440M loss, company bankrupt     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  THE DORMANT BUG:                                               │
│  • Old testing code was reused for new feature                  │
│  • Testing code would accumulate positions (not close them)     │
│  • No one removed the old code, just disabled via flag          │
│  • Partial deploy re-enabled the flag on one server             │
│                                                                  │
│  WHY NO KILL SWITCH?                                            │
│  • No automated position limits                                 │
│  • No anomaly detection                                         │
│  • Manual intervention took too long                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Prevention: Circuit Breakers

```python
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Optional
import asyncio


@dataclass
class TradingLimits:
    max_position_per_symbol: float = 1_000_000
    max_total_position: float = 10_000_000
    max_trades_per_minute: int = 100
    max_loss_per_hour: float = 100_000
    max_loss_per_day: float = 500_000


class TradingCircuitBreaker:
    """Automated circuit breaker for trading systems"""
    
    def __init__(self, limits: TradingLimits):
        self.limits = limits
        self.positions = {}
        self.trades_this_minute = 0
        self.pnl_this_hour = 0.0
        self.pnl_today = 0.0
        self.is_halted = False
    
    async def check_trade(self, symbol: str, quantity: float, 
                           price: float, side: str) -> bool:
        """Check if trade should be allowed"""
        
        if self.is_halted:
            raise CircuitBreakerOpen("Trading is halted")
        
        # Check 1: Position limits
        new_position = self._calculate_new_position(symbol, quantity, side)
        if abs(new_position) > self.limits.max_position_per_symbol:
            await self._halt(f"Position limit exceeded for {symbol}")
            return False
        
        # Check 2: Total exposure
        total = sum(abs(p) for p in self.positions.values()) + abs(new_position)
        if total > self.limits.max_total_position:
            await self._halt("Total position limit exceeded")
            return False
        
        # Check 3: Trade rate
        self.trades_this_minute += 1
        if self.trades_this_minute > self.limits.max_trades_per_minute:
            await self._halt("Trade rate limit exceeded")
            return False
        
        # Check 4: Loss limits
        if self.pnl_this_hour < -self.limits.max_loss_per_hour:
            await self._halt("Hourly loss limit exceeded")
            return False
        
        if self.pnl_today < -self.limits.max_loss_per_day:
            await self._halt("Daily loss limit exceeded")
            return False
        
        return True
    
    async def _halt(self, reason: str):
        """Halt all trading immediately"""
        
        self.is_halted = True
        
        # Alert all channels
        await self.alerter.send_critical(
            message=f"TRADING HALTED: {reason}",
            channels=["pagerduty", "slack", "sms"]
        )
        
        # Cancel all pending orders
        await self.order_manager.cancel_all()
        
        # Log for post-mortem
        await self.logger.critical({
            "event": "circuit_breaker_triggered",
            "reason": reason,
            "positions": self.positions,
            "pnl": self.pnl_today,
            "timestamp": datetime.utcnow().isoformat()
        })


class DeploymentValidator:
    """Ensure consistent deployment across all servers"""
    
    async def validate_deployment(self, service: str, version: str) -> dict:
        """Verify all servers are running correct version"""
        
        servers = await self.get_servers(service)
        versions = {}
        
        for server in servers:
            try:
                info = await self.get_server_version(server)
                versions[server.id] = info["version"]
            except Exception as e:
                versions[server.id] = f"ERROR: {e}"
        
        # Check for inconsistencies
        unique_versions = set(versions.values())
        
        if len(unique_versions) > 1:
            return {
                "valid": False,
                "error": "Inconsistent versions detected",
                "details": versions,
                "expected": version
            }
        
        if version not in unique_versions:
            return {
                "valid": False,
                "error": f"Expected version {version} not found",
                "found": list(unique_versions)[0]
            }
        
        return {"valid": True, "version": version, "servers": len(servers)}
```

---

## 5️⃣ Case Study 4: Facebook Outage (2021)

### The Incident

```
┌─────────────────────────────────────────────────────────────────┐
│              FACEBOOK 6-HOUR OUTAGE                             │
├─────────────────────────────────────────────────────────────────┤
│  Date: October 4, 2021                                          │
│  Duration: ~6 hours                                             │
│  Impact: FB, Instagram, WhatsApp down globally                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WHAT HAPPENED:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. Routine BGP config change during maintenance        │    │
│  │  2. Bug in audit tool failed to catch error            │    │
│  │  3. BGP routes withdrawn = FB disappeared from internet │    │
│  │  4. DNS servers couldn't reach FB = DNS fails too      │    │
│  │  5. Internal tools down = can't fix the problem        │    │
│  │  6. Physical access needed = 6 hours to recover        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  THE PERFECT STORM:                                              │
│  • BGP withdrawal = network unreachable                         │
│  • DNS fails = nothing can resolve facebook.com                 │
│  • Internal tools need network = locked out                     │
│  • Badge access needs network = can't enter data center        │
│  • Remote hands needed = physical intervention                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The BGP Problem

```python
class BGPSafetySystem:
    """Prevent catastrophic BGP changes"""
    
    def __init__(self):
        self.route_announcements = []
        self.min_routes_threshold = 100  # Alert if routes drop below this
    
    async def validate_bgp_change(self, change: dict) -> dict:
        """Validate BGP configuration change before applying"""
        
        issues = []
        
        # Check 1: Would this withdraw all routes?
        if change["action"] == "withdraw":
            remaining = self._simulate_withdrawal(change)
            if remaining < self.min_routes_threshold:
                issues.append({
                    "severity": "critical",
                    "message": f"Change would leave only {remaining} routes",
                    "action": "BLOCK"
                })
        
        # Check 2: Check for typos in prefixes
        for prefix in change.get("prefixes", []):
            if not self._is_valid_prefix(prefix):
                issues.append({
                    "severity": "critical",
                    "message": f"Invalid prefix: {prefix}"
                })
        
        # Check 3: Ensure management network not affected
        if self._affects_management_network(change):
            issues.append({
                "severity": "critical",
                "message": "Change would affect management network",
                "action": "BLOCK"
            })
        
        return {
            "allowed": len([i for i in issues if i.get("action") == "BLOCK"]) == 0,
            "issues": issues
        }
    
    def _affects_management_network(self, change: dict) -> bool:
        """Check if change affects out-of-band management"""
        
        management_prefixes = [
            "10.0.0.0/8",      # Internal management
            "192.168.0.0/16",  # Backup network
        ]
        
        for prefix in change.get("prefixes", []):
            for mgmt in management_prefixes:
                if self._prefixes_overlap(prefix, mgmt):
                    return True
        
        return False


class OutOfBandAccess:
    """Ensure always-available recovery access"""
    
    def __init__(self):
        self.oob_networks = []
        self.console_servers = []
    
    async def verify_oob_health(self) -> dict:
        """Regularly verify out-of-band access works"""
        
        results = {}
        
        # Check 1: Console servers reachable
        for console in self.console_servers:
            try:
                await self.ping(console, use_oob=True)
                results[console.id] = "healthy"
            except:
                results[console.id] = "UNREACHABLE"
        
        # Check 2: Physical access systems
        for dc in self.datacenters:
            badge_system = await self.check_badge_system(dc)
            results[f"{dc.id}_badge"] = badge_system
        
        # Check 3: Emergency procedures documented and accessible
        docs = await self.verify_runbook_access()
        results["runbooks"] = docs
        
        # Alert if any issues
        failures = [k for k, v in results.items() if v != "healthy"]
        if failures:
            await self.alert(f"OOB access degraded: {failures}")
        
        return results
```

---

## 6️⃣ Post-Mortem Template

```markdown
# Incident Post-Mortem: [Title]

## Summary
- **Date**: 
- **Duration**: 
- **Impact**: 
- **Severity**: P1/P2/P3

## Timeline (UTC)
| Time | Event |
|------|-------|
| 14:00 | Change deployed |
| 14:05 | First alerts fire |
| 14:15 | Incident declared |
| 14:30 | Root cause identified |
| 15:00 | Mitigation applied |
| 15:30 | Full recovery |

## Root Cause
[Clear, blameless description of what went wrong]

## Contributing Factors
1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

## Resolution
[What was done to fix the immediate issue]

## Lessons Learned
### What Went Well
- 

### What Went Wrong
- 

### Where We Got Lucky
- 

## Action Items
| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| Add circuit breaker | @engineer | P0 | 2024-02-01 |
| Improve monitoring | @sre | P1 | 2024-02-15 |
| Update runbook | @oncall | P2 | 2024-02-28 |

## Appendix
[Logs, graphs, additional details]
```

---

## 7️⃣ Interview Tips

### When Discussing Failures

```
DO:
✅ Be blameless - focus on systems, not people
✅ Show learning mindset - what changed after?
✅ Discuss prevention - how to avoid next time?
✅ Quantify impact - downtime, cost, users affected

DON'T:
❌ Blame individuals
❌ Gloss over mistakes
❌ Claim "it won't happen again" without proof
❌ Ignore the human factors
```

### Common Interview Questions

1. **"Tell me about a production incident you handled"**
   - Use timeline format
   - Focus on YOUR actions
   - Emphasize learnings

2. **"How do you prevent cascading failures?"**
   - Circuit breakers
   - Bulkheads
   - Graceful degradation

3. **"What's your deployment strategy for critical changes?"**
   - Canary deployments
   - Feature flags
   - Rollback plans
