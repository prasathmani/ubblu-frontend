import { put, call } from 'redux-saga/effects';
import { getSearchOutput, listMutedConversations, listStarredConversations, listTaggedConversations, getChannelInboxUsersAxios, getDirectInboxUsersAxios } from 'store/api';
import { ACTION } from 'common/constants';



export function* getSearchResultsSaga(payload) {
    try {
        console.log('before saga func', payload);
        const response = yield call(getSearchOutput, payload);
        yield put({ type: ACTION.SEARCH_MESSAGES_SUCCESS, response });
    } catch (error) {
        yield put({ type: ACTION.SEARCH_MESSAGES_SUCCESS, error });
    }
}


export function* getDirectConversationsSaga(payload) {
    try {
        console.log('before saga func', payload);
        const response = yield call(getDirectInboxUsersAxios, payload);
        yield put({ type: ACTION.DIRECT_MESSAGES_SUCCESS, response });
    } catch (error) {
        yield put({ type: ACTION.DIRECT_MESSAGES_SUCCESS, error });
    }
}


export function* getChannelConversationsSaga(payload) {
    try {
        console.log('before saga func', payload);
        const response = yield call(getChannelInboxUsersAxios, payload);
        yield put({ type: ACTION.CHANNEL_MESSAGES_SUCCESS, response });
    } catch (error) {
        yield put({ type: ACTION.CHANNEL_MESSAGES_SUCCESS, error });
    }
}




export function* getTaggedConversationsSaga(payload) {
    try {
        console.log('before saga func for tagged', payload);
        const response = yield call(listTaggedConversations, payload.payload);
        yield put({ type: ACTION.TAGGED_MESSAGES_SUCCESS, response });
    } catch (error) {
        yield put({ type: ACTION.TAGGED_MESSAGES_SUCCESS, error });
    }
}


export function* getStarredConversationsSaga(payload) {
    try {
        console.log('before saga func', payload);
        const response = yield call(listStarredConversations, payload);
        yield put({ type: ACTION.STARRED_MESSAGES_SUCCESS, response });
    } catch (error) {
        yield put({ type: ACTION.STARRED_MESSAGES_SUCCESS, error });
    }
}



export function* getMutedConversationsSaga(payload) {
    try {
        console.log('before saga func', payload);
        const response = yield call(listMutedConversations, payload);
        yield put({ type: ACTION.MUTED_MESSAGES_SUCCESS, response });
    } catch (error) {
        yield put({ type: ACTION.MUTED_MESSAGES_SUCCESS, error });
    }
}