import dataStore from 'nedb-promise';

export class RepoUsers{
    constructor( { filename, autoload }) {
        this.users = dataStore ( {filename, autoload, corruptAlertThreshold: 1});
    }

    async find(props){
        return this.users.find(props);
    }

    async findOne(props){
        return this.users.findOne(props);
    }
}

export default new RepoUsers( { filename: "./Database/users.json", autoload: true});