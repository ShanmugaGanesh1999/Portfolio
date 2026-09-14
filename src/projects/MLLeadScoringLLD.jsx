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
} from "./mlLeadScoringLLDData";

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

export default function MLLeadScoringLLD() {
  return <GenericLLD data={data} tabColors={{
    "scoring_result.py": "variable",
    "feature_store.py": "success",
    "scoring_engine.py": "keyword",
    "allocation_engine.py": "func",
    "training_pipeline.py": "accent",
    "demo.py": "string",
  }} />;
}
