
import { v1 as neo4j } from 'neo4j-driver';
import { StatementResult, Record, session } from 'neo4j-driver/types/v1';
import { AnimalProperties } from './db/animal_properties';
import { Links } from './db/links';
var driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'techcrunch'));

/*

LOAD CSV WITH HEADERS FROM "file:///TX_graph_data.csv" AS row 
MERGE (n:Animal {animal_id: row.id, name: row.name, org_id: row.org_id, type: row.type, species: row.species, age: row.age, status: row.status, publish_date: row.publish_date, status_changed_date: row.status_changed_date, shots_current: toBoolean(row.shots_current), org_name: row.org_name})

*/



async function retrieveAllAnimals():Promise<StatementResult> {
    console.log("Retrieve all nodes");
    var session = driver.session();

    //READ ALL ANIMAL NODES
    const result = await session.run('MATCH (n:Animal) RETURN n');

    session.close();
    return result;
}

function inSameShelter(animal:AnimalProperties, otherAnimal:AnimalProperties): boolean {
    return animal.org_id === otherAnimal.org_id;
}

function calculateWeight(animal:AnimalProperties, otherAnimal:AnimalProperties): number {
    let weight = 0.1;
    if (!otherAnimal.shots_current) {
        weight += 0.4;
    }
    if("Baby" === otherAnimal.age) {
        weight += 0.4;
    } else if ("Young" === otherAnimal.age) {
        weight += 0.2;
    }

    return weight;
}

function isManualLink(animal:AnimalProperties, other:AnimalProperties): boolean {

    let result = (animal.animal_id === "45249356" && other.org_id === "TX1274") || //Ellie Jax : Jackson_County_Happy_Tails_Animal_Shelter
        (animal.org_id === "TX1274" && other.animal_id === "45249356") || //Ellie Jax : Jackson_County_Happy_Tails_Animal_Shelter
        (animal.animal_id === "45675073" && other.org_id === "TX1773") || //Colt : Miniature_Pinscher_Rescue_Houston
        (animal.org_id === "TX1773" && other.animal_id === "45675073") || //Colt : Miniature_Pinscher_Rescue_Houston
        (animal.animal_id === "45273132" && other.org_id === "TX1773") || //Sappho : Miniature_Pinscher_Rescue_Houston
        (animal.org_id === "TX1773" && other.animal_id === "45273132") || //Sappho : Miniature_Pinscher_Rescue_Houston
        (animal.animal_id === "45675131" && other.org_id === "TX1773") ||  //Willa: Miniature_Pinscher_Rescue_Houston
        (animal.org_id === "TX1773" && other.animal_id === "45675131") ||  //Willa: Miniature_Pinscher_Rescue_Houston
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

function calculateLinks(records:Record[]):Links[] {
    let links:Links[];
    links = [];

    records.forEach(record => {
        // console.log("Record: " + JSON.stringify(record));
        // console.log("Record n: " + JSON.stringify(record.get('n')));
        const animalProperties = record.get('n').properties as AnimalProperties;
        // console.log("property id: " + animalProperties.animal_id);
        // console.log("Record id: " + record.get('n').properties.name);
        // console.log("Record name: " + record.get('n').name);
        records.forEach(otherRecord => {
            const otherProps = otherRecord.get('n').properties;
            if (animalProperties.animal_id !== otherProps.animal_id &&
                (inSameShelter(animalProperties, otherProps) || 
                    isManualLink(animalProperties, otherProps))) {
                    let weight = calculateWeight(animalProperties, otherProps);
                    links.push(new Links(Links.LABEL_LINKS, animalProperties, otherProps, weight));
            }
        })
    });

    return links;
}

function mergeLinks(links:Links[]): Promise<StatementResult[]> {
    const session = driver.session();
    const results = session.writeTransaction(async txc => {
        let promises:Promise<StatementResult>[];
        promises = [];
        links.forEach(link => {
            const mergePrint = 'MATCH (a:Animal {animal_id: "' + link.source.animal_id + '"}),' +
                '(b:Animal {animal_id: "' + link.target.animal_id + '"}) ' +
                'MERGE (a)-[:' + link.label + ' {weight: ' + link.weight + '}]->(b)';
            console.log(mergePrint);
            const merge = 'MATCH (a:Animal {animal_id: "$aId"}),(b:Animal {animal_id: "$bId"}) ' +
                'MERGE (a)-[:LINKS {weight: $weight}]->(b)';
            let txnPromise = txc.run(mergePrint, {
                aId: link.source.animal_id,
                bId: link.target.animal_id,
                label: link.label,
                weight: link.weight
            });
            promises.push(txnPromise);
        });
        const results = await Promise.all(promises);
        txc.commit();
        return results;
    })
    .then(results => {
        console.log("closing merge links session");
        session.close();
        return results;
    });
    
    return results;
}

retrieveAllAnimals()
    .then(result => {
        // console.log("result: " + JSON.stringify(result));
        console.log("records length: " + result.records.length);
        let links = calculateLinks(result.records);

        //Create links
        return mergeLinks(links);
    })
    .then(mergeLinksResults => {
        console.log("closing driver");
        driver.close();
    })
    .catch(error => {
        console.log("ERROR: " + error);
        driver.close();
    })

