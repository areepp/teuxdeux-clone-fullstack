import { useState, KeyboardEvent, FocusEvent } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { ITodo } from '@/types/ITodo'
import useAddTodoToListMutation from '@/hooks/react-query-hooks/todo/useAddTodoToList'
import useEditListTitle from '@/hooks/react-query-hooks/list/useEditListTitle'
import { IList } from '@/types/IList'
import TodoItem from '../Common/TodoItem'
import getRenderClone from '../Common/getRenderClone'
import ListOption from './ListOption'

interface Props {
  list: IList
  todos: ITodo[] | null
}

const ListColumn = ({ todos, list }: Props) => {
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [listTitle, setListTitle] = useState(list.title)

  const { mutate: addTodoMutation } = useAddTodoToListMutation()

  const { mutate: editListMutation } = useEditListTitle({
    listId: list.id,
    title: listTitle,
  })

  const renderClone = getRenderClone(todos)
  // renderClone allows to move todo item to another parent container
  // (EX: LIST COLUMN -> DATE COLUMN)
  // while maintaining the desired drag behavior

  const handleAddTodo = async () => {
    addTodoMutation({ text: newTodoInputValue, listId: list.id })
    setNewTodoInputValue('')
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  const handleInputBlur = async (e: FocusEvent<HTMLInputElement>) => {
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
