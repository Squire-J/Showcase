import { Db } from 'mongodb'
import { type } from 'os'

const debug = true

const count = 1

export class UserManager {
  constructor () { /* */ }

  /* Get user from DB */
  getUser (userID: number, db: Db) {
    console.log('Get user')
    return db.collection('users').find({ _id: Number(userID) }).toArray()
  }

    /* Method to get all the users from the DB */
  getAllUsers (db: Db) {
    console.log('getAllUsers()')
    return db.collection('users').find().toArray()
  }

  /* Method to add a new user. Returns the id of the new user */
  async addUser (db: Db) {
    const currentMaxID = await db.collection('users').find().sort({ _id: -1 }).limit(1).toArray()
    let toAdd: number = 1
    console.log('TYPE IS: ' + typeof(currentMaxID[0]))
    if (typeof currentMaxID[0] !== 'undefined') {
      toAdd = Number(currentMaxID[0]._id) + 1
    }

    db.collection('users').insertOne({
      _id: toAdd,
      readPermissions: [],
      writePermissions: [],
      owned: []

    })
    console.log(currentMaxID)
    return { index: toAdd }
  }

  removeUser (userID: number, db: Db) {
    return db.collection('users').deleteOne({ _id: Number(userID) })
  }
}
