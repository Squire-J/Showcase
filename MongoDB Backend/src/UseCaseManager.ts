import { Db } from 'mongodb'

export async function addUseCase (db: Db, useCaseData: string, parentID: Number) {
  const currentMaxID = await db.collection('usecases').find().sort({ _id: -1 }).limit(1).toArray()
  let toAdd: number = 1

  if (typeof currentMaxID[0] !== 'undefined') {
    toAdd = Number(currentMaxID[0]._id) + 1
  }

  await db.collection('usecases').insertOne(
    {
      _id: Number(toAdd),
      useCaseData
    })

  await db.collection('projects').updateOne({ _id: Number(parentID) },
    {
      $addToSet: {
        usecases: toAdd
      }
    })

  console.log('Adding Usecase ' + toAdd + ' to Project ' + parentID)

  return { index: toAdd }
}

export async function deleteUseCase (db: Db, useCaseID: number, projectID: number) {
  const useCase = await db.collection('usecases').find({ _id: Number(useCaseID) }).toArray()
  const ownerId = projectID
  console.log('Remove usecase ' + useCaseID + ' from project ' + ownerId)
  db.collection('projects').updateOne({ _id: Number(ownerId) },
    { $pull: {
      usecases: { $in: [Number(useCaseID)] } } })
  return db.collection('usecases').deleteOne({ _id: Number(useCaseID) })
}

export async function getUseCase (db: Db, useCaseID: number) {
  console.log('fetching usecase ' + useCaseID)
  return db.collection('usecases').find({ _id: Number(useCaseID) }).toArray()
}

export async function getProjectUseCases (db: Db, projectID: number) {
  console.log('Fetching usecases for project ' + projectID)
  const project = await db.collection('projects').find({ _id: Number(projectID) }).toArray()
  const usecaseList = project[0].usecases
  return usecaseList
}

export async function editUseCase (db: Db, useCaseID: number, useCaseData: string) {

  const usecase = await db.collection('usecases').find({ _id: Number(useCaseID) }).toArray()
  const parentID = usecase[0].ownerProject
  console.log('Editing usecase ' + useCaseID)
  await db.collection('usecases').replaceOne({ _id: Number(useCaseID) },
    {
      _id: Number(useCaseID),
      useCaseData
    })
}
