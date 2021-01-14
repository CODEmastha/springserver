import Router from 'koa-router';
import RepoMessages from './repo';
import {broadcast} from "../WebUtils";
import etag from "etag";

export const router = new Router();

router.get('/', async (ctx) => {
    const response = ctx.response;
    response.body = await RepoMessages.findAll( );
    console.log(response.body)
    response.setHeader("etag", etag(JSON.stringify(response.body)))
    response.status = 200;
});

router.get('/:txt', async (ctx) => {
    const response = ctx.response;
    response.body = await RepoMessages.searchMessage(txt);
    response.status = 200;
})

router.get('/:id', async (ctx) => {
    const id = ctx.state.user._id;
    const message = await RepoMessages.findOne( { _id: ctx.params.id });
    const response = ctx.response;
    if(message){
        if(message.userId === id){
            response.body = message;
            response.status = 200;
        }else {
            response.status = 403;
        }
    } else {
        response.status = 404;
    }
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createMessage = async (context, message, response) => {
    try{
        const id = context.state.user._id;
        message._userid = id;
        message._id = makeid(10);
        message.username = context.state.user.username;
        response.body = await RepoMessages.insert(message);
        response.status = 201;
        broadcast(id, { type: 'createId', payload: message });
    } catch (err) {
        response.body = { message: err.message };
        response.status = 400;
    }
};

router.post('/', async context => await createMessage(context, context.request.body, context.response));

router.del(':/id', async (context) => {
    const userId = context.state.user._id;
    const message = await RepoMessages.findOne( { id: context.params._id });
    if(message && userId !== message.id_user){
        context.response.status = 403;
    } else {
        await RepoMessages.remove( { id: context.params._id });
        context.response.status = 204;
        broadcast(userId, { type: 'deleted', payload: message});
    }
});