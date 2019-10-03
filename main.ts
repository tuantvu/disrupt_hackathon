import { Organization } from "./dataobjects/organization";
import { OrganizationListResponse } from "./api/organization_api";
import { AnimalListResponse } from "./api/animal_api";
import { Animal } from "./dataobjects/animal";
import { WriteStream } from "fs";

const axios = require('axios');
const fs = require('fs');

const CLIENT_ID = "VIxvZ91ocvNlMsbIuXattj6FH1L7pDb3CDvidPuSqLuUcurHOw";
const CLIENT_SECRET = "AydUVqhd4rX1dCcSODr50cvbZPEqAgrlV04H5R9U";

function getToken(callback: (token:string) => void) {

    axios.post('https://api.petfinder.com/v2/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    })
    .then(response => {
        // console.log(response.data.token_type);
        // console.log(response.data.expires_in);
        // console.log(response.data.access_token);
        callback(response.data.access_token);
        // return response.data.access_token;
    })
    .catch(error => {
        console.log(error);
    });

}

function getShelter(state: string,limit: number, page: number, token: string): Promise<OrganizationListResponse> {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    }
  }
    return axios.get('https://api.petfinder.com/v2/organizations' +
      // '?state=CA' + 
      '?state=' + state +
      '&limit=' + limit +
      '&page=' + page
      , config)
    .then(response => {
        // console.log(response.data);
        let data = response.data as OrganizationListResponse;
        return data;
    })
    .catch(error => {
        console.log(error);
    });
}

function getShelterByCityState(city: string, state: string,limit: number, page: number, token: string): Promise<OrganizationListResponse> {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    }
  }
    return axios.get('https://api.petfinder.com/v2/organizations' +
      '?location=' + city + "," + state + 
      '&limit=' + limit +
      '&page=' + page
      , config)
    .then(response => {
        console.log(response.data);
        let data = response.data as OrganizationListResponse;
        return data;
    })
    .catch(error => {
        console.log(error);
    });
}

function getAnimal(orgs: string[], limit: number, page: number, token: string): Promise<AnimalListResponse> {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    }
  }
  
    return axios.get('https://api.petfinder.com/v2/animals' +
      '?organization=' + orgs.join(",") +
      '&limit=' + limit +
      '&page=' + page
      , config)
    .then(response => {
        // console.log(response.data);
        let data = response.data as AnimalListResponse;
        return data;
    })
    .catch(error => {
        console.log(error);
    });
}

function replaceSpaces(text: string): string {
  return text.replace(/[^A-Z0-9]+/ig, "_");
}

function prependZeroToDate(digit: number): string {
  if (digit < 10) {
    return "0" + digit;
  } else {
    return "" + digit;
  }
}

function parseDateAsNumber(dateString: string): number {
  if (!dateString) {
    return 0;
  }
  try {
    let resultDate = new Date(dateString);
    let shortDateString = "" + resultDate.getFullYear()+ "" + 
      prependZeroToDate((resultDate.getMonth()+1)) + '' + 
      prependZeroToDate(resultDate.getDate());

    return parseInt(shortDateString);
  } catch (error) {
    console.log("WARNING, couldn't parse date: " + dateString + "due to: " + error);
    return 0;
  }
}

function toCSVString(organization: Organization, animal: Animal): string {
  return replaceSpaces(organization.name) + "," + 
    animal.id + "," + 
    organization.id + "_" + animal.id + "," +
    parseDateAsNumber(animal.status_changed_at);
}

const stateAbbrev = "RI";

//MAIN
//First get the token
getToken(async (token) => {
  //Open file stream
  const stream:WriteStream = fs.createWriteStream("graph_data/" + stateAbbrev + "_graph_data.csv", {flags:'a'});

  try {

    let page = 1;
    let hasMore = true;

    //Iterate through organizations in the state until page < total pages
    while (hasMore) {
      // const orgListResponse = await getShelterByCityState("Houston", "TX", 100, page, token); DOESN'T WORK
      const orgListResponse = await getShelter(stateAbbrev, 100, page, token);
      const orgs = orgListResponse.organizations as Organization[];
      const orglist = orgs.map(org => org.id);

      // console.log("orgListIDs: " + orglist);
      
      let animalPage = 1;
      let animalHasMore = false;

      //Iterate through animals in the state until page < total pages
      while (animalHasMore) {
        //Animals can take in a list of org ids, which will save us calls since some orgs may have less
        //than 100 animals. That way we don't call org at a time
        const animalListResponse = await getAnimal(orglist, 100, animalPage, token);
        console.log("animals:" + animalListResponse.animals.map(animal => animal.name).join(", "));

        animalListResponse.animals.forEach(animal => { 
          const org = orgListResponse.organizations.find(org => org.id === animal.organization_id);
          const csvString = toCSVString(org, animal);
          // console.log(toCSVString(org, animal));

          //Write to CSV
          stream.write(csvString + "\n");
        });
        animalHasMore = animalListResponse.pagination.current_page < animalListResponse.pagination.total_pages;
        animalPage++;
      }
      hasMore = orgListResponse.pagination.current_page < orgListResponse.pagination.total_pages;
      page++;
    }
  } catch (error) {
    console.log("ERROR: " + error);
  } finally {
    //Make sure to close file stream
    stream.end();
  }
})

