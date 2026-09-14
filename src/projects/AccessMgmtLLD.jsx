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
} from "./accessMgmtLLDData";

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

export default function AccessMgmtLLD() {
  return <GenericLLD data={data} tabColors={{
    "User.java": "accent",
    "AuthToken.java": "variable",
    "AccessPolicy.java": "keyword",
    "AuthorizationDecision.java": "success",
    "OAuth2TokenManager.java": "func",
    "PolicyDecisionPoint.java": "comment",
    "Demo.java": "string",
  }} />;
}
