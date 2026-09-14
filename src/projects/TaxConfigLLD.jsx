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
} from "./taxConfigLLDData";

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

export default function TaxConfigLLD() {
  return <GenericLLD data={data} tabColors={{
    "Tax.java": "accent",
    "LineItem.java": "variable",
    "TaxConfigSnapshot.java": "comment",
    "TaxCalculationStrategy.java": "success",
    "TaxConfigurationService.java": "func",
    "Demo.java": "string",
  }}
  entitiesCols="sm:grid-cols-2 lg:grid-cols-4" />;
}
