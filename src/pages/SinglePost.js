import React, { useContext, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Button, Card, Icon, Label, Image, Grid, Form } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

export default function SinglePost(props) {
    const commentInputRef = useRef(null);
    const FETCH_POST_QUERY = gql`
        query($postId:ID!){
            getPost(postId:$postId){
                id
                body 
                createdAt
                username
                likeCount
                likes{
                    id
                    username
                }
                commentCount
                comments{
                    id
                    username
                    createdAt
                    body
                }
            }
        }
    `;

    const SUBMIT_COMMENT_MUTATION = gql`
        mutation($postId:String!, $body:String!){
          createComment(postId:$postId,body:$body){
              id
              comments{
                  id 
                  body 
                  createdAt
                  username
              }
              commentCount
          }  
        }
    `;

    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const postId = props.match.params.postId;
    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });
    function deletePostCallback() {
        props.history.push('/');
    }
    let postMarkup;
    if (data) {
        if (!data.getPost) {
            postMarkup = <p>Loading post...</p>
        } else {
            const { id, body, createdAt, username, likes, likeCount, commentCount, comments } = data.getPost;
            postMarkup = (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Image
                                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                                size="small"
                                float="right"
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{username}</Card.Header>
                                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{body}</Card.Description>
                                </Card.Content>
                                <hr />
                                <Card.Content extra>
                                    <LikeButton user={user} post={{ id, likeCount, likes }} />
                                    <MyPopup content="Comment On Post">
                                        <Button as="div" labelPosition="right" onClick={() => console.log('Comment on Post')}>
                                            <Button basic color="blue">
                                                <Icon name="comments" />
                                            </Button>
                                            <Label basic color="blue" pointing="left">{commentCount}</Label>
                                        </Button>
                                    </MyPopup>
                                    {user && user.username === username && (
                                        <DeleteButton postId={id} callback={deletePostCallback} />
                                    )}
                                </Card.Content>
                            </Card>
                            {user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a Comment</p>
                                        <Form>
                                            <div className="ui action input fluid">
                                                <input
                                                    type="text"
                                                    placeholder="Comment.."
                                                    name="comment"
                                                    value={comment}
                                                    onChange={event => setComment(event.target.value)}
                                                    ref={commentInputRef}
                                                />
                                                <button
                                                    type="submit"
                                                    className="ui button teal"
                                                    disabled={comment.trim() === ''}
                                                    onClick={submitComment}
                                                >
                                                    Submit
                                            </button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )}
                            {comments.map((comment, idx) => (
                                <Card fluid key={idx}>
                                    <Card.Content>
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} commentId={comment.id} />
                                        )}
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
        return postMarkup;
    }
    return <p>Loading post...</p>;
}
