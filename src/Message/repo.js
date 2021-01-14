import dataStore from 'nedb-promise';

export class RepoMessages{
    constructor({ filename, autoload }) {
        this.messages = dataStore( { filename, autoload, corruptAlertThreshold: 1});
    }

    async find(props){
        return this.messages.find(props);
    }

    async findAll(){
        return this.messages.find({});
    }

    async findOne(props){
        return this.messages.findOne(props);
    }

    async searchMessage(txt){
        var rez = [];
        for (var message in this.messages){
            if(message.text.contains(txt))
                rez.concat([message]);
        }
        return rez;
    }

    async insert(message){
        let messageText = message.text;
        if(!messageText){
            throw new Error("Mising message text")
        }
        return this.messages.insert(message);
    }

    async remove(props){
        return this.messages.remove(props);
    }
}
export default new RepoMessages({ filename: "./Database/messages.json", autoload: true});