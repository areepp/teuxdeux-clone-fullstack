import { db } from './firebaseClient'
import { ITodo } from '@/stores/todos'
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

const getTodoCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'todos')

const getTodoDocRef = (userId: string, todoId: string) =>
  doc(db, 'users', userId, 'todos', todoId)

export const getAllTodos = (userId: string) => {
  return getDocs(getTodoCollectionRef(userId))
}

export const getColumnTodos = (userId: string, columnTodosIds: string[]) => {
  const q = query(
    getTodoCollectionRef(userId),
    where(documentId(), 'in', columnTodosIds),
  )
  return getDocs(q)
}

export const addTodo = async (
  userId: string,
  newTodoId: string,
  newTodo: Omit<ITodo, 'id'>,
) => {
  return setDoc(getTodoDocRef(userId, newTodoId), newTodo)
}

export const deleteTodo = async (userId: string, todoId: string) => {
  return deleteDoc(getTodoDocRef(userId, todoId))
}

export const deleteMultipleTodos = async (
  userId: string,
  deletedIds: string[],
) => {
  const batch = writeBatch(db)

  for (let id in deletedIds) {
    batch.delete(getTodoDocRef(userId, id))
  }

  return batch.commit()
}

export const editTodoChecked = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'checked'>,
) => {
  return updateDoc(getTodoDocRef(userId, todoId), newData)
}

export const editTodoText = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'text'>,
) => {
  return updateDoc(getTodoDocRef(userId, todoId), newData)
}
