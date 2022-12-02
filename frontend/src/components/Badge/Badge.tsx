import "./Badge.scss";

interface IProps {
  title: string;
  image: string;
  description: string;
  is_fulfilled: boolean;
}

const Badge = (props: IProps) => {
  return (
    <div className="Badge">
        {props.is_fulfilled && <img src={props.image} className="badge-image"/>}
        {!props.is_fulfilled && <img src={props.image} className="default-image"/>}
        {!props.is_fulfilled && <div className="badge-description">{props.description}</div>}
        <div className="badge-title">{props.is_fulfilled? props.title: ""}</div>
    </div>
  );
};

export default Badge;
