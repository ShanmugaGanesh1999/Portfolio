// Thin wrapper — canvas logic lives in ./diagram/DiagramCanvas.jsx
import DiagramCanvas from "./diagram/DiagramCanvas";
import { DIAGRAM_NODES, DIAGRAM_EDGES, DATA_FLOWS } from "./taxConfigData";

export default function TaxConfigDiagram() {
  return (
    <DiagramCanvas
      nodes={DIAGRAM_NODES}
      edges={DIAGRAM_EDGES}
      flows={DATA_FLOWS}
      markerId="arrowhead-tax"
      viewBox="0 0 1100 720"
    />
  );
}
