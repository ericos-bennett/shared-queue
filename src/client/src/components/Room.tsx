import { useParams } from 'react-router'

export default function Room() {

  let { id } = useParams<{ id: string }>();

  return(
    <h1>Welcome to room {id}!</h1>
  )
};