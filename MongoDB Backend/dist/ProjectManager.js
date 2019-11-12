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
Object.defineProperty(exports, "__esModule", { value: true });
function addProject(db, creatorID, projectName, projectDesc) {
    return __awaiter(this, void 0, void 0, function () {
        var currentMaxID, toAdd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('addProject()');
                    console.log('\t' + projectName + ' : ' + projectDesc + ' : ' + creatorID);
                    return [4 /*yield*/, db.collection('projects').find().sort({ _id: -1 }).limit(1).toArray()];
                case 1:
                    currentMaxID = _a.sent();
                    toAdd = 1;
                    if (typeof currentMaxID[0] !== 'undefined') {
                        toAdd = Number(currentMaxID[0]._id) + 1;
                    }
                    return [4 /*yield*/, db.collection('projects').insertOne({
                            _id: toAdd,
                            name: projectName,
                            description: projectDesc,
                            usecases: []
                        })];
                case 2:
                    _a.sent();
                    console.log('\tNew project of ID added:' + toAdd);
                    swapProjectOwner(0, creatorID, toAdd, db);
                    return [2 /*return*/, { index: toAdd }];
            }
        });
    });
}
exports.addProject = addProject;
function deleteProject(db, projectID) {
    return __awaiter(this, void 0, void 0, function () {
        var projectSearch, project, _i, _a, usecase, users, _b, users_1, user, _c, _d, userProjectPermission;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('Delete project ' + projectID);
                    return [4 /*yield*/, db.collection('projects').find({ _id: Number(projectID) }).toArray()];
                case 1:
                    projectSearch = _e.sent();
                    project = projectSearch[0];
                    _i = 0, _a = project.usecases;
                    _e.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    usecase = _a[_i];
                    console.log('\tDelete Usecase:\t' + usecase);
                    return [4 /*yield*/, db.collection('usecases').deleteOne({ _id: Number(usecase) })];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, db.collection('users').find({}).toArray()];
                case 6:
                    users = _e.sent();
                    _b = 0, users_1 = users;
                    _e.label = 7;
                case 7:
                    if (!(_b < users_1.length)) return [3 /*break*/, 12];
                    user = users_1[_b];
                    _c = 0, _d = user.readPermissions;
                    _e.label = 8;
                case 8:
                    if (!(_c < _d.length)) return [3 /*break*/, 11];
                    userProjectPermission = _d[_c];
                    if (!(Number(userProjectPermission) === Number(projectID))) return [3 /*break*/, 10];
                    console.log('\tDelete Project ' + projectID + ' from User ' + Number(user._id));
                    return [4 /*yield*/, db.collection('users').updateOne({ _id: Number(user._id) }, { $pull: {
                                owned: { $in: [Number(projectID)] },
                                writePermissions: { $in: [Number(projectID)] },
                                readPermissions: { $in: [Number(projectID)] }
                            }
                        })];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _c++;
                    return [3 /*break*/, 8];
                case 11:
                    _b++;
                    return [3 /*break*/, 7];
                case 12: return [2 /*return*/, db.collection('projects').deleteOne({ _id: Number(projectID) })];
            }
        });
    });
}
exports.deleteProject = deleteProject;
function editProject(db, projectID, json) {
    return __awaiter(this, void 0, void 0, function () {
        var data, project, projectUsecases;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = JSON.parse(JSON.stringify(json));
                    return [4 /*yield*/, db.collection('projects').findOne({ _id: Number(projectID) })];
                case 1:
                    project = _a.sent();
                    projectUsecases = project.usecases;
                    console.log('Editing project ' + projectID);
                    return [4 /*yield*/, db.collection('projects').replaceOne({ _id: Number(projectID) }, {
                            name: String(data.name),
                            description: String(data.description),
                            usecases: projectUsecases
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.editProject = editProject;
/* !add indicates remove permission
   !write indicates read permission*/
function editPermission(userID, projectID, add, write, db) {
    console.log('\tEdit user ' + userID + ' permissions for project ' + projectID);
    if (add === true) {
        if (write === true) {
            console.log('\tAdding write permissions');
            return addWritePermission(userID, projectID, db);
        }
        else {
            console.log('\tAdding read permissions');
            return addReadPermission(userID, projectID, db);
        }
    }
    else {
        if (write === true) {
            console.log('\tRemoving write permissions');
            return removeWritePermission(userID, projectID, db);
        }
        else {
            console.log('\tRemoving read permissions');
            return removeReadPermission(userID, projectID, db);
        }
    }
}
exports.editPermission = editPermission;
function addReadPermission(userID, projectID, db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.collection('users').updateOne({ _id: Number(userID) }, { $addToSet: {
                        readPermissions: Number(projectID)
                    } })];
        });
    });
}
function removeReadPermission(userID, projectID, db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            removeWritePermission(userID, projectID, db);
            return [2 /*return*/, db.collection('users').updateOne({ _id: Number(userID) }, { $pull: {
                        readPermissions: { $in: [Number(projectID)] }
                    } })];
        });
    });
}
function addWritePermission(userID, projectID, db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            addReadPermission(userID, projectID, db);
            return [2 /*return*/, db.collection('users').updateOne({ _id: Number(userID) }, { $addToSet: {
                        writePermissions: Number(projectID)
                    } })];
        });
    });
}
function removeWritePermission(userID, projectID, db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.collection('users').updateOne({ _id: Number(userID) }, {
                    $pull: {
                        writePermissions: { $in: [Number(projectID)] }
                    }
                })];
        });
    });
}
function swapProjectOwner(oldOwnerID, newOwnerID, projectID, db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Changing ownership of project ' + projectID + ' from User ' + oldOwnerID + ' to User ' + newOwnerID);
                    addWritePermission(newOwnerID, projectID, db);
                    return [4 /*yield*/, db.collection('users').updateOne({ _id: Number(newOwnerID) }, {
                            $addToSet: {
                                owned: Number(projectID)
                            }
                        })];
                case 1:
                    _a.sent();
                    if (!(oldOwnerID !== 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.collection('users').updateOne({}, { $pull: {
                                owned: { $in: [Number(projectID)] }
                            } })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    console.log(db.collection('users').find({ _id: Number(oldOwnerID) }).toArray());
                    console.log(db.collection('users').find({ _id: Number(newOwnerID) }).toArray());
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.swapProjectOwner = swapProjectOwner;
function getProject(projectID, db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.collection('projects').find({ _id: Number(projectID) }).toArray()];
        });
    });
}
exports.getProject = getProject;
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
