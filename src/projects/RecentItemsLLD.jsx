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
} from "./recentItemsLLDData";

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

export default function RecentItemsLLD() {
  return <GenericLLD data={data} tabColors={{
    "RecentItem.java": "accent",
    "ModuleType.java": "success",
    "RecentItemsRepository.java": "variable",
    "RecentItemsCache.java": "keyword",
    "RecentItemsService.java": "func",
    "Demo.java": "string",
  }}
  entitiesCols="sm:grid-cols-3" />;
}
