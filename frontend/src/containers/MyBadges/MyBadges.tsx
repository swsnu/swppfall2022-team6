import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/user";
import Badge from "../../components/Badge/Badge";
import { BadgeType } from "../../store/slices/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./MyBadges.scss";

function MyBadges() {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
    const onClickBackButton = () => {
        navigate("/mypage");
    };

    const main_badge =
        userState.userBadges[Number(userState.currUser?.main_badge) - 1];
    const onClickBadge = (badge: BadgeType) => {
        if (selectedBadge === badge) {
            setSelectedBadge(null);
        }
        else setSelectedBadge(badge);
    };
    const onClickSetAsMainBadgeButton = () => {};

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
                    <div id="main-badge">
                        {/* <img src={main_badge.image} className="main-badge-image"/> */}
                        <img src={""} className="main-badge-image" />
                    </div>
                </Col>
            </Row>
            <Row id="badges-header-container">
                <Col className="area-label">
                    <span>My Badges</span>
                </Col>
                <Col md={6}></Col>
            </Row>
            <Row className="badges-container">
                <Container id="badges-list" className="mt-3 w-95 m-auto">
                    {[...userState.userBadges]
                        .sort((a, b) => {
                            if (!a.is_fulfilled && b.is_fulfilled) return 1;
                            if (a.is_fulfilled && !b.is_fulfilled) return -1;
                            return 0;
                        })
                        .map((badge) => {
                            return (
                                <div className={badge === selectedBadge ? "selected-badge": "non-selected-badge"}>
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
            <button
                id="set-main-badge-button"
                onClick={onClickSetAsMainBadgeButton}
            >
                Set As Main Badge
            </button>
        </Container>
    );
}

export default MyBadges;
