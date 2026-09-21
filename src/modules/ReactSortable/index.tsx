'use client';

import { useState } from 'react';
import { ReactSortable, Sortable } from 'react-sortablejs';
import './styles.scss';

const DragDrop = () => {
  const [list, setList] = useState<{ id: number; color: string }[]>([
    { id: 1, color: '#57AADE' },
    { id: 2, color: '#A0B3DE' },
    { id: 3, color: '#5957DE' },
    { id: 4, color: '#57D5DE' },
    { id: 5, color: '#28285f' },
    { id: 6, color: '#06191b' },
    { id: 7, color: '#54545a' },
    { id: 8, color: '#762176' },
  ]);

  const handleChange = (event: Sortable.SortableEvent) => {
    const { newIndex = 0, oldIndex = 0 } = event;
    if (newIndex === oldIndex) return;
    const newList = [...list];
    const [newItem] = newList.splice(oldIndex, 1);
    newList.splice(newIndex, 0, newItem);
    console.log(newList);
  };

  return (
    <ReactSortable
      className='grid grid-cols-3 items-center justify-items-center min-h-screen p-8 gap-16 bg-white [&>div:nth-child(even)]:col-span-2 [&>div:nth-child(odd)]:col-span-1'
      list={list}
      setList={setList}
      onUpdate={handleChange}
      animation={300}
    >
      {list.map((item) => (
        <div
          key={item.id}
          className='w-full h-full flex items-center justify-center border border-solid text-black'
          style={{
            backgroundColor: item.color,
          }}
        >
          {item.id}
        </div>
      ))}
    </ReactSortable>
  );
};

export default DragDrop;
