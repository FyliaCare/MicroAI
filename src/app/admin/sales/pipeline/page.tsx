"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DollarSign, Calendar, User, TrendingUp, Plus } from "lucide-react";

interface Opportunity {
  id: string;
  opportunityNumber: string;
  name: string;
  value: number;
  probability: number;
  stage: string;
  expectedCloseDate: string | null;
  assignedToName: string | null;
}

const stages = [
  { id: "prospecting", name: "Prospecting", color: "bg-blue-500" },
  { id: "qualification", name: "Qualification", color: "bg-purple-500" },
  { id: "proposal", name: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
  { id: "closed-won", name: "Won", color: "bg-green-500" },
  { id: "closed-lost", name: "Lost", color: "bg-red-500" },
];

export default function PipelinePage() {
  const [opportunities, setOpportunities] = useState<
    Record<string, Opportunity[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [pipelineValue, setPipelineValue] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sales/opportunities");
      const data = await response.json();

      // Group opportunities by stage
      const grouped: Record<string, Opportunity[]> = {};
      const values: Record<string, number> = {};

      stages.forEach((stage) => {
        grouped[stage.id] = [];
        values[stage.id] = 0;
      });

      data.opportunities.forEach((opp: Opportunity) => {
        if (grouped[opp.stage]) {
          grouped[opp.stage].push(opp);
          values[opp.stage] += opp.value;
        }
      });

      setOpportunities(grouped);
      setPipelineValue(values);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the opportunity
    const sourceOpps = Array.from(opportunities[source.droppableId]);
    const [movedOpp] = sourceOpps.splice(source.index, 1);

    // Update stage
    movedOpp.stage = destination.droppableId;

    // Update source column
    const newOpportunities = { ...opportunities };
    newOpportunities[source.droppableId] = sourceOpps;

    // Update destination column
    const destOpps = Array.from(opportunities[destination.droppableId]);
    destOpps.splice(destination.index, 0, movedOpp);
    newOpportunities[destination.droppableId] = destOpps;

    setOpportunities(newOpportunities);

    // Update on server
    try {
      await fetch(`/api/sales/opportunities/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: destination.droppableId }),
      });
      fetchOpportunities(); // Refresh to get updated values
    } catch (error) {
      console.error("Error updating opportunity:", error);
      // Revert on error
      fetchOpportunities();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-2">
              Drag and drop opportunities to update their stage
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            New Opportunity
          </button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className={`${stage.color} w-12 h-1 rounded-full mb-3`}></div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {stage.name}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              ${(pipelineValue[stage.id] || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {opportunities[stage.id]?.length || 0} deals
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`${stage.color} w-3 h-3 rounded-full`}
                  ></div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {stage.name}
                  </h2>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {opportunities[stage.id]?.length || 0}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 min-h-[200px] ${
                      snapshot.isDraggingOver ? "bg-blue-50" : ""
                    } rounded-lg p-2 transition-colors`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : (
                      opportunities[stage.id]?.map((opp, index) => (
                        <Draggable
                          key={opp.id}
                          draggableId={opp.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                snapshot.isDragging ? "rotate-3 shadow-lg" : ""
                              }`}
                            >
                              <h3 className="font-medium text-gray-900 mb-2">
                                {opp.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-gray-900">
                                  ${opp.value.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  {opp.probability}% probability
                                </span>
                              </div>
                              {opp.expectedCloseDate && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm text-gray-600">
                                    {new Date(
                                      opp.expectedCloseDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {opp.assignedToName && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm text-gray-600">
                                    {opp.assignedToName}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
