import "./App.css";

import React, { useState } from "react";
import ReactFlow, {
  ArrowHeadType,
  Background,
  Connection,
  Controls,
  Edge,
  Elements,
  MiniMap,
  OnLoadParams,
  addEdge,
  removeElements,
  updateEdge,
  useStoreState,
} from "react-flow-renderer";

const App = () => {
  const [elements, setElements] = useState<Elements>([]);

  const onLoad = (reactFlowInstance: OnLoadParams) => {
    reactFlowInstance.fitView();
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const onConnect = (params: Edge | Connection) => {
    console.log(params);
    setElements((els) =>
      addEdge(
        {
          ...params,
          // 矢印のついたエッジにする
          arrowHeadType: ArrowHeadType.ArrowClosed,
        },
        els,
      ),
    );
  };

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
  };

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        elements={elements}
        onLoad={onLoad}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
      >
        <Background />
        <Controls />
        <MiniMap />
        <MyDebugger setElements={setElements} />
      </ReactFlow>
    </div>
  );
};

const MyDebugger = ({
  setElements,
}: {
  setElements: React.Dispatch<React.SetStateAction<Elements>>;
}) => {
  const nodes = useStoreState((state) => state.nodes);
  const edges = useStoreState((state) => state.edges);
  console.log("nodes", nodes);
  console.log("edges", edges);

  const [id, setId] = useState(0);
  const transform = useStoreState((state) => state.transform);

  const createNewNode = () => {
    setId((id) => id + 1);
    const idStr = String(id);

    setElements((els) => [
      ...els,
      {
        id: idStr,
        data: { label: `Node ${idStr}` },
        position: {
          x: -transform[0] / transform[2] + 100,
          y: -transform[1] / transform[2] + 100,
        },
      },
    ]);
  };

  return (
    <button style={{ position: "fixed", zIndex: 100 }} onClick={createNewNode}>
      ノードを追加
    </button>
  );
};

export default App;
