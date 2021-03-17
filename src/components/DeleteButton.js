import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphqlQuery';
import MyPopup from '../util/MyPopup';

export default function DeleteButton({ postId, commentId, callback }) {
    const DELETE_POST_MUTATION = gql`
        mutation deletePost($postId:ID!){
            deletePost(postId:$postId)
        }
    `;
    const DELETE_COMMENT_MUTATION = gql`
        mutation deleteComment($postId: ID!, $commentId: ID!){
            deleteComment(postId:$postId, commentId:$commentId){
                id
                comments{
                    id
                    username
                    createdAt
                    body
                }
                commentCount
            }
        }
    `;
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(p => p.id !== postId)
                    }
                })
            }
            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })
    return (
        <>
            <MyPopup content={commentId ? 'Delete Comment' : 'Delete post'}>
                <Button as="div" color="red" onClick={() => setConfirmOpen(true)} floated="right">
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />
        </>
    )
}
