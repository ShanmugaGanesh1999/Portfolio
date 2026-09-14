// Thin wrapper — canvas logic lives in ./diagram/DiagramCanvas.jsx
import DiagramCanvas from "./diagram/DiagramCanvas";
import { DIAGRAM_NODES, DIAGRAM_EDGES, DATA_FLOWS } from "./rollupSummaryData";

export default function InteractiveDiagram() {
  return (
    <DiagramCanvas
      nodes={DIAGRAM_NODES}
      edges={DIAGRAM_EDGES}
      flows={DATA_FLOWS}
      markerId="arrowhead"
      viewBox="0 0 1100 560"
      heights={{ mobile: "280px", desktop: "420px" }}
    />
  );
}
