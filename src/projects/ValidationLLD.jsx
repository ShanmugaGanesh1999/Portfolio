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
} from "./validationLLDData";

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

export default function ValidationLLD() {
  return <GenericLLD data={data} tabColors={{
    "ValidationRule.java": "accent",
    "ValidationContext.java": "variable",
    "ValidationResult.java": "success",
    "ValidationExecutor.java": "keyword",
    "AsyncValidationService.java": "func",
    "ExternalAPIValidator.java": "comment",
    "Demo.java": "string",
  }} />;
}
