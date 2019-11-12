import express from 'express'

import { UserManager } from './UserManager'
import * as UseCaseManager from './UseCaseManager'
import { MongoClient, DeleteWriteOpResultObject } from 'mongodb'
import * as ProjectManager from './ProjectManager'
import * as BodyParser from 'body-parser'

const app = express()

const userManager = new UserManager()
// const UseCaseManager = new UseCaseManager()
// const ProjectManager = new ProjectManager()

const client = new MongoClient('mongodb://localhost:27017')

const freshData = true

client.connect((err: any) => {
  if (err) throw err
  console.log('connected')
  const db = client.db('App')
  // Create users collection
  db.createCollection('users', function (err: any,res: any) {
    if (err) throw err
    console.log('Created user collection')
  })
  // Create projects collection
  db.createCollection('projects', (err: any, res: any) => {
    if (err) throw err
    console.log('Created projects collection')
  })

  db.createCollection('usecases', (err: any, res: any) => {
    if (err) throw err
    console.log('Created usecases collection')
  })

  if (freshData) {
    db.collection('users').remove({})
    db.collection('projects').remove({})
    db.collection('usecases').remove({})

    db.collection('users').insertMany([
      {
        _id: 1,
        readPermissions: [1,2,3],
        writePermissions: [1,2,3],
        owned: [1,3]
      },
      {
        _id: 2,
        readPermissions: [2,3],
        writePermissions: [2],
        owned: [2]
      },
      {
        _id: 3,
        readPermissions: [],
        writePermissions: [],
        owned: []
      }
    ])

    db.collection('projects').insertMany([
      {
        _id: 1,
        name: 'Project 1',
        description: 'Test Project',
        usecases: [1]
      },
      {
        _id: 2,
        name: 'Project 2',
        description: 'Test Project 2',
        usecases: [2,3]
      },
      {
        _id: 3,
        name: 'Project 3',
        description: 'Test Project 3',
        usecases: [3]
      }
    ])

    db.collection('usecases').insertMany([
      {
        _id: 1,
        ownerProject: 1,
        goalInContext: 'Goal in Context',
        scope: 'Scope',
        precondition: 'Precondition',
        successEndCondition: 'successEndCondition',
        failedEndCondition: 'failedEndCondition',
        trigger: 'trigger',
        basicflows: [],
        extensions: [],
        subvariations: [],
        useCaseName: 'useCaseName',
        useCasePriority: 'useCasePriority',
        performance: 'performance',
        frequency: 'frequency',
        channels: 'channels',
        issues: 'issues',
        dueDate: 'dueDate',
        managementInfo: 'managementInfo',
        superordinates: 'superordinates',
        subordinates: 'subordinates'
      },
      {
        _id: 2,
        ownerProject: 2,
        goalInContext: 'Goal in Context',
        scope: 'Scope',
        precondition: 'Precondition',
        successEndCondition: 'successEndCondition',
        failedEndCondition: 'failedEndCondition',
        trigger: 'trigger',
        basicflows: [],
        extensions: [],
        subvariations: [],
        useCaseName: 'useCaseName',
        useCasePriority: 'useCasePriority',
        performance: 'performance',
        frequency: 'frequency',
        channels: 'channels',
        issues: 'issues',
        dueDate: 'dueDate',
        managementInfo: 'managementInfo',
        superordinates: 'superordinates',
        subordinates: 'subordinates'
      },
      {
        _id: 3,
        ownerProject: 2,
        goalInContext: 'Goal in Context',
        scope: 'Scope',
        precondition: 'Precondition',
        successEndCondition: 'successEndCondition',
        failedEndCondition: 'failedEndCondition',
        trigger: 'trigger',
        basicflows: [],
        extensions: [],
        subvariations: [],
        useCaseName: 'useCaseName',
        useCasePriority: 'useCasePriority',
        performance: 'performance',
        frequency: 'frequency',
        channels: 'channels',
        issues: 'issues',
        dueDate: 'dueDate',
        managementInfo: 'managementInfo',
        superordinates: 'superordinates',
        subordinates: 'subordinates'
      }
    ])
  }

  const portNumber = 3000

  app.listen(portNumber, () => {
    console.log('Server started on port ' + portNumber)
  })

  app.get('/', (req, res) => {
    res.send('hello world, my name is Dave')
  })

 // app.use(express.json())

  app.use(express.json())
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

/* Get all users */
// Fin
  app.get('/users', (req,res) => {
    try {
      const a = userManager.getAllUsers(db).then(a => {
        res.send(a)
      })
    } catch (err) {
      console.error(err)
      res.send('404')
    }
  })

// Get info on user
// Fin
  app.get('/user/:userid', async (req,res) => {
    const userID: number = req.params.userid
    try {
      const userInfo = await userManager.getUser(userID, db)
      // console.log(userInfo)
      res.send(userInfo)
    } catch (err) {
      console.error(err)
      res.send('404')
    }

  })

/* Create new user, no parameter as userid generated from backend */
// Fin
  app.post('/newuser', async (req,res) => {
    const newID = await userManager.addUser(db)
    res.send(newID)
  })

/* Delete user */
// Fin
  app.delete('/user/:userid',async (req,res) => {
    const userID: number = req.params.userid
    try {
      const returnVal: DeleteWriteOpResultObject = await userManager.removeUser(userID,db)
      console.log(returnVal)
      res.send('Success')
    } catch (err) {
      console.error(err)
      res.send('404')
    }
  })

/* Change Project permissions */
// Fin
  app.put('/user/changepermissions/:userid/:projectid/:add/:write',async (req,res) => {
    try {
      const userID: number = req.params.userid
      const projectID: number = req.params.projectid
      const addBool: boolean = req.params.add
      const writeBool: boolean = req.params.write
      const updateOutcome = await ProjectManager.editPermission(userID, projectID, addBool, writeBool, db)
      res.send(updateOutcome)
    } catch (err) {
      console.error(err)
      res.send('something went wrong')
    }
  })

/*Swap project owner*/
// Fin
  app.post('/projects/editproject/:oldUserid/:newUserid/:projectid', async (req,res) => {
    try {
      console.log('Updating owner')
      const oldUserid: number = req.params.oldUserid
      const newUserid: number = req.params.newUserid
      const projectid: number = req.params.projectid
      const indexAdded = await ProjectManager.swapProjectOwner(oldUserid, newUserid, projectid, db)
      res.send(indexAdded)
    } catch (err) {
      console.log('Body: ' + req.body)
      console.error(err)
      res.send('505')
    }
  })

/* Create new project. Returns generated index */
//  Fin
  app.post('/projects', async (req,res) => {
    try {
      const projectName: string = String(req.body.title)
      const projectDescription: string = String(req.body.description)
      const creatorId = Number(req.body.ID)
      const indexAdded = await ProjectManager.addProject(db, creatorId, projectName, projectDescription)
      res.send(indexAdded)
    } catch (err) {
      console.log('Body: ' + req.body)
      console.error(err)
      res.send('505')
    }

  })

 /*Edit a project*/
  // In progress
  app.post('/projects/editproject/:projectid', async (req, res) => {
    const projectID: number = req.params.projectid
    const projectData = req.body
    try {
      const returnVal = await ProjectManager.editProject(db, projectID, projectData)
      res.send(200)
    } catch (err) {
      console.error(err)
      res.send(404)
    }
  })

  /*delete project */
  // Fin
  app.delete('/projects/:projectid', async (req,res) => {
    const projectID: number = req.params.projectid
    try {
      await ProjectManager.deleteProject(db,projectID)
      res.send('200')
    } catch (err) {
      console.error(err)
      res.send(404)
    }

  })

  /*Retrieve a project*/
  // Fin
  app.get('/projects/:projectid', async (req,res) => {
    const projectID: number = req.params.projectid
    console.log('Fetching project ' + projectID)
    try {
      const returnVal = await ProjectManager.getProject(projectID, db)
      res.send(JSON.stringify(returnVal[0]))
    } catch (err) {
      console.error(err)
      res.send(404)
    }
  })

  /*Create a Usecase under a Project*/
  // Fin
  app.post('/usecase/:projectid', async (req, res) => {
    const projectID: number = req.params.projectid
    const usecaseData = req.body
    try {
      const returnVal = await UseCaseManager.addUseCase(db, usecaseData, projectID)
      res.send(200)
    } catch (err) {
      console.error(err)
      res.send(404)
    }
  })

  /*Fetch all Usecases for project*/
  // Fin
  app.get('/usecases/:projectid', async (req, res) => { // previously "/usecase/:projectid"
    const projectID: number = req.params.projectid
    try {
      const useCaseList = await UseCaseManager.getProjectUseCases(db, projectID)
      console.log(useCaseList)
      res.send(useCaseList)
    } catch (err) {
      console.error('Use case error: ' + err)
      res.send(404)
    }
  })

  /*fetch a single usecase*/
  // Fin
  app.get('/usecase/:usecaseid', async (req, res) => {
    const usecaseID: number = req.params.usecaseid
    try {
      const useCase = await UseCaseManager.getUseCase(db, usecaseID)
      console.log(useCase)
      res.send(useCase)
    } catch (err) {
      console.error('Use case error: ' + err)
      res.send(404)
    }
  })

  /*Delete a usecase*/
  // Fin
  app.delete('/usecase/:usecaseid/:projectid', async (req, res) => {
    const usecaseID: number = req.params.usecaseid
    const projectID: number = req.params.projectid
    console.log('Deleting use case')
    try {
      await UseCaseManager.deleteUseCase(db,usecaseID, projectID)
      res.send('200')
    } catch (err) {
      console.error(err)
      res.send(404)
    }
  })

  /*Edit a usecase*/
  // Fin
  app.put('/usecase/:usecaseid', async (req, res) => {
    const usecaseID: number = req.params.usecaseid
    const usecaseData = req.body
    try {
      const returnVal = await UseCaseManager.editUseCase(db, usecaseID, usecaseData)
      res.send(200)
    } catch (err) {
      console.error(err)
      res.send(404)
    }
  })

   /*Edit a project*/
  // In progress
  app.put('/projects/:projectid', async (req, res) => {
    const projectID: number = req.params.projectid
    const projectData = req.body
    console.log('Updated project info')
    try {
      const returnVal = await ProjectManager.editProject(db, projectID, projectData.title, projectData.description)
      res.send(200)
    } catch (err) {
      console.error(err)
      res.send(404)
    }
  })

  // client.close()

})
