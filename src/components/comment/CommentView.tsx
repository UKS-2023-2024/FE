import { CommentHierarchy } from "../../store/model/comment.model";

interface Props {
  classname: string;
  comment: CommentHierarchy;
}

export const CommentView = ({ comment, classname }: Props) => {
  return (
    <div className={`m-4 pl-4 ${classname}`}>
      <div>{comment.comment.content}</div>

      {comment.parent && (
        <CommentView comment={comment.parent} classname="text-gray-600 border-l-2" />
      )}
    </div>
  );
};
