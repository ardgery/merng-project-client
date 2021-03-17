import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Icon, Label, Button } from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
    const LIKE_POST_MUTATION = gql`
        mutation likePost($postId:ID!){
            likePost(postId:$postId){
                id
                likes{
                    id
                    username
                }
                likeCount
            }
        }
    `;
    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    });

    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes]);

    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to='/login' color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            <MyPopup content={liked ? 'Unlike' : 'Like'}>
                {likeButton}
            </MyPopup>
            <Label basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}
