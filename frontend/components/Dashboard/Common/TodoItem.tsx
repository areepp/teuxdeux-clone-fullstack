import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { HiOutlineX, HiPencil } from 'react-icons/hi'
import * as todoService from '@/lib/todo.service'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

interface Props {
  item: todoService.ITodo
  index: number
  colId: number | string
  childOf: 'calendar' | 'list'
}

const TodoItem = ({ item, index, colId, childOf }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const [todoText, setTodoText] = useState(item.text)

  // TODO: make invalidate queries dynamic (listCollection or dateColumn)

  const { mutate: deleteTodoFromList } = useMutation(
    () =>
      todoService.deleteTodo(axiosPrivate, {
        todoId: item.id,
        listId: colId as number,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  const { mutate: toggleCheckTodo } = useMutation(
    () =>
      todoService.editTodo(axiosPrivate, {
        todoId: item.id.toString(),
        checked: !item.checked,
      }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['listCollection'] }),
    },
  )

  const { mutate: editTodoTextMutation } = useMutation(
    () =>
      todoService.editTodo(axiosPrivate, {
        todoId: item.id.toString(),
        text: todoText,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    if (childOf === 'calendar') {
      // dayStore.deleteTodoFromColumn(colId, item.id)
    } else {
      deleteTodoFromList()
    }
  }

  const handleCheckTodo = async (data: { checked: boolean }) => {
    toggleCheckTodo()
  }

  const handleCheckTodoKeyDown = async (
    e: React.KeyboardEvent,
    data: { checked: boolean },
  ) => {
    if (e.key === 'Enter') {
      await handleCheckTodo(data)
    }
  }

  const handleOnBlur = async () => {
    setIsEditing(false)
    editTodoTextMutation()
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      editTodoInputRef.current?.blur()
      editTodoTextMutation()
    }
  }

  return (
    <Draggable draggableId={item.id.toString()} index={index}>
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
                onClick={() => handleCheckTodo({ checked: !item.checked })}
                onKeyDown={(e) =>
                  handleCheckTodoKeyDown(e, { checked: !item.checked })} // prettier-ignore
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
