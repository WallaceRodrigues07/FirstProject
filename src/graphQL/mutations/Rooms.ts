
import { gql } from "@apollo/client";

export const CREATE_ROOM = gql`
    mutation CreateRoom($name: String!) {
  insert_rooms_one(object: { name: $name }) {
    id
    name
  }
}
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($id: uuid!) {
    delete_rooms_by_pk(id: $id) {
      id
    }
  }
`;

export const ADD_COMMENT_TO_ROOM = gql`
  mutation AddCommentToRoom($room_id: uuid!, $content: String!) {
  insert_messages_one(object: { room_id: $room_id, content: $content }) {
    id
    content
    user_id
    created_at
    room_id
  }
}
`;


