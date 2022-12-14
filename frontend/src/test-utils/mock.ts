import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../store";
import userReducer, { UserState, UserType } from "../store/slices/user";
import postReducer, { PostState } from "../store/slices/post";
import reportReducer, { ReportState } from "../store/slices/report";
import hashtagReducer, { HashtagState } from "../store/slices/hashtag";
import positionReducer, { PositionState } from "../store/slices/position";
import apiErrorReducer, { ApiErrorState, ApiErrorCode } from "../store/slices/apierror";

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: {
            users: userReducer,
            posts: postReducer,
            reports: reportReducer,
            hashtags: hashtagReducer,
            positions: positionReducer,
        },
        preloadedState,
    });
};
const stubHashtagInitialState: HashtagState = {
    hashtags: [
        { id: 1, content: "hashtag1" },
        { id: 2, content: "hashtag2" },
        { id: 3, content: "hashtag3" },
        { id: 4, content: "hashtag4" },
        { id: 5, content: "hashtag5" },
    ],
    top3: [
        { id: 1, content: "hashtag1" },
        { id: 2, content: "hashtag2" },
        { id: 3, content: "hashtag3" },
    ],
};

const stubUserInitialState: UserState = {
    users: [
        {
            id: 1,
            username: "user1",
            email: "",
            radius: 0.0,
            main_badge: 1,
        },
        {
            id: 2,
            username: "user2",
            email: "",
            radius: 0.0,
            main_badge: 1,
        },
        {
            id: 3,
            username: "user3",
            email: "",
            radius: 0.0,
            main_badge: 1,
        },
        {
            id: 4,
            username: "user4",
            email: "",
            radius: 0.0,
            main_badge: 1,
        },
        {
            id: 4,
            username: "user4",
            email: "",
            radius: 0.0,
            main_badge: 1,
        },
    ],
    currUser: {
        id: 1,
        username: "user1",
        email: "",
        radius: 0.0,
        main_badge: 1,
    },
    userPosts: [
        {
            id: 1,
            user_name: "user1",
            badge_id: 1,
            content: "CONTENT-t1",
            image: "",
            latitude: 0,
            longitude: 0,
            location: "Location",
            created_at: "2022-11-20T8:43:28UTC+9",
            reply_to_author: null,
            hashtags: [stubHashtagInitialState.hashtags[0]],
        },
        {
            id: 2,
            user_name: "user2",
            badge_id: 1,
            content: "CONTENT-t2",
            image: "/logo192.png",
            latitude: 0,
            longitude: 0,
            location: "Location",
            created_at: "2022-11-21T8:43:28UTC+9",
            reply_to_author: null,
            hashtags: [stubHashtagInitialState.hashtags[1]],
        },
    ],
    userBadges: [
        {
            id: 1,
            title: "badge1",
            image: "src1",
            description: "badge1",
            is_fulfilled: true,
        },
        {
            id: 2,
            title: "badge2",
            image: "src2",
            description: "badge2",
            is_fulfilled: false,
        }
        ,
        {
            id: 3,
            title: "badge3",
            image: "src3",
            description: "badge3",
            is_fulfilled: true,
        }
    ],
    mainBadge: {
        id: 1,
        title: "badge1",
        image: "src1",
        description: "badge1",
        is_fulfilled: true,
    }
}

const stubUserInitialState2: UserState = {
    users: [],
    currUser: null,
    userPosts: [],
    userBadges: [
        {
            id: 1,
            title: "badge1",
            image: "src1",
            description: "badge1",
            is_fulfilled: true,
        },
        {
            id: 2,
            title: "badge2",
            image: "src2",
            description: "badge2",
            is_fulfilled: false,
        }
        ,
        {
            id: 3,
            title: "badge3",
            image: "src3",
            description: "badge3",
            is_fulfilled: true,
        }
    ],
    mainBadge: null,
};

const stubPostInitialState: PostState = {
    posts: [
        {
            id: 1,
            user_name: "user1",
            badge_id: 1,
            content: "CONTENT-t1",
            image: "",
            latitude: 0,
            longitude: 0,
            location: "Location",
            created_at: "2022-11-20T8:43:28UTC+9",
            reply_to_author: null,
            hashtags: [stubHashtagInitialState.hashtags[0]],
        },
        {
            id: 2,
            user_name: "user2",
            badge_id: 1,
            content: "CONTENT-t2",
            image: "/logo192.png",
            latitude: 0,
            longitude: 0,
            location: "Location",
            created_at: "2022-11-21T8:43:28UTC+9",
            reply_to_author: null,
            hashtags: [stubHashtagInitialState.hashtags[1]],
        },
        {
            id: 3,
            user_name: "user3",
            badge_id: 1,
            content: "CONTENT-t3",
            image: "",
            latitude: 0,
            longitude: 0,
            location: "Location",
            created_at: "2022-11-22T8:43:28UTC+9",
            reply_to_author: null,
            hashtags: [stubHashtagInitialState.hashtags[2]],
        },
        {
            id: 4,
            user_name: "user4",
            badge_id: 1,
            content: "CONTENT-t4",
            image: "",
            latitude: 0,
            longitude: 0,
            location: "Location",
            created_at: "2022-11-23T8:43:28UTC+9",
            reply_to_author: null,
            hashtags: [stubHashtagInitialState.hashtags[3]],
        },
    ],
};
const stubReportInitialState: ReportState = {
    reports: [
        {
            id: 1,
            user_name: "user1",
            weather: "Sunny",
            weather_degree: 3,
            wind_degree: 2,
            happy_degree: 2,
            humidity_degree: 4,
            latitude: 0,
            longitude: 0,
            created_at: "2022-11-20T8:43:28UTC+9",
        },
        {
            id: 2,
            user_name: "user1",
            weather: "Cloudy",
            weather_degree: 3,
            wind_degree: 2,
            happy_degree: 2,
            humidity_degree: 4,
            latitude: 0,
            longitude: 0,
            created_at: "2022-11-20T9:43:28UTC+9",
        },
        {
            id: 3,
            user_name: "user4",
            weather: "Rain",
            weather_degree: 3,
            wind_degree: 2,
            happy_degree: 2,
            humidity_degree: 4,
            latitude: 0,
            longitude: 0,
            created_at: "2022-11-20T10:43:28UTC+9",
        },
        {
            id: 4,
            user_name: "user3",
            weather: "Snow",
            weather_degree: 3,
            wind_degree: 2,
            happy_degree: 2,
            humidity_degree: 4,
            latitude: 0,
            longitude: 0,
            created_at: "2022-11-20T11:43:28UTC+9",
        },
    ],
};
const stubPositionInitialState: PositionState = {
    findPosition: {
        lat: 37.44877599087201,
        lng: 126.95264777802309,
    },
    currPosition: {
        lat: 37.44877599087201,
        lng: 126.95264777802309,
    },
};

const stubApiErrorInitialState: ApiErrorState = {
    apiError: {
        code: ApiErrorCode.NONE,
        msg: ""
    },
};
export const mockStore = getMockStore({
    users: stubUserInitialState,
    posts: stubPostInitialState,
    reports: stubReportInitialState,
    hashtags: stubHashtagInitialState,
    positions: stubPositionInitialState,
    apiErrors: stubApiErrorInitialState,
});

export const mockStore2 = getMockStore({
    users: stubUserInitialState2,
    posts: stubPostInitialState,
    reports: stubReportInitialState,
    hashtags: stubHashtagInitialState,
    positions: stubPositionInitialState,
    apiErrors: stubApiErrorInitialState,
});

const stubUserBadgeHashFeed1 = [
    {
        id: 1,
        title: "title1",
        image: "",
        description: "badge1",
        is_fulfilled: false,
    },
    {
        id: 2,
        title: "title2",
        image: "",
        description: "badge2",
        is_fulfilled: false,
    },
    {
        id: 3,
        title: "title3",
        image: "",
        description: "badge3",
        is_fulfilled: false,
    },
    {
        id: 4,
        title: "title4",
        image: "",
        description: "badge4",
        is_fulfilled: false,
    },
];

export const mockStoreHashFeed1 = getMockStore({
    users: {
        ...stubUserInitialState,
        userBadges: [
            ...stubUserBadgeHashFeed1,
            {
                id: 5,
                title: "title5",
                image: "",
                description: "badge5",
                is_fulfilled: false,
            },
        ],
    },
    posts: stubPostInitialState,
    reports: { reports: [] },
    hashtags: {
        hashtags: [{ id: 1, content: "hashtag1" }],
        top3: [{ id: 1, content: "hashtag1" }],
    },
    positions: stubPositionInitialState,
    apiErrors: stubApiErrorInitialState,
});

export const mockStorePostModal1 = getMockStore({
    users: {
        ...stubUserInitialState,
        userBadges: [
            ...stubUserBadgeHashFeed1,
            {
                id: 5,
                title: "title5",
                image: "",
                description: "badge5",
                is_fulfilled: true,
            },
        ],
    },
    posts: stubPostInitialState,
    reports: { reports: [] },
    hashtags: {
        hashtags: [{ id: 1, content: "hashtag1" }],
        top3: [{ id: 1, content: "hashtag1" }],
    },
    positions: stubPositionInitialState,
    apiErrors: stubApiErrorInitialState,
});

export const mockSearchResultData = () => {
    const result = [];
    for (let i = 1; i <= 30; i++) {
        result.push({
            id: i,
            place_name: `place${i}`,
            x: i,
            y: i,
        });
    }
    return result;
};
