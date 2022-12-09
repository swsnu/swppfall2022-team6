import { LockOutlined } from "@ant-design/icons"

import "./Badge.scss";

interface IProps {
  title: string;
  image: string;
  description: string;
  is_fulfilled: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Badge = (props: IProps) => {
  return (
    <div className="Badge" onClick={props.onClick}>
        {props.is_fulfilled && <img src={props.image} className="badge-image"/>}
        {!props.is_fulfilled && <img src={props.image} className="default-image"/>}
        {!props.is_fulfilled && 
          <div className="badge-description">
            <LockOutlined style={{fontSize: "20px", color: "rgba(0,0,0,0.5)"}}/>
            {props.description}
          </div>}
        <div className="badge-title">{props.is_fulfilled? props.title: ""}</div>
    </div>
  );
};

export default Badge;
