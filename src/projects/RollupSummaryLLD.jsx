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
} from "./rollupSummaryLLDData";

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

export default function RollupSummaryLLD() {
  return <GenericLLD data={data} tabColors={{
    "RollupDefinition.java": "accent",
    "RollupEvent.java": "success",
    "AggregatedResult.java": "variable",
    "RollupService.java": "func",
    "RollupEngine.java": "keyword",
    "Demo.java": "string",
  }}
  entitiesCols="sm:grid-cols-3" />;
}
