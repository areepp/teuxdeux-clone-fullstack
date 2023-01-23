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
