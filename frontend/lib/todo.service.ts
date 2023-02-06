import { AxiosInstance } from 'axios'
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  documentId,
  where,
  writeBatch,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebaseClient'

export interface ITodo {
  id: number
  text: string
  checked: boolean
}

const getTodoCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'todos')

const getTodoDocRef = (userId: string, todoId: string) =>
  doc(db, 'users', userId, 'todos', todoId)

export const getAllTodos = (userId: string) =>
  getDocs(getTodoCollectionRef(userId))

export const getColumnTodos = (userId: string, columnTodosIds: string[]) => {
  const q = query(
    getTodoCollectionRef(userId),
    where(documentId(), 'in', columnTodosIds),
  )
  return getDocs(q)
}

export const addTodo = async (
  axiosPrivate: AxiosInstance,
  body: { text: string; listId?: number; dateColumnId?: string },
) => axiosPrivate.post('/todos', body)

export const deleteTodo = async (
  axiosPrivate: AxiosInstance,
  {
    todoId,
    listId,
    dateColumnId,
  }: { todoId: number; listId?: number; dateColumnId?: string },
) =>
  axiosPrivate.delete(`/todos/${todoId}`, {
    data: { listId, dateColumnId },
  })

export const editTodo = async (
  axiosPrivate: AxiosInstance,
  {
    todoId,
    text,
    checked,
  }: { todoId: string; text?: string; checked?: boolean },
) => axiosPrivate.patch(`/todos/${todoId}`, { text, checked })

export const deleteMultipleTodos = async (
  userId: string,
  deletedIds: string[],
) => {
  const batch = writeBatch(db)

  for (let i = 0; i < deletedIds.length; i++) {
    batch.delete(getTodoDocRef(userId, deletedIds[i]))
  }
  return batch.commit()
}

export const editTodoChecked = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'checked'>,
) => updateDoc(getTodoDocRef(userId, todoId), newData)

export const editTodoText = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'text'>,
) => updateDoc(getTodoDocRef(userId, todoId), newData)
