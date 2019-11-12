"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var UserManager_1 = require("./UserManager");
var UseCaseManager = __importStar(require("./UseCaseManager"));
var mongodb_1 = require("mongodb");
var ProjectManager = __importStar(require("./ProjectManager"));
var app = express_1.default();
var userManager = new UserManager_1.UserManager();
// const UseCaseManager = new UseCaseManager()
// const ProjectManager = new ProjectManager()
var client = new mongodb_1.MongoClient('mongodb://localhost:27017');
var freshData = true;
client.connect(function (err) {
    if (err)
        throw err;
    console.log('connected');
    var db = client.db('App');
    // Create users collection
    db.createCollection('users', function (err, res) {
        if (err)
            throw err;
        console.log('Created user collection');
    });
    // Create projects collection
    db.createCollection('projects', function (err, res) {
        if (err)
            throw err;
        console.log('Created projects collection');
    });
    db.createCollection('usecases', function (err, res) {
        if (err)
            throw err;
        console.log('Created usecases collection');
    });
    if (freshData) {
        db.collection('users').remove({});
        db.collection('projects').remove({});
        db.collection('usecases').remove({});
        db.collection('users').insertMany([
            {
                _id: 1,
                readPermissions: [1, 2, 3],
                writePermissions: [1, 2, 3],
                owned: [1, 3]
            },
            {
                _id: 2,
                readPermissions: [2, 3],
                writePermissions: [2],
                owned: [2]
            },
            {
                _id: 3,
                readPermissions: [],
                writePermissions: [],
                owned: []
            }
        ]);
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
                usecases: [2, 3]
            },
            {
                _id: 3,
                name: 'Project 3',
                description: 'Test Project 3',
                usecases: [3]
            }
        ]);
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
        ]);
    }
    var portNumber = 3000;
    app.listen(portNumber, function () {
        console.log('Server started on port ' + portNumber);
    });
    app.get('/', function (req, res) {
        res.send('hello world, my name is Dave');
    });
    // app.use(express.json())
    app.use(express_1.default.json());
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    /* Get all users */
    // Fin
    app.get('/users', function (req, res) {
        try {
            var a = userManager.getAllUsers(db).then(function (a) {
                res.send(a);
            });
        }
        catch (err) {
            console.error(err);
            res.send('404');
        }
    });
    // Get info on user
    // Fin
    app.get('/user/:userid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userID, userInfo, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = req.params.userid;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userManager.getUser(userID, db)
                        // console.log(userInfo)
                    ];
                case 2:
                    userInfo = _a.sent();
                    // console.log(userInfo)
                    res.send(userInfo);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    res.send('404');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /* Create new user, no parameter as userid generated from backend */
    // Fin
    app.post('/newuser', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var newID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userManager.addUser(db)];
                case 1:
                    newID = _a.sent();
                    res.send(newID);
                    return [2 /*return*/];
            }
        });
    }); });
    /* Delete user */
    // Fin
    app.delete('/user/:userid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userID, returnVal, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = req.params.userid;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userManager.removeUser(userID, db)];
                case 2:
                    returnVal = _a.sent();
                    console.log(returnVal);
                    res.send('Success');
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error(err_2);
                    res.send('404');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /* Change Project permissions */
    // Fin
    app.put('/user/changepermissions/:userid/:projectid/:add/:write', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userID, projectID, addBool, writeBool, updateOutcome, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userID = req.params.userid;
                    projectID = req.params.projectid;
                    addBool = req.params.add;
                    writeBool = req.params.write;
                    return [4 /*yield*/, ProjectManager.editPermission(userID, projectID, addBool, writeBool, db)];
                case 1:
                    updateOutcome = _a.sent();
                    res.send(updateOutcome);
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error(err_3);
                    res.send('something went wrong');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /*Swap project owner*/
    // Fin
    app.post('/projects/editproject/:oldUserid/:newUserid/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var oldUserid, newUserid, projectid, indexAdded, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    oldUserid = req.params.oldUserid;
                    newUserid = req.params.newUserid;
                    projectid = req.params.projectid;
                    return [4 /*yield*/, ProjectManager.swapProjectOwner(oldUserid, newUserid, projectid, db)];
                case 1:
                    indexAdded = _a.sent();
                    res.send(indexAdded);
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    console.log('Body: ' + req.body);
                    console.error(err_4);
                    res.send('505');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /* Create new project. Returns generated index */
    //  Fin
    app.post('/projects', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectName, projectDescription, creatorId, indexAdded, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    projectName = String(req.body.title);
                    projectDescription = String(req.body.description);
                    creatorId = Number(req.body.ID);
                    return [4 /*yield*/, ProjectManager.addProject(db, creatorId, projectName, projectDescription)];
                case 1:
                    indexAdded = _a.sent();
                    res.send(indexAdded);
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    console.log('Body: ' + req.body);
                    console.error(err_5);
                    res.send('505');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /*Edit a project*/
    // In progress
    app.post('/projects/editproject/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectID, projectData, returnVal, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectID = req.params.projectid;
                    projectData = req.body;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ProjectManager.editProject(db, projectID, projectData)];
                case 2:
                    returnVal = _a.sent();
                    res.send(200);
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    console.error(err_6);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*delete project */
    // Fin
    app.delete('/projects/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectID, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectID = req.params.projectid;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ProjectManager.deleteProject(db, projectID)];
                case 2:
                    _a.sent();
                    res.send('200');
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _a.sent();
                    console.error(err_7);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*Retrieve a project*/
    // Fin
    app.get('/projects/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectID, returnVal, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectID = req.params.projectid;
                    console.log('Fetching project ' + projectID);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ProjectManager.getProject(projectID, db)];
                case 2:
                    returnVal = _a.sent();
                    res.send(JSON.stringify(returnVal[0]));
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _a.sent();
                    console.error(err_8);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*Create a Usecase under a Project*/
    // Fin
    app.post('/usecase/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectID, usecaseData, returnVal, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectID = req.params.projectid;
                    usecaseData = req.body;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UseCaseManager.addUseCase(db, usecaseData, projectID)];
                case 2:
                    returnVal = _a.sent();
                    res.send(200);
                    return [3 /*break*/, 4];
                case 3:
                    err_9 = _a.sent();
                    console.error(err_9);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*Fetch all Usecases for project*/
    // Fin
    app.get('/usecases/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectID, useCaseList, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectID = req.params.projectid;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UseCaseManager.getProjectUseCases(db, projectID)];
                case 2:
                    useCaseList = _a.sent();
                    console.log(useCaseList);
                    res.send(useCaseList);
                    return [3 /*break*/, 4];
                case 3:
                    err_10 = _a.sent();
                    console.error('Use case error: ' + err_10);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*fetch a single usecase*/
    // Fin
    app.get('/usecase/:usecaseid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var usecaseID, useCase, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usecaseID = req.params.usecaseid;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UseCaseManager.getUseCase(db, usecaseID)];
                case 2:
                    useCase = _a.sent();
                    console.log(useCase);
                    res.send(useCase);
                    return [3 /*break*/, 4];
                case 3:
                    err_11 = _a.sent();
                    console.error('Use case error: ' + err_11);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*Delete a usecase*/
    // Fin
    app.delete('/usecase/:usecaseid/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var usecaseID, projectID, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usecaseID = req.params.usecaseid;
                    projectID = req.params.projectid;
                    console.log('Deleting use case');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UseCaseManager.deleteUseCase(db, usecaseID, projectID)];
                case 2:
                    _a.sent();
                    res.send('200');
                    return [3 /*break*/, 4];
                case 3:
                    err_12 = _a.sent();
                    console.error(err_12);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*Edit a usecase*/
    // Fin
    app.put('/usecase/:usecaseid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var usecaseID, usecaseData, returnVal, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usecaseID = req.params.usecaseid;
                    usecaseData = req.body;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UseCaseManager.editUseCase(db, usecaseID, usecaseData)];
                case 2:
                    returnVal = _a.sent();
                    res.send(200);
                    return [3 /*break*/, 4];
                case 3:
                    err_13 = _a.sent();
                    console.error(err_13);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /*Edit a project*/
    // In progress
    app.put('/projects/:projectid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var projectID, projectData, returnVal, err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectID = req.params.projectid;
                    projectData = req.body;
                    console.log('Updated project info');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ProjectManager.editProject(db, projectID, projectData.title, projectData.description)];
                case 2:
                    returnVal = _a.sent();
                    res.send(200);
                    return [3 /*break*/, 4];
                case 3:
                    err_14 = _a.sent();
                    console.error(err_14);
                    res.send(404);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // client.close()
});
