'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { GameResult } from '@/lib/types';

interface Item {
  id: string;
  content: string;
  groupId: string;
  image?: string;
}

interface Group {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface GroupSortProps {
  items?: Item[];
  groups?: Group[];
  title?: string;
  onComplete?: (result: GameResult) => void;
}

// Draggable Item Component
function DraggableItem({ item, isDragging }: { item: Item; isDragging: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        px-4 py-3 bg-white rounded-lg shadow-md cursor-move select-none
        hover:shadow-lg transition-shadow border-2 border-gray-200
        ${isDragging ? 'z-50' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        {item.image && <span className="text-xl">{item.image}</span>}
        <span className="font-medium">{item.content}</span>
      </div>
    </div>
  );
}

// Droppable Group Component
function DroppableGroup({
  group,
  items,
  isCorrect
}: {
  group: Group;
  items: Item[];
  isCorrect?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: group.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-4 rounded-xl min-h-[200px] transition-all
        ${isOver ? 'ring-4 ring-offset-2' : ''}
        ${isCorrect === true ? 'bg-green-100 border-green-400' : ''}
        ${isCorrect === false ? 'bg-red-100 border-red-400' : ''}
      `}
      style={{
        backgroundColor: isOver ? `${group.color}20` : `${group.color}10`,
        borderColor: group.color,
        borderWidth: '2px',
        borderStyle: 'solid'
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        {group.icon && <span className="text-2xl">{group.icon}</span>}
        <h3 className="text-lg font-bold" style={{ color: group.color }}>
          {group.name}
        </h3>
        <span className="ml-auto text-sm text-gray-600">
          ({items.length} items)
        </span>
      </div>

      <div className="space-y-2">
        <SortableContext
          items={items.map(item => item.id)}
          strategy={rectSortingStrategy}
        >
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              isDragging={false}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

const defaultGroups: Group[] = [
  { id: 'fruits', name: 'Фрукты', color: '#10b981', icon: '🍎' },
  { id: 'animals', name: 'Животные', color: '#3b82f6', icon: '🐾' },
  { id: 'transport', name: 'Транспорт', color: '#f59e0b', icon: '🚗' },
];

const defaultItems: Item[] = [
  { id: '1', content: 'Яблоко', groupId: 'fruits', image: '🍎' },
  { id: '2', content: 'Банан', groupId: 'fruits', image: '🍌' },
  { id: '3', content: 'Апельсин', groupId: 'fruits', image: '🍊' },
  { id: '4', content: 'Собака', groupId: 'animals', image: '🐕' },
  { id: '5', content: 'Кошка', groupId: 'animals', image: '🐱' },
  { id: '6', content: 'Слон', groupId: 'animals', image: '🐘' },
  { id: '7', content: 'Машина', groupId: 'transport', image: '🚗' },
  { id: '8', content: 'Самолет', groupId: 'transport', image: '✈️' },
  { id: '9', content: 'Велосипед', groupId: 'transport', image: '🚲' },
];

export const GroupSort: React.FC<GroupSortProps> = ({
  items = defaultItems,
  groups = defaultGroups,
  title = "Сортировка по группам",
  onComplete
}) => {
  const [sortedItems, setSortedItems] = useState<{ [key: string]: Item[] }>({});
  const [unsortedItems, setUnsortedItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameComplete, setGameComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize game
  useEffect(() => {
    // Shuffle items
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setUnsortedItems(shuffled);

    // Initialize empty groups
    const emptyGroups: { [key: string]: Item[] } = {};
    groups.forEach(group => {
      emptyGroups[group.id] = [];
    });
    setSortedItems(emptyGroups);
  }, [items, groups]);

  // Check if game is complete
  useEffect(() => {
    if (unsortedItems.length === 0 && Object.keys(sortedItems).length > 0) {
      const totalItems = Object.values(sortedItems).flat().length;
      if (totalItems === items.length) {
        checkCompletion();
      }
    }
  }, [sortedItems, unsortedItems]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the item being dragged
    let draggedItem: Item | undefined;
    let sourceGroup: string | null = null;

    // Check if item is in unsorted
    draggedItem = unsortedItems.find(item => item.id === activeId);

    // If not in unsorted, find in groups
    if (!draggedItem) {
      for (const [groupId, items] of Object.entries(sortedItems)) {
        const item = items.find(i => i.id === activeId);
        if (item) {
          draggedItem = item;
          sourceGroup = groupId;
          break;
        }
      }
    }

    if (!draggedItem) {
      setActiveId(null);
      return;
    }

    // Check if dropping on a group
    const targetGroup = groups.find(g => g.id === overId);

    if (targetGroup) {
      // Moving to a group
      if (sourceGroup) {
        // From group to group
        setSortedItems(prev => ({
          ...prev,
          [sourceGroup]: prev[sourceGroup].filter(i => i.id !== activeId),
          [targetGroup.id]: [...prev[targetGroup.id], draggedItem!]
        }));
      } else {
        // From unsorted to group
        setUnsortedItems(prev => prev.filter(i => i.id !== activeId));
        setSortedItems(prev => ({
          ...prev,
          [targetGroup.id]: [...prev[targetGroup.id], draggedItem!]
        }));
      }

      // Check if placed correctly
      if (draggedItem.groupId !== targetGroup.id) {
        setMistakes(mistakes + 1);
      }
    }

    setActiveId(null);
  };

  const checkCompletion = () => {
    let correctCount = 0;
    let totalCount = 0;

    for (const [groupId, groupItems] of Object.entries(sortedItems)) {
      groupItems.forEach(item => {
        totalCount++;
        if (item.groupId === groupId) {
          correctCount++;
        }
      });
    }

    setShowResults(true);
    setGameComplete(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (onComplete) {
      onComplete({
        score: correctCount * 10,
        completed: true,
        timeSpent,
        accuracy: (correctCount / totalCount) * 100,
        mistakes,
        customData: {
          totalItems: totalCount,
          correctItems: correctCount,
          gameType: 'group_sort'
        }
      });
    }
  };

  const restartGame = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setUnsortedItems(shuffled);

    const emptyGroups: { [key: string]: Item[] } = {};
    groups.forEach(group => {
      emptyGroups[group.id] = [];
    });
    setSortedItems(emptyGroups);

    setMistakes(0);
    setGameComplete(false);
    setShowResults(false);
  };

  const activeItem = [...unsortedItems, ...Object.values(sortedItems).flat()].find(
    item => item.id === activeId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📂 {title}</h1>
              <p className="text-white/80">Перетащите каждый элемент в соответствующую группу</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Осталось: {unsortedItems.length}</span>
              </div>
              <div className="bg-red-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Ошибки: {mistakes}</span>
              </div>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Unsorted Items */}
          {!gameComplete && (
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Элементы для сортировки:</h3>
              <div className="flex flex-wrap gap-3">
                <SortableContext
                  items={unsortedItems.map(item => item.id)}
                  strategy={rectSortingStrategy}
                >
                  {unsortedItems.map((item) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      isDragging={activeId === item.id}
                    />
                  ))}
                </SortableContext>
              </div>
              {unsortedItems.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Все элементы распределены по группам!
                </p>
              )}
            </div>
          )}

          {/* Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <DroppableGroup
                key={group.id}
                group={group}
                items={sortedItems[group.id] || []}
                isCorrect={showResults ? sortedItems[group.id]?.every(item => item.groupId === group.id) : undefined}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeItem ? (
              <div className="px-4 py-3 bg-white rounded-lg shadow-2xl cursor-move">
                <div className="flex items-center gap-2">
                  {activeItem.image && <span className="text-xl">{activeItem.image}</span>}
                  <span className="font-medium">{activeItem.content}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Results */}
        {gameComplete && (
          <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {mistakes === 0 ? '🎉 Отлично!' : '✅ Задание выполнено!'}
            </h2>
            <p className="text-lg mb-4">
              Ошибок: {mistakes}
            </p>
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Играть снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSort;