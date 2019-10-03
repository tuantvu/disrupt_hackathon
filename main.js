"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var csv_util = require("./utils/csv_util");
var axios = require('axios');
var fs = require('fs');
var CLIENT_ID = "VIxvZ91ocvNlMsbIuXattj6FH1L7pDb3CDvidPuSqLuUcurHOw";
var CLIENT_SECRET = "AydUVqhd4rX1dCcSODr50cvbZPEqAgrlV04H5R9U";
function getToken(callback) {
    axios.post('https://api.petfinder.com/v2/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    })
        .then(function (response) {
        // console.log(response.data.token_type);
        console.log(response.data.expires_in);
        // console.log(response.data.access_token);
        callback(response.data.access_token);
        // return response.data.access_token;
    })["catch"](function (error) {
        console.log(error);
    });
}
function getShelter(state, limit, page, token) {
    var config = {
        headers: {
            Authorization: "Bearer " + token
        }
    };
    return axios.get('https://api.petfinder.com/v2/organizations' +
        // '?state=CA' + 
        '?state=' + state +
        '&limit=' + limit +
        '&page=' + page, config)
        .then(function (response) {
        var data = response.data;
        console.log("Number of organizations: " + data.organizations.length);
        return data;
    })["catch"](function (error) {
        console.log(error);
    });
}
function getShelterByCityState(city, state, limit, page, token) {
    var config = {
        headers: {
            Authorization: "Bearer " + token
        }
    };
    return axios.get('https://api.petfinder.com/v2/organizations' +
        '?location=' + city + "," + state +
        '&limit=' + limit +
        '&page=' + page, config)
        .then(function (response) {
        console.log(response.data);
        var data = response.data;
        return data;
    })["catch"](function (error) {
        console.log(error);
    });
}
function getAnimal(orgs, limit, page, token) {
    var config = {
        headers: {
            Authorization: "Bearer " + token
        }
    };
    return axios.get('https://api.petfinder.com/v2/animals' +
        '?organization=' + orgs.join(",") +
        '&limit=' + limit +
        '&page=' + page, config)
        .then(function (response) {
        var data = response.data;
        console.log("Number of animals: " + data.animals.length);
        return data;
    })["catch"](function (error) {
        console.log(error);
    });
}
function replaceSpaces(text) {
    return text.replace(/[^A-Z0-9]+/ig, "_");
}
function prependZeroToDate(digit) {
    if (digit < 10) {
        return "0" + digit;
    }
    else {
        return "" + digit;
    }
}
function parseDateAsNumber(dateString) {
    if (!dateString) {
        return 0;
    }
    try {
        var resultDate = new Date(dateString);
        var shortDateString = "" + resultDate.getFullYear() + "" +
            prependZeroToDate((resultDate.getMonth() + 1)) + '' +
            prependZeroToDate(resultDate.getDate());
        return parseInt(shortDateString);
    }
    catch (error) {
        console.log("WARNING, couldn't parse date: " + dateString + "due to: " + error);
        return 0;
    }
}
function toCSVString(organization, animal) {
    return replaceSpaces(organization.name) + "," +
        animal.id + "," +
        organization.id + "_" + animal.id + "," +
        parseDateAsNumber(animal.status_changed_at);
}
var stateAbbrev = "TX";
//MAIN
//First get the token
getToken(function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var stream, page, hasMore, header, _loop_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stream = fs.createWriteStream("graph_data/" + stateAbbrev + "_graph_data.csv", { flags: 'a' });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, 6, 7]);
                page = 1;
                hasMore = true;
                header = 'id,name,org_id,type,species,age,status,publish_date,status_changed_date,shots_current,org_name,has_auto_immune_disease';
                stream.write(header + "\n");
                _loop_1 = function () {
                    var orgListResponse, orgs, orglist, animalPage, animalHasMore, animalListResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getShelter(stateAbbrev, 100, page, token)];
                            case 1:
                                orgListResponse = _a.sent();
                                orgs = orgListResponse.organizations;
                                orglist = orgs.map(function (org) { return org.id; });
                                animalPage = 1;
                                animalHasMore = true;
                                _a.label = 2;
                            case 2:
                                if (!animalHasMore) return [3 /*break*/, 4];
                                return [4 /*yield*/, getAnimal(orglist, 100, animalPage, token)];
                            case 3:
                                animalListResponse = _a.sent();
                                // console.log("animals:" + animalListResponse.animals.map(animal => animal.name).join(", "));
                                animalListResponse.animals.forEach(function (animal) {
                                    var org = orgListResponse.organizations.find(function (org) { return org.id === animal.organization_id; });
                                    // const csvString = toCSVString(org, animal);
                                    var csvString = csv_util.animalAndOrganizationToString(animal, org);
                                    // console.log(csvString);
                                    //Write to CSV
                                    stream.write(csvString + "\n");
                                });
                                // animalHasMore = animalListResponse.pagination.current_page < animalListResponse.pagination.total_pages;
                                animalHasMore = animalListResponse.pagination.current_page < 2; //Remove this to retrieve more than $animalLimit * 2
                                animalPage++;
                                return [3 /*break*/, 2];
                            case 4:
                                hasMore = orgListResponse.pagination.current_page < orgListResponse.pagination.total_pages;
                                hasMore = false; //Remove this to grab more than $limit
                                page++;
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 2;
            case 2:
                if (!hasMore) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1()];
            case 3:
                _a.sent();
                return [3 /*break*/, 2];
            case 4: return [3 /*break*/, 7];
            case 5:
                error_1 = _a.sent();
                console.log("ERROR: " + error_1);
                return [3 /*break*/, 7];
            case 6:
                //Make sure to close file stream
                stream.end();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
