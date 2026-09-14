// Thin wrapper — canvas logic lives in ./diagram/DiagramCanvas.jsx
import DiagramCanvas from "./diagram/DiagramCanvas";
import { DIAGRAM_NODES, DIAGRAM_EDGES, DATA_FLOWS } from "./validationData";

export default function ValidationDiagram() {
  return (
    <DiagramCanvas
      nodes={DIAGRAM_NODES}
      edges={DIAGRAM_EDGES}
      flows={DATA_FLOWS}
      markerId="arrowhead-val"
      viewBox="0 0 1000 740"
      labelFontSize={12}
      maxZoom={2.5}
    />
  );
}
