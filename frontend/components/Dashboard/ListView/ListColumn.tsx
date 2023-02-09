import { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import * as todoService from '@/lib/todo.service'
import TodoItem from '../Common/TodoItem'
import { getRenderClone } from '../Common/getRenderClone'
import ListOption from './ListOption'
import * as listService from '@/lib/list.service'
import { ITodo } from '@/types/ITodo'
import { useMutation, useQueryClient } from 'react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { IList } from '@/types/IList'

interface Props {
  list: IList
  todos: ITodo[] | null
}

const ListColumn = ({ todos, list }: Props) => {
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [listTitle, setListTitle] = useState(list.title)
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutate: addTodoMutation } = useMutation(
    () =>
      todoService.addTodo(axiosPrivate, {
        text: newTodoInputValue,
        listId: list.id,
      }),
    { onSuccess: () => queryClient.invalidateQueries('listCollection') },
  )

  const { mutate: editListMutation } = useMutation(
    () =>
      listService.editList(axiosPrivate, { listId: list.id, title: listTitle }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  const renderClone = getRenderClone(todos)
  // renderClone allows to move todo item to another parent container (EX: LIST COLUMN -> DATE COLUMN)
  // while maintaining the desired drag behavior

  const handleAddTodo = async () => {
    setNewTodoInputValue('')
    addTodoMutation()
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  const handleInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return
    }
    handleAddTodo()
  }

  return (
    <div className="relative h-full px-4 w-full text-gray-900 flex-grow drag-fix">
      {/* OPTION */}

      <ListOption listId={list.id} />

      {/* TITLE */}
      <input
        type="text"
        value={listTitle}
        onChange={(e) => setListTitle(e.target.value)}
        onBlur={() => editListMutation()} // prettier-ignore
        className="flex items-center mx-auto bg-inherit font-gothic text-center uppercase text-6xl md:text-4xl focus:outline-none hover:bg-stone-300 transition-all w-full"
      />

      {/* TODOS */}
      <div className="h-full mt-10 md:mt-4 md:text-sm bg-mobile-horizontal-lines md:bg-md-horizontal-lines">
        <Droppable
          droppableId={`list-${list.id}`}
          type="todo"
          renderClone={renderClone}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todos &&
                todos.map((item, i) => {
                  if (!item) return undefined
                  return (
                    <TodoItem
                      item={item}
                      index={i}
                      key={item.id}
                      colId={list.id}
                      parent="listCollection"
                    />
                  )
                })}
              {provided.placeholder}
              <input
                className="h-[49px] text-gray-900 md:h-[27px] flex items-center w-full focus:outline-none bg-transparent"
                type="text"
                value={newTodoInputValue}
                onChange={(e) => setNewTodoInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
              />
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default ListColumn
