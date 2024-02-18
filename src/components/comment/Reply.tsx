import { Button } from "flowbite-react";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { CommentHierarchy, Comment } from "../../store/model/comment.model";

interface Props {
  comment: CommentHierarchy | Comment;
  setCommentToReply: React.Dispatch<any>;
  setReplyComment: React.Dispatch<React.SetStateAction<string>>;
  handleReplyToComment: () => Promise<void>;
}

export const Reply = ({
  comment,
  setCommentToReply,
  setReplyComment,
  handleReplyToComment,
}: Props) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const handleReplyClick = () => {
    setIsReplying(true);
    setCommentToReply(comment);
  };

  const handleCancelReplyToComment = () => {
    setIsReplying(false);
    setCommentToReply(null);
  };

  const handleReplyToCommentIntercept = async () => {
    handleReplyToComment();
    handleCancelReplyToComment();
  };

  return (
    <div className="flex ">
      {!isReplying ? (
        <Button className="ml-4">
          <MessageCircle onClick={() => handleReplyClick()} />
        </Button>
      ) : (
        <div className="flex items-center pl-4 gap-4">
          <textarea
            className="text-black"
            onChange={(e) => setReplyComment(e.target.value)}
          ></textarea>
          <Button className="h-[40px]" onClick={() => handleReplyToCommentIntercept()}>
            Reply
          </Button>
          <Button className="h-[40px]" onClick={() => handleCancelReplyToComment()}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
