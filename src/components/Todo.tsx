import  { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

const SortableItem = ({ id, item, onDelete }: { id: string; item: string; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className="flex bg-amber-900 text-white rounded-xl w-full justify-between items-center px-4 py-3"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Drag handle area */}
      <div className="flex-1 cursor-grab touch-none" {...attributes} {...listeners}>
        <span className="break-all">{item}</span>
      </div>

      {/* Delete button (not draggable) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent drag from activating
          onDelete();
        }}
        className="text-xl ml-4 hover:scale-110 transition-transform"
      >
        🚀
      </button>
    </motion.div>
  );
};

const Todo = () => {
    const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // Start dragging after 5px movement (helps avoid accidental drags)
      delay: 0,     // Optional: add delay in ms before drag starts
      tolerance: 5,
    },
  })
);


  const handleAdd = () => {
    if (input.trim() === "") return;
    setTasks((prev) => [...prev, input]);
    setInput("");
  };

  const handleDelete = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((task) => task === active.id);
      const newIndex = tasks.findIndex((task) => task === over?.id);
      setTasks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };
  return (
    <div className="bg-indigo-800 min-h-screen p-4 sm:p-6 md:p-10">
      <div className="bg-amber-500 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto shadow-xl">
        <div className="bg-amber-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <label className="text-lg font-medium">Enter:</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="flex-1 bg-white rounded-md p-2 text-base"
            placeholder="Type your task..."
          />
          <button
            onClick={handleAdd}
            className="bg-red-800 text-white px-4 py-2 rounded-xl active:scale-95 hover:bg-red-700 transition"
          >
            Submit
          </button>
        </div>

        <div className="pt-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">Tasks:</h1>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 pt-6">
                {tasks.map((task, index) => (
                  <SortableItem
                    key={task}
                    id={task}
                    item={task}
                    onDelete={() => handleDelete(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default Todo