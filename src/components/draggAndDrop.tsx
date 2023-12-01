// DragDropTable.tsx
import React, { useState } from 'react';
import { useDrag, useDrop, DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

interface Item {
  id: number;
  text: string;
}

interface DraggableRowProps {
  id: number;
  text: string;
  index: number;
  moveRow: (fromIndex: number, toIndex: number) => void;
}

const ItemTypes = {
  BOX: 'box',
};

const DraggableRow: React.FC<DraggableRowProps> = ({ id, text, index, moveRow }) => {
  const [, drag] = useDrag<DragObjectWithType<Item>>({
    type: ItemTypes.BOX,
    item: { id, index },
  });

  const [, drop] = useDrop<DragObjectWithType<Item>, void, { hovered: boolean }>({
    accept: ItemTypes.BOX,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <TableRow ref={(node) => drag(drop(node))}>
      <TableCell>{text}</TableCell>
    </TableRow>
  );
};

interface DragDropTableProps {
  rows: Item[];
}

const DragDropTable: React.FC<DragDropTableProps> = ({ rows }) => {
  const [items, setItems] = useState<Item[]>(rows);

  const moveRow = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {items.map((row, index) => (
            <DraggableRow key={row.id} id={row.id} text={row.text} index={index} moveRow={moveRow} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DragDropTable;
