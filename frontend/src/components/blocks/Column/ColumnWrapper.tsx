import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';
import type { Column } from '../../../types/types';

type ColumnWrapperProps = {
    column: Column,
    children: React.ReactNode,
}

export const ColumnWrapper: React.FC<ColumnWrapperProps> = (({...props}) => {
    const { column, children } = props;
    
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            columnId: column.id
        }},
        // disabled: editMode, // FIX LATER
    );
  
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        border: isDragging ? "2px dashed #ffffff" : "",
        height: isDragging ? "min-h-[139px] max-h-[515px]" : "",
    };

    return (
        <article 
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="w-[18.75rem] h-[611px] bg-[#1F2937] flex flex-shrink-0 flex-col rounded-xl gap-4 p-2 overflow-y-scroll overflow-x-hidden"
                >
                    {children}
        </article>
        )
    }
);