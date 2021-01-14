import Router from 'koa-router';
import repoUsers from './repo';
import jwt from 'jsonwebtoken';
import {jwtConfig} from '../WebUtils'

export const router = new Router();

const createToken = (user) => {
    return jwt.sign( { username: user.username, _id: user._id}, jwtConfig.secret, { expiresIn: 60*60*60 });
};

const createUser = async (user, response) => {
    try {
        await repoUsers.insert(user);
        response.body = { token: createToken(user) };
        response.status = 201;
    } catch (err) {
        response.body = { issue: [{ error: err.message }] };
        response.status = 400;
    }
};

router.post('/login', async (ctx) => {
    const credentials = ctx.request.body;
    const response = ctx.response;
    const user = await repoUsers.findOne( { username: credentials.username });
    if (user && credentials.password === user.password) {
        response.body = { token: createToken(user) };
        response.status = 201;
    } else {
        response.body = { issue: [{ error: 'Invalid credentials' }] };
        response.status = 400;
    }
});
