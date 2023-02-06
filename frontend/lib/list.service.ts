import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebaseClient'
import { AxiosInstance } from 'axios'
import { ITodo } from './todo.service'

export interface IList {
  id: number
  title: string
  todoOrder: number[]
  todos: ITodo[]
}

const getListCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'lists', 'listsCollection', 'collection')

const getListDocRef = (userId: string, listId: string) =>
  doc(db, 'users', userId, 'lists', 'listsCollection', 'collection', listId)

const getListOrderDocRef = (userId: string) =>
  doc(db, 'users', userId, 'lists', 'listOrder')

export const getLists = async (userId: string) =>
  getDocs(getListCollectionRef(userId))

export const getListOrder = async (userId: string) =>
  getDoc(getListOrderDocRef(userId))

export const createList = async (axiosPrivate: AxiosInstance) =>
  axiosPrivate.post('/lists')

export const deleteList = async (
  axiosPrivate: AxiosInstance,
  { listId }: { listId: number },
) => axiosPrivate.delete(`/lists/${listId}`)

export const editList = async (
  axiosPrivate: AxiosInstance,
  {
    listId,
    title,
    todoOrder,
  }: { listId: number; title?: string; todoOrder?: number[] },
) => axiosPrivate.patch(`/lists/${listId}`, { title, todoOrder })

export const addToListOrder = async (userId: string, listId: string) =>
  setDoc(
    getListOrderDocRef(userId),
    {
      order: arrayUnion(listId),
    },
    { merge: true },
  )

export const deleteFromListOrder = async (userId: string, deletedId: string) =>
  setDoc(
    getListOrderDocRef(userId),
    {
      order: arrayRemove(deletedId),
    },
    { merge: true },
  )

export const editListOrder = async (userId: string, listOrder: string[]) =>
  updateDoc(getListOrderDocRef(userId), {
    order: listOrder,
  })

export const addTodoToList = async (
  userId: string,
  listId: string,
  todoId: string,
) =>
  setDoc(
    getListDocRef(userId, listId),
    {
      order: arrayUnion(todoId),
    },
    { merge: true },
  )

export const deleteTodoFromList = async (
  userId: string,
  listId: string,
  todoId: string,
) =>
  setDoc(
    getListDocRef(userId, listId),
    {
      order: arrayRemove(todoId),
    },
    { merge: true },
  )

export const editTodoOrder = async (
  userId: string,
  listId: string,
  order: string[],
) =>
  setDoc(
    getListDocRef(userId, listId),
    {
      order,
    },
    { merge: true },
  )
