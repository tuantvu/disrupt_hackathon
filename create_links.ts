
const csvLoad = 'LOAD CSV WITH HEADERS FROM "file:///TX_graph_data.csv" AS row ' +
'MERGE (n:Animal {animal_id: row.id, name: row.name, org_id: row.org_id, type: row.type, species: row.species, age: row.age, status: row.status, publish_date: row.publish_date, status_changed_date: row.status_changed_date, shots_current: toBoolean(row.shots_current), org_name: row.org_name})'


console.log("I'm testing");