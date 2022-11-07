import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "../../containers/AreaFeed/AreaFeed";
import axios from "axios";
import "./Post.scss";

export interface postProps {
    id: number;
    user_name: string;
    content: string;
    image: string; // image url, "" if none
    location: string;
    created_at: string; // date & time string
    reply_to: number | null; // id of the chained post
    clickPost?: React.MouseEventHandler<HTMLDivElement>;
    toggleChain?: () => void; // toggle chain open/close
    isReplyList: number; // 0 when not, from replyTo in postlist
}
// get location from user lang, long

function Post(post: postProps) {
    const navigate = useNavigate();
    // set chain toggle status
    const [isChainOpen, setChainOpen] = useState<boolean>(false);
    const [replyingTo, setReplyAuthor]= useState<string>("");
    // get replied post
    const [chainedPosts, setChainedPosts] = useState<PostType[]>([]);
    useEffect(() => {
        if (post.reply_to){
            axios
                .get(`/post/${post.reply_to}/`)
                .then((response)=>{
                    setReplyAuthor(response.data["post"].user_name);
                })
        }
    }, []);
    useEffect(() => {
        if(isChainOpen){
            axios
                .get(`/post/${post.reply_to}/`)
                .then((response)=>{
                    setChainedPosts([response.data["post"]])
                })
            }
    }, [isChainOpen]);

    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
    };
    const clickToggleChain = () => {
        setChainOpen(!isChainOpen);
    };
    const renderChainedPosts = (): JSX.Element[] => {
        const chain = chainedPosts.map((post: PostType) => {
            return (
                <Post
                    key={post.id}
                    id={post.id}
                    user_name={replyingTo}
                    content={post.content}
                    location={"Location"} //should come from map API
                    created_at={post.created_at}
                    reply_to={post.reply_to}
                    image={""}
                    clickPost={() => clickPostHandler(post)}
                    isReplyList={1}
                />
            );
        });
        return chain;
    };
    return (
        <div
            id="post-and-chain-container"
            className="d-flex flex-column gap-3 "
        >
            <div id="post-container" className="p-2" onClick={post.clickPost}>
                <div
                    id="main-post-div"
                    className="d-flex justify-content-start"
                >
                    <div id="user-main-badge">
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="15" cy="15" r="15" fill="#F5F5F5" />
                            <path
                                d="M12.306 18.881C11.2696 18.8164 10.9753 19.1694 10.1018 18.5785C9.22839 17.9875 8.51404 17.1699 8.02751 16.2042C7.54097 15.2385 7.29862 14.1572 7.32377 13.0644C7.34891 11.9715 7.6407 10.9039 8.17107 9.96414C8.70145 9.02438 9.45256 8.24412 10.3522 7.69842C11.2518 7.15271 12.2696 6.85992 13.3078 6.84821C14.3459 6.83649 15.3695 7.10624 16.28 7.63151C17.1905 8.15678 17.9573 8.9199 18.5067 9.84747C19.6901 9.88727 20.814 10.4032 21.647 11.2891C22.48 12.175 22.9588 13.3635 22.9848 14.6098C23.0108 15.8562 22.582 17.0656 21.7867 17.9892C20.9915 18.9127 19.8945 18.7866 18.714 18.881L15.154 16.7575L12.306 18.881Z"
                                fill="#3185E7"
                            />
                            <g filter="url(#filter0_b_223_769)">
                                <path
                                    d="M17.9016 19.5887L15.6567 17.3569C15.5232 17.2242 15.3421 17.1496 15.1533 17.1496C14.9645 17.1496 14.7835 17.2242 14.65 17.3569L12.4335 19.5603C11.4605 19.4605 10.5299 19.1132 9.73105 18.552C8.93224 17.9908 8.29224 17.2346 7.87268 16.3562C7.45312 15.4778 7.26813 14.5068 7.33553 13.5367C7.40293 12.5666 7.72045 11.6301 8.25751 10.8174C8.79457 10.0046 9.53308 9.34308 10.4019 8.8964C11.2707 8.44973 12.2406 8.23298 13.2181 8.26702C14.1957 8.30107 15.1479 8.58477 15.9832 9.0908C16.8184 9.59683 17.5086 10.3081 17.9871 11.1562C18.5701 11.0564 19.1676 11.0781 19.7418 11.2199C20.3159 11.3617 20.8542 11.6205 21.3225 11.9799C21.7908 12.3393 22.1789 12.7915 22.4622 13.3078C22.7455 13.8242 22.9179 14.3933 22.9683 14.9794C23.0188 15.5654 22.9463 16.1554 22.7554 16.7121C22.5645 17.2688 22.2594 17.78 21.8594 18.2133C21.4593 18.6466 20.9732 18.9926 20.4316 19.2294C19.89 19.4661 19.3049 19.5885 18.7133 19.5887H17.9016ZM13.8945 20.1068L15.1533 18.8553L16.4121 20.1068C16.661 20.3543 16.8305 20.6696 16.8992 21.0129C16.9678 21.3561 16.9325 21.7119 16.7978 22.0352C16.6631 22.3585 16.4349 22.6349 16.1422 22.8293C15.8495 23.0237 15.5054 23.1275 15.1533 23.1275C14.8013 23.1275 14.4572 23.0237 14.1645 22.8293C13.8718 22.6349 13.6436 22.3585 13.5089 22.0352C13.3741 21.7119 13.3389 21.3561 13.4075 21.0129C13.4762 20.6696 13.6456 20.3543 13.8945 20.1068Z"
                                    fill="white"
                                    fillOpacity="0.2"
                                />
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_223_769"
                                    x="-77.678"
                                    y="-76.7365"
                                    width="185.662"
                                    height="184.864"
                                    filterUnits="userSpaceOnUse"
                                    colorInterpolationFilters="sRGB"
                                >
                                    <feFlood
                                        floodOpacity="0"
                                        result="BackgroundImageFix"
                                    />
                                    <feGaussianBlur
                                        in="BackgroundImageFix"
                                        stdDeviation="42.5"
                                    />
                                    <feComposite
                                        in2="SourceAlpha"
                                        operator="in"
                                        result="effect1_backgroundBlur_223_769"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_223_769"
                                        result="shape"
                                    />
                                </filter>
                            </defs>
                        </svg>
                    </div>
                    <div
                        id="post-right-container"
                        className="d-flex flex-column"
                    >
                        <div
                            id="user-name"
                            className="d-flex justify-content-start gap-1 fw-bold fs-5-5"
                        >
                            {post.user_name}
                        </div>
                        <div
                            id="time-and-location"
                            className="d-flex justify-content-start gap-1 fw-light fs-7"
                        >
                            <div id="location">{post.location}</div>
                            <div> . </div>
                            <div id="timestamp">{post.created_at}</div>
                        </div>
                        <div
                            id="post-content-container"
                            className="d-flex justify-content-start gap-1 mt-2"
                        >
                            <div
                                id="post-content"
                                className="text-start fw-normal"
                            >
                                {post.reply_to === null ? null : (
                                    <span
                                        id="post-reply-to"
                                        className="text-primary"
                                    >
                                        @{replyingTo}{" "}
                                    </span>
                                )}
                                <span id="post-text">{post.content}</span>
                            </div>
                            {post.image === "" ? null : (
                                <div id="post-photo">
                                    <img src={require(post.image)}></img>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Show chain when it is a reply */}
            {(post.isReplyList !== 0 || post.reply_to === null)
            ? null
            : isChainOpen === false ? (
                <div
                    id="chain-container"
                    className="p-2 d-flex justify-content-start"
                >
                    <button
                        id="chain-toggle-button"
                        type="button"
                        className="btn btn-link"
                        onClick={clickToggleChain}
                    >
                        Show All
                    </button>
                </div>
            ) : (
                <div id="chain-container" className="p-2">
                    <div id="chained-posts">{renderChainedPosts()}</div>
                    <div
                        id="chain-toggle"
                        className="p-2 d-flex justify-content-start"
                    >
                        <button
                            id="chain-toggle-button"
                            type="button"
                            className="btn btn-link"
                            onClick={clickToggleChain}
                        >
                            Close All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
