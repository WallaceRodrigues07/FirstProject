import { createApolloClient } from "@nhost/apollo";
import { nhost } from './nhost'

export const apolloClient = createApolloClient({nhost});