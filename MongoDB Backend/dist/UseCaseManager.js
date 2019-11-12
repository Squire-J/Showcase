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
function addUseCase(db, useCaseData, parentID) {
    return __awaiter(this, void 0, void 0, function () {
        var currentMaxID, toAdd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection('usecases').find().sort({ _id: -1 }).limit(1).toArray()];
                case 1:
                    currentMaxID = _a.sent();
                    toAdd = 1;
                    if (typeof currentMaxID[0] !== 'undefined') {
                        toAdd = Number(currentMaxID[0]._id) + 1;
                    }
                    return [4 /*yield*/, db.collection('usecases').insertOne({
                            _id: Number(toAdd),
                            useCaseData: useCaseData
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.collection('projects').updateOne({ _id: Number(parentID) }, {
                            $addToSet: {
                                usecases: toAdd
                            }
                        })];
                case 3:
                    _a.sent();
                    console.log('Adding Usecase ' + toAdd + ' to Project ' + parentID);
                    return [2 /*return*/, { index: toAdd }];
            }
        });
    });
}
exports.addUseCase = addUseCase;
function deleteUseCase(db, useCaseID, projectID) {
    return __awaiter(this, void 0, void 0, function () {
        var useCase, ownerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection('usecases').find({ _id: Number(useCaseID) }).toArray()];
                case 1:
                    useCase = _a.sent();
                    ownerId = projectID;
                    console.log('Remove usecase ' + useCaseID + ' from project ' + ownerId);
                    db.collection('projects').updateOne({ _id: Number(ownerId) }, { $pull: {
                            usecases: { $in: [Number(useCaseID)] }
                        } });
                    return [2 /*return*/, db.collection('usecases').deleteOne({ _id: Number(useCaseID) })];
            }
        });
    });
}
exports.deleteUseCase = deleteUseCase;
function getUseCase(db, useCaseID) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('fetching usecase ' + useCaseID);
            return [2 /*return*/, db.collection('usecases').find({ _id: Number(useCaseID) }).toArray()];
        });
    });
}
exports.getUseCase = getUseCase;
function getProjectUseCases(db, projectID) {
    return __awaiter(this, void 0, void 0, function () {
        var project, usecaseList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Fetching usecases for project ' + projectID);
                    return [4 /*yield*/, db.collection('projects').find({ _id: Number(projectID) }).toArray()];
                case 1:
                    project = _a.sent();
                    usecaseList = project[0].usecases;
                    return [2 /*return*/, usecaseList];
            }
        });
    });
}
exports.getProjectUseCases = getProjectUseCases;
function editUseCase(db, useCaseID, useCaseData) {
    return __awaiter(this, void 0, void 0, function () {
        var usecase, parentID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection('usecases').find({ _id: Number(useCaseID) }).toArray()];
                case 1:
                    usecase = _a.sent();
                    parentID = usecase[0].ownerProject;
                    console.log('Editing usecase ' + useCaseID);
                    return [4 /*yield*/, db.collection('usecases').replaceOne({ _id: Number(useCaseID) }, {
                            _id: Number(useCaseID),
                            useCaseData: useCaseData
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.editUseCase = editUseCase;
