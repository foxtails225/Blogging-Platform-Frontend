import React, { FC } from 'react';
import PropTypes from 'prop-types';

interface PostViewProps {
  postId: string;
}

const PostView: FC<PostViewProps> = ({ postId }) => {
  return <div>Hello World!</div>;
};

PostView.propTypes = {
  postId: PropTypes.string
};

export default PostView;
