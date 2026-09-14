// Thin wrapper — canvas logic lives in ./diagram/DiagramCanvas.jsx
import DiagramCanvas from "./diagram/DiagramCanvas";
import { DIAGRAM_NODES, DIAGRAM_EDGES, DATA_FLOWS } from "./mlLeadScoringData";

export default function MLLeadScoringDiagram() {
  return (
    <DiagramCanvas
      nodes={DIAGRAM_NODES}
      edges={DIAGRAM_EDGES}
      flows={DATA_FLOWS}
      markerId="arrowhead-ml"
      viewBox="0 0 900 620"
    />
  );
}
