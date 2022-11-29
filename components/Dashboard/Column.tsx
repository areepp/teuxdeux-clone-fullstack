import * as todoService from '@/lib/todo.service'
import * as columnService from '@/lib/column.service'
import { useState, KeyboardEvent } from 'react'
import { useAuth } from '../AuthContext'
import update from 'immutability-helper'

import TodoItem, { ITodo } from './TodoItem'
import { Droppable } from 'react-beautiful-dnd'

export interface IColumn {
  id: string
  order: string[]
}

interface Props {
  todos: ITodo[] | null
  column: IColumn
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>
}

const Column = ({ todos, column, setTodos, setColumns }: Props) => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')

  const handleAddTodo = async () => {
    const res = await todoService.addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })

    setNewTodoInputValue('')

    setColumns((prev) =>
      prev.map((c) =>
        c.id === column.id
          ? update(c, {
              order: {
                $push: [res.id],
              },
            })
          : c,
      ),
    )

    setTodos((prev) =>
      update(prev, {
        $push: [{ id: res.id, text: newTodoInputValue, checked: false }],
      }),
    )

    await columnService.addToOrderList(user!.uid, column.id, res.id)
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  return (
    <div className="mt-12 h-full flex-grow">
      <div className="w-full text-center">
        <div className="font-gothic text-6xl text-red-600">
          {column.id.toUpperCase()}
        </div>
      </div>
      <div className="bg-horizontal-lines min-h-[150px]">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todos &&
                todos.map((item, i) => {
                  if (!item) return
                  return (
                    <TodoItem
                      item={item}
                      index={i}
                      key={item.id}
                      setTodos={setTodos}
                      colId={column.id}
                    />
                  )
                })}
              {provided.placeholder}
              <input
                className="h-[49px] flex items-center w-full focus:outline-none bg-transparent"
                type="text"
                value={newTodoInputValue}
                onChange={(e) => setNewTodoInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default Column