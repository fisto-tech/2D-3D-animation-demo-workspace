import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WebsiteCard from './WebsiteCard';
import { AuthContext } from '../context/AuthContext';
import { WebsiteContext } from '../context/WebsiteContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const SortableWebsiteCard = ({ website, onEditClick, onPlayVideo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: website.websiteId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDragging ? 'opacity-70 cursor-grabbing' : 'cursor-grab'}>
      <WebsiteCard website={website} onEditClick={onEditClick} onPlayVideo={onPlayVideo} />
    </div>
  );
};

const WebsiteGrid = ({ websites, onEditClick, sortBy, isRearrangeMode, onPlayVideo }) => {
  const { isAdmin } = useContext(AuthContext);
  const { updateWebsiteOrder } = useContext(WebsiteContext);
  const [items, setItems] = useState(websites);

  useEffect(() => {
    setItems(websites);
  }, [websites]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging 8px before activation, so clicks work
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.websiteId === active.id);
        const newIndex = items.findIndex((item) => item.websiteId === over.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Save the new order to DB
        const orderData = newArray.map((site, index) => ({
          id: site.websiteId,
          order: index
        }));
        
        updateWebsiteOrder(orderData);
        return newArray;
      });
    }
  };

  if (websites.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border shadow-sm">
        <h3 className="text-xl font-medium text-textSecondary">No websites found matching your criteria.</h3>
      </div>
    );
  }

  // If sorting by category, disable drag & drop to avoid complex nested states
  if (sortBy === 'Category Wise') {
    const grouped = items.reduce((acc, website) => {
      const cat = website.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(website);
      return acc;
    }, {});

    const sortedCategories = Object.keys(grouped).sort();

    return (
      <div className="flex flex-col gap-10">
        {sortedCategories.map(category => (
          <div key={category} className="border-b border-border/30 pb-10 last:border-0">
            <h3 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {category}
            </h3>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {grouped[category].map(website => (
                <motion.div key={website.websiteId} variants={itemVariants}>
                  <WebsiteCard website={website} onEditClick={onEditClick} onPlayVideo={onPlayVideo} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    );
  }

  // If normal grid and Admin and isRearrangeMode, enable Drag & Drop
  if (isAdmin && isRearrangeMode) {
    return (
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.websiteId)}
          strategy={rectSortingStrategy}
        >
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {items.map(website => (
              <SortableWebsiteCard 
                key={website.websiteId} 
                website={website} 
                onEditClick={onEditClick} 
                onPlayVideo={onPlayVideo} 
              />
            ))}
          </motion.div>
        </SortableContext>
      </DndContext>
    );
  }

  // If normal grid and NOT admin, just show normal motion divs
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {items.map(website => (
        <motion.div key={website.websiteId} variants={itemVariants}>
          <WebsiteCard website={website} onEditClick={onEditClick} onPlayVideo={onPlayVideo} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WebsiteGrid;
