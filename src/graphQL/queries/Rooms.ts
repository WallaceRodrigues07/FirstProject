import { gql } from "@apollo/client";

export const GET_ROOMS_WITH_MESSAGES = gql`
  query GetRoomsWithMessages {
    rooms {
      id
      name
      created_at
      user_id
      messages {
        id
        content
        user_id
        created_at
        room_id
      }
    }
  }
`;