import { Db } from 'mongodb'

export async function addProject (db: Db, creatorID: number, projectName: string, projectDesc: string) {
  console.log('addProject()')
  console.log('\t' + projectName + ' : ' + projectDesc + ' : ' + creatorID)
  const currentMaxID = await db.collection('projects').find().sort({ _id: -1 }).limit(1).toArray()
  let toAdd: number = 1

  if (typeof currentMaxID[0] !== 'undefined') {
    toAdd = Number(currentMaxID[0]._id) + 1
  }

  await db.collection('projects').insertOne({
    _id: toAdd,
    name: projectName,
    description: projectDesc,
    usecases: []
  })

  console.log('\tNew project of ID added:' + toAdd)

  swapProjectOwner(0,creatorID,toAdd,db)

  return { index: toAdd }
}

export async function deleteProject (db: Db, projectID: number) {
  console.log('Delete project ' + projectID)
    /*Recursivly delete Usecases */
  const projectSearch = await db.collection('projects').find({ _id: Number(projectID) }).toArray()
  const project = projectSearch[0]
  for (const usecase of project.usecases) {
    console.log('\tDelete Usecase:\t' + usecase)
    await db.collection('usecases').deleteOne({ _id: Number(usecase) })
  }
    /*Deletes all references to project within users*/
  const users = await db.collection('users').find({}).toArray()
  for (const user of users) {
    for (const userProjectPermission of user.readPermissions) {
      if (Number(userProjectPermission) === Number(projectID)) {
        console.log('\tDelete Project ' + projectID + ' from User ' + Number(user._id))
        await db.collection('users').updateOne(
          { _id: Number(user._id) },
          { $pull: {
            owned: { $in: [Number(projectID)] },
            writePermissions: { $in: [Number(projectID)] },
            readPermissions: { $in: [Number(projectID)] }
          }
          }
        )
      }
    }
  }

  return db.collection('projects').deleteOne({ _id: Number(projectID) })
}

export async function editProject (db: Db, projectID: number, json: JSON) {
  const data = JSON.parse(JSON.stringify(json))
  const project = await db.collection('projects').findOne({ _id: Number(projectID) })
  const projectUsecases = project.usecases

  console.log('Editing project ' + projectID)
  await db.collection('projects').replaceOne({ _id: Number(projectID) },
    {
      name: String(data.name),
      description: String(data.description),
      usecases: projectUsecases
    })
}

  /* !add indicates remove permission
     !write indicates read permission*/
export function editPermission (userID: number, projectID: number,add: boolean, write: boolean, db: Db) {
  console.log('\tEdit user ' + userID + ' permissions for project ' + projectID)
  if (add === true) {
    if (write === true) {
      console.log('\tAdding write permissions')
      return addWritePermission(userID, projectID, db)
    } else {
      console.log('\tAdding read permissions')
      return addReadPermission(userID, projectID, db)
    }
  } else {
    if (write === true) {
      console.log('\tRemoving write permissions')
      return removeWritePermission(userID, projectID, db)
    } else {
      console.log('\tRemoving read permissions')
      return removeReadPermission(userID, projectID, db)
    }
  }
}

async function addReadPermission (userID: number, projectID: number, db: Db) {
  return db.collection('users').updateOne({ _id: Number(userID) },
    { $addToSet: {
      readPermissions: Number(projectID) } })
}

async function removeReadPermission (userID: number, projectID: number, db: Db) {
  removeWritePermission(userID, projectID, db)
  return db.collection('users').updateOne({ _id: Number(userID) },
    { $pull: {
      readPermissions: { $in: [Number(projectID)] } } })
}

async function addWritePermission (userID: number, projectID: number, db: Db) {
  addReadPermission(userID, projectID, db)
  return db.collection('users').updateOne({ _id: Number(userID) },
    { $addToSet: {
      writePermissions: Number(projectID) } })
}

async function removeWritePermission (userID: number, projectID: number, db: Db) {
  return db.collection('users').updateOne({ _id: Number(userID) },
    {
      $pull: {
        writePermissions: { $in: [Number(projectID)] } }
    })
}

export async function swapProjectOwner (oldOwnerID: number, newOwnerID: number, projectID: number, db: Db) {
  console.log('Changing ownership of project ' + projectID + ' from User ' + oldOwnerID + ' to User ' + newOwnerID)
  addWritePermission(newOwnerID, projectID, db)
  await db.collection('users').updateOne({ _id: Number(newOwnerID) },
    {
      $addToSet: {
        owned: Number(projectID)
      }
    })

  if (oldOwnerID !== 0) {
    await db.collection('users').updateOne({},
      { $pull: {
        owned: { $in: [Number(projectID)] }
      } })
  }
  console.log(db.collection('users').find({ _id: Number(oldOwnerID) }).toArray())
  console.log(db.collection('users').find({ _id: Number(newOwnerID) }).toArray())
  return true
}

export async function getProject (projectID: number, db: Db) {
  return db.collection('projects').find({ _id: Number(projectID) }).toArray()
}

// export async function editProject (db: Db, projectID: number, projectTitle: string, projectDesc: string) {
//   const project = await db.collection('projects').findOne({ _id: Number(projectID) })
//   const projectUsecases = project.usecases

//   console.log('Editing project ' + projectID)
//   await db.collection('projects').replaceOne({ _id: Number(projectID) },
//     {
//       name: String(projectTitle),
//       description: String(projectDesc),
//       usecases: projectUsecases
//     })
// }
