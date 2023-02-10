import clsx from 'clsx'
import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { HiOutlineX, HiPencil } from 'react-icons/hi'
import { useMutation, useQueryClient } from 'react-query'
import * as todoService from '@/lib/todo.service'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ITodo } from '@/types/ITodo'

interface Props {
  item: ITodo
  index: number
  colId: number | string
  parent: 'dateColumn' | 'listCollection'
}

const TodoItem = ({ item, index, colId, parent }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const [todoText, setTodoText] = useState(item.text)

  const { mutate: deleteTodoFromList } = useMutation(
    () =>
      todoService.deleteTodo(axiosPrivate, {
        todoId: item.id,
        listId: colId as number,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(parent),
    },
  )

  const { mutate: deleteTodoFromDateColumn } = useMutation(
    () =>
      todoService.deleteTodo(axiosPrivate, {
        todoId: item.id,
        dateColumnId: colId as string,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(parent),
    },
  )

  const { mutate: toggleCheckTodo } = useMutation(
    () =>
      todoService.editTodo(axiosPrivate, {
        todoId: item.id.toString(),
        checked: !item.checked,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(parent),
    },
  )

  const { mutate: editTodoTextMutation } = useMutation(
    () =>
      todoService.editTodo(axiosPrivate, {
        todoId: item.id.toString(),
        text: todoText,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(parent),
    },
  )

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    if (parent === 'dateColumn') {
      deleteTodoFromDateColumn()
    } else {
      deleteTodoFromList()
    }
  }

  const handleCheckTodo = async () => {
    toggleCheckTodo()
  }

  const handleCheckTodoKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleCheckTodo()
    }
  }

  const handleOnBlur = async () => {
    setIsEditing(false)
    editTodoTextMutation()
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      editTodoInputRef.current?.blur()
      editTodoTextMutation()
    }
  }

  return (
    <Draggable
      draggableId={item.id.toString()}
      key={item.id.toString()}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={clsx(
            'relative w-full h-[49px] md:h-[27px] drag-fix',
            isHovered && 'z-50',
            !isHovered && 'z-40',
          )} // drag-fix class is used to fix the dragged item not inline with cursor issue
        >
          <div
            className={clsx(
              'absolute top-0 w-full flex items-center justify-between',
              isEditing && 'bg-transparent h-full',
              isHovered && 'min-h-full h-fit bg-red-100',
              !isHovered && 'h-full',
            )}
          >
            {isEditing ? (
              <input
                ref={editTodoInputRef}
                className="h-full flex-auto focus:outline-none bg-transparent"
                type="text"
                value={todoText}
                // prettier-ignore
                onChange={(e) =>
                  setTodoText(e.target.value)}
                onBlur={() => handleOnBlur()}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <div
                role="checkbox"
                tabIndex={0}
                aria-checked={item.checked}
                onClick={() => handleCheckTodo()}
                onKeyDown={handleCheckTodoKeyDown} // prettier-ignore
                className={clsx(
                  'h-full flex-auto break-all flex items-center',
                  isHovered && 'max-w-[92%] break-all text-gray-900',
                  !isHovered && 'truncate',
                  item.checked && 'line-through text-stone-300',
                )}
              >
                <span className={clsx('min-w-[2px]', !isHovered && 'truncate')}>
                  {item.text}
                </span>
              </div>
            )}

            {item.checked ? (
              <button
                type="button"
                className={clsx(
                  'self-start mt-4 md:mt-[6px] mr-1',
                  !isHovered && 'hidden',
                )}
                onClick={() => handleDeleteTodo()}
              >
                <HiOutlineX />
              </button>
            ) : (
              <button
                type="button"
                className={clsx(
                  'self-start mt-4 md:mt-[6px] mr-1',
                  !isHovered && 'hidden',
                )}
                onClick={() => setIsEditing(true)}
              >
                <HiPencil />
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TodoItem
