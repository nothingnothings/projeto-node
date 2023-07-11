import CommentListStyle from './CommentList.module.css';

const CommentList = (props) => {
  const { list } = props;




  // console.log(list);

  return (
    <ul className={CommentListStyle.Comments}>
      {/* <li>
        <p>My comment is amazing!</p>
        <div>
          By<address>Maximilian</address>
        </div>
      </li>
      <li>
        <p>My comment is amazing!</p>
        <div>
          By<address>Maximilian</address>
        </div>
      </li> */}
      {list.map((listItem) => {
        console.log(listItem._id);
        return (
          <li key={listItem._id}>
            <p>{listItem.text}</p>
            <div>
              By &nbsp;<address>{listItem.name}</address>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CommentList;
