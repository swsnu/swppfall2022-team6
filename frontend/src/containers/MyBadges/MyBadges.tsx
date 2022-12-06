import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/slices/user";
import Badge from "../../components/Badge/Badge";
import { BadgeType, updateUserMainBadge } from "../../store/slices/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./MyBadges.scss";
import { AppDispatch } from "../../store";

function MyBadges() {
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
    const initial_main_badge = userState.mainBadge;
    const [mainBadge, setMainBadge] = useState<BadgeType | null>(initial_main_badge);

    const onClickBackButton = () => {
        navigate("/mypage");
    };
    const onClickBadge = (badge: BadgeType) => {
        if (badge.is_fulfilled) {
            if (selectedBadge === badge) setSelectedBadge(null);
            else setSelectedBadge(badge);
        }
    };
    const onClickSetAsMainBadgeButton = async () => {
        if (userState.currUser && selectedBadge) {
            setMainBadge(selectedBadge);
            await dispatch(
                updateUserMainBadge({
                    user_id: userState.currUser.id, 
                    main_badge: selectedBadge.id
                })
            )
        }
    };

    return (
        <Container className="MyBadges">
            <Row id="header-container">
                <Col id="back-button-container" md={1}>
                    <button
                        id="back-button"
                        aria-label="back-button"
                        onClick={onClickBackButton}
                    >
                        <FontAwesomeIcon size="xs" icon={faChevronLeft} />
                    </button>
                </Col>
                <Col id="mybadges-title">My Badges</Col>
                <Col md={1}></Col>
            </Row>
            <Row id="profile-container">
                <Col id="main-badge-container">
                    <img src={mainBadge ? mainBadge.image : ""} 
                    className="main-badge-image" 
                    alt="" 
                    style={{height: "14vh", width: "13vh",}}
                    />
                </Col>
            </Row>
            <Row id="badges-header-container">
                <Col className="area-label">
                    <span>My Badges</span>
                </Col>
                <Col md={6}></Col>
            </Row>
            <Row className="badges-container">
                <Container id="badges-list" className="mt-3 w-95 m-auto" style={{padding: "10px"}}>
                    {[...userState.userBadges]
                        .sort((a, b) => {
                            if (!a.is_fulfilled && b.is_fulfilled) return 1;
                            if (a.is_fulfilled && !b.is_fulfilled) return -1;
                            return 0;
                        })
                        .map((badge) => {
                            return (
                                <div id={badge === selectedBadge ? "selected-badge": "non-selected-badge"} key={badge.id}>
                                    <Badge
                                        key={badge.id}
                                        title={badge.title}
                                        image={badge.image}
                                        description={badge.description}
                                        is_fulfilled={badge.is_fulfilled}
                                        onClick={() => onClickBadge(badge)}
                                    />
                                </div>
                            );
                        })}
                </Container>
            </Row>
            {selectedBadge !== null 
                ?<button
                id="set-main-badge-button"
                onClick={onClickSetAsMainBadgeButton}
                >
                    Set As Main Badge
                </button>
                : null
            }
        </Container>
    );
}

export default MyBadges;
