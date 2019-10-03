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
var neo4j_driver_1 = require("neo4j-driver");
var links_1 = require("./db/links");
var driver = neo4j_driver_1.v1.driver('bolt://localhost:7687', neo4j_driver_1.v1.auth.basic('neo4j', 'techcrunch'));
/*
//header after creating csv
id,name,org_id,type,species,age,status,publish_date,status_changed_date,shots_current,org_name,has_auto_immune_disease


LOAD CSV WITH HEADERS FROM "file:///TX_graph_data.csv" AS row
MERGE (n:Animal {animal_id: row.id, name: row.name, org_id: row.org_id, type: row.type, species: row.species, age: row.age, status: row.status, publish_date: row.publish_date, status_changed_date: row.status_changed_date, shots_current: toBoolean(row.shots_current), org_name: row.org_name})

*/
function retrieveAllAnimals() {
    return __awaiter(this, void 0, void 0, function () {
        var session, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Retrieve all nodes");
                    session = driver.session();
                    return [4 /*yield*/, session.run('MATCH (n:Animal) RETURN n')];
                case 1:
                    result = _a.sent();
                    session.close();
                    return [2 /*return*/, result];
            }
        });
    });
}
function inSameShelter(animal, otherAnimal) {
    return animal.org_id === otherAnimal.org_id;
}
function calculateWeight(animal, otherAnimal) {
    var weight = 0.1;
    if (!otherAnimal.shots_current) {
        weight += 0.4;
    }
    if ("Baby" === otherAnimal.age) {
        weight += 0.4;
    }
    else if ("Young" === otherAnimal.age) {
        weight += 0.2;
    }
    return weight;
}
function isManualLink(animal, other) {
    var result = (animal.animal_id === "45249356" && other.org_id === "TX1274") || //Ellie Jax : Jackson_County_Happy_Tails_Animal_Shelter
        (animal.org_id === "TX1274" && other.animal_id === "45249356") || //Ellie Jax : Jackson_County_Happy_Tails_Animal_Shelter
        (animal.animal_id === "45675073" && other.org_id === "TX1773") || //Colt : Miniature_Pinscher_Rescue_Houston
        (animal.org_id === "TX1773" && other.animal_id === "45675073") || //Colt : Miniature_Pinscher_Rescue_Houston
        (animal.animal_id === "45273132" && other.org_id === "TX1773") || //Sappho : Miniature_Pinscher_Rescue_Houston
        (animal.org_id === "TX1773" && other.animal_id === "45273132") || //Sappho : Miniature_Pinscher_Rescue_Houston
        (animal.animal_id === "45675131" && other.org_id === "TX1773") || //Willa: Miniature_Pinscher_Rescue_Houston
        (animal.org_id === "TX1773" && other.animal_id === "45675131") || //Willa: Miniature_Pinscher_Rescue_Houston
        (animal.animal_id === "45734659" && other.org_id === "TX1193") || //Sandi: Pawed_Squad
        (animal.org_id === "TX1193" && other.animal_id === "45734659"); //Sandi: Pawed_Squad
    if (result) {
        console.log("Manual Link: " + animal.name + "(" + animal.org_name + ") & " + other.name + "(" + other.org_name + ")");
    }
    return result;
    // return (animal_id === "45249356" && org_id === "TX1274") || //Ellie Jax : Jackson_County_Happy_Tails_Animal_Shelter
    //     (animal_id === "45675073" && org_id === "TX1773") || //Colt : Miniature_Pinscher_Rescue_Houston
    //     (animal_id === "45273132" && org_id === "TX1773") || //Sappho : Miniature_Pinscher_Rescue_Houston
    //     (animal_id === "45675131" && org_id === "TX1773") ||  //Willa: Miniature_Pinscher_Rescue_Houston
    //     (animal_id === "45734659" && org_id === "TX1193"); //Sandi: Pawed_Squad
}
function calculateLinks(records) {
    var links;
    links = [];
    records.forEach(function (record) {
        // console.log("Record: " + JSON.stringify(record));
        // console.log("Record n: " + JSON.stringify(record.get('n')));
        var animalProperties = record.get('n').properties;
        // console.log("property id: " + animalProperties.animal_id);
        // console.log("Record id: " + record.get('n').properties.name);
        // console.log("Record name: " + record.get('n').name);
        records.forEach(function (otherRecord) {
            var otherProps = otherRecord.get('n').properties;
            if (animalProperties.animal_id !== otherProps.animal_id &&
                (inSameShelter(animalProperties, otherProps) ||
                    isManualLink(animalProperties, otherProps))) {
                var weight = calculateWeight(animalProperties, otherProps);
                links.push(new links_1.Links(links_1.Links.LABEL_LINKS, animalProperties, otherProps, weight));
            }
        });
    });
    return links;
}
function mergeLinks(links) {
    var _this = this;
    var session = driver.session();
    var results = session.writeTransaction(function (txc) { return __awaiter(_this, void 0, void 0, function () {
        var promises, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = [];
                    links.forEach(function (link) {
                        var mergePrint = 'MATCH (a:Animal {animal_id: "' + link.source.animal_id + '"}),' +
                            '(b:Animal {animal_id: "' + link.target.animal_id + '"}) ' +
                            'MERGE (a)-[:' + link.label + ' {weight: ' + link.weight + '}]->(b)';
                        console.log(mergePrint);
                        var merge = 'MATCH (a:Animal {animal_id: "$aId"}),(b:Animal {animal_id: "$bId"}) ' +
                            'MERGE (a)-[:LINKS {weight: $weight}]->(b)';
                        var txnPromise = txc.run(mergePrint, {
                            aId: link.source.animal_id,
                            bId: link.target.animal_id,
                            label: link.label,
                            weight: link.weight
                        });
                        promises.push(txnPromise);
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _a.sent();
                    txc.commit();
                    return [2 /*return*/, results];
            }
        });
    }); })
        .then(function (results) {
        console.log("closing merge links session");
        session.close();
        return results;
    });
    return results;
}
retrieveAllAnimals()
    .then(function (result) {
    // console.log("result: " + JSON.stringify(result));
    console.log("records length: " + result.records.length);
    var links = calculateLinks(result.records);
    //Create links
    return mergeLinks(links);
})
    .then(function (mergeLinksResults) {
    console.log("closing driver");
    driver.close();
})["catch"](function (error) {
    console.log("ERROR: " + error);
    driver.close();
});
