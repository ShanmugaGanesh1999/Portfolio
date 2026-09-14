// Thin wrapper — content and rendering live in ./lld/GenericLLD.jsx
import GenericLLD from "./lld/GenericLLD";
import {
  PROBLEM_SCOPE,
  KEY_APIS,
  UML_CLASSES,
  UML_RELATIONSHIPS,
  CODE_FILES,
  COMPLEXITY,
  FOLLOW_UPS,
  DESIGN_PATTERNS,
  SOLID_PRINCIPLE,
} from "./marketDataLLDData";

const data = {
  PROBLEM_SCOPE,
  KEY_APIS,
  UML_CLASSES,
  UML_RELATIONSHIPS,
  CODE_FILES,
  COMPLEXITY,
  FOLLOW_UPS,
  DESIGN_PATTERNS,
  SOLID_PRINCIPLE,
};

export default function MarketDataLLD() {
  return <GenericLLD data={data} tabColors={{
    "MarketData.java": "accent",
    "AggregatedQuote.java": "success",
    "DataSource.java": "func",
    "DataSourceAdapter.java": "variable",
    "MarketDataRepository.java": "func",
    "MarketDataAggregator.java": "keyword",
    "SimulatedPollingAdapter.java": "string",
    "MarketDataDemo.java": "accent",
  }}
  spaceTitle="Memory Footprint"
  spaceCols="sm:grid-cols-3"
  concurrencyStacked
  concurrencyTitle="Concurrency Primitives"
  apisHeading="API Signatures" />;
}
